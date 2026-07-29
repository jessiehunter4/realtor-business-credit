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

    const {
      firstName, lastName, email, phone, agentType, state, wantsFundabilityScan, ghlContactId, source,
      emailConsent, smsConsent, smsConsentText, smsConsentSource,
    } = await req.json();

    const now = new Date().toISOString();
    const smsOptIn = smsConsent === true;
    // Express written consent captured on-form is the ONLY path to SMS eligibility.
    const consentFields: Record<string, unknown> = {
      email_consent: emailConsent !== false,
      email_consent_at: emailConsent !== false ? now : null,
    };
    if (smsOptIn) {
      consentFields.sms_consent = true;
      consentFields.sms_consent_at = now;
      consentFields.sms_consent_source = smsConsentSource || source || 'web-form';
      consentFields.sms_consent_text = smsConsentText || null;
      consentFields.sms_opted_out_at = null;
      consentFields.sms_eligible = true;
    }

    console.log('Submitting lead:', { firstName, lastName, email, agentType, state, ghlContactId: ghlContactId ? 'provided' : 'not provided' });

    // Validate required fields
    if (!firstName || !lastName || !email || !phone) {
      return new Response(JSON.stringify({ error: 'Missing required fields (firstName, lastName, email, phone)' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if lead already exists
    const { data: existingLead } = await supabaseClient
      .from('leads')
      .select('id, ghl_contact_id')
      .eq('email', email)
      .maybeSingle();

    let leadId: string;
    let resolvedGhlContactId: string | null = ghlContactId || existingLead?.ghl_contact_id || null;

    if (existingLead) {
      console.log('Lead already exists, updating:', existingLead.id);
      leadId = existingLead.id;
      
      const { error: updateError } = await supabaseClient
        .from('leads')
        .update({
          first_name: firstName,
          last_name: lastName,
          phone,
          agent_type: agentType || 'unknown',
          state: state || 'unknown',
          wants_fundability_scan: wantsFundabilityScan || false,
          ghl_contact_id: resolvedGhlContactId,
          updated_at: now,
          ...consentFields,
        })
        .eq('id', existingLead.id);

      if (updateError) {
        console.error('Error updating lead:', updateError);
        throw updateError;
      }
    } else {
      const { data: newLead, error: insertError } = await supabaseClient
        .from('leads')
        .insert({
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          agent_type: agentType || 'unknown',
          state: state || 'unknown',
          wants_fundability_scan: wantsFundabilityScan || false,
          ghl_contact_id: resolvedGhlContactId,
          source: source || 'LandingPageRealtorBusinessCredit',
          ...consentFields,
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

    // GHL sync logic
    const ghlApiKey = Deno.env.get('GHL_API_KEY');
    const ghlLocationId = Deno.env.get('GHL_LOCATION_ID');

    if (ghlApiKey) {
      if (resolvedGhlContactId) {
        // PATH A: Known contactId — update existing contact directly
        console.log('Updating GHL contact directly:', resolvedGhlContactId);
        try {
          const ghlPayload: Record<string, unknown> = {
            firstName,
            lastName,
            email,
            phone,
            customFields: [
              { key: 'state_of_license', field_value: state || 'unknown' },
              { key: 'realtor_type', field_value: agentType || 'unknown' },
            ],
          };

          const ghlResponse = await fetch(`https://services.leadconnectorhq.com/contacts/${resolvedGhlContactId}`, {
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

          // Apply tags separately
          const tagsToApply = ['a-rbc-optin'];
          if (wantsFundabilityScan) tagsToApply.push('a-fund-scan');
          tagsToApply.push(smsOptIn ? 'sms-consent-yes' : 'sms-consent-no');

          const tagsResponse = await fetch(`https://services.leadconnectorhq.com/contacts/${resolvedGhlContactId}/tags`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${ghlApiKey}`,
              'Content-Type': 'application/json',
              'Version': '2021-07-28',
            },
            body: JSON.stringify({ tags: tagsToApply }),
          });

          if (!tagsResponse.ok) {
            const tagsErrorText = await tagsResponse.text();
            console.error('GHL tags update failed:', tagsResponse.status, tagsErrorText);
          } else {
            console.log('GHL tags applied successfully');
          }
        } catch (ghlError) {
          console.error('Error updating GHL:', ghlError);
        }
      } else {
        // PATH B: No contactId — upsert to GHL inline to get one back
        console.log('No ghlContactId, upserting to GHL inline');
        try {
          const upsertPayload: Record<string, unknown> = {
            firstName,
            lastName,
            email,
            phone,
            source: source || 'LandingPageRealtorBusinessCredit',
            customFields: [
              { key: 'state_of_license', field_value: state || 'unknown' },
              { key: 'realtor_type', field_value: agentType || 'unknown' },
            ],
          };
          if (ghlLocationId) {
            upsertPayload.locationId = ghlLocationId;
          }

          const upsertResponse = await fetch('https://services.leadconnectorhq.com/contacts/upsert', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${ghlApiKey}`,
              'Content-Type': 'application/json',
              'Version': '2021-07-28',
            },
            body: JSON.stringify(upsertPayload),
          });

          if (!upsertResponse.ok) {
            const errorText = await upsertResponse.text();
            console.error('GHL upsert failed:', upsertResponse.status, errorText);
          } else {
            const upsertData = await upsertResponse.json();
            const newContactId = upsertData?.contact?.id;
            console.log('GHL upsert successful, contactId:', newContactId);

            if (newContactId) {
              resolvedGhlContactId = newContactId;

              // Save contactId on the leads record
              await supabaseClient
                .from('leads')
                .update({ ghl_contact_id: newContactId, ghl_sync_status: 'success', ghl_synced_at: new Date().toISOString() })
                .eq('id', leadId);

              // Apply tags separately
              const tagsToApply = ['a-rbc-optin'];
              if (wantsFundabilityScan) tagsToApply.push('a-fund-scan');
              tagsToApply.push(smsOptIn ? 'sms-consent-yes' : 'sms-consent-no');
          tagsToApply.push(smsOptIn ? 'sms-consent-yes' : 'sms-consent-no');

              const tagsResponse = await fetch(`https://services.leadconnectorhq.com/contacts/${newContactId}/tags`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${ghlApiKey}`,
                  'Content-Type': 'application/json',
                  'Version': '2021-07-28',
                },
                body: JSON.stringify({ tags: tagsToApply }),
              });

              if (!tagsResponse.ok) {
                const tagsErrorText = await tagsResponse.text();
                console.error('GHL tags failed after upsert:', tagsResponse.status, tagsErrorText);
              } else {
                console.log('GHL tags applied after upsert');
              }
            }
          }
        } catch (ghlError) {
          console.error('Error during GHL upsert:', ghlError);
          // Fall back to async sync record
          const { error: syncError } = await supabaseClient
            .from('contact_syncs')
            .insert({ lead_id: leadId, status: 'pending' });
          if (syncError) console.error('Error creating fallback contact sync:', syncError);
        }
      }
    } else {
      console.warn('GHL_API_KEY not configured, skipping GHL sync');
    }

    return new Response(JSON.stringify({ 
      success: true, 
      leadId,
      ghlContactId: resolvedGhlContactId,
      message: existingLead ? 'Lead updated successfully' : 'Lead created successfully',
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in submit-lead:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
