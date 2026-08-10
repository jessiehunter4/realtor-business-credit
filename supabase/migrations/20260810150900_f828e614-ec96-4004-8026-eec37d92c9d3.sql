CREATE TABLE public.checklist_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text,
  page_path text,
  ghl_contact_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

GRANT SELECT, INSERT, UPDATE ON public.checklist_subscribers TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.checklist_subscribers TO anon;
GRANT ALL ON public.checklist_subscribers TO service_role;

ALTER TABLE public.checklist_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous checklist subscribers"
  ON public.checklist_subscribers
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated checklist subscribers"
  ON public.checklist_subscribers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);