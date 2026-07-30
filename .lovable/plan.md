## Goal
Every visible "log in" entry point on the site sends users to `/mock-login`, never `/auth`.

## Why this works
`/mock-login` already handles both audiences: after sign-in it checks the user's role and routes admins to `/admin` and everyone else to `/dashboard`, and it honors a `?next=` param. No new login logic needed — only the redirect targets change.

## Changes

1. **`src/components/shared/SiteHeader.tsx`** — desktop "Log in" link `/auth` → `/mock-login` (mobile already correct).

2. **`src/components/auth/RoleGuards.tsx`** — `RequireRole` and `RequireAdmin` send unauthenticated users to `/mock-login?next=…` instead of `/auth?next=…`.

3. **`src/components/ProtectedRoute.tsx`** — `<Navigate to="/auth">` → `/mock-login`.

4. **`src/pages/AdminDashboard.tsx`** (2 spots) and **`src/pages/MLSImport.tsx`** (1 spot) — `navigate("/auth")` on missing session → `/mock-login?next=<current admin path>`.

5. **`src/lib/startCheckout.ts`** — `/auth?redirect=…` → `/mock-login?next=…` so the return path is honored by the login page.

6. **`src/pages/OAuthConsentPage.tsx`** — `"/auth?next=…"` → `"/mock-login?next=…"`.

7. **`src/pages/AuthPage.tsx`** — leave the `/auth` route in place but unlinked. It is the admin bootstrap path (calls the `setup-admin` function to grant the first admin role), so it stays reachable by direct URL only.

## Technical notes
- Frontend-only; no backend, database, or auth-provider changes.
- Signed-in users are unaffected; only unauthenticated redirects change.
- If you want `/auth` to fully disappear (auto-redirect to `/mock-login`), tell me and I'll add that — the admin bootstrap call would then move into `/mock-login`.
