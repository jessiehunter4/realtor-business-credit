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

    const { firstName, lastName, email, phone, agentType, state, wantsFundabilityScan, ghlContactId } = await req.json();

    console.log('Submitting lead:', { firstName, lastName, email, agentType, state, ghlContactId: ghlContactId ? 'provided' : 'not provided' });

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

    let leadId: string;

    if (existingLead) {
      console.log('Lead already exists, updating:', existingLead.id);
      leadId = existingLead.id;
      
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
          ghl_contact_id: ghlContactId || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingLead.id);

      if (updateError) {
        console.error('Error updating lead:', updateError);
        throw updateError;
      }
    } else {
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
          ghl_contact_id: ghlContactId || null,
          source: 'LandingPageRealtorBusinessCredit',
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting lead:', insertError);
        throw insertError;
      }

      console.log('Lead created successfully:', newLead.id);
      leadId = newLead.id;
    }

    // If ghlContactId is provided, update GHL directly
    if (ghlContactId) {
      console.log('Updating GHL contact directly:', ghlContactId);
      
      const ghlApiKey = Deno.env.get('GHL_API_KEY');
      if (!ghlApiKey) {
        console.error('GHL_API_KEY not configured');
        // Don't fail the request, just skip GHL update
      } else {
        try {
          // Build tags array for landing page leads
          const tags = ['RBC_Landing', 'LeadMagnetDownload'];
          if (wantsFundabilityScan) {
            tags.push('RequestedFundabilityScan');
          }

          const ghlPayload = {
            firstName,
            lastName,
            email,
            phone,
            tags,
            customFields: [
              { key: 'state_of_license', field_value: state }
            ]
          };

          console.log('Sending to GHL:', JSON.stringify(ghlPayload));

          const ghlResponse = await fetch(`https://services.leadconnectorhq.com/contacts/${ghlContactId}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${ghlApiKey}`,
              'Content-Type': 'application/json',
              'Version': '2021-07-28',
            },
            body: JSON.stringify(ghlPayload),
          });

          if (!ghlResponse.ok) {
            const errorText = await ghlResponse.text();
            console.error('GHL update failed:', ghlResponse.status, errorText);
          } else {
            console.log('GHL contact updated successfully');
          }
        } catch (ghlError) {
          console.error('Error updating GHL:', ghlError);
          // Don't fail the request if GHL update fails
        }
      }
    } else {
      // No ghlContactId provided - create contact sync record for async processing
      console.log('No ghlContactId provided, creating contact_sync record');
      
      const { error: syncError } = await supabaseClient
        .from('contact_syncs')
        .insert({
          lead_id: leadId,
          status: 'pending',
        });

      if (syncError) {
        console.error('Error creating contact sync:', syncError);
        // Don't fail the request if sync creation fails
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      leadId,
      message: existingLead ? 'Lead updated successfully' : 'Lead created successfully' 
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
