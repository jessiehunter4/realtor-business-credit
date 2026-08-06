# Add Credit Utilization Question to Phase 4 of the Intake Survey

Add one new question to the "Business Credit & Funding" step (Phase 4) of the intake survey capturing the visitor's current credit utilization per credit card, stored as a single validated number. No branching or workflow logic yet.

## What the user sees

Placed in Phase 4, directly after "Approximate personal credit score range":

- Question: "What is your current credit utilization per credit card?"
- Helper text: "This is the percentage of your available credit currently being used. Example: If your credit limit is $10,000 and your balance is $2,500, your utilization is 25%."
- Two side-by-side inputs:
  - A dropdown with 0% through 100% in 5% increments
  - A number field for a custom value with a "%" suffix shown in the field
- Typing in the number field clears the dropdown selection; picking from the dropdown fills the number field. Only one value is ever stored.
- Required to generate the plan. Inline red message when empty or outside 0-100, plus the existing toast that jumps back to Phase 4.

## Technical notes

**Database (migration, runs first)**
- Add `credit_utilization_percent` (integer, nullable, `CHECK (value BETWEEN 0 AND 100)`) to `intake_surveys`. Existing rows stay null so nothing breaks. No RLS or grant changes needed — the column joins an existing table.

**Edge function** `supabase/functions/intake-survey/index.ts`
- Add `credit_utilization_percent` to `EDITABLE_SURVEY_FIELDS`, and coerce it to a number or null in `pickEditableSurveyFields` so autosave/draft/submit all persist it.

**Frontend** `src/pages/IntakeSurveyPage.tsx`
- Add `credit_utilization_percent?: number | null` to the `SurveyData` interface.
- Render the new block inside the `step === 3` card, using existing `Select` + `Input` primitives and current styling conventions.
- Local state tracks whether the dropdown or manual entry is the active source, so the two stay synchronized without double-storing.
- Extend `validateAllRequired()` with a `step: 3` rule requiring a number between 0 and 100.

**Read-side (display only)**
- Show the value in the admin coach view (`src/pages/AdminIntakeCoachView.tsx`) alongside the credit score range so coaches see it during sessions.

## Out of scope
- No EveryCatch workflow changes, no plan-generation or dashboard branching, no changes to other survey steps.
