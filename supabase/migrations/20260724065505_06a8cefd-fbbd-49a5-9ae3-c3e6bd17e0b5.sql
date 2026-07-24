ALTER TABLE public.intake_surveys
  ADD COLUMN IF NOT EXISTS primary_goals text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS financial_pains text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS draft_email text;

-- Backfill primary_goals from legacy primary_goal + additional_goals
UPDATE public.intake_surveys
SET primary_goals = (
  SELECT COALESCE(array_agg(DISTINCT g), '{}'::text[])
  FROM unnest(
    array_remove(
      ARRAY[primary_goal] || COALESCE(additional_goals, '{}'::text[]),
      NULL
    )
  ) AS g
  WHERE g IS NOT NULL AND g <> ''
)
WHERE (primary_goals IS NULL OR primary_goals = '{}'::text[])
  AND (primary_goal IS NOT NULL OR (additional_goals IS NOT NULL AND array_length(additional_goals, 1) > 0));

-- Backfill financial_pains from legacy top_financial_pain
UPDATE public.intake_surveys
SET financial_pains = ARRAY[top_financial_pain]
WHERE (financial_pains IS NULL OR financial_pains = '{}'::text[])
  AND top_financial_pain IS NOT NULL
  AND top_financial_pain <> '';

-- Drop obsolete columns
ALTER TABLE public.intake_surveys
  DROP COLUMN IF EXISTS primary_goal,
  DROP COLUMN IF EXISTS additional_goals,
  DROP COLUMN IF EXISTS top_financial_goal,
  DROP COLUMN IF EXISTS top_financial_pain,
  DROP COLUMN IF EXISTS top_financial_need,
  DROP COLUMN IF EXISTS goal_time_horizon,
  DROP COLUMN IF EXISTS desired_monthly_credit_capacity,
  DROP COLUMN IF EXISTS target_funding_amount;

-- Unique in-progress drafts per email
CREATE UNIQUE INDEX IF NOT EXISTS intake_surveys_draft_email_idx
  ON public.intake_surveys (lower(draft_email))
  WHERE status = 'in_progress' AND draft_email IS NOT NULL;
