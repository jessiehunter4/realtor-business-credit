# Stripe Payment Result Pages

Add dedicated `/payment-success` and `/payment-cancelled` routes and point Stripe Checkout at them instead of the current `/checkout` and `/pricing?status=cancelled` URLs.

## New pages

**`src/pages/PaymentSuccessPage.tsx`** — mounted at `/payment-success`
- Reads `session_id` and optional `tier` from the query string.
- Shows a large success state (green check, "Payment received", tier name if present).
- Sub-copy: "We're confirming your payment with Stripe. You'll be redirected to your dashboard in a few seconds."
- Fires a `checkout_completed` funnel event via `log-funnel-event` (best-effort, ignore errors).
- Auto-redirects to `/dashboard` after ~6s using `setTimeout` + `useNavigate`. Includes a manual "Go to Dashboard now" button and a secondary "View Pricing" link.
- Uses existing bright/navy design tokens and `SiteHeader` for layout parity.

**`src/pages/PaymentCancelledPage.tsx`** — mounted at `/payment-cancelled`
- Neutral state (amber icon, "No payment was processed").
- Copy: "Your card was not charged. You can head back to pricing whenever you're ready."
- Primary CTA: "Return to Pricing" → `/pricing`. Secondary: "Back to Dashboard" → `/dashboard`.
- Fires `checkout_cancelled` funnel event (best-effort).

Both pages are public (no role guard) so Stripe's redirect always lands cleanly, even if the auth session hasn't rehydrated yet.

## Wiring

- `src/App.tsx` — register the two routes above the catch-all `NotFound`.
- `supabase/functions/create-checkout-session/index.ts` — update the URLs sent to Stripe:
  - `success_url`: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&tier=<tierId>`
  - `cancel_url`: `${origin}/payment-cancelled?tier=<tierId>`
  - Redeploy the function so the new URLs take effect.
- Leave the existing `/checkout` route untouched (still used elsewhere as a marketing/checkout landing page).

## Funnel events

Add `checkout_completed` and `checkout_cancelled` to the allowlist in `supabase/functions/log-funnel-event/index.ts` if they aren't already present, so the best-effort logging from the new pages doesn't 400.

## Out of scope

- Server-side payment verification / Stripe webhook handling (would require a separate `stripe-webhook` function and a `payments` table). The success page trusts Stripe's redirect and shows a "confirming" message; hard confirmation can be added later.
- Any change to pricing UI or checkout initiation logic.