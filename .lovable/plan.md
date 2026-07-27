## Visitor Dashboard Onboarding — Implementation Plan

Turn the current UI-only `/mock-dashboard` into a real, auth-gated `/dashboard` that becomes the landing surface immediately after a visitor generates their plan and creates an account. Prioritize the personalized plan, add a one-time welcome experience, and drive all metrics from real intake + plan data.

---

### 1. End-to-End User Journey

```
/intake  →  Generate Plan  →  PostPlanAuthCard (signup)
                          →  link-intake-to-user (stamps user_id)
                          →  /dashboard?firstLogin=1  (NOT /portal/plan/:id)
                                    ↓
                          Welcome modal + video (first time only)
                                    ↓
                          Dashboard with "View Your Plan" hero card
                                    ↓ (click)
                          /portal/plan/:id  (in-app, Back-to-Dashboard bar)
```

Change from today: after `PostPlanAuthCard` succeeds, redirect to `/dashboard` (not straight to the plan). The plan becomes the top CTA on the dashboard.

---

### 2. First-Time vs Returning Login

Track first login on the `profiles` table (server-side, single source of truth):
- `onboarding_completed_at timestamptz null`
- `welcome_video_viewed_at timestamptz null`

Rules:
- If `onboarding_completed_at IS NULL` on dashboard mount → open Welcome dialog automatically with intro video, "Take the tour" CTA, and "Skip for now" link. Closing sets `onboarding_completed_at = now()`.
- If not null → dashboard renders normally with a persistent "Watch welcome video" button in the header menu that reopens the same dialog.
- `?firstLogin=1` query param is a hint only — the DB flag is authoritative to survive re-installs and multi-device.

Welcome video source: reuse `HeroVideo` component with a new storage path (`welcome-dashboard.mp4`) in the existing `site-videos` bucket. Uploadable from `/admin/video-upload`.

---

### 3. Dashboard Information Architecture

Reorganize `MockDashboardPage` around the plan. New top-to-bottom order:

1. **Header** — greeting + avatar + "Watch welcome video" + Log out.
2. **Plan Hero Card** (new, replaces current KPI row as visual anchor):
   - Title of user's plan, recommended program, generated date.
   - Big "View Your Plan" primary button → `/portal/plan/:id`.
   - Secondary "Download PDF".
3. **KPI strip** — driven by real plan/task data (see §5).
4. **Next Action** card — first uncompleted task from `plan_task_progress`.
5. **Roadmap stepper** — from `plan_data.roadmap` phases.
6. **Two-column**: Upcoming tasks | Fundability radial.
7. **Recommendations** — from `plan_data.recommendations`.
8. **Recent activity** — from `funnel_events` filtered to this user.
9. Tabs (Overview / My Plan / 90-Day / Goals / Guides / Purchases) stay, but Overview is what loads.

Mobile: single column, sticky tab bar, KPIs collapse to 2×2, hero card full width.

---

### 4. Plan Viewing Experience

Keep `/portal/plan/:id` in the same window. Add:
- Sticky top bar: "← Back to Dashboard" + plan title + Download PDF.
- Bottom footer bar: same "← Back to Dashboard" button.
- When arriving from `/dashboard`, preserve scroll on return via existing `ScrollMemory`.
- Remove any `target="_blank"` on plan links from the dashboard.

---

### 5. Dashboard Data Model — Real, Not Mock

Replace `src/data/mockDashboard.ts` usage with data fetched from:

| Widget | Source |
|---|---|
| Greeting name | `profiles.first_name` |
| Plan hero | `custom_plans` for `user_id = auth.uid()`, latest published |
| Recommended program | `custom_plans.recommended_program_slug` + `programs` |
| 90-day checklist | `plan_task_progress` joined to plan; falls back to `plan_data.action_plan` |
| Overall progress % | completed tasks / total tasks |
| Fundability score | derived from intake_surveys structure fields (existing status logic in `PlanDocument`) |
| Goals | `intake_surveys.primary_goals` + plan roadmap |
| Recommendations | `plan_data.recommendations` |
| Recent activity | `funnel_events` where `lead_id/user_id` matches |
| Purchases | placeholder now; schema-ready for future Stripe |

**Recommended primary metrics** (highest value, low effort):
- 90-day plan completion %
- Fundability status (Strong / Warning / Missing counts)
- Next action due
- Days since plan generated

Defer for later: business credit score trend, funding readiness composite (needs more data captured over time).

---

### 6. Auth & Data Architecture Changes

**RLS / policies — already in place:**
- `custom_plans`: "Users can view own custom plans" (`auth.uid() = user_id`) ✓
- `intake_surveys`: "Users can view own intake surveys" ✓
- `profiles`: user can select/update own ✓

**New work:**
- Add columns to `profiles`: `onboarding_completed_at`, `welcome_video_viewed_at`, `last_login_at`.
- Add RLS policy on `plan_task_progress` for `authenticated` users to select/update rows where the parent `custom_plans.user_id = auth.uid()` (currently only public-for-published-plans + admin).
- Add RLS SELECT on `funnel_events` for `authenticated` where `lead_id` maps to the user (via a security-definer helper, since `funnel_events` doesn't have `user_id`).
- Wrap `/dashboard` in `ProtectedRoute` (already exists).
- Add `/dashboard` route to `App.tsx`; keep `/mock-dashboard` for internal previews or remove.
- Post-auth redirect in `PostPlanAuthCard.onAuthenticated` → `/dashboard?firstLogin=1` instead of `/portal/plan/:id`.
- Session: rely on existing `onAuthStateChange` + `getSession()` pattern in `ProtectedRoute`.

**Session lifecycle:**
- Add a lightweight `AuthProvider` context so dashboard, header, and plan view all share session + profile without refetching.
- On sign-out from dashboard → navigate to `/`.

---

### 7. Loading / Error / Empty States

- Dashboard skeleton with card placeholders during initial fetch.
- If user has auth but no linked plan (edge case): show "Finish your intake" empty state linking to `/intake`.
- If plan fetch fails: inline retry, don't block the whole dashboard.
- Welcome video: graceful fallback if the storage file isn't uploaded yet (skip auto-open, hide "Watch welcome video" button).

---

### 8. UX / Accessibility / Performance / Future

- Welcome dialog: focus-trap, ESC to close, `role="dialog"` `aria-labelledby`, closes flagged on any dismissal.
- All KPI numbers announced with `aria-live="polite"` when they change.
- Prefetch plan data on hover of "View Your Plan" using React Query.
- Code-split `/portal/plan/:id` and PDF renderer (already heavy).
- Future-proof: dashboard sections read from a `useDashboardData()` hook so new modules (Stripe purchases, cohort schedule, credit monitor) plug in without page-level changes.

---

### 9. Phased Delivery

**Phase 1 — Auth Redirect + Real Dashboard Route (small)**
- Add `/dashboard` route + `ProtectedRoute`.
- Repoint `PostPlanAuthCard` redirect to `/dashboard?firstLogin=1`.
- Copy `MockDashboardPage` → `DashboardPage`; keep mock imports temporarily.
- Add sign-out wired to real Supabase.

**Phase 2 — Profiles Onboarding Flags + Welcome Modal (small)**
- Migration: add `onboarding_completed_at`, `welcome_video_viewed_at` to `profiles`.
- Build `WelcomeDialog` with `HeroVideo` (storage path `welcome-dashboard.mp4`).
- Auto-open on first login; persistent "Watch welcome video" button after.

**Phase 3 — Plan Hero + In-App Plan Viewing (medium)**
- New `PlanHeroCard` at top of dashboard.
- Add Back-to-Dashboard bars (top + bottom) to `PortalPlanView`.
- Ensure all plan links are same-window.

**Phase 4 — Real Data Wiring (medium/large)**
- `useDashboardData()` hook: fetch profile, plan, task progress, recommendations, activity.
- Replace mock arrays in KPIs, Next Action, Checklist, Goals, Recommendations, Activity.
- Add RLS policy for authenticated `plan_task_progress` access.
- Keep `mockDashboard.ts` only for `/mock-dashboard` preview route.

**Phase 5 — Polish (small)**
- Skeletons, empty states, retry, prefetch on hover.
- A11y pass, mobile QA, Lighthouse pass.

**Dependencies:** Phase 2 needs Phase 1. Phase 4 needs Phase 3 (plan hero). Phase 5 runs last.

---

### 10. Risks & Testing

Risks:
- `funnel_events` has no `user_id` → activity feed needs a mapping via `leads`/`profiles` or a new `user_id` column (add in Phase 4 if needed).
- Users with intakes not linked (`user_id` NULL) will land on an empty dashboard — mitigated by the "Finish your intake" empty state and by the existing `link-intake-to-user` flow.
- Auto-open dialog on tab-switch back could annoy — use one-shot flag, not URL-based.

Testing:
- Playwright script: complete `/intake` → sign up → verify redirect to `/dashboard` → welcome dialog appears once → reload → dialog does NOT appear → click View Plan → Back to Dashboard preserves scroll.
- SQL check: `profiles.onboarding_completed_at` set after first dismissal.
- RLS: attempt to read another user's plan/tasks as anon and as another authenticated user — must fail.
- Mobile viewport 375px screenshot check on dashboard hero + checklist.

---

### Technical details (for the engineer)

- Files to add: `src/pages/DashboardPage.tsx`, `src/components/dashboard/PlanHeroCard.tsx`, `src/components/dashboard/WelcomeDialog.tsx`, `src/hooks/useDashboardData.ts`, `src/hooks/useAuthProfile.ts`.
- Files to edit: `src/App.tsx` (add route), `src/components/intake/PostPlanAuthCard.tsx` (change `onAuthenticated` redirect target), `src/pages/PortalPlanView.tsx` (Back bars), `src/components/shared/SiteHeader.tsx` (Watch welcome video + Sign out when authed).
- Migration: add profile columns + new policy on `plan_task_progress` for authenticated owners (with matching GRANTs already present).
- Storage: upload `welcome-dashboard.mp4` via `/admin/video-upload` (no code change needed there).
