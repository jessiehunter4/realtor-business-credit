# Single Role Per Account at Registration

## Root cause

Two independent processes assign roles, and both run for an admin signup:

1. The new-user database trigger (`handle_new_user`, fired on every auth signup) always inserts `('user')` into `user_roles`.
2. Immediately after `signUp()`, `AdminSignupPage` (and the signup tab of the older `AuthPage`) calls the `assign-admin-role` edge function, which upserts `('admin')`.

Neither step knows about the other, so an admin account ends up with an `admin` row *and* a `user` row. The unique constraint is on `(user_id, role)`, so it does not prevent two different roles for one user. The duplicate is not visible in today's stored data (each existing account has exactly one row, and the newest admin predates the trigger change), but the current code path produces it for any admin created now.

Secondary issues found:

- Two overlapping admin-granting functions exist: `assign-admin-role` (grants unconditionally to the caller — anyone who can sign up can make themselves admin) and `setup-admin` (bootstrap-only: refuses when an admin already exists). Both signup screens use the unrestricted one.
- Role resolution in `useAuthRole` masks the duplicate (it prefers `admin`), so redirects still work today — the defect is data integrity plus the privilege-escalation hole, not broken routing.

## Role assignment strategy

One authoritative writer per account: the database.

- Keep the trigger as the only place that creates the initial role row, but make it read the signup intent from user metadata: if `raw_user_meta_data->>'requested_role' = 'admin'` **and** admin self-registration is permitted, insert `admin`; otherwise insert `user`.
- Because self-declared metadata cannot be trusted alone, gate the admin branch the same way `setup-admin` does: allow `admin` only when no admin exists yet (bootstrap). Any later admin must be granted by an existing admin.
- Signup pages stop assigning roles. `AdminSignupPage` passes `requested_role: 'admin'` in signup metadata and, once the session exists, refreshes the role and routes on what the database actually returned.
- Post-bootstrap admin creation happens through an admin-only path: an existing admin promotes a user from the admin dashboard (RLS already allows admin inserts on `user_roles`).

## Database safeguards

- Add a unique index giving each user at most one primary role row (unique on `user_id` across the `admin`/`user` set). A second insert then fails loudly instead of silently duplicating.
- Cleanup migration: for any user holding both `admin` and `user`, delete the `user` row (admin wins).
- Keep every insert idempotent (`ON CONFLICT DO NOTHING`) so repeated auth-state hydration cannot create extra rows.
- A promotion (user to admin) becomes an update inside one security-definer function, never a bare insert.

## Code changes

| File | Change |
| --- | --- |
| migration | Rewrite `handle_new_user` to branch on `requested_role` plus the bootstrap check; add the one-role-per-user index; clean up duplicates; add `promote_user_to_admin(uuid)` security-definer function callable only by admins |
| `src/pages/AdminSignupPage.tsx` | Send `requested_role: 'admin'` in signup metadata; remove the `assign-admin-role` invoke; route from the refreshed role |
| `src/pages/AuthPage.tsx` | Same treatment for its signup tab (or retire the page if redundant with `/login` + admin signup) |
| `src/pages/SignupPage.tsx` | No change (already relies on the trigger) |
| `supabase/functions/assign-admin-role` | Delete — unrestricted self-elevation; `setup-admin` covers bootstrap |
| `supabase/config.toml` | Drop the removed function entry |
| `src/pages/AdminDashboard.tsx` | Point the "setup admin" action at the retained bootstrap function; optionally surface promote-to-admin for existing users |

## RBAC validation

- `useAuthRole` keeps its precedence logic as defence in depth, but with one row per user it now returns exactly what is stored.
- `RequireAdmin` / `RequireVisitor` / `resolvePostAuthTarget` need no change: admins land on `/admin`, visitors on `/dashboard`, and `RequireVisitor` already bounces admins to their own home.
- Verify an admin signing in through the visitor login is redirected to `/admin`, and a visitor hitting `/admin` gets `/unauthorized`.

## Testing checklist

1. New admin registration with no admin present: exactly one `admin` row, lands on `/admin`.
2. New admin registration when an admin already exists: account created as `user`, clear message that admin access must be granted; exactly one `user` row.
3. New visitor registration: exactly one `user` row, lands on `/dashboard`.
4. Existing admin login: `/admin`, role unchanged, no new rows.
5. Existing visitor login: `/dashboard`, no new rows.
6. Repeated signup attempts and repeated auth-state hydration: row count stays at 1.
7. Promotion flow: admin promotes a visitor, leaving a single `admin` row.
8. Direct check: `select user_id, count(*) from user_roles group by 1 having count(*) > 1` returns no rows.
9. Route protection: visitor to `/admin` gets `/unauthorized`; admin to `/dashboard` redirects to `/admin`.
10. Email-confirmation path: signup without an immediate session still yields the correct single role once confirmed.

## Phases

1. **Migration** — trigger rewrite, unique index, duplicate cleanup, promotion function.
2. **Frontend** — signup pages stop writing roles; route from the refreshed role.
3. **Cleanup** — remove `assign-admin-role`, update config and the admin dashboard action.
4. **Verification** — run the testing checklist and confirm the duplicate query returns nothing.