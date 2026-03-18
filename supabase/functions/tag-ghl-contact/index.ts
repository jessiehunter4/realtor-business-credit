const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { contactId, tags, removeTags } = await req.json();

    if (!contactId) {
      return new Response(JSON.stringify({ error: 'contactId is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const hasTags = Array.isArray(tags) && tags.length > 0;
    const hasRemoveTags = Array.isArray(removeTags) && removeTags.length > 0;

    if (!hasTags && !hasRemoveTags) {
      return new Response(JSON.stringify({ error: 'tags[] or removeTags[] required' }), {
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

    const results: { added?: string[]; removed?: string[]; errors?: string[] } = {};
    const errors: string[] = [];

    // Remove tags first (so add takes precedence if same tag in both)
    if (hasRemoveTags) {
      console.log(`Removing tags ${JSON.stringify(removeTags)} from GHL contact ${contactId}`);
      const removeRes = await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/tags`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${ghlApiKey}`,
          'Content-Type': 'application/json',
          'Version': '2021-07-28',
        },
        body: JSON.stringify({ tags: removeTags }),
      });

      if (!removeRes.ok) {
        const errText = await removeRes.text();
        console.error(`GHL remove tags failed [${removeRes.status}]:`, errText);
        errors.push(`Remove failed: ${errText}`);
      } else {
        const removeData = await removeRes.json();
        results.removed = removeData.tags || removeTags;
        console.log('Tags removed successfully:', JSON.stringify(removeData));
      }
    }

    // Add tags
    if (hasTags) {
      console.log(`Applying tags ${JSON.stringify(tags)} to GHL contact ${contactId}`);
      const addRes = await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/tags`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ghlApiKey}`,
          'Content-Type': 'application/json',
          'Version': '2021-07-28',
        },
        body: JSON.stringify({ tags }),
      });

      if (!addRes.ok) {
        const errText = await addRes.text();
        console.error(`GHL add tags failed [${addRes.status}]:`, errText);
        errors.push(`Add failed: ${errText}`);
      } else {
        const addData = await addRes.json();
        results.added = addData.tags || tags;
        console.log('Tags applied successfully:', JSON.stringify(addData));
      }
    }

    if (errors.length > 0) {
      results.errors = errors;
    }

    const allFailed = (hasTags && !results.added) && (hasRemoveTags && !results.removed);

    return new Response(JSON.stringify({ success: !allFailed, ...results }), {
      status: allFailed ? 502 : 200,
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
