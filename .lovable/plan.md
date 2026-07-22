
## End-to-End Flow (as it exists today)

```text
IntakeSurveyPage.tsx  ──submit──▶  intake_surveys (status: submitted)
                                          │
                                          ▼
Admin opens /admin/intake/:id  ──▶  AdminIntakeCoachView.tsx
                                          │
                          click "Generate Plan" (handleGeneratePlan, line 170)
                                          │
                                          ▼
supabase.functions.invoke("generate-plan", { intake_survey_id })
                                          │
                                          ▼
supabase/functions/generate-plan/index.ts
  1. Auth: verify caller is admin (has_role)
  2. Fetch intake_surveys row + intake_coach_notes
  3. computeFundabilityItems(survey)  → deterministic status list
  4. POST https://ai.gateway.lovable.dev/v1/chat/completions
       model: google/gemini-3-flash-preview
       tool_choice: generate_plan (forced function call)
  5. Parse tool_call.function.arguments → aiPlan
  6. INSERT into custom_plans (status: "draft", created_by: admin userId)
  7. Return { plan_id }
                                          │
                                          ▼
Admin redirected to /admin/plan/:plan_id  (AdminPlanView.tsx)
   - Shows draft, "Publish" button flips status → "published"
                                          │
                                          ▼
Client visits /portal/plan/:plan_id  (PortalPlanView.tsx)
   - Line 36 hard gate: if status !== "published" → "Plan not available"
```

## What's Actually Broken

Verified against live `custom_plans` data:

| intake_survey_id | rows | statuses |
|---|---|---|
| baa13ca9 (John Test) | 3 | published, draft, published |
| 98b6c728 (REYJOY P SABINO) | 3 | draft, draft, draft |

Two concrete failure modes:

1. **Duplicate rows on every click.** `generate-plan` does a plain `INSERT` (index.ts:332-345). Each "Generate Plan" click creates a new `custom_plans` row for the same intake. There is no unique constraint on `intake_survey_id`, no upsert, no archival of prior drafts. Result: admin ends up with several plan IDs per intake, the `/admin/plan/:id` link the intake view surfaces (`existingPlanId`) can point to a stale row, and clients can be sent a URL that no longer matches the "latest" plan.

2. **Silent draft trap for clients.** New plans always land as `status: "draft"`. `PortalPlanView.tsx:36` renders "This plan is not yet available" for anything non-published. REYJOY's intake has three drafts and zero published rows — the client can never view a plan. There is no UI signal to the coach that the plan is unpublished, and no auto-publish path.

Secondary issues surfaced during the trace:

- **No render-time validation.** `PlanDocument.tsx` / `PlanPDF.tsx` assume every `sections.*` key exists. A partial AI response (missing e.g. `funding_items`) would blank-screen the plan.
- **AI error surfacing is generic.** Non-402/429 gateway errors become "AI gateway error: {status}" with no admin-facing context (this is the 403 credit exhaustion we saw last turn).
- **`intake_surveys.status` never advances.** Even after successful generation, the survey stays "submitted" — no signal in `AdminIntakeList` that a plan exists.
- **Duplicate created_by on regenerate.** If a different admin regenerates, `created_by` on the newest row silently changes with no audit trail of prior versions.

## Root Cause

The generation pipeline is a fire-and-forget insert with a publish gate the coach must remember to flip manually. There is no lifecycle model tying `intake_survey → plan → published state`. As soon as a coach forgets to publish (or clicks "Generate" twice), the client hits either "not available" or a stale draft, and the admin UI has no cue that anything is wrong.

## Impact

- **Clients:** blocked at `/portal/plan/:id` with a dead-end message; the fix depends on a manual admin action the UI doesn't prompt.
- **Coaches:** accumulate orphan drafts, cannot tell which plan URL to share, risk sharing an old published version after regenerating.
- **Data integrity:** `custom_plans` grows unbounded per intake; historical comparisons are lossy because prior versions aren't marked as "archived".
- **Debuggability:** AI-gateway failures (credits, tool-call parse) all collapse to a generic 500, matching the 403 loop from the previous turn.

## Proposed Fixes (pick one)

### Approach A — Minimal, backend-only (recommended first pass)
1. In `generate-plan`, replace raw `INSERT` with a "supersede" pattern:
   - If a `draft` exists for this `intake_survey_id`, `UPDATE` it in place (refresh `plan_data`, bump `updated_at`).
   - If only `published` rows exist, mark them `status = 'archived'` and INSERT a new draft.
2. Add a DB check/unique partial index: at most one `draft` per `intake_survey_id`.
3. Update `AdminIntakeCoachView` to show plan status (Draft / Published / None) and a "Publish now" button inline, so the coach never leaves the intake view without an explicit publish decision.
4. Improve `PortalPlanView` messaging: distinguish "no plan yet" vs "plan pending publish" vs "not found", with a mailto/CTA fallback.
5. Add defensive rendering in `PlanDocument` and `PlanPDF` (guard each `sections.*` access; render a skeleton for missing sections).
6. Add richer error mapping in `generate-plan` (403 → "AI credits exhausted", tool-call missing → "AI returned no plan, retry").

Risks: `archived` is a new status value — must be added to any Badge/enum handling in `AdminPlanView`. No schema migration required beyond the partial index.

### Approach B — Auto-publish on generation
Same as A, but new plans land as `status: "published"` and archive the prior published row atomically. Removes the "draft trap" entirely but eliminates the coach's chance to review before clients see it. Recommended only if Jessie is comfortable skipping the review gate.

### Approach C — Full versioning model
Add `version` int, `is_current` boolean; keep every generation; `PortalPlanView` always resolves the current published version by `intake_survey_id`, not by `plan_id`. Highest data integrity, largest change (portal URL scheme moves from `/portal/plan/:planId` to `/portal/plan/:intakeId` or similar).

## Recommendation

Start with **Approach A**. It fixes both observed failure modes (duplicates + draft trap), keeps the coach's review gate, requires no destructive schema changes, and lays the groundwork for Approach C later if versioning history becomes valuable. Approach B is a one-line follow-up if the review gate turns out to be friction.

## Files Involved (no edits yet)

- `supabase/functions/generate-plan/index.ts` — supersede logic, error mapping
- `src/pages/AdminIntakeCoachView.tsx` — status badge + inline publish
- `src/pages/AdminPlanView.tsx` — handle `archived` status
- `src/pages/PortalPlanView.tsx` — differentiated messaging, `.maybeSingle()`
- `src/components/plan/PlanDocument.tsx`, `PlanPDF.tsx` — defensive rendering
- New migration — partial unique index on `custom_plans (intake_survey_id) WHERE status = 'draft'`
