# Stripe Checkout branding — RE Pro Business Credit

Applies to the existing Checkout Session flow (`create-checkout-session`). All items
below are configured in the Stripe Dashboard; no code change is required.

## Branding settings (Settings → Business → Branding)
- **Logo:** RE Pro Business Credit horizontal logo (PNG, transparent, ≥ 128×128).
- **Icon:** RE Pro mark (square).
- **Brand / accent color:** navy `#153865`.
- **Button color:** success green `#3EAF7C` (hover state is derived by Stripe).
- **Font:** pick the closest match to the site's body font in the branding panel.
- **Border style / shape:** rounded, to match the site's rounded-full CTAs.

## Product images
Add a product image on each Stripe Product (DIY, Pro Cohort, Cohort Plus). Product
name and description are synced automatically from `src/data/pricingTiers.ts` on every
checkout session via `supabase/functions/_shared/tierCopy.ts` — do not edit them by hand
in Stripe, they will be overwritten.

## Payment methods
Locked to `card`, `klarna`, `affirm` in `create-checkout-session`. Amazon Pay and
Cash App Pay are intentionally excluded by omission — do not enable them "for all
sessions" in the dashboard expecting them to appear; the session allowlist wins.

## Legal / policy links
Set Terms of Service and Privacy Policy URLs in Stripe's public business details:
- https://reprobusinesscredit.com/terms
- https://reprobusinesscredit.com/privacy

## Optional: custom checkout domain (`pay.reprobusinesscredit.com`)
Stripe-side steps (manual — no DNS automation in this project):
1. Stripe Dashboard → Settings → Business → Custom domains → add
   `pay.reprobusinesscredit.com`.
2. Stripe issues CNAME records; add them at the domain registrar/DNS host.
3. Wait for Stripe to verify the domain and provision the certificate.
4. Enable the domain for Checkout. Session URLs then render on the custom domain —
   no application code change is needed, because the app always redirects to the
   `url` returned by the Stripe API.

## Webhook
Endpoint: the deployed `stripe-webhook` function, event `checkout.session.completed`.
The signing secret must be stored as the `STRIPE_WEBHOOK_SECRET` secret; without it
the function returns 500 and fulfilment falls back to the browser-side
`verify-stripe-payment` call on `/payment-success`.
