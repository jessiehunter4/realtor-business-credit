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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const eventType = body?.eventType;
    const rawContactId =
      body?.contactId ??
      body?.contactID ??
      body?.ContactId ??
      body?.ghl_contact_id ??
      null;
    const contactId = typeof rawContactId === 'string' ? rawContactId.trim() : null;
    const metadata = body?.metadata && typeof body.metadata === 'object' ? body.metadata : {};

    if (!eventType || !ALLOWED_EVENTS.includes(eventType)) {
      return new Response(JSON.stringify({ error: `Invalid eventType. Allowed: ${ALLOWED_EVENTS.join(', ')}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

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
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
