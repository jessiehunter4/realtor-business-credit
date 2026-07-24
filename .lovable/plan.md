## Goal

Rebuild the Intake Survey (public `/intake` and admin `/admin/intake/:id`) around:

1. Multi-select **Primary Financial Goals (Top 3)** and **Financial Pains (Up to 3)**.
2. A live **Goal Statement** that reads the selections back in plain English.
3. **4 steps** — Profile · Goals · Business Structure · Credit & Funding — with a **Generate Plan** button at the bottom of Credit & Funding. The old Step E (Program Fit) is removed as a step; its inputs move onto the plan / dashboard experience after generation.
4. **Auto-save** on every field change: localStorage first, promote to a server draft as soon as an email is captured (or immediately when a token exists).
5. Remove **Time Horizon** and **Desired Monthly Credit Capacity** fields everywhere.
6. Post-generation UX: a congratulations screen, then the user's personal dashboard/plan is built and opened.

## Impact analysis

Files/systems affected (confirmed by search):

- `src/pages/IntakeSurveyPage.tsx` — steps, inputs, submit flow.
- `src/pages/AdminIntakeCoachView.tsx` — mirrors public inputs; coach edit view.
- `src/pages/AdminIntakeList.tsx` — no field refs (safe).
- `supabase/functions/intake-survey/index.ts` — `EDITABLE_SURVEY_FIELDS` whitelist, direct-submit + PUT handlers; will grow a POST `mode=direct-draft` (upsert-by-email) for anonymous auto-save promotion.
- `supabase/functions/generate-plan/index.ts` — prompt lines 175–181 reference the removed/renamed fields; rewrite to consume arrays and drop horizon/capacity.
- `src/integrations/supabase/types.ts` — regenerated automatically after migration.
- `src/components/intake/IntakePricingAndReadiness.tsx`, `src/components/plan/InlinePricingAccordion.tsx`, `src/components/plan/NextStepPanel.tsx` — currently rendered inside Step E of intake; move to plan portal only (they already exist there via `PortalPlanView`/`AdminIntakeCoachView`, so intake usage is just removed).
- DB schema: `intake_surveys` — add `primary_goals text[]`, `financial_pains text[]`; drop `goal_time_horizon`, `desired_monthly_credit_capacity`, `primary_goal`, `additional_goals`, `top_financial_goal`, `top_financial_pain`, `target_funding_amount`, `top_financial_need`. Add `draft_email text` for anonymous draft upsert key + partial unique index on `(lower(draft_email))` where `status = 'in_progress' and access_token is null`.
- Analytics / CRM: funnel events (`intake_started`, `intake_submitted`) unchanged. New event `plan_generated` already fires from `generate-plan` (verify) — no additional CRM changes required.
- Plan display (`PortalPlanView`, `AdminPlanView`, `PlanDocument`, `PlanPDF`) reads the AI-generated plan JSON, not raw survey fields — no changes needed.
- Dashboard/reporting: no direct references to the removed columns.

Not affected: MLS import, submit-lead, tag-ghl-contact, log-funnel-event, guide, landing.

## UX recommendations

**Multi-select for Goals & Pains**
- Use a checkbox grid (same visual as today's "Additional goals") with an inline counter: "2 of 3 selected". After 3 are checked, the remaining boxes disable and show tooltip "Pick your top 3". Optional numeric ordering via drag handle is out of scope for v1; instead, selection order is preserved in the array so the first-checked is treated as #1.
- Rationale: matches existing shadcn primitives, works on mobile, no new dependency.

**Live Goal Statement**
- Inline on Step B directly under the goals grid, rendered in an accent card:
  > "I want my real estate business to **cover overhead between closings**, **grow marketing spend**, and **build reserves** — and the biggest thing standing in the way is **cash flow gaps between commissions**."
- Repeated on a final in-page review block above the "Generate Plan" button (bottom of Credit & Funding step) so the user confirms before generating.
- Empty state: "Pick at least one goal to see your goal statement."

**Auto-save strategy**
- **Debounced 800 ms** after any field change, plus flush on step change and `visibilitychange = hidden`.
- **Direct mode (no token):**
  - Immediately: write full form to `localStorage["rbc_intake_draft_v2"]` keyed by contact identity email (falls back to anonymous).
  - As soon as `contact_email` is valid (regex + on blur), call `POST /intake-survey?mode=direct-draft` which upserts an `intake_surveys` row by `draft_email` and returns `{ id, access_token }`. Store the token in localStorage so subsequent visits resume from the server row.
  - Show subtle "Saved · just now" indicator in the header.
- **Token mode:** debounced PUT with `status: "in_progress"` (already supported); silent unless it fails.
- **Conflict handling:** server response includes `updated_at`; client stores it and sends `If-Match`-style `expected_updated_at`. On mismatch, toast "Your answers were updated in another tab — reloading" and refetch. (Low probability; acceptable safeguard.)
- **Resume:** on mount, if URL has `token` → fetch server draft; else if localStorage has token → append `?token=...` to URL and fetch; else hydrate from localStorage.
- **Completion:** on "Generate Plan" click → final PUT with `status=submitted`, invoke `generate-plan`, then route to congratulations → `/portal/plan/:id`. Clear localStorage draft.

**Post-generation flow**
- Full-screen success card: "Your plan is ready 🎉" with a 2-second progress bar animation while the plan renders, then auto-redirect to `/portal/plan/:id`. Manual button for users who want to jump.

## Technical architecture

**Database migration (single migration):**
```sql
alter table public.intake_surveys
  add column if not exists primary_goals text[] default '{}'::text[],
  add column if not exists financial_pains text[] default '{}'::text[],
  add column if not exists draft_email text;

-- Backfill from legacy columns before dropping
update public.intake_surveys
  set primary_goals = coalesce(
        array_remove(array_prepend(primary_goal, additional_goals), null),
        '{}'::text[])
  where primary_goals = '{}'::text[];

update public.intake_surveys
  set financial_pains = case
        when top_financial_pain is not null then array[top_financial_pain]
        else '{}'::text[] end
  where financial_pains = '{}'::text[];

alter table public.intake_surveys
  drop column if exists primary_goal,
  drop column if exists additional_goals,
  drop column if exists top_financial_goal,
  drop column if exists top_financial_pain,
  drop column if exists top_financial_need,
  drop column if exists goal_time_horizon,
  drop column if exists desired_monthly_credit_capacity,
  drop column if exists target_funding_amount;

create unique index if not exists intake_surveys_draft_email_idx
  on public.intake_surveys (lower(draft_email))
  where status = 'in_progress';
```

**Edge function changes**
- `intake-survey/index.ts`:
  - Update `EDITABLE_SURVEY_FIELDS` (add `primary_goals`, `financial_pains`; remove obsolete).
  - Add `mode=direct-draft` POST branch: upsert by `lower(draft_email)`, return `{ id, access_token }`.
  - Add optimistic concurrency: accept `expected_updated_at` and 409 on mismatch.
- `generate-plan/index.ts`: rewrite the survey summary section:
  ```
  - Primary Goals (top 3): ${(survey.primary_goals||[]).join("; ") || "N/A"}
  - Financial Pains: ${(survey.financial_pains||[]).join("; ") || "N/A"}
  - Goal Statement: <computed server-side to match UI>
  ```
  Remove references to horizon/capacity/target_funding.

**Frontend**
- New shared helper `src/lib/intakeGoalStatement.ts` — deterministic string builder used by UI, review card, and edge function (duplicate in Deno-safe form).
- New `src/components/intake/MultiSelectLimited.tsx` — reusable capped checkbox grid.
- New `src/components/intake/GoalStatement.tsx` — accent card renderer.
- New `src/hooks/useIntakeAutosave.ts` — debounce + localStorage + server promotion; returns `{ status, lastSavedAt, save }`.
- `IntakeSurveyPage.tsx`:
  - Reduce `steps` to 4 (Profile, Goals, Business Structure, Credit & Funding).
  - Delete Step E block; remove `IntakePricingAndReadiness` import/usage from intake (still used on plan portal).
  - Step D footer: replace Next with **Generate Plan** primary CTA + Goal Statement recap.
  - Add success screen with redirect on plan-ready.
- `AdminIntakeCoachView.tsx`:
  - Same field swap (multi-select goals/pains, drop horizon/capacity/notes-of-goals-legacy).
  - Coach view keeps Program Fit inputs on a separate tab since coach may still edit them post-generation (existing tab structure retained).

## Backward compatibility

- Old submissions: `primary_goals` backfill preserves prior answers so historical plans still show meaningful data. `goal_time_horizon`, `desired_monthly_credit_capacity`, `target_funding_amount` values are discarded (per your choice to drop columns) — the AI-generated plan text already stored on those old rows is unchanged.
- Any external export or GHL sync referencing removed columns: none found in code.

## Risks & edge cases

- Multi-tab editing on the same draft — mitigated by `expected_updated_at`.
- User closes browser mid-Step-A before email — draft lives only in localStorage; acceptable.
- Backfill array_prepend nuance on nulls — migration uses `array_remove(..., null)`.
- Generate Plan is a heavy call; if it fails, keep the survey submitted and show retry button rather than reverting status.

## Phased implementation

**Phase 1 — Schema & backend (blocking)**
- Migration: add new columns, backfill, drop old, index.
- Update `intake-survey` edge function whitelist + add `mode=direct-draft`.
- Update `generate-plan` prompt.
- _Complexity: M_

**Phase 2 — Shared helpers**
- `intakeGoalStatement.ts`, `MultiSelectLimited`, `GoalStatement`, `useIntakeAutosave` hook.
- _Complexity: M_ · depends on Phase 1 types regeneration.

**Phase 3 — Public /intake rebuild**
- Collapse to 4 steps, wire multi-select + Goal Statement + autosave + Generate Plan CTA + success screen.
- _Complexity: L_ · depends on Phase 2.

**Phase 4 — Admin coach view parity**
- Mirror field changes in `AdminIntakeCoachView.tsx`.
- _Complexity: M_ · parallel to Phase 3.

**Phase 5 — QA & cleanup**
- Manual pass: token resume, anonymous → email promotion, multi-tab conflict, Generate Plan happy path + failure retry, mobile layouts for admin dashboard, backfilled historical record renders.
- Remove dead constants (`HORIZON_OPTIONS`, `FUNDING_AMOUNT_OPTIONS`, `CREDIT_CAPACITY_OPTIONS`) and unused imports.
- _Complexity: S_

## Out of scope

- Redesigning the plan portal / dashboard itself.
- Moving Program Fit inputs onto the dashboard UI (data model retained; UI relocation is a follow-up).
- Drag-to-reorder for goal ranking (selection order used instead).
- CRM tag changes beyond existing `f-intake-started` / `f-intake-submitted`.
