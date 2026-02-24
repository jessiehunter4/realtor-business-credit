-- Allow anyone to read published plans (for the public portal view)
CREATE POLICY "Anyone can view published plans"
ON public.custom_plans
FOR SELECT
USING (status = 'published');