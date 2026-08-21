// Scheduler tick. Claims due jobs atomically with a lease, runs them, and
// always recomputes next_sync_at afterwards (success, partial, failure or skip).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LEASE_MINUTES = 30;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  if (req.headers.get('x-internal-key') !== serviceKey) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const db = createClient(Deno.env.get('SUPABASE_URL') ?? '', serviceKey);
  const { data: settings } = await db.from('mls_settings').select('*').maybeSingle();

  // Master switch is flow control: when off, no scheduled work starts.
  if (!settings?.automatic_ingestion_enabled) {
    return new Response(JSON.stringify({ skipped: true, reason: 'automatic ingestion off' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const now = new Date();
  const { data: dueJobs } = await db
    .from('mls_import_jobs')
    .select('*')
    .eq('enabled', true)
    .or(`next_sync_at.is.null,next_sync_at.lte.${now.toISOString()}`);

  const results: any[] = [];

  for (const job of dueJobs ?? []) {
    // Atomic-ish claim: only take the job if nobody holds a live lease.
    const leaseOwner = crypto.randomUUID();
    const leaseExpires = new Date(now.getTime() + LEASE_MINUTES * 60_000).toISOString();

    const { data: claimed } = await db
      .from('mls_import_jobs')
      .update({ lease_owner: leaseOwner, lease_expires_at: leaseExpires })
      .eq('id', job.id)
      .or(`lease_owner.is.null,lease_expires_at.lt.${now.toISOString()}`)
      .select('id')
      .maybeSingle();

    if (!claimed) {
      results.push({ jobId: job.id, skipped: 'already running' });
      continue;
    }

    const modes: string[] = [];
    if (job.update_existing && settings.update_existing_enabled) modes.push('update');
    if (job.import_new && settings.import_new_enabled) modes.push('new');

    let lastStatus = 'skipped';
    for (const mode of modes) {
      try {
        const res = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/trestle-ingest`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-internal-key': serviceKey,
            Authorization: `Bearer ${serviceKey}`,
          },
          body: JSON.stringify({ mode, jobId: job.id, trigger: 'scheduled' }),
        });
        const body = await res.json();
        lastStatus = body.status ?? (body.skipped ? 'skipped' : 'failed');
        results.push({ jobId: job.id, mode, status: lastStatus });
      } catch (err) {
        lastStatus = 'failed';
        results.push({ jobId: job.id, mode, status: 'failed', error: String(err).slice(0, 200) });
      }
    }

    // Always advance next_sync_at, whatever the outcome.
    const nextSync = new Date(Date.now() + (job.interval_hours ?? 24) * 3600_000).toISOString();
    await db
      .from('mls_import_jobs')
      .update({
        last_run_at: new Date().toISOString(),
        last_run_status: lastStatus,
        next_sync_at: nextSync,
        lease_owner: null,
        lease_expires_at: null,
      })
      .eq('id', job.id);
  }

  return new Response(JSON.stringify({ ran: results.length, results }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
