-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for role-based access control
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policy for user_roles: admins can view all, users can view their own
CREATE POLICY "Admins can view all user roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can insert user roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete user roles"
  ON public.user_roles FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create leads table (landing page submissions)
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  agent_type TEXT NOT NULL,
  state TEXT NOT NULL,
  wants_fundability_scan BOOLEAN NOT NULL DEFAULT false,
  source TEXT NOT NULL DEFAULT 'LandingPageRealtorBusinessCredit',
  ghl_synced_at TIMESTAMPTZ,
  ghl_contact_id TEXT,
  ghl_sync_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage leads"
  ON public.leads FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_leads_email ON public.leads(email);
CREATE INDEX idx_leads_created_at ON public.leads(created_at DESC);

-- Create agents table (from MLS imports)
CREATE TABLE public.agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT,
  last_name TEXT,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  license_number TEXT,
  office_name TEXT,
  office_phone TEXT,
  state TEXT,
  type TEXT, -- listing, buyer, both, unknown
  source TEXT NOT NULL, -- mls_csv, landing_optin, etc
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_agent_email UNIQUE(email)
);

ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage agents"
  ON public.agents FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_agents_email ON public.agents(email);
CREATE INDEX idx_agents_phone ON public.agents(phone);
CREATE INDEX idx_agents_state ON public.agents(state);

-- Create import_batches table (CSV upload tracking)
CREATE TABLE public.import_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, complete, error
  rows_processed INTEGER DEFAULT 0,
  agents_created INTEGER DEFAULT 0,
  agents_updated INTEGER DEFAULT 0,
  transactions_created INTEGER DEFAULT 0,
  error_message TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.import_batches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage import batches"
  ON public.import_batches FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_import_batches_uploaded_at ON public.import_batches(uploaded_at DESC);

-- Create transactions table (MLS closing data)
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mls_id TEXT,
  close_date DATE NOT NULL,
  property_address TEXT,
  property_city TEXT,
  property_state TEXT,
  property_zip TEXT,
  property_type TEXT,
  price DECIMAL(12,2),
  listing_agent_id UUID REFERENCES public.agents(id),
  buyer_agent_id UUID REFERENCES public.agents(id),
  import_batch_id UUID REFERENCES public.import_batches(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage transactions"
  ON public.transactions FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_transactions_close_date ON public.transactions(close_date DESC);
CREATE INDEX idx_transactions_listing_agent ON public.transactions(listing_agent_id);
CREATE INDEX idx_transactions_buyer_agent ON public.transactions(buyer_agent_id);

-- Create contact_syncs table (GoHighLevel sync tracking)
CREATE TABLE public.contact_syncs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES public.agents(id),
  lead_id UUID REFERENCES public.leads(id),
  first_synced_at TIMESTAMPTZ,
  last_synced_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, success, failed
  last_error_message TEXT,
  ghl_contact_id TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,
  next_retry_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT check_agent_or_lead CHECK (
    (agent_id IS NOT NULL AND lead_id IS NULL) OR
    (agent_id IS NULL AND lead_id IS NOT NULL)
  )
);

ALTER TABLE public.contact_syncs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage contact syncs"
  ON public.contact_syncs FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_contact_syncs_status ON public.contact_syncs(status);
CREATE INDEX idx_contact_syncs_retry ON public.contact_syncs(next_retry_at) WHERE status = 'failed';

-- Create opt_outs table (TCPA compliance)
CREATE TABLE public.opt_outs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES public.agents(id),
  lead_id UUID REFERENCES public.leads(id),
  email TEXT,
  phone TEXT,
  channel TEXT NOT NULL, -- sms, email, both
  reason TEXT,
  opted_out_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.opt_outs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage opt outs"
  ON public.opt_outs FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_opt_outs_email ON public.opt_outs(email);
CREATE INDEX idx_opt_outs_phone ON public.opt_outs(phone);

-- Create app_settings table (admin configuration)
CREATE TABLE public.app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage app settings"
  ON public.app_settings FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to tables with updated_at
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON public.agents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_import_batches_updated_at BEFORE UPDATE ON public.import_batches
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contact_syncs_updated_at BEFORE UPDATE ON public.contact_syncs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_app_settings_updated_at BEFORE UPDATE ON public.app_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();