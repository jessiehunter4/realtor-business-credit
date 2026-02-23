
-- Intake surveys table
CREATE TABLE public.intake_surveys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES public.agents(id),
  lead_id UUID REFERENCES public.leads(id),
  contact_email TEXT,
  contact_name TEXT,
  access_token TEXT NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  status TEXT NOT NULL DEFAULT 'pending',
  filled_by TEXT NOT NULL DEFAULT 'agent',
  
  -- Section A: Profile & Production
  brokerage_name TEXT,
  city TEXT,
  state TEXT,
  license_type TEXT,
  years_in_real_estate TEXT,
  gci_last_12_months TEXT,
  sides_closed_last_12_months TEXT,
  
  -- Section B: Goals
  top_financial_goal TEXT,
  top_financial_need TEXT,
  desired_monthly_credit_capacity TEXT,
  
  -- Section C: Business Structure
  has_business_entity TEXT,
  entity_type TEXT,
  has_business_address TEXT,
  address_type TEXT,
  has_business_phone BOOLEAN,
  has_business_email BOOLEAN,
  has_business_website BOOLEAN,
  has_business_bank_account TEXT,
  uses_accounting_software TEXT,
  accounting_software_name TEXT,
  
  -- Section D: Business Credit & Funding
  business_credit_cards TEXT,
  vendor_tradelines TEXT,
  credit_reporting_bureaus TEXT[],
  funding_gap_methods TEXT[],
  desired_funding_types TEXT[],
  personal_guarantee_comfort TEXT,
  personal_credit_score_range TEXT,
  
  -- Section E: Program Fit
  preferred_support_format TEXT,
  interest_in_cohort TEXT,
  preferred_cohort_days TEXT,
  investment_readiness TEXT,
  additional_notes TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  submitted_at TIMESTAMPTZ,
  
  CONSTRAINT intake_has_contact CHECK (agent_id IS NOT NULL OR lead_id IS NOT NULL OR contact_email IS NOT NULL)
);

-- Coach notes per survey
CREATE TABLE public.intake_coach_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  intake_survey_id UUID NOT NULL REFERENCES public.intake_surveys(id) ON DELETE CASCADE,
  section TEXT NOT NULL,
  note TEXT NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Custom plans
CREATE TABLE public.custom_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  intake_survey_id UUID NOT NULL REFERENCES public.intake_surveys(id),
  agent_id UUID REFERENCES public.agents(id),
  lead_id UUID REFERENCES public.leads(id),
  contact_name TEXT,
  contact_email TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  plan_html TEXT,
  plan_data JSONB,
  published_at TIMESTAMPTZ,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.intake_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intake_coach_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_plans ENABLE ROW LEVEL SECURITY;

-- Intake surveys: admins full access
CREATE POLICY "Admins can manage intake surveys"
  ON public.intake_surveys FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Coach notes: admins only
CREATE POLICY "Admins can manage coach notes"
  ON public.intake_coach_notes FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Custom plans: admins full access
CREATE POLICY "Admins can manage custom plans"
  ON public.custom_plans FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Triggers for updated_at
CREATE TRIGGER update_intake_surveys_updated_at
  BEFORE UPDATE ON public.intake_surveys
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_intake_coach_notes_updated_at
  BEFORE UPDATE ON public.intake_coach_notes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_custom_plans_updated_at
  BEFORE UPDATE ON public.custom_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
