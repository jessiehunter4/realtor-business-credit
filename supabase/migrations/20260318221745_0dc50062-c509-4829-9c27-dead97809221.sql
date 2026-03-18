
CREATE TABLE public.funnel_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ghl_contact_id text,
  lead_id uuid,
  event_type text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.funnel_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view funnel events"
  ON public.funnel_events
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Edge functions can insert funnel events"
  ON public.funnel_events
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE INDEX idx_funnel_events_type ON public.funnel_events (event_type);
CREATE INDEX idx_funnel_events_created ON public.funnel_events (created_at);
CREATE INDEX idx_funnel_events_contact ON public.funnel_events (ghl_contact_id);
