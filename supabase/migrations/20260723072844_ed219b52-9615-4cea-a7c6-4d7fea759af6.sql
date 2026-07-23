
-- 1. Programs catalog
CREATE TABLE public.programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  tagline text,
  price_display text,
  cadence text,
  cta_label text NOT NULL DEFAULT 'Learn more',
  cta_href text,
  pricing_anchor text,
  fit_rules jsonb NOT NULL DEFAULT '{}'::jsonb,
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.programs TO anon, authenticated;
GRANT ALL ON public.programs TO service_role;

ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active programs"
  ON public.programs FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage programs"
  ON public.programs FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER programs_set_updated_at
  BEFORE UPDATE ON public.programs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed the four current programs. fit_rules describes weighted signals
-- consumed by the shared recommender (see supabase/functions/_shared/recommend-program.ts).
INSERT INTO public.programs (slug, name, tagline, price_display, cadence, cta_label, cta_href, pricing_anchor, sort_order, fit_rules) VALUES
  ('free-discovery',
   'Free Guide + 1:1 Discovery',
   'Start with the guide and a no-cost strategy call.',
   'Free',
   'no cost',
   'Book your free session',
   '/one-on-one',
   'free-discovery',
   10,
   '{
     "support_format": ["self-paced"],
     "readiness": ["just_exploring", "need_more_clarity"],
     "early_stage_bonus": true,
     "base_weight": 1
   }'::jsonb),
  ('self-paced',
   'Self-Paced Blueprint',
   'The plan and the tools — run with it on your own.',
   '$497',
   'one-time',
   'Get the Blueprint',
   '/pricing?highlight=self-paced',
   'self-paced',
   20,
   '{
     "support_format": ["self-paced"],
     "readiness": ["ready_now", "within_30_days"],
     "cohort_interest": ["not_now"],
     "base_weight": 1
   }'::jsonb),
  ('cohort',
   'Realtor Credit Cohort',
   'Small-group 90-day program with weekly coaching.',
   '$1,997',
   '90 days',
   'Enroll in Cohort',
   '/pricing?highlight=cohort',
   'cohort',
   30,
   '{
     "support_format": ["cohort"],
     "readiness": ["ready_now", "within_30_days"],
     "cohort_interest": ["yes", "maybe"],
     "reduce_pg_bonus": true,
     "base_weight": 1
   }'::jsonb),
  ('one-on-one',
   '1:1 Private Coaching',
   'Private, high-touch coaching for high-producing agents & brokers.',
   '$4,997',
   'per quarter',
   'Start 1:1 Coaching',
   '/pricing?highlight=one-on-one',
   'one-on-one',
   40,
   '{
     "support_format": ["1_on_1", "one_on_one"],
     "readiness": ["ready_now"],
     "high_gci_bonus": true,
     "broker_bonus": true,
     "reduce_pg_bonus": true,
     "large_target_bonus": true,
     "base_weight": 1
   }'::jsonb);

-- 2. Extend custom_plans with recommendation fields
ALTER TABLE public.custom_plans
  ADD COLUMN recommended_program_slug text,
  ADD COLUMN recommendation_reasoning jsonb,
  ADD COLUMN recommendation_score jsonb,
  ADD COLUMN recommendation_overridden_by uuid,
  ADD COLUMN recommendation_overridden_at timestamptz;
