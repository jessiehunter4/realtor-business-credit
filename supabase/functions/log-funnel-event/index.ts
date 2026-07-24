import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const ALLOWED_EVENTS = [
  'site_visit',
  'guide_view',
  'guide_download',
  'guide_read_25',
  'guide_read_50',
  'guide_read_75',
  'guide_read_100',
  'guide_session',
  'comparison_page_click',
  'comparison_page_view',
  'checkout_visited',
  'checkout_clicked',
  'checkout_session',
  'one_on_one_visited',
  'one_on_one_session',
  'intake_started',
  'intake_submitted',
  'intake_session',
  'plan_generation_started',
  'plan_generation_succeeded',
  'plan_generation_failed',
  'plan_viewed',
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
  if (trimmed.length === 0) return null;
  // Reject unresolved template variables like {{contact.id}}
  if (/^\{\{.*\}\}$/.test(trimmed)) return null;
  return trimmed;
};

/**
 * Look up contact name from GHL, return null on any failure.
 */
async function lookupGHLContactName(contactId: string): Promise<string | null> {
  try {
    const apiKey = Deno.env.get('GHL_API_KEY');
    if (!apiKey) return null;

    const resp = await fetch(
      `https://services.leadconnectorhq.com/contacts/${contactId}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Version: '2021-07-28',
          Accept: 'application/json',
        },
      },
    );

    if (!resp.ok) {
      console.warn(`GHL contact lookup failed: ${resp.status}`);
      return null;
    }

    const data = await resp.json();
    const contact = data?.contact;
    if (!contact) return null;

    const parts = [contact.firstName, contact.lastName].filter(Boolean);
    if (parts.length > 0) return parts.join(' ');
    if (contact.name) return contact.name;
    if (contact.email) return contact.email;
    return null;
  } catch (err) {
    console.warn('GHL contact lookup error:', err);
    return null;
  }
}

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

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Try to resolve contact name: first check DB cache, then GHL lookup
    let contactName: string | null = null;
    if (contactId) {
      // Check if we already have a name cached for this contact
      const { data: cached } = await supabase
        .from('funnel_events')
        .select('ghl_contact_name')
        .eq('ghl_contact_id', contactId)
        .not('ghl_contact_name', 'is', null)
        .limit(1)
        .maybeSingle();

      if (cached?.ghl_contact_name) {
        contactName = cached.ghl_contact_name;
      } else {
        // Look up from GHL
        contactName = await lookupGHLContactName(contactId);
      }
    }

    const { error } = await supabase.from('funnel_events').insert({
      ghl_contact_id: contactId || null,
      ghl_contact_name: contactName,
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
