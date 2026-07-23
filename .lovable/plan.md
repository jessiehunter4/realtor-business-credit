# Restructure Intake Survey — Goals Section

Today, "Goals" (Step B) is three free-text fields: top financial goal, top financial need, and desired monthly credit capacity. Users typically stuff multiple goals into one paragraph, which is hard to analyze, personalize, or re-use for reporting. This plan replaces that free-text lump with a structured, checkbox/selector-driven set of fields — while keeping the old fields as an optional "anything else" fallback so nothing existing breaks.

## New Goals step layout

Step B becomes:

1. **Primary financial goal (single-select radio)** — one required top-priority.
   - Options: Cover overhead between closings · Grow marketing spend · Hire admin/ISA/team · Build reserves/emergency fund · Buy investment property · Fund brokerage transition/expansion · Reduce reliance on personal credit · Prepare for a slow season · Other
2. **Additional goals (multi-select checkboxes)** — same option list, minus whatever they picked as primary.
3. **Top financial pain right now (single-select radio)** — Cash flow gap between commissions · High personal credit card balances · No access to business credit · Inconsistent income planning · Debt payoff · Tax bill / quarterly estimates · Other
4. **Time horizon for the primary goal (radio)** — 0–3 months · 3–6 months · 6–12 months · 12–24 months
5. **Desired monthly business credit capacity (select)** — Under $5k · $5k–$10k · $10k–$25k · $25k–$50k · $50k–$100k · $100k+ · Not sure
6. **Target funding amount for primary goal (select)** — Under $10k · $10k–$25k · $25k–$50k · $50k–$100k · $100k–$250k · $250k+ · Not sure
7. **Anything else about your goals? (optional textarea)** — replaces the old free-text catch-all.

## Data model

Add columns to `public.intake_surveys` (all nullable, additive — no data loss):

- `primary_goal TEXT`
- `additional_goals TEXT[]`
- `top_financial_pain TEXT`
- `goal_time_horizon TEXT`
- `target_funding_amount TEXT`
- `goals_notes TEXT` (repurposes the "anything else" text)

Keep `top_financial_goal`, `top_financial_need`, `desired_monthly_credit_capacity` for backward compatibility. On submit we'll also mirror `primary_goal` → `top_financial_goal` and `top_financial_pain` → `top_financial_need` so old dashboards/exports keep working. `desired_monthly_credit_capacity` continues to hold the select value.

## Files to change

- `supabase/migrations/<new>.sql` — add the 6 columns above.
- `supabase/functions/intake-survey/index.ts` — whitelist the 6 new fields in `ALLOWED_FIELDS`.
- `supabase/functions/generate-plan/index.ts` — extend the prompt to send Primary Goal, Additional Goals (comma-joined), Top Pain, Time Horizon, Target Funding, Desired Capacity, and Notes as separate labeled lines so Gemini can personalize the plan on structured data.
- `src/integrations/supabase/types.ts` — regenerated automatically after migration.
- `src/pages/IntakeSurveyPage.tsx` — replace Step B UI with the structured inputs above; update `SurveyData` interface and Step B validation (require `primary_goal`).
- `src/pages/AdminIntakeCoachView.tsx` — replace the three textareas in the Goals card with read/edit widgets for the structured fields (radios, multi-select checkboxes, selects, notes textarea); add the fields to the save list.

## User flow preservation

- Step count stays the same; only Step B's fields change.
- Draft autosave, direct/token modes, and submit-lead call are untouched.
- Existing submitted surveys still render — the coach view falls back to the legacy free-text fields when structured fields are empty.

## Analytics / plan generation impact

- Plan prompt now receives discrete goal signals → the 90-day action plan and funding-opportunities sections become directly conditioned on `primary_goal`, `target_funding_amount`, and `goal_time_horizon`.
- Future dashboards can group by `primary_goal` and `top_financial_pain` without NLP.

## Out of scope

- Backfilling structured values from old free-text answers (left as manual coach cleanup).
- Changing any other survey step, portal UI, or PDF layout beyond what the plan prompt already renders.
