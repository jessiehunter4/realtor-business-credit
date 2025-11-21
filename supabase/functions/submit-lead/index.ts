import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { firstName, lastName, email, phone, agentType, state, wantsFundabilityScan } = await req.json();

    console.log('Submitting lead:', { firstName, lastName, email, agentType, state });

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !agentType || !state) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if lead already exists
    const { data: existingLead } = await supabaseClient
      .from('leads')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existingLead) {
      console.log('Lead already exists, updating:', existingLead.id);
      
      // Update existing lead
      const { error: updateError } = await supabaseClient
        .from('leads')
        .update({
          first_name: firstName,
          last_name: lastName,
          phone,
          agent_type: agentType,
          state,
          wants_fundability_scan: wantsFundabilityScan || false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingLead.id);

      if (updateError) {
        console.error('Error updating lead:', updateError);
        throw updateError;
      }

      return new Response(JSON.stringify({ 
        success: true, 
        leadId: existingLead.id,
        message: 'Lead updated successfully' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create new lead
    const { data: newLead, error: insertError } = await supabaseClient
      .from('leads')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        agent_type: agentType,
        state,
        wants_fundability_scan: wantsFundabilityScan || false,
        source: 'LandingPageRealtorBusinessCredit',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting lead:', insertError);
      throw insertError;
    }

    console.log('Lead created successfully:', newLead.id);

    // Create contact sync record for GoHighLevel (pending status)
    const { error: syncError } = await supabaseClient
      .from('contact_syncs')
      .insert({
        lead_id: newLead.id,
        status: 'pending',
      });

    if (syncError) {
      console.error('Error creating contact sync:', syncError);
      // Don't fail the request if sync creation fails
    }

    return new Response(JSON.stringify({ 
      success: true, 
      leadId: newLead.id,
      message: 'Lead created successfully' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in submit-lead:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
