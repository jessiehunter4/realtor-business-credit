UPDATE public.intake_surveys SET status = 'archived' WHERE id = '5d0e15fa-dd46-4830-bee7-6bbd5c606e4f';

CREATE UNIQUE INDEX IF NOT EXISTS intake_surveys_one_active_per_user
  ON public.intake_surveys (user_id)
  WHERE user_id IS NOT NULL AND status <> 'archived';

CREATE UNIQUE INDEX IF NOT EXISTS custom_plans_one_published_per_user
  ON public.custom_plans (user_id)
  WHERE user_id IS NOT NULL AND status = 'published';