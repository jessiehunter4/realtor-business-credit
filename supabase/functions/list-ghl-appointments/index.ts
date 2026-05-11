import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-04-15';

interface GhlCalendar {
  id: string;
  name?: string;
  isActive?: boolean;
}

interface GhlAppointment {
  id: string;
  title?: string;
  appointmentStatus?: string;
  startTime?: string;
  endTime?: string;
  calendarId?: string;
  contactId?: string;
  assignedUserId?: string;
  address?: string;
  notes?: string;
  dateAdded?: string;
}

async function ghlFetch(path: string, apiKey: string): Promise<Response> {
  return fetch(`${GHL_BASE}${path}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Version: GHL_VERSION,
      Accept: 'application/json',
    },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Admin gate
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const { data: roleRow } = await supabaseClient
      .from('user_roles').select('role').eq('user_id', user.id).eq('role', 'admin').maybeSingle();
    if (!roleRow) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const ghlApiKey = Deno.env.get('GHL_API_KEY');
    const ghlLocationId = Deno.env.get('GHL_LOCATION_ID');
    if (!ghlApiKey || !ghlLocationId) {
      return new Response(JSON.stringify({ error: 'Missing GHL credentials' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse window: default = past 60d to next 60d
    const url = new URL(req.url);
    const now = Date.now();
    const defaultStart = now - 60 * 86400_000;
    const defaultEnd = now + 60 * 86400_000;
    const startTime = Number(url.searchParams.get('startTime') || defaultStart);
    const endTime = Number(url.searchParams.get('endTime') || defaultEnd);

    // 1) Fetch calendars
    const calRes = await ghlFetch(`/calendars/?locationId=${encodeURIComponent(ghlLocationId)}`, ghlApiKey);
    const calText = await calRes.text();
    if (!calRes.ok) {
      return new Response(JSON.stringify({
        error: `Failed to list calendars (${calRes.status})`,
        details: calText.substring(0, 500),
      }), { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    let calendars: GhlCalendar[] = [];
    try {
      const parsed = JSON.parse(calText);
      calendars = (parsed.calendars || parsed.data || []) as GhlCalendar[];
    } catch {
      calendars = [];
    }
    const activeCalendars = calendars.filter((c) => c.id);

    // 2) For each calendar, fetch events in window
    const allAppts: GhlAppointment[] = [];
    const calendarMap: Record<string, string> = {};
    const errors: Array<{ calendarId: string; status: number; body: string }> = [];

    await Promise.all(activeCalendars.map(async (cal) => {
      calendarMap[cal.id] = cal.name || cal.id;
      const params = new URLSearchParams({
        locationId: ghlLocationId,
        calendarId: cal.id,
        startTime: String(startTime),
        endTime: String(endTime),
      });
      const evRes = await ghlFetch(`/calendars/events?${params.toString()}`, ghlApiKey);
      const evText = await evRes.text();
      if (!evRes.ok) {
        errors.push({ calendarId: cal.id, status: evRes.status, body: evText.substring(0, 200) });
        return;
      }
      try {
        const parsed = JSON.parse(evText);
        const events = (parsed.events || parsed.data || []) as GhlAppointment[];
        for (const ev of events) allAppts.push(ev);
      } catch {
        // ignore parse failures
      }
    }));

    // Sort by startTime desc
    allAppts.sort((a, b) => {
      const ta = a.startTime ? new Date(a.startTime).getTime() : 0;
      const tb = b.startTime ? new Date(b.startTime).getTime() : 0;
      return tb - ta;
    });

    return new Response(JSON.stringify({
      appointments: allAppts,
      calendars: calendarMap,
      window: { startTime, endTime },
      errors,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error',
    }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});