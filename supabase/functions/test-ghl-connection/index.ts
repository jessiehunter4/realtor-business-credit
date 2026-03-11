import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify caller is admin
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
      if (authError || !user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    const ghlApiKey = Deno.env.get('GHL_API_KEY');
    const ghlLocationId = Deno.env.get('GHL_LOCATION_ID');

    const diagnostics: Record<string, unknown> = {
      ghl_api_key_present: !!ghlApiKey && ghlApiKey.length > 0,
      ghl_api_key_length: ghlApiKey?.length || 0,
      ghl_location_id_present: !!ghlLocationId && ghlLocationId.length > 0,
      ghl_location_id_preview: ghlLocationId ? `${ghlLocationId.substring(0, 4)}...${ghlLocationId.substring(ghlLocationId.length - 4)}` : null,
    };

    if (!ghlApiKey || !ghlLocationId) {
      return new Response(JSON.stringify({
        connected: false,
        error: 'Missing credentials',
        diagnostics,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Test the connection by fetching location info
    const response = await fetch(
      `https://services.leadconnectorhq.com/locations/${ghlLocationId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${ghlApiKey}`,
          'Version': '2021-07-28',
          'Accept': 'application/json',
        },
      }
    );

    const responseText = await response.text();

    if (!response.ok) {
      return new Response(JSON.stringify({
        connected: false,
        error: `GHL API returned ${response.status}`,
        details: responseText.substring(0, 500),
        diagnostics,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let locationData;
    try {
      locationData = JSON.parse(responseText);
    } catch {
      locationData = null;
    }

    const locationName = locationData?.location?.name || locationData?.name || 'Unknown';

    return new Response(JSON.stringify({
      connected: true,
      location_name: locationName,
      location_id_preview: `${ghlLocationId.substring(0, 4)}...${ghlLocationId.substring(ghlLocationId.length - 4)}`,
      diagnostics,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
