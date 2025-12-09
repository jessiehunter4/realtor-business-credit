-- Add property detail fields to agents table for GHL sync
ALTER TABLE public.agents
ADD COLUMN IF NOT EXISTS property_address text,
ADD COLUMN IF NOT EXISTS property_city text,
ADD COLUMN IF NOT EXISTS property_state text,
ADD COLUMN IF NOT EXISTS property_zip text,
ADD COLUMN IF NOT EXISTS property_country text,
ADD COLUMN IF NOT EXISTS property_county text,
ADD COLUMN IF NOT EXISTS property_price numeric,
ADD COLUMN IF NOT EXISTS property_close_date date,
ADD COLUMN IF NOT EXISTS property_days_on_market integer,
ADD COLUMN IF NOT EXISTS property_street_number text,
ADD COLUMN IF NOT EXISTS property_street_dir_prefix text,
ADD COLUMN IF NOT EXISTS property_street_name text,
ADD COLUMN IF NOT EXISTS property_street_suffix text;