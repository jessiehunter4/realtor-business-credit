import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const ALLOWED_EVENTS = [
  'site_visit',
  'guide_view',
  'guide_read_25',
  'guide_read_50',
  'guide_read_75',
  'guide_read_100',
  'guide_session',
  'checkout_visited',
  'checkout_clicked',
  'checkout_session',
  'one_on_one_visited',
  'one_on_one_session',
  'intake_started',
  'intake_submitted',
  'intake_session',
];

const parseRequestBody = async (req: Request) => {
  const raw = await req.text();
  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch {
    throw new Error('Invalid JSON body');
  }
};

const asNonEmptyString = (value: unknown) => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await parseRequestBody(req);
    const eventType = asNonEmptyString(body?.eventType);
    const rawContactId =
      body?.contactId ??
      body?.contactID ??
      body?.contactiD ??
      body?.contactid ??
      body?.ContactId ??
      body?.ContactID ??
      body?.contact_id ??
      body?.ghl_contact_id ??
      body?.ghlContactId ??
      null;
    const contactId = asNonEmptyString(rawContactId);
    const metadata = body?.metadata && typeof body.metadata === 'object' ? body.metadata : {};

    if (!eventType || !ALLOWED_EVENTS.includes(eventType)) {
      return new Response(JSON.stringify({ error: `Invalid eventType. Allowed: ${ALLOWED_EVENTS.join(', ')}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const metadataRecord = metadata as Record<string, unknown>;
    console.info('Incoming funnel event', {
      eventType,
      contactId,
      hostname: metadataRecord.hostname ?? null,
      pathname: metadataRecord.pathname ?? null,
      tracker_version: metadataRecord.tracker_version ?? null,
    });

    // Use service role key to bypass RLS — this function is public (verify_jwt = false)
    // and accepts lightweight tracking pings including sendBeacon requests without auth headers
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { error } = await supabase.from('funnel_events').insert({
      ghl_contact_id: contactId || null,
      event_type: eventType,
      metadata: metadata || {},
    });

    if (error) {
      console.error('Insert error:', error);
      return new Response(JSON.stringify({ error: 'Failed to log event' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in log-funnel-event:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message === 'Invalid JSON body' ? 400 : 500;

    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
