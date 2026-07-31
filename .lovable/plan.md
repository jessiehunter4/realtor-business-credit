## Goal

Add a **Free** tier as the first pricing option, without touching the three existing paid tiers (DIY / Pro Cohort / Cohort Plus +).

## What the Free tier says

- Name: **Free**, price **$0**, cadence "no card required"
- Who: "For Realtors who want to learn the system and see their own plan before investing."
- Includes:
  - Full Business Structure, Finance & Credit Guide
  - Your customized plan generated from the intake survey
  - Task checklist from your plan, with progress tracking in the portal
- Not included: coaching calls, cohort, Credit Suite portal/coach
- CTA: **Read the Free Guide** → `/guide` (plain link, no Stripe)

## Data model

`src/data/pricingTiers.ts`
- Extend `PricingTier.id` union with `"free"`, and add an optional `isFree?: boolean` flag so components can branch on link-vs-checkout.
- Prepend the Free tier object to `PRICING_TIERS` (icon: `BookOpen`), `ctaHref: "/guide"`.
- Leave the three existing tier objects and `STRIPE_LINKS` byte-for-byte unchanged.

`src/lib/startCheckout.ts`
- `CheckoutTierId` stays `"self-paced" | "cohort" | "one-on-one"` — Free never goes to Stripe. Components will narrow before calling `startCheckout`.

## Component updates

**`src/pages/PricingPage.tsx`**
- Card grid: `md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4` so 4 cards read cleanly (1 col mobile → 2 cols tablet/laptop → 4 cols wide desktop). Cards stay `items-stretch` with equal-height footers.
- Card renderer: if `tier.isFree`, render a `<Link to={tier.ctaHref}>` styled like the outline CTA instead of the checkout button; otherwise keep the exact existing checkout button, loading state, and error handling.
- Comparison table (`grid-cols-2 md:grid-cols-4` at ~line 303) and the feature/columns grid at ~line 446: add a Free column so the table has 4 tiers + label column; on mobile it keeps its existing stacked/scroll behavior. Free row values: guide ✓, custom plan ✓, task checklist ✓, everything else —.
- FAQ copy: add one short line noting the Free tier exists and what it covers.

**`src/pages/CheckoutPage.tsx`**
- Filter Free out of the selectable list (`PRICING_TIERS.filter(t => !t.isFree)`) — checkout is for paid tiers only; `?tier=free` falls back to the existing default (`cohort`). No other change.

**`src/components/plan/InlinePricingAccordion.tsx`**
- Free renders as an accordion item like the others, but its action is a `Link` to `/guide` rather than a checkout button. Paid items unchanged.

**`src/components/intake/IntakePricingAndReadiness.tsx`**
- No change needed; the "just exploring" / "need clarity" responses already point to `/guide`.

## Testing checklist

- `/pricing` at 375px, 768px, 1024px, 1440px: 4 cards, no overflow, equal heights, "Most popular" badge still on Pro Cohort.
- Free card CTA navigates to `/guide`; no Stripe call fires.
- Each paid card still opens Stripe checkout and still shows its error text on failure.
- `/checkout` shows only the 3 paid options; `?tier=cohort|self-paced|one-on-one` preselects correctly; `?tier=free` falls back to Cohort.
- Plan-page inline accordion: Free expands with a guide link, paid tiers still check out.
- Comparison table renders 4 tier columns on desktop and stays readable on mobile.
- Typecheck passes with the widened `PricingTier["id"]` union.
