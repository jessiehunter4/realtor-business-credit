# Stripe checkout: left-side inclusions + product description

## What's on the page today

The screenshot shows the current state: the "What's Included with Cohort Plus: • …" line sits in the right column, squeezed above the Pay button, and it wraps into one grey paragraph instead of a bullet list. The left order-summary column shows only the tier name and the price nickname — no product description, because the Stripe Products themselves still have blank descriptions.

Stripe controls where each piece of copy renders:

```text
LEFT  (order summary)  <- Stripe Product name + Product description
RIGHT (above Pay)      <- checkout session custom_text
```

So moving the inclusions to the left side means putting them on the Stripe Product, not repeating them in `custom_text`.

## Changes

1. **Product description carries the inclusions (left column).**
   Reformat the description written to each Stripe Product so the short positioning line is followed by the feature bullets on their own lines, e.g.

   ```text
   For Realtors and brokers who want private, high-touch guidance.
   • Everything in Cohort
   • Private 1:1 coaching with Jessie
   • Dedicated Credit Suite specialist
   • Priority response + funding strategy sessions
   • Quarterly plan reviews
   ```

   Stripe caps product descriptions at 350 characters, so the builder keeps trimming the tail if a tier ever exceeds that. Copy still comes from the pricing page — no invented inclusions.

2. **Run the sync so it takes effect.**
   The `sync-stripe-products` function already exists and updates the three existing Products in place (name + description only — no new products, no price or payment-method changes). It needs one admin run from the **Sync Stripe Product Info** button on `/admin`.

3. **Trim the right-column duplicate.**
   Once the bullets live in the order summary, the `custom_text` block above the Pay button becomes redundant clutter. Reduce it to a single short reassurance line so the Pay button stays the focus.

## Technical notes

- `supabase/functions/_shared/tierCopy.ts` — rewrite `buildProductDescription` to emit newline-separated bullets; shorten `buildIncludedText`.
- `supabase/functions/create-checkout-session/index.ts` — unchanged apart from the shorter `custom_text` value. Payment methods (`card`, `klarna`, `affirm`), price IDs, success/cancel URLs, metadata, and promo codes all stay exactly as they are.
- `supabase/functions/sync-stripe-products/index.ts` — no change; just needs to be run.

## Verification

Open checkout for each of the three paid tiers and confirm the left order summary shows the tier name plus the bulleted inclusions, the right column is clean above Pay, the amount is unchanged, and Klarna/Affirm still appear for eligible buyers.