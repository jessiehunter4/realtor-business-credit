## Goal
Replace the free-text "Preferred days/times for cohort" field with two dropdowns: **1st choice** and **2nd choice**, each picking from a fixed list of cohort time slots.

## Time slot options
- Monday 7:00 AM PT
- Monday 5:00 PM PT
- Wednesday 7:00 AM PT
- Wednesday 5:00 PM PT
- Friday 7:00 AM PT
- Friday 5:00 PM PT

## Changes

### Database (migration)
Add two columns to `intake_surveys`:
- `preferred_cohort_time_1` TEXT — 1st choice
- `preferred_cohort_time_2` TEXT — 2nd choice

Keep the legacy `preferred_cohort_days` column and mirror a combined string (e.g. `"Mon 7am PT; Wed 5pm PT"`) into it on save so existing plans/exports don't break.

### Edge function `intake-survey`
Whitelist `preferred_cohort_time_1` and `preferred_cohort_time_2` in the accepted fields list.

### Intake Survey page (`IntakeSurveyPage.tsx`)
Replace the single Input at line 828–829 with two Selects labeled **1st choice** and **2nd choice**, both populated from the fixed slot list. On change, update the new columns and mirror a combined value into `preferred_cohort_days`.

### Admin Coach View (`AdminIntakeCoachView.tsx`)
Replace the matching Input at line 785–786 with the same two Selects and add the new keys to `editableKeys`.

### Plan generation
No prompt change needed — cohort scheduling isn't referenced in the AI plan prompt today.

## Out of scope
- No changes to the plan document rendering.
- No changes to GHL sync tags.
