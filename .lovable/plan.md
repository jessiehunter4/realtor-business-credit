# Basic Role-Based Authentication

Much of this already exists (`user_roles` table, `has_role()`, `src/lib/roles.ts`, `AuthRoleProvider`, `RequireAdmin` / `RequireAuth` / `RequireVisitor` guards, role-based redirect on login). What's missing is **two distinct signup pages with automatic role assignment**. Plan below fills that gap and tightens the rest.

## 1. Signup pages

**Visitor signup — `/signup`** (or keep the existing "Create account" tab on `/mock-login`)
- Email + password + existing consent fields.
- On success, the account is assigned the `user` role.

**Admin signup — `/admin-signup`**
- Same fields plus an **Admin access code** field.
- The code is checked server-side against the existing `ADMIN_SIGNUP_CODE` secret. Without a valid code, no admin role is granted.
- This page is not linked in site navigation.

Rationale: role must never be chosen by the browser alone, otherwise any visitor could sign up as admin by hitting the admin URL.

## 2. Role assignment

- **Visitor:** a database trigger on new user creation inserts a `user_roles` row with role `user`. This makes every account explicitly roled instead of relying on the current "no row = visitor" default.
- **Admin:** the frontend calls an edge function `assign-admin-role` right after signup, passing the access code. The function verifies the signed-in user, compares the code to `ADMIN_SIGNUP_CODE`, and inserts the `admin` role (idempotent). Invalid code → 403 and the account simply stays a visitor.
- The existing bootstrap-only `setup-admin` function stays as-is for the first-admin case.

## 3. Login and redirect

- Single login form authenticates, then `AuthRoleProvider` resolves the role from `user_roles` (already implemented).
- Redirect via existing `resolvePostAuthTarget`: `admin` → `/admin`, `user` → `/dashboard`. A `?next=` target is honored only if the role is allowed there.
- Admin signup page redirects to `/admin` once the role call succeeds; visitor signup to `/dashboard`.

## 4. Route protection

- `/admin/*` stays wrapped in `RequireAdmin`; non-admins go to `/unauthorized`.
- `/dashboard` stays wrapped in `RequireVisitor`; an admin landing there is bounced to `/admin`.
- Signed-out users on any protected route are sent to the login page with `?next=`.
- Server side remains the real boundary: RLS policies and edge-function admin checks continue to use `has_role()`.

## 5. Database changes

- No schema change needed — `user_roles` + `app_role` enum already exist.
- One migration: a trigger (or an addition to the existing `handle_new_user` function) that inserts the default `user` role for each new account.

## Technical notes

- Files touched: new `src/pages/AdminSignupPage.tsx` and `src/pages/SignupPage.tsx` (or reuse the `/mock-login` tab), route entries in `src/App.tsx`, new `supabase/functions/assign-admin-role/index.ts`, one migration.
- No client-writable path to the `admin` role: `user_roles` has no insert policy for regular users; only security-definer functions and the service role write it.

## Verification

- Visitor signup → lands on `/dashboard`; visiting `/admin` shows Unauthorized.
- Admin signup with valid code → lands on `/admin`; with an invalid code → account created as visitor.
- Log out / log back in on both accounts → each lands on its correct home route.
