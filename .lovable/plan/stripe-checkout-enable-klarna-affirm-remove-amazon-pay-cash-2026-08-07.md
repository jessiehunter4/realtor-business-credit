# Stripe Checkout: enable Klarna/Affirm, remove Amazon Pay & Cash App Pay

## What the audit found

- There are **no Stripe Payment Links** in this project. Every "Enroll" button already funnels through one shared path:
  - `src/data/pricingTiers.ts` → `STRIPE_LINKS` are internal app routes (`/checkout?tier=...`), not Stripe URLs.
  - `/pricing`, `/checkout`, and the inline pricing accordion all call `startCheckout(tierId)` in `src/lib/startCheckout.ts`.
  - That invokes the `create-checkout-session` edge function, which builds a **Stripe-hosted Checkout Session** from price IDs held in secrets (`STRIPE_PRICE_SELF_PACED`, `STRIPE_PRICE_COHORT`, `STRIPE_PRICE_ONE_ON_ONE`) and returns the hosted Stripe URL.
- The existing tier → Stripe price mapping is intact and reusable. No new URLs are needed and none are missing.
- The session currently sends no payment-method configuration, so Stripe falls back to whatever is toggled on in the account dashboard — which is why Amazon Pay and Cash App Pay show up.

## What changes (one file)

`supabase/functions/create-checkout-session/index.ts`

- Explicitly request payment methods on the session instead of inheriting dashboard defaults:
  - `payment_method_types[]` = `card`, `klarna`, `affirm`
  - This excludes Amazon Pay and Cash App Pay from the hosted checkout page.
- Klarna/Affirm render only when amount, USD currency, and buyer country are eligible; Stripe hides them otherwise, so card is always available.
- Everything else untouched: auth check, tier allowlist, success/cancel URLs, `client_reference_id`, metadata, promo codes, webhook, and payment verification.

## What must happen in Stripe (not code)

- **Product name and description on the checkout page** come from the Stripe Product attached to each price. If a product's description is blank there, nothing will display — this has to be filled in on the three products in Stripe.
- **Klarna and Affirm must be activated** on the Stripe account under payment method settings. If they are inactive, requesting them in the session errors out.

## Verification

- Click Enroll on each of the three paid tiers; confirm the Stripe page loads with the correct product and amount, shows Klarna and Affirm alongside card, and no longer lists Amazon Pay or Cash App Pay.
