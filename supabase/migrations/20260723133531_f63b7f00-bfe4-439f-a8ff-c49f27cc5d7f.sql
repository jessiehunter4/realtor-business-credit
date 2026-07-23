ALTER TABLE public.intake_surveys 
  ADD COLUMN IF NOT EXISTS preferred_cohort_time_1 TEXT,
  ADD COLUMN IF NOT EXISTS preferred_cohort_time_2 TEXT;