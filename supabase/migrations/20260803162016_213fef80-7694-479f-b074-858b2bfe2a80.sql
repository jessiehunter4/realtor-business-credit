ALTER TABLE public.intake_surveys
  ADD COLUMN IF NOT EXISTS primary_goals_other text,
  ADD COLUMN IF NOT EXISTS financial_pains_other text;