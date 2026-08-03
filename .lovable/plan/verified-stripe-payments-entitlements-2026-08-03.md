# Verified Stripe Payments & Entitlements

Payments are confirmed server-side with Stripe before anything is unlocked. The browser never decides whether a purchase succeeded.

## What changes for users

- After paying, the success page shows a spinner while the payment is verified, then displays the program purchased, amount paid, and a Stripe reference, and forwards to the dashboard.
- If verification fails, a clear "Payment could not be verified — please contact support" message appears with a retry option instead of an automatic redirect.
- Purchased programs are recorded as an entitlement, so the app can check access without scanning payment history.

## Database

Two new tables:

- `payments` — one row per completed Stripe checkout: user, email, stripe session id (unique), payment intent, customer id, tier/product, price id, amount, currency, status, timestamps.
- `subscriptions` — entitlement per user/product: user, product, price id, status (`active` / `cancelled` / `expired`), purchased_at, expires_at (nullable), stripe session id, payment intent. Unique on (user_id, product).

Access rules: a signed-in user can read only their own payment and entitlement rows. Nobody can write through the app — inserts happen only from the backend function using its service role. Standard grants for both tables.

## Backend

New edge function `verify-stripe-payment`:

1. Requires a signed-in caller; validates the JWT and pulls the user id.
2. Accepts `session_id`, retrieves the Checkout Session from Stripe with the secret key (expanding line items and payment intent).
3. Rejects unless `payment_status === "paid"` (and `status === "complete"` when present) and the session's `metadata.user_id` / `client_reference_id` matches the caller.
4. Looks up `payments.stripe_session_id`; if present, returns the existing record with `alreadyProcessed: true` — no duplicate insert.
5. Otherwise inserts the payment row and upserts the matching `subscriptions` entitlement, mapping the price id back to a tier via the existing `STRIPE_PRICE_SELF_PACED` / `STRIPE_PRICE_COHORT` / `STRIPE_PRICE_ONE_ON_ONE` secrets.
6. Returns `{ success, status, product, amount, currency, alreadyProcessed }`.

Second edge function `stripe-webhook` (authoritative path, `verify_jwt = false`): handles `checkout.session.completed`, verifies the Stripe signature against a webhook signing secret, and runs the same shared record-payment logic so purchases land even when the buyer closes the tab. The signing secret is requested separately once the endpoint URL exists.

Shared logic lives in `supabase/functions/_shared/recordPayment.ts` so both entry points behave identically.

## Frontend

- `PaymentSuccessPage` calls `verify-stripe-payment` with the `session_id` from the URL, shows the verifying state, then a success panel with product, amount, currency, and session reference; it redirects to `/dashboard` after a short countdown only on success.
- A small `useEntitlements` helper reads the current user's active subscriptions for gating program content later.

## Technical notes

- No Stripe SDK dependency; the function calls the Stripe REST API directly with `fetch`, matching `create-checkout-session`.
- `create-checkout-session` already sets `metadata.user_id`, `metadata.tier_id`, and `client_reference_id`, so no checkout changes are needed.
- Amounts are stored in the smallest currency unit (cents) exactly as Stripe reports them.
- `supabase/config.toml` gets a `verify_jwt = false` entry for `stripe-webhook`.

## Order of work

1. Migration for `payments` and `subscriptions`.
2. Shared record-payment module plus `verify-stripe-payment`.
3. Success page rework.
4. `stripe-webhook` and the signing-secret request.
