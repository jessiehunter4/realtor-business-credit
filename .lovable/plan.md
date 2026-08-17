# RE Pro Product Pages → Existing Stripe Checkout

## Audit findings (verified in code)

The project already has a complete, single Stripe architecture. Nothing needs to be replaced.

- **Pricing source of truth:** `src/data/pricingTiers.ts` — 4 tiers (`free`, `self-paced` "DIY", `cohort` "Pro Cohort", `one-on-one` "Cohort Plus") with price, cadence, `who`, `features`, `notIncluded`, CTA label/href.
- **CTA flow today:** Pricing/Checkout/Program CTAs call `startCheckout(tierId)` (`src/lib/startCheckout.ts`), which requires a signed-in session (else redirects to `/login?next=/pricing?tier=...`), invokes the `create-checkout-session` edge function and opens the returned Stripe URL.
- **Checkout Sessions, not Payment Links:** `supabase/functions/create-checkout-session` maps `tierId → STRIPE_PRICE_SELF_PACED | STRIPE_PRICE_COHORT | STRIPE_PRICE_ONE_ON_ONE` (server-side allowlist), sets `payment_method_types = card, klarna, affirm` (Amazon Pay / Cash App already excluded), `client_reference_id = userId`, `metadata.user_id`, and success/cancel URLs `/payment-success?session_id=...&tier=...` / `/payment-cancelled?tier=...`. It also pushes current tier copy onto the Stripe Product on every session via `_shared/tierCopy.ts`.
- **Fulfilment:** `_shared/recordPayment.ts` inserts into `payments` (unique `stripe_session_id` = duplicate-safe) and upserts `subscriptions` (`user_id, product=tierId, status=active`). Called by both `stripe-webhook` (signature-verified, replay-protected) and `verify-stripe-payment` (invoked by `/payment-success`), so fulfilment is already idempotent and dual-path.
- **Dashboard access:** `useEntitlements` reads `subscriptions`; `src/lib/entitlementTiers.ts` derives owned tiers, highest tier, and capabilities (`platformAccess`, `resourceLibrary`) consumed by `ProgramSection`/`DashboardLayout`.
- **Gap found:** `STRIPE_WEBHOOK_SECRET` is **not** in the project's configured secrets, while `stripe-webhook` returns 500 without it. Today fulfilment effectively depends on the `/payment-success` verify call. This is the one infrastructure item to fix.

Conclusion: extend, don't rebuild. The work is mostly new front-end sales pages plus one shared config file, one webhook secret, and small routing/CTA changes.

## What will be built

### 1. Centralized product config (one file)
Extend `src/data/pricingTiers.ts` (keeps it the single source of truth) with per-tier fields:
`slug` (URL segment), `headline`, `subhead`, `heroBullets`, `includedGroups` (categorized inclusions built from existing `features`), `faqs`, `paymentPlanNote`, `refundNote`, `partnerAccess`, `dashboardCapabilityNote`.
No Stripe IDs move to the front end — price IDs stay server-side env vars, and `tierId` remains the only thing the client sends. Product-page CTAs call the same `startCheckout(tierId)`.

Product-page content is derived strictly from existing copy in `pricingTiers.ts`, `ProgramSection`, and `PayLaterOptions`. No new claims, guarantees, or prices are invented; any field without existing source content is simply omitted.

### 2. Dedicated sales pages
New route `/programs/:slug` (`src/pages/ProgramProductPage.tsx`) with slugs `diy`, `pro-cohort`, `cohort-plus`, plus a shared section set:
- Product header: name, headline, short description, price + cadence, primary CTA
- What's included: grouped bullets, highlighted items, "not included" clarity
- Supporting content: pay-later panel (reuse `PayLaterOptions`), FAQ accordion, program/coaching detail, partner-resource note
- Sticky/repeat CTA ("Join Pro Cohort" / "Join Cohort Plus" / "Get DIY Access")
- Entitlement-aware CTA: if the user already owns the tier, the CTA becomes "Go to your dashboard" instead of a repeat purchase.

### 3. Routing / entry points
- `/pricing` tier cards → link to `/programs/:slug` instead of straight to checkout (the "choose plan → sales page → Stripe" journey).
- Dashboard `ProgramSection` upgrade CTAs → same product pages.
- Keep `/checkout?tier=` working as-is (backwards compatible, still used by existing links).

### 4. Payments hardening (no new architecture)
- Add `STRIPE_WEBHOOK_SECRET` and confirm the `checkout.session.completed` endpoint so webhook fulfilment works independently of the browser returning to `/payment-success`.
- `/payment-success`: use the tier returned by verification (not the URL param) for the welcome copy, and route to a tier-aware onboarding block on the dashboard.
- `/payment-cancelled`: return link goes back to the product page for the cancelled tier.
- Error paths surface friendly messages only (missing price config, session creation failure, unverified payment with a Retry, payment recorded but entitlement missing → support prompt). No Stripe internals or secrets in the UI.

### 5. Stripe branding (documentation only)
Document the Stripe-side settings to apply manually — logo, icon, brand/accent colors, product images, and the optional custom checkout domain `pay.reprobusinesscredit.com` (CNAME + Stripe domain verification). No DNS automation.

## Not changing
Stripe products, prices, payment-method allowlist, `create-checkout-session` mapping, `recordPayment` fulfilment, `payments`/`subscriptions` tables, RLS, `useEntitlements`, dashboard architecture. **No database migration is required.**

## Testing
- Product pages: correct name/price/inclusions/CTA per slug; owned-tier CTA swap; desktop/tablet/mobile; heading order, keyboard focus, contrast, 44px touch targets.
- Checkout: each slug opens the correct Stripe price; Klarna/Affirm present; Amazon Pay / Cash App absent; signed-out CTA routes through login and returns.
- Payment: success updates `subscriptions` to the exact purchased tier (never a neighbouring tier); cancel returns to the product page; replayed webhook and double `/payment-success` verify produce no duplicate rows.
- Dashboard: correct tier shown, correct resources unlocked, locked content still locked, existing custom plan intact, no repeat-purchase prompt.

## Risks
- Webhook secret must be configured or fulfilment stays browser-dependent.
- Tier copy duplicated between the page config and `_shared/tierCopy.ts` (Stripe product copy) — keep both edited together; the plan keeps `pricingTiers.ts` labelled as the source of truth.
- Existing `/checkout` and `/pricing` deep links must keep working during the CTA re-point.
