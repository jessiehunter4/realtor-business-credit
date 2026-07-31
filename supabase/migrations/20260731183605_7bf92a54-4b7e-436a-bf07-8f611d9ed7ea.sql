-- 1) Move existing public marketing videos into a public/ prefix
UPDATE storage.objects
SET name = 'public/' || name
WHERE bucket_id = 'site-videos' AND name NOT LIKE 'public/%';

-- 2) Replace blanket read policy with prefix-scoped public read + admin full read
DROP POLICY IF EXISTS "site-videos public read" ON storage.objects;

CREATE POLICY "site-videos public marketing read"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'site-videos' AND name LIKE 'public/%');

CREATE POLICY "site-videos admin read"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'site-videos' AND public.has_role(auth.uid(), 'admin'));

-- 3) Revoke API-exposed EXECUTE on internal SECURITY DEFINER functions
REVOKE ALL ON FUNCTION public.sync_plan_task_status() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- 4) has_role: restrict to the caller's own roles (RLS policies always pass auth.uid())
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND (auth.uid() IS NULL OR auth.uid() = _user_id)
  )
$function$;

REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;