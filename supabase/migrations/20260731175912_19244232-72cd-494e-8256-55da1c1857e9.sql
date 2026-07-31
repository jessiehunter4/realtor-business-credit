ALTER TABLE public.plan_task_progress
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'not_started',
  ADD COLUMN IF NOT EXISTS priority integer,
  ADD COLUMN IF NOT EXISTS phase text,
  ADD COLUMN IF NOT EXISTS source text,
  ADD COLUMN IF NOT EXISTS snoozed_until timestamp with time zone;

-- Backfill status from the legacy boolean
UPDATE public.plan_task_progress
SET status = CASE WHEN completed THEN 'completed' ELSE 'not_started' END
WHERE status = 'not_started' AND completed = true;

CREATE OR REPLACE FUNCTION public.sync_plan_task_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status IS NULL OR NEW.status NOT IN ('not_started','in_progress','completed') THEN
    NEW.status := CASE WHEN NEW.completed THEN 'completed' ELSE 'not_started' END;
  END IF;

  IF TG_OP = 'UPDATE' AND NEW.status IS DISTINCT FROM OLD.status THEN
    -- status is authoritative when it changed
    NEW.completed := (NEW.status = 'completed');
  ELSIF TG_OP = 'UPDATE' AND NEW.completed IS DISTINCT FROM OLD.completed THEN
    -- legacy writers only set the boolean
    NEW.status := CASE WHEN NEW.completed THEN 'completed' ELSE 'not_started' END;
  ELSE
    NEW.completed := (NEW.status = 'completed');
  END IF;

  IF NEW.completed AND NEW.completed_at IS NULL THEN
    NEW.completed_at := now();
  ELSIF NOT NEW.completed THEN
    NEW.completed_at := NULL;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sync_plan_task_status_trg ON public.plan_task_progress;
CREATE TRIGGER sync_plan_task_status_trg
BEFORE INSERT OR UPDATE ON public.plan_task_progress
FOR EACH ROW EXECUTE FUNCTION public.sync_plan_task_status();

CREATE INDEX IF NOT EXISTS idx_plan_task_progress_status ON public.plan_task_progress (plan_id, status);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.plan_task_progress TO authenticated;
GRANT ALL ON public.plan_task_progress TO service_role;
REVOKE EXECUTE ON FUNCTION public.sync_plan_task_status() FROM anon, authenticated;