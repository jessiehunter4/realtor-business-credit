# Fix: Pro Cohort purchase also shows Cohort Plus + as owned

## What I verified first

- **Stripe to product mapping is correct.** Checkout sends `metadata.tier_id` and a server-resolved price ID from a per-tier allowlist (`STRIPE_PRICE_SELF_PACED` / `STRIPE_PRICE_COHORT` / `STRIPE_PRICE_ONE_ON_ONE`). No tier can resolve to another tier's price.
- **Payment recording is correct.** The shared record-payment module writes exactly one payment row and upserts exactly one entitlement, keyed on the purchased tier.
- **The database is clean.** Live rows show three purchases (two `cohort`, one `self-paced`) and exactly one matching entitlement each. Nobody holds a `one-on-one` entitlement.

So this is **not** a Stripe, webhook, or database bug. It is a display bug in the dashboard.

## Root cause

The dashboard collapses four distinct products into a single boolean "program" flag:

```text
program = has("cohort") OR has("one-on-one")
diy     = program OR has("self-paced")
```

The "Compare your options" grid then marks a card as "Your plan" when
`(card is cohort OR card is one-on-one) AND program`. With only a Pro Cohort
entitlement, both the Pro Cohort and Cohort Plus + cards light up as owned and
both hide their upgrade button.

## The fix

### 1. Replace the tier booleans with owned-product identity

Change the dashboard context tier object from `{ diy, program }` to carry the
actual owned product ids plus derived capability flags:

- `owned` — the exact set of purchased product ids.
- `highest` — the top owned tier, for headline copy only.
- `capabilities` — feature-level flags (e.g. platform access, resource library)
  derived from `owned`, so feature gating never means "you own that product".

Keeping capability separate from ownership is the key change: Cohort may unlock
the same platform links as Cohort Plus +, but that must not render Cohort Plus +
as purchased.

### 2. Make the comparison grid ownership-exact

`ProgramSection` marks "Your plan" only when the card's id is in `owned`. Free is
shown as current only when nothing is owned. Every non-owned tier keeps its CTA,
with the label switching to "Upgrade" for tiers above the highest owned one.

### 3. Correct the header and locked-state copy

The "My Program" subtitle names the actual product ("Pro Cohort active"), not a
generic "Cohort access active". Locked copy stops implying both cohort tiers are
one bundle.

### 4. Resources section

`ResourcesSection` keeps its inclusive behavior but reads the capability flag
rather than the `diy` rollup, so a Cohort buyer still gets DIY resources without
the app claiming they bought DIY.

## Deliberately unchanged

- Stripe price/product mapping and the checkout function.
- `verify-stripe-payment`, `stripe-webhook`, and the shared record-payment logic.
- `payments` / `subscriptions` schema, grants, and RLS. The unique
  `(user_id, product)` constraint already prevents duplicate entitlements.
- No data backfill or cleanup is needed — existing rows are already one-to-one.

## Technical notes

Files touched:

- `src/pages/dashboard/DashboardLayout.tsx` — build owned / highest /
  capabilities; widen the context tier type.
- `src/pages/dashboard/ProgramSection.tsx` — ownership-exact "Your plan" badge,
  CTA logic, subtitle copy.
- `src/pages/dashboard/ResourcesSection.tsx` — read the capability flag.
- Optionally a small `src/lib/entitlementTiers.ts` holding tier order and the
  ownership-to-capability derivation so the rules live in one place.

`useEntitlements` already returns per-product rows and needs no change.

## Testing

Signed in as each existing test account, confirm on `/dashboard/program`:

- Pro Cohort buyer → "Your plan" on Pro Cohort only; Cohort Plus + shows an
  Upgrade CTA; platform links still unlocked.
- DIY buyer → "Your plan" on DIY only; both cohort tiers show CTAs; platform
  links locked.
- No entitlements → "Your plan" on Free only; all paid tiers show CTAs.
- A user holding two separate entitlements shows "Your plan" on both.
- Re-run a test checkout for Pro Cohort and confirm still exactly one new row in
  `payments` and one in `subscriptions`.

## Phases

1. Ownership model in the dashboard layout context.
2. `ProgramSection` badge, CTA, and copy corrections.
3. `ResourcesSection` capability read.
4. Verification pass across the three account states.