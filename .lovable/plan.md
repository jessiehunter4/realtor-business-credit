
# Lead Authentication Implementation Plan

Adds email/password auth for **visitors only** (leads who read the guide or complete the intake). Admin auth at `/auth` and `/admin/*` stays exactly as-is.

---

## 1. Authentication Flow

**Sign-up trigger points** (natural moments where we already have their info):
1. After **Guide Opt-In** (`GuideOptInGate`) — we already collect first/last/email/phone. Add a password field so the same submission creates their account.
2. After **Intake Survey submission** — if the visitor isn't yet authenticated, prompt them to "Save your plan — create an account" (password only; email is prefilled from intake).
3. Standalone **Visitor Login** page for return visitors clicking magic links from GHL emails.

**Flow diagram:**
```text
Guide form / Intake done
        │
        ▼
  Set password ──► supabase.auth.signUp
        │              (emailRedirectTo = /dashboard)
        ▼
  Session created ──► Link identity to profile + existing lead/intake row
        │
        ▼
  Redirect to /dashboard
```

Return visitor: `/login` → `signInWithPassword` → `/dashboard`.
Password reset: `/forgot-password` + `/reset-password` (required by Supabase best practice).

---

## 2. Database Considerations

New tables (all in `public`, with GRANTs + RLS):

**`profiles`** — one row per authenticated visitor, keyed by `auth.users.id`.
- `user_id uuid PK references auth.users on delete cascade`
- `first_name`, `last_name`, `email`, `phone`
- `ghl_contact_id` (link to existing CRM contact)
- `lead_id` (nullable FK to `leads`)
- Auto-created on signup via `handle_new_user` trigger on `auth.users`.
- RLS: user can select/update own row; service_role full.

**Link existing data to the new user:**
- Add `user_id uuid` column (nullable) to `intake_surveys`, `custom_plans`, and `leads`.
- On signup, an edge function `link-visitor-identity` looks up existing rows by email/ghl_contact_id and stamps `user_id`.
- RLS on those tables: add policy `user_id = auth.uid()` for visitor SELECT (admin policies unchanged — admins already use `has_role`).

**No changes to `user_roles`** — visitors have no role row, so `has_role(uid, 'admin')` returns false and admin surfaces remain protected.

---

## 3. Route Protection Strategy

Reuse the existing pattern but add a visitor-scoped guard so we don't entangle it with `ProtectedRoute` (which is admin-only in spirit).

- **New `VisitorRoute`** component: same `onAuthStateChange` + `getSession` logic as `ProtectedRoute`, but redirects unauthenticated users to `/login?next=<path>` instead of `/auth`.
- **Wrap:** `/dashboard`, `/dashboard/plan`, `/dashboard/guide`, `/dashboard/profile`.
- **Public routes stay public:** `/`, `/guide`, `/intake`, `/pricing`, `/about`, `/one-on-one`, `/sample-plan`, etc.
- **Portal plan page (`/portal/plan/:id`)**: keep tokenized public access for GHL email links, but if a session exists, prefer redirecting to `/dashboard/plan`.
- **Admin routes (`/auth`, `/admin/*`)**: untouched.

---

## 4. UI Changes

**New pages/components:**
- `src/pages/LoginPage.tsx` — `/login` (visitor sign-in + link to signup / forgot password).
- `src/pages/SignupPage.tsx` — `/signup` (standalone; usually reached via guide/intake flow).
- `src/pages/ForgotPasswordPage.tsx` — `/forgot-password`.
- `src/pages/ResetPasswordPage.tsx` — `/reset-password` (required; handles `type=recovery`).
- `src/pages/VisitorDashboardPage.tsx` — `/dashboard` shell with tabs/cards:
  - **My Plan** — pulls latest `custom_plans` row for `user_id`, reuses `PlanDocument` and PDF export.
  - **Guide Progress** — reads from `guideScrollMemory` + `plan_task_progress`; shows % complete and a "Resume reading" CTA.
  - **My Profile** — edit name/phone; email is read-only from `auth.users`.
- `src/components/VisitorRoute.tsx` — auth guard.
- `src/components/shared/SiteHeader.tsx` — add "Log in" / avatar menu (Dashboard, Sign out) when a visitor session exists.

**Modified components:**
- `GuideOptInGate.tsx` — add password field; call `signUp` then existing `submit-lead`. Replace `navigate("/mock-login")` with `navigate("/dashboard")`.
- `IntakeSurveyPage.tsx` — on completion, if no session: show inline "Create account to save your plan" (password only), then redirect to `/dashboard`; if session exists: skip prompt.
- Retire `MockLoginPage`/`MockDashboardPage` once the real flow is live.

---

## 5. Phased Implementation

**Phase 1 — Backend foundation**
- Migration: create `profiles`, add `user_id` to `leads` / `intake_surveys` / `custom_plans`, `handle_new_user` trigger, visitor RLS policies + GRANTs.
- Edge function `link-visitor-identity` (invoked after signup) to backfill `user_id` on matching rows by email.

**Phase 2 — Auth pages & guard**
- Add `LoginPage`, `SignupPage`, `ForgotPasswordPage`, `ResetPasswordPage`, `VisitorRoute`.
- Wire routes in `App.tsx`; add header auth affordance.

**Phase 3 — Signup integration in existing funnels**
- Update `GuideOptInGate` to create an account inline.
- Update intake completion to prompt account creation and stamp `user_id` on the intake/plan.

**Phase 4 — Visitor Dashboard**
- Build `/dashboard` with Plan / Guide Progress / Profile sections, reusing existing `PlanDocument`, PDF export, and scroll memory.

**Phase 5 — Cleanup & QA**
- Remove `MockLoginPage` / `MockDashboardPage`.
- Enable Supabase password HIBP check (`configure_auth`).
- Verify admin flow untouched, RLS on all visitor tables, password reset end-to-end.

---

## Technical Details

- Use `supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${origin}/dashboard`, data: { first_name, last_name, phone, ghl_contact_id } } })`; the trigger reads `raw_user_meta_data` to seed `profiles`.
- Session bootstrap follows the required pattern: register `onAuthStateChange` first, then call `getSession()`; use `getUser()` for any server-trusted check.
- Auto-confirm email stays **off** (per platform rules); rely on Supabase's default confirmation email (or later scaffold branded auth email templates).
- Password reset link uses `resetPasswordForEmail(email, { redirectTo: `${origin}/reset-password` })`; `/reset-password` calls `updateUser({ password })`.
- All new `public` tables and altered tables get explicit `GRANT SELECT, INSERT, UPDATE, DELETE ... TO authenticated` plus `GRANT ALL ... TO service_role`; no `anon` grants (every visitor policy is `user_id = auth.uid()`).
