ALTER TABLE public.intake_surveys
  ADD COLUMN IF NOT EXISTS business_street TEXT,
  ADD COLUMN IF NOT EXISTS business_zip TEXT,
  ADD COLUMN IF NOT EXISTS business_phone TEXT;