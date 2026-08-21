// Admin-only writer for MLS ingestion configuration, with change auditing.
// The master switch here is runtime flow control for ingestion only.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { requireAdmin } from '../_shared/requireAdmin.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SETTING_FIELDS = new Set([
  'automatic_ingestion_enabled',
  'import_new_enabled',
  'update_existing_enabled',
  'page_size',
  'max_concurrency',
  'request_timeout_ms',
  'retry_attempts',
  'retry_initial_delay_ms',
  'retry_max_delay_ms',
  'circuit_breaker_threshold',
  'circuit_breaker_recovery_seconds',
  'timezone',
]);

const JOB_FIELDS = new Set([
  'name',
  'enabled',
  'zip_group_id',
  'interval_hours',
  'import_new',
  'update_existing',
  'daily_new_limit',
  'min_price',
  'max_price',
  'max_days_on_market',
  'overlap_minutes',
]);

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const guard = await requireAdmin(req);
  if (guard instanceof Response) return guard;

  const db = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

  const { action, payload } = await req.json();

  async function audit(entity: string, entityId: string | null, oldValue: unknown, newValue: unknown) {
    await db.from('mls_settings_audit').insert({
      actor: guard.userId,
      entity,
      entity_id: entityId,
      old_value: oldValue as any,
      new_value: newValue as any,
    });
  }

  try {
    switch (action) {
      case 'update_settings': {
        const updates: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(payload ?? {})) {
          if (SETTING_FIELDS.has(k)) updates[k] = v;
        }
        if (Object.keys(updates).length === 0) return json({ error: 'No valid fields' }, 400);
        const { data: before } = await db.from('mls_settings').select('*').maybeSingle();
        const { data, error } = await db
          .from('mls_settings')
          .update(updates)
          .eq('id', before.id)
          .select()
          .single();
        if (error) throw error;
        await audit('mls_settings', before.id, before, updates);
        return json({ settings: data });
      }

      case 'upsert_zip_group': {
        const { id, label, county, enabled, note, zips } = payload ?? {};
        const clean = (zips ?? []).map((z: string) => String(z).trim()).filter((z: string) => /^[0-9]{5}$/.test(z));
        let groupId = id as string | undefined;
        if (groupId) {
          const { error } = await db
            .from('mls_zip_groups')
            .update({ label, county, enabled, note })
            .eq('id', groupId);
          if (error) throw error;
        } else {
          const { data, error } = await db
            .from('mls_zip_groups')
            .insert({ label, county, enabled: enabled ?? false, note })
            .select('id')
            .single();
          if (error) throw error;
          groupId = data.id;
        }
        await db.from('mls_zips').delete().eq('group_id', groupId);
        if (clean.length) {
          await db.from('mls_zips').insert(clean.map((zip: string) => ({ group_id: groupId, zip })));
        }
        await audit('mls_zip_groups', groupId ?? null, null, { label, enabled, zips: clean });
        return json({ groupId, zips: clean });
      }

      case 'delete_zip_group': {
        await db.from('mls_zip_groups').delete().eq('id', payload.id);
        await audit('mls_zip_groups', payload.id, null, { deleted: true });
        return json({ ok: true });
      }

      case 'upsert_job': {
        const updates: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(payload ?? {})) {
          if (JOB_FIELDS.has(k)) updates[k] = v;
        }
        if (payload?.id) {
          const { data, error } = await db
            .from('mls_import_jobs')
            .update(updates)
            .eq('id', payload.id)
            .select()
            .single();
          if (error) throw error;
          await audit('mls_import_jobs', payload.id, null, updates);
          return json({ job: data });
        }
        const { data, error } = await db.from('mls_import_jobs').insert(updates).select().single();
        if (error) throw error;
        await audit('mls_import_jobs', data.id, null, updates);
        return json({ job: data });
      }

      case 'update_status_policy': {
        const { id, internal_status, policyAction } = payload ?? {};
        const { data, error } = await db
          .from('mls_status_policy')
          .update({ internal_status, action: policyAction, needs_review: false })
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        await audit('mls_status_policy', id, null, { internal_status, action: policyAction });
        return json({ policy: data });
      }

      default:
        return json({ error: 'Unknown action' }, 400);
    }
  } catch (err) {
    console.error('mls-admin-settings error:', err);
    return json({ error: err instanceof Error ? err.message : 'Unknown error' }, 500);
  }
});
