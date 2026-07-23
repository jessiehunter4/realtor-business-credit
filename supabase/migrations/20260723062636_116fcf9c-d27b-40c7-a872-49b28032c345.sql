
ALTER TABLE public.intake_surveys
  ADD COLUMN IF NOT EXISTS first_name TEXT,
  ADD COLUMN IF NOT EXISTS last_name TEXT,
  ADD COLUMN IF NOT EXISTS full_name TEXT;

-- Backfill from existing contact_name
UPDATE public.intake_surveys
SET
  first_name = COALESCE(first_name, NULLIF(split_part(contact_name, ' ', 1), '')),
  last_name  = COALESCE(last_name, NULLIF(NULLIF(regexp_replace(contact_name, '^\S+\s*', ''), ''), contact_name)),
  full_name  = COALESCE(full_name, contact_name)
WHERE contact_name IS NOT NULL;
