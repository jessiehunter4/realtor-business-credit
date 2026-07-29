## Stripe Checkout Session Integration

### 1. Edge Function: `create-checkout-session`
Create `supabase/functions/create-checkout-session/index.ts`:
- POST endpoint, `verify_jwt = false` (validate token manually via `getClaims()` for authenticated user).
- Accepts JSON body:
  ```
  { priceId: string, leadId?: string, tierId?: string }
  ```
- Validates the authenticated user from `Authorization` header.
- Validates `priceId` against an **allowlist** of known price IDs (from env vars: `STRIPE_PRICE_SELF_PACED`, `STRIPE_PRICE_COHORT`, `STRIPE_PRICE_ONE_ON_ONE`) — rejects anything else with 400.
- Uses `STRIPE_SECRET_KEY` (already in Supabase Secrets) to call Stripe REST API `POST /v1/checkout/sessions`:
  - `mode: payment` (one-time) — all three tiers are one-time per pricing tiers file.
  - `line_items[0][price] = priceId`, `quantity = 1`.
  - `success_url = {origin}/checkout?status=success&session_id={CHECKOUT_SESSION_ID}`.
  - `cancel_url = {origin}/pricing?status=cancelled`.
  - `client_reference_id = userId`.
  - `metadata`: userId, leadId, tierId.
  - `customer_email` from user claims when available.
- Returns `{ url }` on success; JSON `{ error }` with proper status codes on failure.
- Full CORS headers; try/catch with structured error logging.

### 2. Config
Add to `supabase/config.toml`:
```
[functions.create-checkout-session]
verify_jwt = false
```

### 3. Secrets needed
Request from user via `add_secret`:
- `STRIPE_PRICE_SELF_PACED`
- `STRIPE_PRICE_COHORT`
- `STRIPE_PRICE_ONE_ON_ONE`

(`STRIPE_SECRET_KEY` is already saved.)

### 4. Frontend
- Extend `src/data/pricingTiers.ts` with a `tierId` mapping used by the frontend to select the price at checkout (server resolves tierId → priceId via env, so no priceId is exposed client-side).
- Add `src/lib/startCheckout.ts` helper: calls `supabase.functions.invoke('create-checkout-session', { body: { tierId, leadId } })`, redirects to returned URL, requires auth session (redirects to `/auth?redirect=/pricing` when signed out).
- Update `src/pages/PricingPage.tsx`:
  - Replace `<a href={tier.ctaHref}>` with `<button onClick={() => startCheckout(tier.id)}>` on all 3 tier cards and the 3 comparison-table row links.
  - Preserve styling.

### 5. Security notes
- Secret key never touches the client.
- Price IDs resolved server-side from env allowlist — client cannot pass arbitrary prices.
- Auth required (401 if missing/invalid JWT).
- `client_reference_id` + metadata let a future webhook reconcile payments.
