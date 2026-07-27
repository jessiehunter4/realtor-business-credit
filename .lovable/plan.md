# Public Visitor Journey — End-to-End Implementation Plan

Design a seamless flow from Guide opt-in → Intake → Plan → Account → Dashboard, preserving data at every hop and introducing auth only after the plan exists.

---

## 1. UX Review & Target Flow

```text
/guide (form) ──► Lead saved ──► /guide (unlocked, CTA visible)
                                       │
                                       ▼
                    "Create My Customized Plan"
                                       │
                                       ▼
        /intake?leadId=... (prefilled, auto-save per step)
                                       │
                          Step 4 ──► "Generate My Customized Plan"
                                       │
                                       ▼
                    Plan generated + persisted
                                       │
                                       ▼
              Congratulations + Confetti (existing)
                                       │
                                       ▼
                Account creation card (email prefilled)
                                       │
                                       ▼
               /auth/visitor (login) ──► /dashboard
```

Key UX principles:
- Never lose typed data — persist to server on every meaningful step, keep a `localStorage` mirror as fallback.
- Auth is deferred: nothing before the plan requires a password.
- Every state has explicit loading + error + retry affordances.
- All new surfaces responsive from 320px; focus rings, aria-live on toasts, labeled inputs.

---

## 2. Database Impact Analysis

Existing tables cover most needs. Proposed additions (schema-only, no data yet):

### `leads` (extend)
- Add nullable `user_id uuid references auth.users(id) on delete set null`
- Add unique partial index on `lower(email)` to enforce dedupe (keep case-insensitive)
- Add `company_name text`, `city text` if we want to auto-fill more intake fields (optional)

### `intake_surveys` (already has `user_id`, `lead_id`, `access_token`)
- Add index on `lead_id` for resume lookups
- Ensure `handle_new_user` trigger (or a follow-up) links pre-existing intake to the new auth user via email match

### `custom_plans` (already has `user_id`, `lead_id`, `intake_survey_id`)
- No schema change; add linker to backfill `user_id` on signup

### New: `link-lead-to-user` edge function OR extend `link-intake-to-user`
- Given an authenticated user, find lead/intake/plan by email match or token, set `user_id` on all three.

### RLS
- `leads`: allow authenticated `select` where `user_id = auth.uid()` (currently admin-only reads).
- `intake_surveys` + `custom_plans`: confirm visitor `select` policies scoped to `user_id = auth.uid()` (already present per schema notes).

### Data flow diagram
```text
Guide form ─► leads (by email, upsert)
                │
                ▼
Intake step save ─► intake_surveys (lead_id FK, access_token, user_id NULL)
                │
                ▼
Generate plan ─► custom_plans (intake_survey_id FK, lead_id FK, user_id NULL)
                │
                ▼
Signup ─► auth.users + profiles (trigger) + link-fn sets
          leads.user_id, intake_surveys.user_id, custom_plans.user_id
                │
                ▼
Dashboard reads plan by user_id
```

---

## 3. Authentication Architecture

- **Provider:** Supabase Auth email/password (already in place). No social login in this phase.
- **Lead-to-User linking:** email is the join key. On signup:
  1. `handle_new_user` trigger creates `profiles` row (already exists).
  2. New edge function `link-visitor-data` (service role) runs post-signup, updates `leads`, `intake_surveys`, `custom_plans` where `email = new_user.email` AND `user_id IS NULL`.
- **Duplicate account detection:** try `signUp`; on `user_already_exists`, show inline "You already have an account — sign in instead" with prefilled email.
- **Route protection:** reuse `RequireVisitor` / `RequireAdmin` / `RequireAuth` from `RoleGuards.tsx` (RBAC Phase 1 already shipped). Visitors default to `user` role from `has_role`.
- **Session mgmt:** existing `useAuthRole` provider; `onAuthStateChange` already registered. Add `?next=/dashboard` support on the visitor login route.
- **Authorization:** RLS scopes reads to `auth.uid()`. Edge functions that mutate visitor data validate JWT + row ownership; anonymous flows (intake draft, plan generation pre-signup) continue to use `access_token`.
- **Admin compatibility:** unchanged — admins keep `/auth` + `/admin`; visitors get `/auth/visitor` (rename of `/mock-login`) + `/dashboard`.

---

## 4. Technical Design

### Frontend
- `src/pages/GuidePage.tsx` — after `LeadForm` submits, POST to `submit-lead` (already writes to `leads`), then keep user on `/guide` with unlocked content + new **"Create My Customized Plan"** CTA that navigates to `/intake?leadId=<id>` (leadId returned from edge fn).
- `src/components/landing/LeadForm.tsx` — return `leadId` to caller; add success state; email dedupe handled server-side.
- `src/pages/IntakeSurveyPage.tsx` — on mount, if `leadId` (or `rbc_contact` localStorage) present, prefetch lead + hydrate: first_name, last_name, email, phone, state, (company/city if collected). Preserve editability. Persist step already exists (`intake-survey` fn `mode=direct-draft`); ensure `lead_id` is passed so the row links back.
- `src/components/intake/PostPlanAuthCard.tsx` — email locked (prefilled from intake), collect password + confirm; on success call `link-visitor-data`, then redirect to `/auth/visitor?next=/dashboard&justSignedUp=1`.
- `src/pages/MockLoginPage.tsx` — rename route to `/auth/visitor` (keep `/mock-login` as redirect for one release); already handles real auth + role redirect.
- `src/pages/DashboardPage.tsx` — already renders plan hero, KPIs, welcome dialog. Extend `useDashboardData` to also expose goals + recommendations lifted from `custom_plans.plan_data`.

### Backend (Edge Functions)
- **`submit-lead`** — enforce email dedupe (`upsert on conflict lower(email)`), return `{ leadId }`.
- **`intake-survey`** — accept `lead_id` on `mode=direct-draft` and on final submit; guarantee one intake per lead (upsert by `lead_id` if `access_token` missing).
- **`generate-plan`** — no change beyond ensuring `lead_id` propagates onto `custom_plans`.
- **New `link-visitor-data`** — auth-required; sets `user_id` on leads/intakes/plans matching `auth.user.email`.

### Auto-fill
- Query `leads` by `id` via a lightweight `get-lead` read (or embed lead payload in the CTA redirect state). Prefer state-passing via `react-router` `navigate(url, { state })` to avoid extra fetch when possible; fall back to fetch by id.

### Auto-save
- Already implemented per-step in `IntakeSurveyPage`. Add debounce (800ms) for text fields so partial edits inside a step aren't lost if the user closes the tab mid-step.

### Route Guards / New Routes
- `/auth/visitor` (public), `/dashboard` (`RequireVisitor`), `/portal/plan` (`RequireVisitor`) — already exist or minor renames.

### Scalability hooks
- `custom_plans.status` + `plan_task_progress` already model progress; future Stripe purchases can add a `subscriptions` table keyed by `user_id` without touching this journey.

---

## 5. Phased Implementation

### Phase A — Guide → Lead dedupe & CTA (Low complexity)
- Update `submit-lead` to upsert by email and return `leadId`.
- Update `LeadForm` + `GuideOptInGate` to store `leadId` in localStorage + surface CTA on `/guide`.
- Add "Create My Customized Plan" button that navigates to `/intake?leadId=...`.

### Phase B — Intake prefill + lead linkage (Low/Med)
- `IntakeSurveyPage` reads `leadId` from URL/localStorage, fetches lead, prefills fields.
- `intake-survey` edge fn accepts and persists `lead_id`; enforces "one open draft per lead".

### Phase C — Plan generation continuity (Low)
- Ensure `generate-plan` writes `lead_id` on `custom_plans`.
- Confirm confetti/celebration screen already shown (it is) — no change.

### Phase D — Post-plan account creation + linking (Med)
- Ship new `link-visitor-data` edge function.
- `PostPlanAuthCard` collects password only (email locked), signs up, calls linker, then routes to `/auth/visitor?next=/dashboard`.
- Handle `user_already_exists` gracefully.

### Phase E — Visitor login polish (Low)
- Rename `/mock-login` → `/auth/visitor`; keep old path redirecting.
- Add `?next=` support (already partly done); loading + error states audit.

### Phase F — Dashboard data completeness (Low/Med)
- Extend `useDashboardData` to surface goals + recommendations from `plan_data`.
- Placeholders for "Future Guide Progress" and "Future Purchased Programs" cards.

### Phase G — Migration + RLS review (Med)
- Add `leads.user_id`, dedupe index, RLS `select` for owner.
- Backfill script (optional) to link historical leads/intakes/plans by email.

---

## 6. Risks

- **Email collisions across roles** — a visitor who later becomes admin would need role change, not new account. Document.
- **Anonymous intake abuse** — rate-limit `intake-survey` `direct-draft` writes by IP.
- **Prefill leaking data** — never fetch a lead by email from the client; always by opaque `leadId` returned to the same session (or via `access_token`).
- **Race condition on linker** — run linker synchronously before redirect; retry once on transient failures.
- **Existing users hitting signup card** — must detect `user_already_exists` and offer sign-in.

---

## 7. Testing Recommendations

- E2E (Playwright): fresh visitor completes guide → intake → plan → signup → dashboard shows plan.
- Duplicate email guide submissions produce a single lead row.
- Signup with an already-registered email surfaces sign-in path.
- Direct navigation to `/dashboard` while logged out → `/auth/visitor?next=/dashboard`.
- Admin logging into `/auth/visitor` bounces to `/admin`; visitor at `/auth` bounces to `/auth/visitor`.
- RLS: authenticated visitor cannot read another user's plan (supabase-js negative test).
- Mobile viewport 375px pass on Guide form, Intake steps, PostPlanAuthCard, Dashboard.

---

## 8. Complexity Summary

| Phase | Complexity | Depends on |
|-------|-----------|------------|
| A     | S         | —          |
| B     | S/M       | A          |
| C     | S         | B          |
| D     | M         | C, G       |
| E     | S         | D          |
| F     | S/M       | D          |
| G     | M         | —          |

Recommend shipping G first (migration), then A→F in order.

---

Approve and I'll start with Phase G (schema + RLS migration) followed by Phase A.
