## Current state

`/pricing` already wires all tier CTAs (3 cards + 3 comparison-table row links) to `startCheckout(tierId)`, which invokes the `create-checkout-session` edge function and redirects to the returned Stripe URL. Missing pieces per the request: per-button loading state and friendly inline error messaging (today errors only surface via toast).

## Changes

### 1. `src/lib/startCheckout.ts`
- Return a structured result `{ ok: true } | { ok: false, message: string }` so callers can render inline errors.
- Map common failure cases to friendly copy:
  - Not signed in → still redirects to `/auth` (unchanged).
  - `Invalid or missing priceId/tierId` / `Price not configured…` → "This plan isn't available for checkout yet. Please try another option or contact support."
  - Stripe/network/unknown → "We couldn't start checkout. Please try again in a moment."
- Keep toast as a secondary signal.

### 2. `src/pages/PricingPage.tsx`
- Add local state: `loadingTier: TierId | null` and `errorByTier: Record<TierId, string | undefined>`.
- New handler `handleCheckout(tierId)`:
  - Sets `loadingTier = tierId`, clears that tier's error.
  - Awaits `startCheckout`; on failure stores the friendly message, clears loading.
  - On success, browser navigates away (no cleanup needed).
- Update the 3 tier card buttons:
  - `disabled={loadingTier !== null}`.
  - Label swaps to "Redirecting to Stripe…" with a spinning `Loader2` icon while `loadingTier === tier.id`.
  - Render inline error text below the button when present (small, red, `role="alert"`).
- Update the 3 comparison-table row links the same way (compact spinner, disabled while loading, inline error under the row cell).
- No visual/style changes beyond the spinner + inline error text; existing classes preserved.

### 3. No backend changes
`create-checkout-session` already validates, uses server-side price allowlist, and returns JSON errors — sufficient for the new UX.

## Files touched
- `src/lib/startCheckout.ts`
- `src/pages/PricingPage.tsx`
