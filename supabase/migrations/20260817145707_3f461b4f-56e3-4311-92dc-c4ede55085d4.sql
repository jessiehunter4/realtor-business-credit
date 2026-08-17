CREATE TABLE public.guide_progress (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  guide_slug TEXT NOT NULL,
  last_section_id TEXT,
  completed TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, guide_slug)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.guide_progress TO authenticated;
GRANT ALL ON public.guide_progress TO service_role;

ALTER TABLE public.guide_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own guide progress"
  ON public.guide_progress FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own guide progress"
  ON public.guide_progress FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own guide progress"
  ON public.guide_progress FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own guide progress"
  ON public.guide_progress FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER update_guide_progress_updated_at
  BEFORE UPDATE ON public.guide_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();