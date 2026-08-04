# Clear sessionStorage on Logout

## Goal
Every sign-out wipes browser sessionStorage so the next person using the same browser starts clean, with no leftover onboarding, scroll, or navigation state.

## Current state (verified)
sessionStorage is used in two places today:
- `src/lib/guideScrollMemory.ts` — key `rbc_guide_scroll_y` (guide scroll position)
- `src/components/ScrollMemory.tsx` — key `rbc_scroll_positions_v1` (per-route scroll map)

Other visitor state (intake draft `rbc_intake_draft`, contact identity `rbc_contact`, guide opt-in flag `rbc_guide_optin_completed`, and the Supabase auth token) lives in **localStorage**, not sessionStorage. Those are out of scope for the stated objective, but they are the actual cross-user leakage risk — see "Optional follow-up".

Sign-out is called from 8 places today, each with its own ad-hoc redirect:
`SiteHeader`, `dashboard/DashboardLayout`, `AdminDashboard`, `UnauthorizedPage`, `AuthPage`, `MockLoginPage` (x2), `ResetPasswordPage`.

## Approach

### 1. One shared sign-out helper
Add `src/lib/signOut.ts` exporting `signOutAndClear(options?: { redirectTo?: string })`:
1. `sessionStorage.clear()` wrapped in try/catch (Safari private mode can throw).
2. `await supabase.auth.signOut()` — ignore an "already signed out" error rather than blocking the redirect.
3. `sessionStorage.clear()` again after sign-out, to catch anything written during teardown (e.g. ScrollMemory saving a position as the route changes).
4. Redirect via `window.location.href = redirectTo ?? "/"` — a full reload guarantees no in-memory React state survives.

### 2. Route every call site through it
Replace the direct `supabase.auth.signOut()` calls in the 8 locations above with `signOutAndClear`, preserving each one's existing destination:
- `SiteHeader`, `DashboardLayout`, `UnauthorizedPage`, `AdminDashboard` → `/`
- `AuthPage`, `MockLoginPage`, `ResetPasswordPage` (rejected/invalid-role sign-outs) → stay on the current auth page; call the helper with `redirectTo: null` so it clears + signs out without navigating, and keep the existing toast.

### 3. Catch sign-outs that bypass the button
Add a global `onAuthStateChange` listener in `src/hooks/useAuthRole.tsx`: when the event is `SIGNED_OUT`, clear sessionStorage. This covers token expiry, sign-out in another tab, and any future call site that forgets the helper.

### 4. Session isolation on login
Also clear sessionStorage on the `SIGNED_IN` event (same listener) so a new user on a shared browser cannot inherit scroll/navigation state left by a crashed or force-closed prior session.

## Not touched
Database records, accounts, saved plans, and the Supabase auth token storage itself (managed by the client) are untouched. Only sessionStorage is cleared.

## Optional follow-up (say the word and I'll fold it in)
localStorage keys `rbc_contact`, `rbc_intake_draft`, `rbc_intake_draft_v1`, and `rbc_guide_optin_completed` currently persist across users on a shared browser and are the real cross-user leak. They can be removed by name in the same helper, leaving the Supabase auth key intact. Not included above because the request scopes to sessionStorage.

## Testing checklist
- Sign out from header, dashboard sidebar, admin dashboard, and unauthorized page — sessionStorage empty in DevTools each time, redirect lands correctly.
- Scroll deep into `/guide`, sign out, sign in as a different user, open `/guide` — starts at top.
- Non-admin signing in at `/login` gets rejected: toast shows, stays on page, sessionStorage empty.
- Expire/clear the token in another tab — `SIGNED_OUT` fires and sessionStorage clears.
- Confirm the user's plan, intake survey, and account still load intact after signing back in.

## Phases
1. Add `src/lib/signOut.ts`.
2. Swap all 8 call sites onto it.
3. Add the `SIGNED_OUT` / `SIGNED_IN` listener in `useAuthRole`.
4. Manual verification per the checklist.
