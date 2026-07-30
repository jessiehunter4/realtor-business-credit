-- custom_plans: remove blanket public read of published plans
DROP POLICY IF EXISTS "Anyone can view published plans" ON public.custom_plans;
DROP POLICY IF EXISTS "Admins can manage custom plans" ON public.custom_plans;
CREATE POLICY "Admins can manage custom plans" ON public.custom_plans
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- plan_task_progress: remove public policies tied only to published status
DROP POLICY IF EXISTS "Anyone can view task progress for published plans" ON public.plan_task_progress;
DROP POLICY IF EXISTS "Anyone can insert task progress for published plans" ON public.plan_task_progress;
DROP POLICY IF EXISTS "Anyone can update task progress for published plans" ON public.plan_task_progress;
DROP POLICY IF EXISTS "Admins can manage task progress" ON public.plan_task_progress;
CREATE POLICY "Admins can manage task progress" ON public.plan_task_progress
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- intake_surveys: admin policy scoped to authenticated only
DROP POLICY IF EXISTS "Admins can manage intake surveys" ON public.intake_surveys;
CREATE POLICY "Admins can manage intake surveys" ON public.intake_surveys
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- programs: scope public read to active rows
DROP POLICY IF EXISTS "Anyone can read active programs" ON public.programs;
CREATE POLICY "Anyone can read active programs" ON public.programs
  FOR SELECT USING (active = true);

-- funnel_events: drop always-true anon insert policy (writes go through service role)
DROP POLICY IF EXISTS "Edge functions can insert funnel events" ON public.funnel_events;

-- agents: explicit deny for anonymous readers
CREATE POLICY "Deny public access to agents" ON public.agents
  FOR SELECT TO anon USING (false);

-- Remove Data API privileges for signed-out visitors on sensitive tables
REVOKE ALL ON public.agents FROM anon;
REVOKE ALL ON public.leads FROM anon;
REVOKE ALL ON public.transactions FROM anon;
REVOKE ALL ON public.import_batches FROM anon;
REVOKE ALL ON public.contact_syncs FROM anon;
REVOKE ALL ON public.opt_outs FROM anon;
REVOKE ALL ON public.intake_surveys FROM anon;
REVOKE ALL ON public.custom_plans FROM anon;
REVOKE ALL ON public.plan_task_progress FROM anon;
REVOKE ALL ON public.funnel_events FROM anon;
REVOKE ALL ON public.profiles FROM anon;
REVOKE ALL ON public.app_settings FROM anon;

-- SECURITY DEFINER functions should not be callable from the Data API
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;