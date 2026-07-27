-- Add user_id link on leads
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Case-insensitive uniqueness on email to enforce dedupe at DB level.
-- First, dedupe any existing rows (keep the earliest by created_at).
WITH ranked AS (
  SELECT id,
         row_number() OVER (PARTITION BY lower(email) ORDER BY created_at ASC, id ASC) AS rn
  FROM public.leads
  WHERE email IS NOT NULL
)
DELETE FROM public.leads l
USING ranked r
WHERE l.id = r.id AND r.rn > 1;

CREATE UNIQUE INDEX IF NOT EXISTS leads_email_lower_unique_idx
  ON public.leads ((lower(email)));

-- Helpful index for lead -> intake resume lookups
CREATE INDEX IF NOT EXISTS intake_surveys_lead_id_idx
  ON public.intake_surveys (lead_id);

CREATE INDEX IF NOT EXISTS leads_user_id_idx
  ON public.leads (user_id);

-- Visitors can read their own lead row
DROP POLICY IF EXISTS "Visitors can view their own lead" ON public.leads;
CREATE POLICY "Visitors can view their own lead"
  ON public.leads
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());
