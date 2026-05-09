
CREATE TABLE public.plan_task_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL,
  task_key text NOT NULL,
  task_label text,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (plan_id, task_key)
);

CREATE INDEX idx_plan_task_progress_plan ON public.plan_task_progress(plan_id);

ALTER TABLE public.plan_task_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view task progress for published plans"
ON public.plan_task_progress FOR SELECT
USING (EXISTS (SELECT 1 FROM public.custom_plans cp WHERE cp.id = plan_id AND cp.status = 'published'));

CREATE POLICY "Anyone can insert task progress for published plans"
ON public.plan_task_progress FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM public.custom_plans cp WHERE cp.id = plan_id AND cp.status = 'published'));

CREATE POLICY "Anyone can update task progress for published plans"
ON public.plan_task_progress FOR UPDATE
USING (EXISTS (SELECT 1 FROM public.custom_plans cp WHERE cp.id = plan_id AND cp.status = 'published'))
WITH CHECK (EXISTS (SELECT 1 FROM public.custom_plans cp WHERE cp.id = plan_id AND cp.status = 'published'));

CREATE POLICY "Admins can manage task progress"
ON public.plan_task_progress FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_plan_task_progress_updated_at
BEFORE UPDATE ON public.plan_task_progress
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
