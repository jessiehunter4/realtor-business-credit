## RBAC Implementation Plan

### Current state (verified)

- `user_roles` table + `app_role` enum (`admin`, `user`) + `has_role()` security-definer function already exist; RLS lets users read their own roles and admins read all.
- `AuthRoleProvider` (`src/hooks/useAuthRole.tsx`) already resolves session + role; `RoleGuards.tsx` provides `RequireAuth`, `RequireRole`, `RequireAdmin`, `RequireVisitor`.
- `/admin/*` routes and `/dashboard` are already guarded; `SiteHeader` already branches on `role === "admin"`.
- Edge functions `process-mls-import`, `sync-to-ghl`, `tag-ghl-contact`, `test-ghl-connection`, `list-ghl-appointments` use the shared `requireAdmin` helper.

**Three real gaps found:**

1. **Privilege escalation:** `/auth` calls the `setup-admin` edge function, which grants the **admin** role to *any* authenticated user who signs in there. This is exactly the "any valid credentials get in" symptom.
2. **Unguarded authenticated routes:** `/portal/plan/:id` and `/checkout` render with no guard (data is protected by RLS, but the pages are reachable and can render broken/empty states).
3. **Role resolution is duplicated** — `MockLoginPage` queries `user_roles` directly instead of using the shared provider, and role defaults to `"user"` when no row exists (implicit, undocumented).

---

### 1. Role model

Keep `user_roles` as the single source of truth (never on `profiles`). Roles stay in the `app_role` enum so adding `coach`, `staff`, `manager` later is one enum value + one route-map entry.

- No row for a user = implicit `user` (visitor). Document this; optionally backfill an explicit `user` row on signup via the existing `handle_new_user` trigger so every account has a row.
- Add a **role → home route** map in one file (`src/lib/roles.ts`): `admin → /admin`, `user → /dashboard`, future roles append here. Every redirect decision reads this map — no scattered `role === "admin"` ternaries.
- Optional schema additions (only if the user wants them): `user_roles.created_by uuid`, `user_roles.is_active boolean default true`. `is_active` would need to be honored by `has_role()` and `fetchRole()`.

### 2. Authentication flow

1. Credentials submitted → Supabase auth.
2. `AuthRoleProvider` `onAuthStateChange` fires and resolves the role (already implemented).
3. Login page waits for `loading === false`, then redirects to `homeForRole(role)`.
4. A `?next=` param is honored **only if** the target is permitted for that role; otherwise fall back to the role home.

`MockLoginPage` drops its local `resolveHome()` query and uses `useAuthRole()` — one code path for role resolution.

### 3. Privilege-escalation fix (highest priority)

- Stop the auto-grant: `/auth` no longer calls `setup-admin` on every sign-in. A non-admin signing in at `/auth` is redirected to `/dashboard` with a message.
- `setup-admin` becomes a **bootstrap-only** function: it grants admin only when the `user_roles` table has zero admins (first-admin bootstrap), otherwise returns 403. All subsequent admins are granted by an existing admin.
- Add an admin-only "Users & Roles" panel in the admin portal to grant/revoke roles (list users from `profiles`, insert/delete `user_roles` rows via an admin-guarded edge function using the service role).

### 4. Route protection matrix

| Access | Routes |
|---|---|
| Public | `/`, `/landing-page/:slug`, `/guide`, `/about`, `/pricing`, `/one-on-one`, `/intake`, `/sample-plan`, `/business-credit-cards-for-realtors`, `/privacy`, `/terms`, `/sms-opt-in`, `/booking-confirmed`, `/mock-login`, `/auth`, `/unauthorized`, `/payment-success`, `/payment-cancelled` |
| Authenticated (any role) | `/portal/plan/:id`, `/checkout` — wrap in `RequireAuth` (**new**) |
| Visitor only | `/dashboard` (already), plus future `/dashboard/*` progress/tasks pages |
| Admin only | `/admin`, `/admin/mls-import`, `/admin/video-upload`, `/admin/intake`, `/admin/intake/:id`, `/admin/plan/:id` (already) |

Guards are declared in `App.tsx` only. To reduce drift, group admin routes under a single parent `<Route element={<RequireAdmin/>}>` with `<Outlet/>` rather than wrapping each child.

### 5. Unauthorized-access behavior

- **Unauthenticated → protected route:** redirect to `/mock-login?next=<path>` (current behavior, keep).
- **Visitor → `/admin/*`:** redirect to `/unauthorized`, which shows a friendly "You don't have permission" message and a button back to their role home. (Change from current: `/unauthorized` should read the role and label the button "Go to your dashboard" / "Go to admin".)
- **Admin → `/dashboard`:** silent redirect to `/admin` (already in `RequireVisitor`).
- **Role still loading:** render the spinner, never a redirect — prevents flicker-logouts on refresh.

### 6. Navigation visibility

- `SiteHeader` renders items from a single declarative array with an optional `roles` field, filtered by current role — so a visitor can never render an admin link.
- Admin pages use the admin nav only; the visitor dashboard nav has no admin entries.
- Any admin-only action buttons inside shared components are wrapped in a small `<ShowForRole roles={["admin"]}>` helper.

### 7. Backend authorization (defense in depth)

- RLS remains the enforcement layer; guards are UX only. Every admin-readable table already uses `has_role(auth.uid(),'admin')`.
- Audit each edge function and classify: public (`submit-lead`, `log-funnel-event`, `intake-survey`, `heygen-token`), authenticated-user (`generate-plan`, `link-intake-to-user`, `create-checkout-session` — must verify the JWT and scope to `auth.uid()`), admin-only (must call `requireAdmin`). Add the missing guards found in that audit.
- New role-management function is admin-guarded and rejects self-demotion of the last admin.

### 8. Future scalability

Adding a role = (1) new enum value, (2) entry in the role→home map, (3) `roles={[...]}` on routes/nav items, (4) RLS policies using `has_role`. No changes to the provider, guards, or login flow.

### Implementation phases

1. **Phase 1 — Security fix:** remove auto-admin-grant from `/auth`, make `setup-admin` bootstrap-only. *(no dependencies)*
2. **Phase 2 — Central role config:** `src/lib/roles.ts` (role list, home map, route permissions); refactor `useAuthRole` and `MockLoginPage` to use it.
3. **Phase 3 — Route coverage:** add `RequireAuth` to `/portal/plan/:id` and `/checkout`; consolidate admin routes under one guard. *(depends on 2)*
4. **Phase 4 — Nav + unauthorized page:** role-filtered nav config, `ShowForRole`, role-aware `/unauthorized`. *(depends on 2)*
5. **Phase 5 — Edge function audit + admin Users & Roles panel.** *(depends on 1)*
6. **Phase 6 — Verification:** manual matrix test (visitor→/admin, admin→/dashboard, signed-out→both, deep-link `?next=` round-trip) plus a security scan.

### Open questions

- Do you want the `is_active` / `created_by` columns on `user_roles` now, or keep the schema as-is?
- Should the admin "Users & Roles" panel be part of this work, or a follow-up?
