CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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

  -- Every new account is explicitly a visitor. Elevation to admin happens
  -- only through a server-side, code-verified path.
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$function$;