
## Goal
Streamline `/intake` to 4 public steps, ensure scroll-to-top on step change, incrementally auto-save server-side (create record on step 1, update on each step), and replace the final Submit with a centered "Generate My Plan" button that validates → saves → generates → runs the existing preview/portal flow. Preserve Step 5 (Program Fit) code and DB columns for admin/future use.

## 1. Remove Step 5 from public flow (preserve for admin)

- In `src/pages/IntakeSurveyPage.tsx`:
  - Trim the public `steps` array to 4 entries (Profile, Goals, Business Structure, Credit & Funding). Keep `stepVideoMeta` entries 0–3.
  - Leave the `{step === 4 && ...}` JSX block AND its imports (`IntakePricingAndReadiness`, `InlinePricingAccordion`) in the file, but wrap it in `{false && ...}` (or an `ENABLE_PROGRAM_FIT_STEP = false` flag) so it's dead-code-eliminated yet trivially re-enabled. No DB / edge function changes.
  - Progress indicator, "Step X of Y", and sticky footer counter automatically reflect `steps.length = 4`.
- `AdminIntakeCoachView` and the underlying columns (`preferred_support_format`, `interest_in_cohort`, `preferred_cohort_time_1/2`, `investment_readiness`, `additional_notes`) are untouched. The admin coach view continues to render the Program tab.
- No changes to `intake-survey` edge function `EDITABLE_SURVEY_FIELDS` — server still accepts those columns if a user is resumed via an admin-issued token that had them set.

## 2. Scroll to top on step change

- Add a `useEffect([step])` in `IntakeSurveyPage` that calls `window.scrollTo({ top: 0, behavior: "smooth" })` on step change (skip on initial mount).
- `ScrollMemory` operates on `location.pathname` only, so it won't interfere with same-route step transitions.
- No changes needed for desktop/tablet/mobile beyond this — the layout is already single-column.

## 3. Incremental server-side auto-save (direct mode)

Today direct mode only saves to `localStorage` until final submit. Move to server-persisted incremental save so users can resume from any device.

- Add a POST `mode=direct-draft` branch to `supabase/functions/intake-survey/index.ts`:
  - Body: `{ intake_id?, ...editable fields }`.
  - If no `intake_id`: require `contact_email`, insert a new `intake_surveys` row with `filled_by: "self"`, `status: "in_progress"`, return `{ id, access_token }`.
  - If `intake_id`: update the row by id (still `status: "in_progress"`), no `submitted_at`.
  - Reuse existing `pickEditableSurveyFields` — no field allowlist changes.
- Client changes in `IntakeSurveyPage.tsx`:
  - Track `intakeId` + `intakeToken` (already state) as the persisted record identity.
  - On the "Next" button click AND on step-index change, call a `persistStep()` helper:
    - If `!intakeId` and `contact_email` present → POST `mode=direct-draft` to create; store returned `id` and `access_token` in state and `localStorage` (existing draft key extended to include `{intake_id, access_token, form}`).
    - If `intakeId` → POST `mode=direct-draft` with `intake_id` to patch.
    - Failure: keep local draft, show a subtle "Saved locally — will retry" toast; do not block navigation.
  - Keep the existing debounced localStorage save as a background safety net.
  - On mount: if the stored draft contains `intake_id` + `access_token`, prefer server hydration (`GET ?token=...`) and reuse that token; falls back to local form if the row is missing.
- Token-mode (admin-issued link) is unchanged — it already PUTs on every debounce.
- Duplicate prevention: identity is the row `id` in draft storage; we never insert twice because subsequent saves carry `intake_id`. If a user clears storage and re-starts, we create a fresh row (acceptable; admin can dedupe by email later — same as today).

## 4. "Generate My Plan" on Step 4

Replace the current two-stage flow (Submit → then PlanPreviewCard) with a single centered CTA on Step 4:

- Add a `validateAllRequired()` that checks: `first_name`, `last_name`, `contact_email` (email regex), and `primary_goals.length >= 1`. On failure, jump to the first failing step and toast the missing field.
- New button on Step 4 (centered, primary, large), label "Generate My Plan → ", replacing the current sticky footer "Submit". Sticky footer on Step 4 shows only "Previous"; primary CTA lives inside the card for visibility.
- Handler `handleGenerate()`:
  1. Run `validateAllRequired()`.
  2. Call `persistStep()` and wait — this now sends the FINAL PUT with `status: "submitted"` and `submitted_at` (add a `finalize: true` flag to the `mode=direct-draft` endpoint, or reuse the existing direct-submit path when finalizing). Result must include `{ id, access_token }`.
  3. Set `submitted = true`, `intakeId`, `intakeToken`.
  4. Fire `intake_submitted` funnel event + GHL tag (same as today).
  5. Immediately call `generatePlan({ intakeSurveyId, intakeToken, source: "user" })` — skip the manual `PlanPreviewCard` click, going straight to `PlanGenerationLoader` → `PlanSuccessCelebration` → `View My Plan` → `/portal/plan/:id`. Existing error card + retry stays.
- The `PlanPreviewCard` component remains available for token/admin flows; for the direct public flow we bypass it. (If you want to keep an "explanation" moment, we can leave PlanPreviewCard rendered for ~800ms before auto-clicking — flag as optional.)

## 5. Impact review

- `usePlanGeneration`, `generate-plan` edge function, `log-funnel-event`: no changes.
- `AdminIntakeCoachView`: unchanged (still shows all 5 tabs).
- `AdminIntakeList`, RLS, `custom_plans`, `plan_task_progress`: unchanged.
- Analytics: same event types (`intake_started`, `intake_submitted`, `plan_generation_started/succeeded/failed`, `intake_session`). Add an optional `intake_step_saved` metadata event per step (nice-to-have; skip if we want zero new event types).
- Accessibility: focus first heading on step change alongside scroll-to-top; retain existing `aria-label`s.
- Mobile: sticky bottom bar stays; on Step 4 the bar hides its primary action and the inline CTA takes over (avoids double-primary).

## Technical section

- Files touched:
  - `src/pages/IntakeSurveyPage.tsx` — steps array trim, scroll effect, persistStep helper, handleGenerate, Step 4 CTA, feature-flag Step E block.
  - `supabase/functions/intake-survey/index.ts` — add `mode=direct-draft` POST handling (create or update by id) and a `finalize` flag that sets `status: "submitted"` + `submitted_at`.
  - `src/components/intake/PlanPreviewCard.tsx` — no code change; usage becomes optional.
- Draft storage key: bump to `rbc_intake_draft_v3` with shape `{ intake_id, access_token, form }`; migrate v2 by treating it as form-only.
- Rollback: flip `ENABLE_PROGRAM_FIT_STEP = true` to restore Step 5 publicly; delete the `mode=direct-draft` branch to revert to submit-only.

## Phasing

1. **Phase 1 (client-only, low risk):** remove Step 5 from public list, add scroll-to-top, wire centered "Generate My Plan" on Step 4 that runs the existing direct-submit path then auto-triggers `generatePlan`. Ship & verify.
2. **Phase 2 (server incremental save):** add `mode=direct-draft` endpoint, persist on Next, hydrate on resume. Ship & verify with a fresh browser session.
3. **Phase 3 (polish):** optional `intake_step_saved` analytics, focus-management on step change, unit-test `validateAllRequired`.
