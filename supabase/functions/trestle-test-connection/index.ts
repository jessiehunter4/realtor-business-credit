import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { requireAdmin } from '../_shared/requireAdmin.ts';
import { DEFAULT_CLIENT_CONFIG, testConnection } from '../_shared/trestle/client.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const guard = await requireAdmin(req);
  if (guard instanceof Response) return guard;

  const db = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

  const { data: settings } = await db.from('mls_settings').select('*').maybeSingle();
  const cfg = {
    ...DEFAULT_CLIENT_CONFIG,
    pageSize: settings?.page_size ?? DEFAULT_CLIENT_CONFIG.pageSize,
    requestTimeoutMs: settings?.request_timeout_ms ?? DEFAULT_CLIENT_CONFIG.requestTimeoutMs,
    retryAttempts: settings?.retry_attempts ?? DEFAULT_CLIENT_CONFIG.retryAttempts,
    retryInitialDelayMs: settings?.retry_initial_delay_ms ?? DEFAULT_CLIENT_CONFIG.retryInitialDelayMs,
    retryMaxDelayMs: settings?.retry_max_delay_ms ?? DEFAULT_CLIENT_CONFIG.retryMaxDelayMs,
  };

  const result = await testConnection(cfg);
  return new Response(JSON.stringify(result), {
    status: result.ok ? 200 : 502,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
