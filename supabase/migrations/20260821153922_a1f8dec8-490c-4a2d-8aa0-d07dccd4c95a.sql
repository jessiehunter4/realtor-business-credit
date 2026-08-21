-- ============ SETTINGS ============
CREATE TABLE public.mls_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  singleton boolean NOT NULL DEFAULT true,
  automatic_ingestion_enabled boolean NOT NULL DEFAULT false,
  import_new_enabled boolean NOT NULL DEFAULT false,
  update_existing_enabled boolean NOT NULL DEFAULT false,
  page_size integer NOT NULL DEFAULT 200,
  max_concurrency integer NOT NULL DEFAULT 1,
  request_timeout_ms integer NOT NULL DEFAULT 30000,
  retry_attempts integer NOT NULL DEFAULT 3,
  retry_initial_delay_ms integer NOT NULL DEFAULT 1000,
  retry_max_delay_ms integer NOT NULL DEFAULT 30000,
  circuit_breaker_threshold integer NOT NULL DEFAULT 5,
  circuit_breaker_recovery_seconds integer NOT NULL DEFAULT 900,
  timezone text NOT NULL DEFAULT 'America/Los_Angeles',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT mls_settings_singleton_unique UNIQUE (singleton)
);
GRANT SELECT ON public.mls_settings TO authenticated;
GRANT ALL ON public.mls_settings TO service_role;
ALTER TABLE public.mls_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read mls settings" ON public.mls_settings
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_mls_settings_updated_at BEFORE UPDATE ON public.mls_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
INSERT INTO public.mls_settings (singleton) VALUES (true);

-- ============ ZIP GROUPS ============
CREATE TABLE public.mls_zip_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  county text,
  state text NOT NULL DEFAULT 'CA',
  enabled boolean NOT NULL DEFAULT false,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.mls_zip_groups TO authenticated;
GRANT ALL ON public.mls_zip_groups TO service_role;
ALTER TABLE public.mls_zip_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read mls zip groups" ON public.mls_zip_groups
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_mls_zip_groups_updated_at BEFORE UPDATE ON public.mls_zip_groups
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.mls_zips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.mls_zip_groups(id) ON DELETE CASCADE,
  zip text NOT NULL CHECK (zip ~ '^[0-9]{5}$'),
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (group_id, zip)
);
GRANT SELECT ON public.mls_zips TO authenticated;
GRANT ALL ON public.mls_zips TO service_role;
ALTER TABLE public.mls_zips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read mls zips" ON public.mls_zips
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============ JOBS ============
CREATE TABLE public.mls_import_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  enabled boolean NOT NULL DEFAULT false,
  zip_group_id uuid REFERENCES public.mls_zip_groups(id) ON DELETE SET NULL,
  interval_hours integer NOT NULL DEFAULT 24 CHECK (interval_hours >= 1 AND interval_hours <= 168),
  import_new boolean NOT NULL DEFAULT true,
  update_existing boolean NOT NULL DEFAULT true,
  daily_new_limit integer NOT NULL DEFAULT 25 CHECK (daily_new_limit >= 0),
  min_price numeric,
  max_price numeric,
  max_days_on_market integer,
  overlap_minutes integer NOT NULL DEFAULT 15,
  watermark_committed timestamptz,
  last_run_at timestamptz,
  last_run_status text,
  next_sync_at timestamptz,
  lease_owner text,
  lease_expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.mls_import_jobs TO authenticated;
GRANT ALL ON public.mls_import_jobs TO service_role;
ALTER TABLE public.mls_import_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read mls jobs" ON public.mls_import_jobs
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_mls_import_jobs_updated_at BEFORE UPDATE ON public.mls_import_jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ STATUS POLICY ============
CREATE TABLE public.mls_status_policy (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  raw_status text NOT NULL UNIQUE,
  internal_status text NOT NULL,
  action text NOT NULL DEFAULT 'store_only' CHECK (action IN ('lead_sync','store_only','suppress')),
  needs_review boolean NOT NULL DEFAULT false,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.mls_status_policy TO authenticated;
GRANT ALL ON public.mls_status_policy TO service_role;
ALTER TABLE public.mls_status_policy ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read mls status policy" ON public.mls_status_policy
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_mls_status_policy_updated_at BEFORE UPDATE ON public.mls_status_policy
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.mls_status_policy (raw_status, internal_status, action) VALUES
  ('Closed','closed','lead_sync'),
  ('Leased','leased','lead_sync'),
  ('Active','active','store_only'),
  ('Active Under Contract','active_under_contract','store_only'),
  ('Pending','pending','store_only'),
  ('Coming Soon','coming_soon','store_only'),
  ('Hold','hold','store_only'),
  ('Withdrawn','withdrawn','store_only'),
  ('Canceled','canceled','store_only'),
  ('Cancelled','canceled','store_only'),
  ('Expired','expired','store_only'),
  ('Incomplete','incomplete','store_only'),
  ('Delete','deleted','suppress'),
  ('Deleted','deleted','suppress');

-- ============ STATUS HISTORY ============
CREATE TABLE public.mls_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid REFERENCES public.transactions(id) ON DELETE CASCADE,
  listing_key text,
  listing_id text,
  old_status text,
  new_status text NOT NULL,
  action_taken text,
  run_id uuid,
  changed_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX mls_status_history_listing_key_idx ON public.mls_status_history (listing_key);
GRANT SELECT ON public.mls_status_history TO authenticated;
GRANT ALL ON public.mls_status_history TO service_role;
ALTER TABLE public.mls_status_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read mls status history" ON public.mls_status_history
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============ RUNS ============
CREATE TABLE public.mls_import_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES public.mls_import_jobs(id) ON DELETE SET NULL,
  trigger text NOT NULL,
  mode text NOT NULL,
  status text NOT NULL DEFAULT 'queued',
  scheduled_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  elapsed_ms integer,
  zip_groups_used jsonb,
  filters_used jsonb,
  window_start timestamptz,
  window_end timestamptz,
  watermark_before timestamptz,
  watermark_after timestamptz,
  pages_expected integer,
  pages_received integer,
  records_reported integer NOT NULL DEFAULT 0,
  records_fetched integer NOT NULL DEFAULT 0,
  records_accepted integer NOT NULL DEFAULT 0,
  records_filtered integer NOT NULL DEFAULT 0,
  records_created integer NOT NULL DEFAULT 0,
  records_updated integer NOT NULL DEFAULT 0,
  records_unchanged integer NOT NULL DEFAULT 0,
  records_deferred integer NOT NULL DEFAULT 0,
  records_failed integer NOT NULL DEFAULT 0,
  api_request_count integer NOT NULL DEFAULT 0,
  rate_limit_responses integer NOT NULL DEFAULT 0,
  provider_wait_ms integer NOT NULL DEFAULT 0,
  error_message text,
  next_run_at timestamptz,
  triggered_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX mls_import_runs_created_idx ON public.mls_import_runs (created_at DESC);
GRANT SELECT ON public.mls_import_runs TO authenticated;
GRANT ALL ON public.mls_import_runs TO service_role;
ALTER TABLE public.mls_import_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read mls runs" ON public.mls_import_runs
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.mls_import_record_errors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid REFERENCES public.mls_import_runs(id) ON DELETE CASCADE,
  listing_key text,
  listing_id text,
  stage text,
  intended_action text,
  outcome text,
  reason text,
  error_category text,
  error_message text,
  retry_count integer NOT NULL DEFAULT 0,
  next_retry_at timestamptz,
  needs_admin_action boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX mls_import_record_errors_run_idx ON public.mls_import_record_errors (run_id);
GRANT SELECT ON public.mls_import_record_errors TO authenticated;
GRANT ALL ON public.mls_import_record_errors TO service_role;
ALTER TABLE public.mls_import_record_errors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read mls record errors" ON public.mls_import_record_errors
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============ AUDIT ============
CREATE TABLE public.mls_settings_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor uuid,
  entity text NOT NULL,
  entity_id uuid,
  field text,
  old_value jsonb,
  new_value jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.mls_settings_audit TO authenticated;
GRANT ALL ON public.mls_settings_audit TO service_role;
ALTER TABLE public.mls_settings_audit ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read mls settings audit" ON public.mls_settings_audit
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============ EXISTING TABLE ADDITIONS ============
ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS source_system text NOT NULL DEFAULT 'csv',
  ADD COLUMN IF NOT EXISTS listing_key text,
  ADD COLUMN IF NOT EXISTS listing_id text,
  ADD COLUMN IF NOT EXISTS standard_status text,
  ADD COLUMN IF NOT EXISTS mls_status_raw text,
  ADD COLUMN IF NOT EXISTS previous_status text,
  ADD COLUMN IF NOT EXISTS status_changed_at timestamptz,
  ADD COLUMN IF NOT EXISTS contract_status_change_date date,
  ADD COLUMN IF NOT EXISTS modification_timestamp timestamptz,
  ADD COLUMN IF NOT EXISTS import_run_id uuid;

ALTER TABLE public.transactions ALTER COLUMN close_date DROP NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS transactions_source_listing_key_uidx
  ON public.transactions (source_system, listing_key)
  WHERE listing_key IS NOT NULL;

CREATE INDEX IF NOT EXISTS transactions_listing_id_idx ON public.transactions (listing_id);

ALTER TABLE public.agents
  ADD COLUMN IF NOT EXISTS source_system text NOT NULL DEFAULT 'csv',
  ADD COLUMN IF NOT EXISTS trestle_list_agent_key text,
  ADD COLUMN IF NOT EXISTS last_mls_sync_at timestamptz;