-- 1. Clean up any user holding both roles: admin wins
DELETE FROM public.user_roles ur
WHERE ur.role = 'user'
  AND EXISTS (
    SELECT 1 FROM public.user_roles a
    WHERE a.user_id = ur.user_id AND a.role = 'admin'
  );

-- 2. Exactly one primary role row per user
CREATE UNIQUE INDEX IF NOT EXISTS user_roles_one_role_per_user
  ON public.user_roles (user_id);

-- 3. Trigger becomes the single authoritative role writer
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _admin_exists boolean;
  _role public.app_role := 'user';
BEGIN
  INSERT INTO public.profiles (
    user_id, first_name, last_name, email, phone, ghl_contact_id,
    terms_accepted_at, terms_consent_text,
    sms_consent, sms_consent_at, sms_consent_text, sms_consent_source
  )
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'ghl_contact_id',
    CASE WHEN (NEW.raw_user_meta_data->>'terms_accepted') = 'true' THEN now() ELSE NULL END,
    NEW.raw_user_meta_data->>'terms_consent_text',
    COALESCE((NEW.raw_user_meta_data->>'sms_consent')::boolean, false),
    CASE WHEN (NEW.raw_user_meta_data->>'sms_consent') = 'true' THEN now() ELSE NULL END,
    NEW.raw_user_meta_data->>'sms_consent_text',
    NEW.raw_user_meta_data->>'sms_consent_source'
  )
  ON CONFLICT (user_id) DO NOTHING;

  -- Admin self-registration is only honored for the very first admin
  -- (bootstrap). Everyone else is a visitor; elevation requires an
  -- existing admin.
  IF (NEW.raw_user_meta_data->>'requested_role') = 'admin' THEN
    SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin')
      INTO _admin_exists;
    IF NOT _admin_exists THEN
      _role := 'admin';
    END IF;
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, _role)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$function$;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- 4. Admin-only promotion path
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only administrators can grant admin access';
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, 'admin')
  ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
END;
$function$;

REVOKE ALL ON FUNCTION public.promote_user_to_admin(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.promote_user_to_admin(uuid) TO authenticated;