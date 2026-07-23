ALTER TABLE public.intake_surveys
  ADD COLUMN IF NOT EXISTS primary_goal TEXT,
  ADD COLUMN IF NOT EXISTS additional_goals TEXT[],
  ADD COLUMN IF NOT EXISTS top_financial_pain TEXT,
  ADD COLUMN IF NOT EXISTS goal_time_horizon TEXT,
  ADD COLUMN IF NOT EXISTS target_funding_amount TEXT,
  ADD COLUMN IF NOT EXISTS goals_notes TEXT;