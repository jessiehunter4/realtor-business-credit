ALTER TABLE public.intake_surveys
ADD COLUMN IF NOT EXISTS credit_utilization_percent integer
CHECK (credit_utilization_percent IS NULL OR (credit_utilization_percent >= 0 AND credit_utilization_percent <= 100));