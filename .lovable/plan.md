# Stripe checkout: show tier name, description, and "What's Included"

## Source of truth
`src/data/pricingTiers.ts` already holds the exact tier names, prices, positioning line (`who`), and feature bullets shown on `/pricing`. Nothing new gets invented — that file's content is copied into Stripe.

| Tier id | Name | Price | Bullets |
|---|---|---|---|
| self-paced | DIY (Do it Yourself) | $497 one-time | 4 features |
| cohort | Pro Cohort | $2,997 / 90 days | 5 features |
| one-on-one | Cohort Plus | $3,497 / quarter | 5 features |

## What changes

1. **Shared tier copy for the backend** — a new `supabase/functions/_shared/tierCopy.ts` mirroring the three paid tiers' name, short description (`who`), and bullet list, so the edge functions use the same wording as the pricing page.

2. **New admin-only edge function `sync-stripe-products`** — reads each configured price (`STRIPE_PRICE_SELF_PACED`, `STRIPE_PRICE_COHORT`, `STRIPE_PRICE_ONE_ON_ONE`) using the existing `STRIPE_SECRET_KEY`, resolves the attached Product, and updates that Product's `name` and `description` on Stripe. Description format per tier:

```text
<short description> What's Included: <bullet> • <bullet> • <bullet> • <bullet>
```

Only `name`/`description`/`metadata` are written. No product creation, no price writes, no payment-behavior changes.

3. **Checkout session gets an itemized "What's Included" block** — `create-checkout-session` adds `custom_text.submit.message` with that tier's bullet list, so the inclusions also render on the Stripe page under the order summary. Everything else in the session stays identical: same price lookup, same `payment_method_types` (card, klarna, affirm — Amazon Pay and Cash App Pay remain off), same success/cancel URLs, metadata, and promo codes.

4. **Run the sync once** after deploy so the three live Stripe products carry the descriptions.

## What does not change
- Price IDs, amounts, and the tier → price mapping.
- The Enroll buttons and the `startCheckout` flow.
- Klarna/Affirm configuration; Amazon Pay and Cash App Pay stay disabled.
- No new Stripe Products or Payment Links.

## Verification
- Call the sync function and confirm the Stripe API response shows the new description on each of the three products.
- Click Enroll on each paid tier and confirm it still lands on the same Stripe Checkout URL, with the correct tier name, price, description, and the "What's Included" bullets, and with only card/Klarna/Affirm offered.