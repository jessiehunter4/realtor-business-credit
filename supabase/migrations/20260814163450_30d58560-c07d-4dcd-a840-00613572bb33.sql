GRANT SELECT ON public.custom_plans TO authenticated;
GRANT UPDATE (plan_data) ON public.custom_plans TO authenticated;
GRANT ALL ON public.custom_plans TO service_role;

CREATE POLICY "Users can edit own plan content"
ON public.custom_plans FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);