import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GHLContact {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  source?: string;
  tags?: string[];
  customFields?: {
    agent_type?: string;
    state?: string;
    office_name?: string;
    license_number?: string;
    wants_fundability_scan?: string;
  };
}

interface ContactSync {
  id: string;
  agent_id?: string;
  lead_id?: string;
  retry_count: number;
}

interface Agent {
  id: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  state?: string;
  office_name?: string;
  license_number?: string;
  type?: string;
  source: string;
}

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  agent_type: string;
  state: string;
  wants_fundability_scan: boolean;
  source: string;
}

const MAX_RETRIES = 5;
const BATCH_SIZE = 20;

async function syncContactToGHL(
  contact: GHLContact,
  apiKey: string,
  locationId: string
): Promise<{ success: boolean; contactId?: string; error?: string }> {
  try {
    console.log('Syncing contact to GHL:', contact.email);

    const response = await fetch(`https://services.leadconnectorhq.com/contacts/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28',
      },
      body: JSON.stringify({
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phone: contact.phone,
        locationId: locationId,
        source: contact.source || 'RealtorBusinessCredit',
        tags: contact.tags || [],
        customField: contact.customFields || {},
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('GHL API error:', response.status, errorText);
      
      // Check if contact already exists
      if (response.status === 422 || errorText.includes('already exists')) {
        // Try to find existing contact by email
        const searchResponse = await fetch(
          `https://services.leadconnectorhq.com/contacts/?email=${encodeURIComponent(contact.email)}&locationId=${locationId}`,
          {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Version': '2021-07-28',
            },
          }
        );

        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          if (searchData.contacts && searchData.contacts.length > 0) {
            const existingContact = searchData.contacts[0];
            console.log('Contact already exists in GHL:', existingContact.id);
            
            // Update existing contact with new tags
            if (contact.tags && contact.tags.length > 0) {
              await fetch(`https://services.leadconnectorhq.com/contacts/${existingContact.id}`, {
                method: 'PUT',
                headers: {
                  'Authorization': `Bearer ${apiKey}`,
                  'Content-Type': 'application/json',
                  'Version': '2021-07-28',
                },
                body: JSON.stringify({
                  tags: [...new Set([...(existingContact.tags || []), ...contact.tags])],
                }),
              });
            }
            
            return { success: true, contactId: existingContact.id };
          }
        }
      }
      
      throw new Error(`GHL API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Contact synced successfully:', data.contact?.id);
    
    return { success: true, contactId: data.contact?.id };
  } catch (error) {
    console.error('Error syncing to GHL:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

function buildContactFromAgent(agent: Agent): GHLContact {
  const names = agent.full_name?.split(' ') || [agent.first_name || '', agent.last_name || ''];
  const firstName = agent.first_name || names[0] || 'Unknown';
  const lastName = agent.last_name || names.slice(1).join(' ') || '';

  return {
    firstName,
    lastName,
    email: agent.email || `agent-${agent.id}@placeholder.com`,
    phone: agent.phone || '',
    source: agent.source,
    tags: ['JustClosed', 'RealtorBusinessCredit', 'FromMLSImport'],
    customFields: {
      agent_type: agent.type || 'unknown',
      state: agent.state || '',
      office_name: agent.office_name || '',
      license_number: agent.license_number || '',
    },
  };
}

function buildContactFromLead(lead: Lead): GHLContact {
  const tags = ['RBC_Landing', 'LeadMagnetDownload'];
  if (lead.wants_fundability_scan) {
    tags.push('RequestedFundabilityScan');
  }

  return {
    firstName: lead.first_name,
    lastName: lead.last_name,
    email: lead.email,
    phone: lead.phone,
    source: lead.source,
    tags,
    customFields: {
      agent_type: lead.agent_type,
      state: lead.state,
      wants_fundability_scan: lead.wants_fundability_scan ? 'Yes' : 'No',
    },
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const ghlApiKey = Deno.env.get('GHL_API_KEY');
    const ghlLocationId = Deno.env.get('GHL_LOCATION_ID');

    if (!ghlApiKey || !ghlLocationId) {
      throw new Error('GHL_API_KEY or GHL_LOCATION_ID not configured');
    }

    console.log('Starting GHL sync process...');

    // Fetch pending syncs with retry logic
    const { data: pendingSyncs, error: syncError } = await supabaseClient
      .from('contact_syncs')
      .select(`
        id,
        agent_id,
        lead_id,
        retry_count,
        agents:agent_id (
          id, first_name, last_name, full_name, email, phone, 
          state, office_name, license_number, type, source
        ),
        leads:lead_id (
          id, first_name, last_name, email, phone, 
          agent_type, state, wants_fundability_scan, source
        )
      `)
      .eq('status', 'pending')
      .lt('retry_count', MAX_RETRIES)
      .limit(BATCH_SIZE);

    if (syncError) {
      console.error('Error fetching pending syncs:', syncError);
      throw syncError;
    }

    if (!pendingSyncs || pendingSyncs.length === 0) {
      console.log('No pending syncs to process');
      return new Response(
        JSON.stringify({ success: true, message: 'No pending syncs', processed: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing ${pendingSyncs.length} pending syncs`);

    let successCount = 0;
    let failureCount = 0;

    // Process each sync
    for (const sync of pendingSyncs) {
      try {
        let contact: GHLContact | null = null;

        // Build contact from agent or lead
        if (sync.agent_id && sync.agents) {
          contact = buildContactFromAgent(sync.agents as unknown as Agent);
        } else if (sync.lead_id && sync.leads) {
          contact = buildContactFromLead(sync.leads as unknown as Lead);
        }

        if (!contact) {
          console.error('No contact data found for sync:', sync.id);
          await supabaseClient
            .from('contact_syncs')
            .update({
              status: 'failed',
              last_error_message: 'No contact data found',
              updated_at: new Date().toISOString(),
            })
            .eq('id', sync.id);
          failureCount++;
          continue;
        }

        // Sync to GHL
        const result = await syncContactToGHL(contact, ghlApiKey, ghlLocationId);

        if (result.success) {
          // Update sync record as success
          await supabaseClient
            .from('contact_syncs')
            .update({
              status: 'success',
              ghl_contact_id: result.contactId,
              first_synced_at: new Date().toISOString(),
              last_synced_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('id', sync.id);

          // Update agent or lead with GHL contact ID
          if (sync.agent_id) {
            await supabaseClient
              .from('agents')
              .update({ updated_at: new Date().toISOString() })
              .eq('id', sync.agent_id);
          } else if (sync.lead_id) {
            await supabaseClient
              .from('leads')
              .update({
                ghl_contact_id: result.contactId,
                ghl_synced_at: new Date().toISOString(),
                ghl_sync_status: 'synced',
                updated_at: new Date().toISOString(),
              })
              .eq('id', sync.lead_id);
          }

          successCount++;
          console.log(`Successfully synced contact: ${contact.email}`);
        } else {
          // Update sync record with retry
          const retryCount = (sync.retry_count || 0) + 1;
          const nextRetryAt = new Date(Date.now() + Math.pow(2, retryCount) * 60000); // Exponential backoff

          await supabaseClient
            .from('contact_syncs')
            .update({
              status: retryCount >= MAX_RETRIES ? 'failed' : 'pending',
              retry_count: retryCount,
              last_error_message: result.error || 'Unknown error',
              next_retry_at: retryCount < MAX_RETRIES ? nextRetryAt.toISOString() : null,
              updated_at: new Date().toISOString(),
            })
            .eq('id', sync.id);

          failureCount++;
          console.error(`Failed to sync contact: ${contact.email} - ${result.error}`);
        }
      } catch (error) {
        console.error('Error processing sync:', sync.id, error);
        failureCount++;
      }
    }

    console.log(`Sync complete: ${successCount} successful, ${failureCount} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        processed: pendingSyncs.length,
        successful: successCount,
        failed: failureCount,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in sync-to-ghl:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
