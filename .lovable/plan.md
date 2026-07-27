# RBAC Implementation Plan — Admin vs Visitor

Goal: cleanly separate Admin and Visitor (Lead) authentication and authorization on top of Supabase Auth, using the existing `user_roles` table and `has_role()` security-definer function. No shared dashboards, no cross-role access, no client-tamperable role checks.

---

## 1. Security Review — Current State

Findings from the existing codebase:

- One shared `ProtectedRoute` gates `/admin`, `/admin/*`, and `/dashboard` on **session only** — any authenticated user can reach every admin page today.
- `/auth` (AuthPage) is the only real login and is used by admins; `/mock-login` is a UI-only stub that navigates to `/mock-dashboard` with no Supabase call.
- `user_roles` table + `has_role(uuid, app_role)` exist and are used by some table RLS, but the **frontend never checks role** before rendering admin pages.
- Edge functions (`generate-plan`, `intake-survey`, `link-intake-to-user`, `setup-admin`, `test-ghl-connection`) — only `setup-admin` and `test-ghl-connection` verify the caller; other admin-adjacent functions rely on RLS. Needs an audit pass to confirm no admin-only mutations are reachable by a visitor JWT.
- No "Unauthorized" page; role tampering in `localStorage`/client state would currently be irrelevant only because the client never reads role — but this becomes critical the moment we branch UI by role.
- After login, both roles land at whatever page they came from; no role-based post-login routing.

Concrete risks to eliminate:

1. Visitor JWT hitting `/admin` and reading data via any table whose RLS is not admin-gated.
2. Admin accidentally landing on `/dashboard` and seeing a broken/empty visitor view.
3. Client-side role flags (localStorage, context) being trusted for gating — must always re-derive from Supabase.
4. Edge functions that assume "if you have a JWT you're allowed" — need explicit `has_role` checks for admin actions.
5. Direct-URL navigation to protected routes (fixed by role-aware guards, not just session guards).

---

## 2. Authentication Architecture

Two login surfaces, one Supabase Auth backend, one role source of truth.

```text
                 ┌──────────────────────┐
   Visitors ───▶ │  /mock-login (real)  │ ─┐
                 └──────────────────────┘  │
                                           ▼
                                    Supabase Auth
                                           ▲
                 ┌──────────────────────┐  │
   Admins   ───▶ │   /auth (existing)   │ ─┘
                 └──────────────────────┘
                            │
                            ▼
                 useAuthRole() reads
                 public.user_roles via
                 has_role() (server-trusted)
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
     role = 'admin' → /admin      role = 'user' → /dashboard
```

Key decisions:

- **Single Supabase project, single `auth.users` table.** Role is stored only in `public.user_roles` (already the case). Never on `profiles`, never in JWT claims we mint ourselves, never in `localStorage`.
- `/mock-login` becomes a **real** email/password login (same Supabase call as `/auth`), but branded for visitors and hard-wired to redirect to `/dashboard`. Keeping the URL means we can later swap the visual/flow without route churn. When production visitor auth is ready, this page is what ships — no route rename needed.
- `/auth` stays the admin login. Post-login it routes to `/admin` if the user has admin role, otherwise it signs them back out with an error ("This login is for administrators. Please use the visitor login.") to prevent admins-only pages from ever rendering for a non-admin.
- Signup on `/mock-login` creates a user with **no role row** — visitor is the implicit default (absence of admin). Admin role is only granted via the existing `setup-admin` edge function or a direct DB insert.

---

## 3. Authorization Strategy

Server-trusted, cached on the client for UX only.

- **Source of truth:** `public.user_roles` + `has_role(auth.uid(), 'admin')`. RLS on every admin-only table already routes through this.
- **Client hook:** new `useAuthRole()` returns `{ session, role: 'admin' | 'user' | null, loading }`. It calls `supabase.from('user_roles').select('role').eq('user_id', uid)` on every auth state change. Cached in a React context so we don't refetch per component.
- **No JWT custom claims** for role in this phase — avoids a signing-key migration and keeps the model simple. If we later need per-request role in edge functions without a DB roundtrip, we add a claim then.
- **Edge functions** that perform admin actions call `has_role(user.id, 'admin')` (or select from `user_roles`) via the service role client before proceeding. Any function that mutates cross-user data must do this.

---

## 4. Route Protection Plan

Replace the single `ProtectedRoute` with three composable guards:

- `<RequireAuth>` — session required, role-agnostic (used for `/dashboard` and any future visitor-only route).
- `<RequireAdmin>` — session required AND `role === 'admin'`. Non-admins → `/unauthorized`.
- `<RequireVisitor>` — session required AND `role !== 'admin'`. Admins → `/admin` (silent redirect, not an error — admins landing here is a bookmark mistake, not an attack).

Route map after change:

| Route | Guard | Notes |
|---|---|---|
| `/` `/guide` `/about` `/pricing` `/one-on-one` `/intake` `/checkout` `/booking-confirmed` `/sample-plan` `/business-credit-cards-for-realtors` `/privacy` `/terms` | none | public |
| `/auth` | none | admin login; redirects admins to `/admin`, signs out non-admins with message |
| `/mock-login` | none | visitor login; redirects visitors to `/dashboard`, admins to `/admin` |
| `/admin`, `/admin/*` | `RequireAdmin` | includes mls-import, video-upload, intake list/coach, plan view |
| `/dashboard` | `RequireVisitor` | |
| `/portal/plan/:id` | `RequireAuth` + row-level check | plan owner OR admin; already RLS-scoped, add UI check |
| `/mock-dashboard` | none for now | UI-only mock; leave until phase 4 removes it |
| `/unauthorized` | none | new page |
| `*` | none | NotFound |

`SiteHeader` becomes role-aware: unauthenticated shows "Log in" (→ `/mock-login`) + "Start Here"; visitor shows "Dashboard" + "Sign out"; admin shows "Admin" + "Sign out". No admin link is ever shown to a visitor.

---

## 5. Database Impact

Minimal — the schema already fits.

- **Keep:** `user_roles`, `app_role` enum (`admin`, `user`), `has_role()`.
- **No new columns on `profiles`.** Role stays out of profiles to prevent privilege escalation.
- **New (optional, phase 2):** `public.assign_default_visitor_role()` trigger on `auth.users` insert. Decision: **skip** — absence of an admin row already means "visitor", and adding a `user` row for every signup is noise. Document this convention.
- **RLS audit pass:** for every `public.*` table, confirm policies either (a) scope by `auth.uid()`, or (b) require `has_role(auth.uid(), 'admin')`. Tables to double-check based on current schema: `agents`, `transactions`, `import_batches`, `contact_syncs`, `opt_outs`, `funnel_events`, `app_settings`, `programs`, `intake_coach_notes`. Any table intended as admin-only must have its `authenticated` policies rewritten to require admin.
- **Grants audit:** confirm every `public` table has explicit `GRANT`s matching its policies (per project rule).

Deliverable: a single migration that (1) tightens any admin-only table policies to `has_role(auth.uid(), 'admin')`, (2) removes any lingering broad `authenticated` grants on admin-only tables. Exact policy diffs produced after the RLS audit in Phase 2.

---

## 6. Edge Function Hardening

For each function, add an admin check where applicable:

- `process-mls-import`, `list-ghl-appointments`, `sync-to-ghl`, `tag-ghl-contact`, `test-ghl-connection`, `setup-admin` → **require admin**.
- `generate-plan`, `intake-survey`, `link-intake-to-user`, `submit-lead`, `log-funnel-event` → keep current auth model (public or user-scoped); confirm they can't be coerced into cross-user writes.

Shared helper: small `requireAdmin(req)` util that resolves the user from the bearer token and checks `user_roles`. Returns 401/403 with consistent shape.

---

## 7. UX Recommendations

- **Two distinct login pages** with different visual treatments so admins can't confuse them: `/auth` = compact admin form with an "Admin sign-in" heading; `/mock-login` = branded visitor sign-in/sign-up with "Log in to your dashboard".
- **Post-login redirect:** always role-aware. If a user arrived via a `?next=` param, honor it only if their role is allowed for that path — otherwise send them to their role's home.
- **`/unauthorized` page:** friendly copy, one primary CTA ("Go to my dashboard" for visitors, "Go to admin" for admins), and a "Sign out" link. No leak of what the protected page contained.
- **Header:** never render an "Admin" link for non-admins, even hidden — the DOM is inspectable and it's a bad signal.
- **Error messaging on wrong-portal login:** "This account isn't an admin. Redirecting you to your dashboard…" and auto-redirect after 2s, so visitors who mistakenly hit `/auth` aren't stranded.
- **Future-proofing:** the `useAuthRole()` hook returns `role` as a string so adding `coach`, `partner`, etc. is a matter of extending the enum + guards. Guards accept an array (`<RequireRole roles={['admin','coach']}>`) so composition scales.

---

## 8. Phased Implementation

Each phase is independently shippable and testable.

### Phase 1 — Foundations (low risk)

Scope:
- Add `src/hooks/useAuthRole.ts` and `AuthRoleProvider` context.
- Add `src/components/auth/RequireAuth.tsx`, `RequireAdmin.tsx`, `RequireVisitor.tsx`.
- Add `src/pages/UnauthorizedPage.tsx` and route.
- Refactor `App.tsx` to use the new guards (drop-in swap for `ProtectedRoute` on `/admin/*` and `/dashboard`).
- Header shows correct links per role.

Dependencies: none.
Risk: low — behavior for existing admins unchanged if they already have the admin role row.
Tests: manual — admin can still reach every `/admin/*` page; a fresh visitor account is redirected from `/admin` to `/unauthorized`.
Complexity: **S**.

### Phase 2 — Real visitor login + role-aware post-login routing

Scope:
- Convert `/mock-login` to a real Supabase email/password sign-in + sign-up (mirroring `/auth`), branded for visitors.
- `/auth` gains a post-login check: non-admins are signed out with a friendly message and pointed to `/mock-login`.
- Both pages redirect based on role after success.
- Update `PostPlanAuthCard` redirect target to `/dashboard` (already does) and confirm the new visitor flow works end-to-end.
- Delete `/mock-dashboard` route + page once `/dashboard` covers the same ground (already true).

Dependencies: Phase 1.
Risk: medium — touches the intake→auth→dashboard funnel. Regression test the full path.
Tests: signup as new visitor from intake completion; sign in on `/mock-login`; try `/admin` (should bounce); try `/auth` with visitor creds (should refuse + redirect).
Complexity: **M**.

### Phase 3 — RLS + Edge function hardening

Scope:
- RLS audit migration for admin-only tables (see §5).
- `requireAdmin` helper in `supabase/functions/_shared/` (create dir) and applied to admin-only functions (see §6).
- Grants audit and fix.

Dependencies: Phase 1 (so we can validate behavior with a real visitor account).
Risk: medium-high — a wrong RLS tighten can lock admins out. Ship migration + code in same turn and smoke-test admin dashboard immediately.
Tests: as a visitor JWT, hit each admin edge function → 403; select from each admin-only table via anon+JWT → empty/denied; as admin, everything still works.
Complexity: **M**.

### Phase 4 — UX polish + future-proofing

Scope:
- `<RequireRole roles={[...]}>` generic guard replacing the two specific ones.
- `?next=` support in both login pages with role validation.
- Loading skeletons on guards (avoid layout flash).
- Docs note in `README` describing how to grant admin role and the RBAC model.

Dependencies: Phase 1–3.
Risk: low.
Complexity: **S**.

---

## 9. Testing Recommendations

- **Matrix test:** for each of {anonymous, visitor, admin} × each protected route, verify expected outcome (allow / redirect-to-login / redirect-to-unauthorized / redirect-to-role-home).
- **Edge function matrix:** same three principals × each function, verify 200/401/403.
- **Session edge cases:** expired token, refreshed token mid-session, role revoked mid-session (guard should re-check on next navigation).
- **Direct URL entry:** paste `/admin/mls-import` as a visitor → `/unauthorized`; paste `/dashboard` as an admin → `/admin`.
- **Regression:** intake survey → generate plan → sign up → `/dashboard` → open plan → back to dashboard.

---

## 10. Out of Scope (called out intentionally)

- OAuth providers, magic links, MFA — additive later; the guard architecture is provider-agnostic.
- Custom JWT claims for role — deferred until we hit a real perf/DX need.
- Per-resource ACLs (e.g. sharing a plan with a co-agent) — separate feature.
- Migrating `/mock-login` to a new URL — deliberately keeping the path stable so production cutover is a copy change, not a routing change.
