## Goal

Signing up on `/auth` should result in an **admin** account, not a visitor account.

## Current behavior (verified)

- The new-user database trigger inserts `role = 'user'` for every signup, including `/auth`.
- `/auth` then calls `setup-admin`, which only grants admin when **no admin exists yet**. Since admins already exist, it returns 403 and the user lands on `/dashboard` as a visitor.
- `/admin-signup` already works correctly: it signs up, then calls `assign-admin-role`, which validates the `ADMIN_SIGNUP_CODE` secret server-side and upserts the `admin` role.

## Approach

Reuse the proven `/admin-signup` mechanism on `/auth` instead of the bootstrap-only path. The admin role stays server-verified — the browser can never self-assign it, which is what keeps the app safe from privilege escalation.

## Changes

1. **`src/pages/AuthPage.tsx` — Sign Up tab**
   - Add an "Admin access code" field (same field and validation as `/admin-signup`).
   - After a successful `signUp` that returns a session, invoke `assign-admin-role` with the code.
   - On success: refresh the role context, toast "Admin account created", navigate to `/admin`.
   - On a bad code: toast that the code was not accepted and send the account to `/dashboard` (the account still exists as a visitor).
   - If no session is returned (email confirmation pending), tell them to sign in to finish admin setup.

2. **`src/pages/AuthPage.tsx` — sign-in routing**
   - Drop the `setup-admin` bootstrap invocation from `checkAdminAndRoute`; keep the straight role lookup that sends admins to `/admin` and everyone else to `/dashboard`. This also removes the leftover 403 noise.

Nothing changes in the database, the trigger, or `assign-admin-role`.

## Technical notes

- The `user` role row still gets created by the trigger; the admin row is added alongside it, and `useAuthRole` already prefers `admin` when both are present, so routing lands on `/admin`.
- `ADMIN_SIGNUP_CODE` is already configured, so no new secret is needed. If you'd rather not type a code on `/auth`, the alternative is dropping the code requirement — but then anyone who reaches `/auth` could mint an admin account, so I'd recommend keeping it.
