ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS email_consent boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS email_consent_at timestamptz,
  ADD COLUMN IF NOT EXISTS sms_consent boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS sms_consent_at timestamptz,
  ADD COLUMN IF NOT EXISTS sms_consent_source text,
  ADD COLUMN IF NOT EXISTS sms_consent_text text,
  ADD COLUMN IF NOT EXISTS sms_opted_out_at timestamptz,
  ADD COLUMN IF NOT EXISTS sms_eligible boolean NOT NULL DEFAULT false;

ALTER TABLE public.agents
  ADD COLUMN IF NOT EXISTS sms_eligible boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.agents.sms_eligible IS 'MLS-imported agents are never SMS eligible; only express written consent flips this true.';

DROP POLICY IF EXISTS "Users can view their own lead" ON public.leads;
CREATE POLICY "Users can view their own lead"
ON public.leads FOR SELECT TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own lead consent" ON public.leads;
CREATE POLICY "Users can update their own lead consent"
ON public.leads FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

GRANT SELECT, UPDATE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;