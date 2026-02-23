
-- Allow anonymous users to read and update their own intake survey via access_token
-- This is handled via the edge function (submit-intake), so we don't need anon RLS.
-- But we need a policy for reading by token for the public intake page.
-- We'll use an edge function with service role for writes, so no additional RLS needed.

-- Add unique index on access_token for fast lookups
CREATE UNIQUE INDEX idx_intake_surveys_access_token ON public.intake_surveys(access_token);

-- Add index on intake_survey_id for coach notes
CREATE INDEX idx_intake_coach_notes_survey_id ON public.intake_coach_notes(intake_survey_id);

-- Add index on intake_survey_id for custom plans
CREATE INDEX idx_custom_plans_intake_survey_id ON public.custom_plans(intake_survey_id);
