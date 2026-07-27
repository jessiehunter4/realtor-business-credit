// Shared admin-guard helper for edge functions.
// Returns null when the caller is an admin (or the platform service role),
// otherwise a Response with the appropriate status.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

export async function requireAdmin(
  req: Request,
): Promise<{ userId: string } | Response> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return json({ error: 'Unauthorized' }, 401);
  }
  const token = authHeader.replace('Bearer ', '');

  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  // Allow service-role callers (e.g. pg_cron scheduled jobs) to bypass user check.
  if (serviceRoleKey && token === serviceRoleKey) {
    return { userId: 'service_role' };
  }

  const admin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    serviceRoleKey,
  );
  const { data: userRes, error: userErr } = await admin.auth.getUser(token);
  if (userErr || !userRes?.user) return json({ error: 'Unauthorized' }, 401);

  const { data: roleRow } = await admin
    .from('user_roles')
    .select('role')
    .eq('user_id', userRes.user.id)
    .eq('role', 'admin')
    .maybeSingle();

  if (!roleRow) return json({ error: 'Forbidden' }, 403);
  return { userId: userRes.user.id };
}