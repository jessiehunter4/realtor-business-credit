// Trestle ingestion worker.
// Modes: preview (no writes), new, update, reconcile.
// The master switch is flow control only: when OFF, no automatic work starts
// and a running job stops safely at a record boundary. It changes no data.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { requireAdmin } from '../_shared/requireAdmin.ts';
import {
  DEFAULT_CLIENT_CONFIG,
  fetchProperties,
  sanitiseError,
  type ClientConfig,
  type RequestStats,
} from '../_shared/trestle/client.ts';
import { mapRecord } from '../_shared/trestle/adapter.ts';
import { evaluateRecord, validateZips } from '../_shared/trestle/eligibility.ts';
import { loadStatusPolicy, resolveStatus } from '../_shared/trestle/policy.ts';
import { ingestNormalisedRecord } from '../_shared/mls/ingest.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type Mode = 'preview' | 'new' | 'update' | 'reconcile';

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function configFrom(settings: any): ClientConfig {
  return {
    pageSize: settings?.page_size ?? DEFAULT_CLIENT_CONFIG.pageSize,
    requestTimeoutMs: settings?.request_timeout_ms ?? DEFAULT_CLIENT_CONFIG.requestTimeoutMs,
    retryAttempts: settings?.retry_attempts ?? DEFAULT_CLIENT_CONFIG.retryAttempts,
    retryInitialDelayMs: settings?.retry_initial_delay_ms ?? DEFAULT_CLIENT_CONFIG.retryInitialDelayMs,
    retryMaxDelayMs: settings?.retry_max_delay_ms ?? DEFAULT_CLIENT_CONFIG.retryMaxDelayMs,
    circuitBreakerThreshold: settings?.circuit_breaker_threshold ?? DEFAULT_CLIENT_CONFIG.circuitBreakerThreshold,
  };
}

async function loadZips(db: any, zipGroupId: string | null): Promise<string[]> {
  let query = db
    .from('mls_zips')
    .select('zip, enabled, mls_zip_groups!inner(id, enabled)')
    .eq('enabled', true)
    .eq('mls_zip_groups.enabled', true);
  if (zipGroupId) query = query.eq('group_id', zipGroupId);
  const { data } = await query;
  return validateZips((data ?? []).map((r: any) => r.zip));
}

async function newRecordsToday(db: any): Promise<number> {
  const since = new Date();
  since.setUTCHours(0, 0, 0, 0);
  const { data } = await db
    .from('mls_import_runs')
    .select('records_created')
    .gte('created_at', since.toISOString());
  return (data ?? []).reduce((sum: number, r: any) => sum + (r.records_created ?? 0), 0);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const isInternal = req.headers.get('x-internal-key') === Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  let actorId: string | null = null;
  if (!isInternal) {
    const guard = await requireAdmin(req);
    if (guard instanceof Response) return guard;
    actorId = guard.userId;
  }

  const db = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

  let body: any = {};
  try {
    body = await req.json();
  } catch { /* no body */ }

  const mode: Mode = body.mode ?? 'preview';
  const jobId: string | null = body.jobId ?? null;
  const trigger: string = body.trigger ?? (isInternal ? 'scheduled' : 'manual');

  const { data: settings } = await db.from('mls_settings').select('*').maybeSingle();
  const cfg = configFrom(settings);

  // Kill switch: flow control for automatic work only. Read-only previews and
  // connection tests remain available.
  if (mode !== 'preview' && trigger === 'scheduled' && !settings?.automatic_ingestion_enabled) {
    return json({ skipped: true, reason: 'Automatic ingestion is switched off' });
  }
  if (mode !== 'preview' && trigger === 'scheduled') {
    if (mode === 'new' && !settings?.import_new_enabled) {
      return json({ skipped: true, reason: 'Importing new records is switched off' });
    }
    if (mode === 'update' && !settings?.update_existing_enabled) {
      return json({ skipped: true, reason: 'Updating existing records is switched off' });
    }
  }

  const { data: job } = jobId
    ? await db.from('mls_import_jobs').select('*').eq('id', jobId).maybeSingle()
    : { data: null };

  const zips = await loadZips(db, job?.zip_group_id ?? null);
  if (zips.length === 0) {
    return json({ error: 'No enabled ZIP codes are configured' }, 400);
  }

  const startedAt = new Date();
  const { data: run } = await db
    .from('mls_import_runs')
    .insert({
      job_id: job?.id ?? null,
      trigger,
      mode,
      status: 'running',
      started_at: startedAt.toISOString(),
      zip_groups_used: { zips },
      filters_used: {
        minPrice: job?.min_price ?? null,
        maxPrice: job?.max_price ?? null,
        maxDaysOnMarket: job?.max_days_on_market ?? null,
      },
      watermark_before: job?.watermark_committed ?? null,
      triggered_by: actorId,
    })
    .select()
    .single();

  const stats: RequestStats = { apiRequestCount: 0, rateLimitResponses: 0, providerWaitMs: 0 };

  const counters = {
    records_reported: 0,
    records_fetched: 0,
    records_accepted: 0,
    records_filtered: 0,
    records_created: 0,
    records_updated: 0,
    records_unchanged: 0,
    records_deferred: 0,
    records_failed: 0,
  };

  const previewRows: any[] = [];
  let stoppedEarly = false;

  try {
    // Incremental window: update and new modes use the committed watermark,
    // reconcile deliberately ignores it.
    let modifiedSince: string | null = null;
    if (mode !== 'reconcile' && job?.watermark_committed) {
      const overlapMinutes = job.overlap_minutes ?? 15;
      const from = new Date(new Date(job.watermark_committed).getTime() - overlapMinutes * 60_000);
      modifiedSince = from.toISOString();
    }

    const shouldContinue = async () => {
      if (mode === 'preview' || trigger !== 'scheduled') return true;
      const { data: s } = await db.from('mls_settings').select('automatic_ingestion_enabled').maybeSingle();
      if (!s?.automatic_ingestion_enabled) {
        stoppedEarly = true;
        return false;
      }
      return true;
    };

    const fetched = await fetchProperties(
      {
        zips,
        modifiedSince,
        pageSize: cfg.pageSize,
        maxRecords: mode === 'preview' ? 25 : undefined,
      },
      cfg,
      stats,
      shouldContinue,
    );

    counters.records_reported = fetched.reportedCount ?? 0;
    counters.records_fetched = fetched.records.length;

    const policy = await loadStatusPolicy(db);
    const filters = {
      allowedZips: zips,
      minPrice: job?.min_price ?? null,
      maxPrice: job?.max_price ?? null,
      maxDaysOnMarket: job?.max_days_on_market ?? null,
    };

    const dailyLimit = job?.daily_new_limit ?? 0;
    let newCommittedToday = mode === 'new' || mode === 'reconcile' ? await newRecordsToday(db) : 0;
    let maxModification: string | null = null;

    for (const raw of fetched.records) {
      if (stoppedEarly) break;

      const record = mapRecord(raw);
      if (record.modificationTimestamp && (!maxModification || record.modificationTimestamp > maxModification)) {
        maxModification = record.modificationTimestamp;
      }

      const verdict = evaluateRecord(record, filters);
      if (!verdict.eligible) {
        counters.records_filtered++;
        if (mode !== 'preview') {
          await db.from('mls_import_record_errors').insert({
            run_id: run.id,
            listing_key: record.listingKey,
            listing_id: record.mlsId,
            stage: 'filter',
            intended_action: mode,
            outcome: 'filtered',
            reason: verdict.reason,
          });
        }
        continue;
      }

      const statusEntry = await resolveStatus(db, policy, record.standardStatus);
      counters.records_accepted++;

      // Does the record already exist?
      const { data: existing } = await db
        .from('transactions')
        .select('id, standard_status')
        .eq('source_system', 'trestle')
        .eq('listing_key', record.listingKey)
        .maybeSingle();

      if (mode === 'preview') {
        previewRows.push({
          listingKey: record.listingKey,
          listingId: record.mlsId,
          status: record.standardStatus,
          internalStatus: statusEntry.internal_status,
          action: statusEntry.action,
          needsReview: statusEntry.needs_review,
          exists: Boolean(existing),
          address: record.property.fullAddress,
          city: record.property.city,
          zip: record.property.zip,
          price: record.property.price,
          closeDate: record.property.closeDate,
          listingAgent: [record.listingAgent.firstName, record.listingAgent.lastName]
            .filter(Boolean)
            .join(' '),
          hasAgentContact: Boolean(record.listingAgent.email || record.listingAgent.phone),
        });
        continue;
      }

      if (!existing && mode === 'update') {
        counters.records_unchanged++;
        continue;
      }

      if (existing && mode === 'new') {
        counters.records_unchanged++;
        continue;
      }

      if (!existing && (mode === 'new' || mode === 'reconcile')) {
        if (newCommittedToday >= dailyLimit) {
          counters.records_deferred++;
          continue;
        }
      }

      try {
        const result = await ingestNormalisedRecord(db, record, {
          sourceSystem: 'trestle',
          importRunId: run.id,
          action: statusEntry.action,
        });

        if (result.outcome === 'created') {
          counters.records_created++;
          newCommittedToday++;
        } else if (result.outcome === 'updated') counters.records_updated++;
        else if (result.outcome === 'unchanged') counters.records_unchanged++;
        else if (result.outcome === 'skipped_duplicate') counters.records_filtered++;
        else {
          counters.records_failed++;
          await db.from('mls_import_record_errors').insert({
            run_id: run.id,
            listing_key: record.listingKey,
            listing_id: record.mlsId,
            stage: 'write',
            intended_action: mode,
            outcome: 'failed',
            error_category: 'database',
            error_message: result.reason ?? 'unknown',
            needs_admin_action: true,
          });
        }
      } catch (err) {
        counters.records_failed++;
        await db.from('mls_import_record_errors').insert({
          run_id: run.id,
          listing_key: record.listingKey,
          listing_id: record.mlsId,
          stage: 'write',
          intended_action: mode,
          outcome: 'failed',
          error_category: 'exception',
          error_message: sanitiseError(err),
          needs_admin_action: true,
        });
      }
    }

    const countsReconcile =
      fetched.reportedCount === null || fetched.reportedCount === counters.records_fetched;
    const complete = fetched.complete && countsReconcile && counters.records_failed === 0 && !stoppedEarly;
    const status = stoppedEarly ? 'stopped' : complete ? 'successful' : 'partial';

    // Advance the watermark only after a fully successful write run.
    let watermarkAfter: string | null = job?.watermark_committed ?? null;
    if (job && mode !== 'preview' && complete && maxModification) {
      watermarkAfter = maxModification;
      await db.from('mls_import_jobs').update({ watermark_committed: watermarkAfter }).eq('id', job.id);
    }

    const completedAt = new Date();
    await db
      .from('mls_import_runs')
      .update({
        ...counters,
        status,
        completed_at: completedAt.toISOString(),
        elapsed_ms: completedAt.getTime() - startedAt.getTime(),
        window_start: modifiedSince,
        window_end: completedAt.toISOString(),
        watermark_after: watermarkAfter,
        pages_received: fetched.pagesReceived,
        api_request_count: stats.apiRequestCount,
        rate_limit_responses: stats.rateLimitResponses,
        provider_wait_ms: stats.providerWaitMs,
      })
      .eq('id', run.id);

    return json({ runId: run.id, status, mode, counters, preview: previewRows });
  } catch (err) {
    const completedAt = new Date();
    await db
      .from('mls_import_runs')
      .update({
        ...counters,
        status: 'failed',
        completed_at: completedAt.toISOString(),
        elapsed_ms: completedAt.getTime() - startedAt.getTime(),
        api_request_count: stats.apiRequestCount,
        rate_limit_responses: stats.rateLimitResponses,
        provider_wait_ms: stats.providerWaitMs,
        error_message: sanitiseError(err),
      })
      .eq('id', run.id);

    return json({ runId: run.id, status: 'failed', error: sanitiseError(err) }, 500);
  }
});
