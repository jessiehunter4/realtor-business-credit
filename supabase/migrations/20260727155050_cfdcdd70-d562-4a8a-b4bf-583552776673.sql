
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS onboarding_completed_at timestamptz,
  ADD COLUMN IF NOT EXISTS welcome_video_viewed_at timestamptz,
  ADD COLUMN IF NOT EXISTS last_login_at timestamptz;

CREATE POLICY "Users can view own plan task progress"
  ON public.plan_task_progress
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.custom_plans cp
    WHERE cp.id = plan_task_progress.plan_id
      AND cp.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own plan task progress"
  ON public.plan_task_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.custom_plans cp
    WHERE cp.id = plan_task_progress.plan_id
      AND cp.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own plan task progress"
  ON public.plan_task_progress
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.custom_plans cp
    WHERE cp.id = plan_task_progress.plan_id
      AND cp.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.custom_plans cp
    WHERE cp.id = plan_task_progress.plan_id
      AND cp.user_id = auth.uid()
  ));
