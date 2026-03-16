const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { contactId, tags } = await req.json();

    if (!contactId || !Array.isArray(tags) || tags.length === 0) {
      return new Response(JSON.stringify({ error: 'contactId and tags[] are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const ghlApiKey = Deno.env.get('GHL_API_KEY');
    if (!ghlApiKey) {
      console.error('GHL_API_KEY not configured');
      return new Response(JSON.stringify({ error: 'GHL_API_KEY not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Applying tags ${JSON.stringify(tags)} to GHL contact ${contactId}`);

    const response = await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/tags`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ghlApiKey}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28',
      },
      body: JSON.stringify({ tags }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`GHL tags API failed [${response.status}]:`, errorText);
      return new Response(JSON.stringify({ error: 'Failed to apply tags', details: errorText }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('Tags applied successfully:', JSON.stringify(data));

    return new Response(JSON.stringify({ success: true, tags: data.tags }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in tag-ghl-contact:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
