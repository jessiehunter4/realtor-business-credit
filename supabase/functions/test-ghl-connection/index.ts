import { requireAdmin, corsHeaders } from '../_shared/requireAdmin.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const guard = await requireAdmin(req);
    if (guard instanceof Response) return guard;

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
