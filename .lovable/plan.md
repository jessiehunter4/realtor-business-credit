## Goal
Every login entry point visitors can see or be redirected to lands on `/mock-login`. The `/auth` route stays in place (unlinked admin bootstrap path).

## Current state (verified)
All visible login paths already point to `/mock-login`:
- Header sign-in links (desktop + mobile menu)
- Route guards: `RoleGuards.tsx`, `ProtectedRoute.tsx`
- Redirects from `AdminDashboard`, `MLSImport`, `OAuthConsentPage`, `startCheckout`
- `/auth` still registered in `App.tsx` and, after a successful admin bootstrap, forwards to `/mock-login`

The only remaining `/auth` references are the route definition itself, a comment, and an unrelated Supabase issuer URL in `src/lib/mcp/index.ts`.

## Work to do
1. Sweep for any leftover login/sign-in affordances that bypass `/mock-login` (buttons, `window.location` assignments, email-link `redirectTo` targets, edge-function redirect URLs) and repoint them.
2. Keep `/auth` registered and functional; no removal, no link added to it from any nav or CTA.
3. Verify by loading the site and clicking the sign-in entry points, plus hitting a protected route while signed out, to confirm each lands on `/mock-login` with the `next` param preserved.

## Technical notes
- `/mock-login` is the real Supabase auth page; the name is kept only for URL stability.
- Redirect targets use `?next=<encoded path>` so post-login return behavior is unchanged.
