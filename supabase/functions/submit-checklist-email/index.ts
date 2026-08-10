import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { z } from 'https://esm.sh/zod@3.23.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const schema = z.object({
  email: z.string().trim().email().max(255),
  source: z.string().trim().max(100).optional(),
  pagePath: z.string().trim().max(500).optional(),
  ghlContactId: z.string().trim().max(100).optional(),
});

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid request body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const parsed = schema.safeParse(rawBody);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: 'Please enter a valid email address.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const { email, source, pagePath, ghlContactId } = parsed.data;
    const now = new Date().toISOString();

    const { data: existing } = await supabaseClient
      .from('checklist_subscribers')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    let subscriberId: string;

    if (existing) {
      const { error: updateError } = await supabaseClient
        .from('checklist_subscribers')
        .update({
          source: source ?? 'checklist-form',
          page_path: pagePath ?? null,
          ghl_contact_id: ghlContactId ?? null,
          updated_at: now,
        })
        .eq('id', existing.id);

      if (updateError) {
        console.error('Error updating checklist subscriber:', updateError);
        throw updateError;
      }
      subscriberId = existing.id;
    } else {
      const { data: newSubscriber, error: insertError } = await supabaseClient
        .from('checklist_subscribers')
        .insert({
          email,
          source: source ?? 'checklist-form',
          page_path: pagePath ?? null,
          ghl_contact_id: ghlContactId ?? null,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting checklist subscriber:', insertError);
        throw insertError;
      }
      subscriberId = newSubscriber.id;
    }

    const ghlApiKey = Deno.env.get('GHL_API_KEY');
    if (ghlApiKey && ghlContactId) {
      try {
        await fetch(`https://services.leadconnectorhq.com/contacts/${ghlContactId}/tags`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${ghlApiKey}`,
            'Content-Type': 'application/json',
            'Version': '2021-07-28',
          },
          body: JSON.stringify({ tags: ['a-rbc-checklist-download'] }),
        });
      } catch (ghlError) {
        console.error('Error applying GHL checklist tag:', ghlError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        subscriberId,
        message: existing ? 'You’re already subscribed — welcome back!' : 'Checklist coming to your inbox!',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('Error in submit-checklist-email:', error);
    return new Response(
      JSON.stringify({ error: 'We could not process your request. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
