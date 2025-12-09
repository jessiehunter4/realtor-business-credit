import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CSVRow {
  [key: string]: string;
}

interface PropertyData {
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;
  county: string | null;
  price: number | null;
  closeDate: string | null;
  daysOnMarket: number | null;
  streetNumber: string | null;
  streetDirPrefix: string | null;
  streetName: string | null;
  streetSuffix: string | null;
  fullAddress: string | null;
}

interface AgentData {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  type: string;
  property: PropertyData;
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

    // Get authenticated user
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { filename, content } = await req.json();

    // Create import batch record
    const { data: batch, error: batchError } = await supabaseClient
      .from('import_batches')
      .insert({
        filename,
        uploaded_by: user.id,
        status: 'processing',
      })
      .select()
      .single();

    if (batchError || !batch) {
      throw new Error('Failed to create import batch');
    }

    let stats = {
      rowsProcessed: 0,
      agentsCreated: 0,
      agentsUpdated: 0,
      transactionsCreated: 0,
      coListingAgentsCreated: 0,
      syncRecordsCreated: 0,
    };

    try {
      // Parse CSV
      const rows = parseCSV(content);
      stats.rowsProcessed = rows.length;

      console.log(`Processing ${rows.length} rows from ${filename}`);
      console.log('Sample headers:', Object.keys(rows[0] || {}).slice(0, 10));

      // Process each row
      for (const row of rows) {
        try {
          // Extract property data from specific MLS columns
          const propertyData = extractPropertyData(row);

          // Extract Listing Agent data
          const listingAgentData: AgentData = {
            firstName: row['ListAgentFirstName'] || null,
            lastName: row['ListAgentLastName'] || null,
            email: row['ListAgentEmail'] || null,
            phone: row['ListAgentMobilePhone'] || null,
            type: 'Listing Agent',
            property: propertyData,
          };

          // Create/update Listing Agent
          const listingAgent = await findOrCreateAgent(supabaseClient, listingAgentData);
          if (listingAgent.created) {
            stats.agentsCreated++;
            // Create contact_syncs record for new agent
            if (listingAgentData.email) {
              await createContactSync(supabaseClient, listingAgent.id);
              stats.syncRecordsCreated++;
            }
          } else if (listingAgent.updated) {
            stats.agentsUpdated++;
          }

          // Check for Co-Listing Agent
          const hasCoListingAgent = row['CoListAgentEmail'] || row['CoListAgentFirstName'];
          let coListingAgentId: string | null = null;

          if (hasCoListingAgent) {
            const coListingAgentData: AgentData = {
              firstName: row['CoListAgentFirstName'] || null,
              lastName: row['CoListAgentLastName'] || null,
              email: row['CoListAgentEmail'] || null,
              phone: row['CoListAgentMobilePhone'] || null,
              type: 'Co-Listing Agent',
              property: propertyData,
            };

            const coListingAgent = await findOrCreateAgent(supabaseClient, coListingAgentData);
            coListingAgentId = coListingAgent.id;
            
            if (coListingAgent.created) {
              stats.coListingAgentsCreated++;
              stats.agentsCreated++;
              // Create contact_syncs record for new co-listing agent
              if (coListingAgentData.email) {
                await createContactSync(supabaseClient, coListingAgent.id);
                stats.syncRecordsCreated++;
              }
            } else if (coListingAgent.updated) {
              stats.agentsUpdated++;
            }
          }

          // Create transaction
          const { error: txError } = await supabaseClient
            .from('transactions')
            .insert({
              import_batch_id: batch.id,
              listing_agent_id: listingAgent.id,
              buyer_agent_id: coListingAgentId, // Using buyer_agent_id field for co-listing agent
              close_date: propertyData.closeDate || new Date().toISOString().split('T')[0],
              price: propertyData.price,
              property_address: propertyData.fullAddress,
              property_city: propertyData.city,
              property_state: propertyData.state,
              property_zip: propertyData.zip,
              mls_id: row['ListingId'] || null,
            });

          if (!txError) {
            stats.transactionsCreated++;
          } else {
            console.error('Transaction insert error:', txError);
          }
        } catch (rowError) {
          console.error('Error processing row:', rowError);
        }
      }

      // Update batch with success
      await supabaseClient
        .from('import_batches')
        .update({
          status: 'completed',
          rows_processed: stats.rowsProcessed,
          agents_created: stats.agentsCreated,
          agents_updated: stats.agentsUpdated,
          transactions_created: stats.transactionsCreated,
        })
        .eq('id', batch.id);

      console.log('Import completed:', stats);

      return new Response(JSON.stringify({ 
        success: true, 
        batchId: batch.id,
        stats 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (processingError) {
      console.error('Processing error:', processingError);
      
      // Update batch with error
      await supabaseClient
        .from('import_batches')
        .update({
          status: 'failed',
          error_message: processingError instanceof Error ? processingError.message : String(processingError),
        })
        .eq('id', batch.id);

      throw processingError;
    }

  } catch (error) {
    console.error('Error in process-mls-import:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function extractPropertyData(row: CSVRow): PropertyData {
  // Extract only the 12 specific property fields from MLS
  const streetNumber = row['StreetNumberNumeric'] || null;
  const streetDirPrefix = row['StreetDirPrefix'] || null;
  const streetName = row['StreetName'] || null;
  const streetSuffix = row['StreetSuffix'] || null;
  
  // Build full address from components
  const addressParts = [streetNumber, streetDirPrefix, streetName, streetSuffix].filter(Boolean);
  const fullAddress = addressParts.length > 0 ? addressParts.join(' ') : null;

  // Parse price - remove any non-numeric characters
  const rawPrice = row['CurrentPrice'] || row['ClosePrice'] || null;
  const price = rawPrice ? parseFloat(rawPrice.replace(/[^0-9.-]+/g, '')) : null;

  // Parse close date
  const rawCloseDate = row['CloseDate'] || null;
  let closeDate: string | null = null;
  if (rawCloseDate) {
    try {
      const parsed = new Date(rawCloseDate);
      if (!isNaN(parsed.getTime())) {
        closeDate = parsed.toISOString().split('T')[0];
      }
    } catch {
      closeDate = null;
    }
  }

  // Parse days on market
  const rawDaysOnMarket = row['DaysOnMarket'] || null;
  const daysOnMarket = rawDaysOnMarket ? parseInt(rawDaysOnMarket, 10) : null;

  return {
    city: row['City'] || null,
    state: row['StateOrProvince'] || null,
    zip: row['PostalCode'] || null,
    country: row['Country'] || null,
    county: row['CountyOrParish'] || null,
    price: isNaN(price as number) ? null : price,
    closeDate,
    daysOnMarket: isNaN(daysOnMarket as number) ? null : daysOnMarket,
    streetNumber,
    streetDirPrefix,
    streetName,
    streetSuffix,
    fullAddress,
  };
}

function parseCSV(content: string): CSVRow[] {
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];

  // Handle quoted values properly
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    
    return result;
  };

  const headers = parseCSVLine(lines[0]);
  console.log('CSV Headers found:', headers.length, 'columns');
  
  const rows: CSVRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: CSVRow = {};
    
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    rows.push(row);
  }

  return rows;
}

async function createContactSync(supabaseClient: any, agentId: string): Promise<void> {
  try {
    const { error } = await supabaseClient
      .from('contact_syncs')
      .insert({
        agent_id: agentId,
        status: 'pending',
        retry_count: 0,
      });
    
    if (error) {
      console.error('Error creating contact_sync:', error);
    }
  } catch (err) {
    console.error('Exception creating contact_sync:', err);
  }
}

async function findOrCreateAgent(supabaseClient: any, agentData: AgentData): Promise<{ id: string; created: boolean; updated: boolean }> {
  const { firstName, lastName, email, phone, type, property } = agentData;
  
  // Try to find existing agent by email first
  let existing = null;
  
  if (email) {
    const { data } = await supabaseClient
      .from('agents')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    existing = data;
  }
  
  // If no email match, try phone
  if (!existing && phone) {
    const { data } = await supabaseClient
      .from('agents')
      .select('*')
      .eq('phone', phone)
      .maybeSingle();
    existing = data;
  }
  
  // If no phone match, try name
  if (!existing && firstName && lastName) {
    const { data } = await supabaseClient
      .from('agents')
      .select('*')
      .eq('first_name', firstName)
      .eq('last_name', lastName)
      .maybeSingle();
    existing = data;
  }

  const fullName = [firstName, lastName].filter(Boolean).join(' ');

  if (existing) {
    // Update agent with new property info (upsert behavior)
    // Always update property details for existing agents
    const updates: any = {
      // Update property details (overwrite with latest)
      property_address: property.fullAddress,
      property_city: property.city,
      property_state: property.state,
      property_zip: property.zip,
      property_country: property.country,
      property_county: property.county,
      property_price: property.price,
      property_close_date: property.closeDate,
      property_days_on_market: property.daysOnMarket,
      property_street_number: property.streetNumber,
      property_street_dir_prefix: property.streetDirPrefix,
      property_street_name: property.streetName,
      property_street_suffix: property.streetSuffix,
      updated_at: new Date().toISOString(),
    };
    
    // Only update contact info if we have new data and existing is empty
    if (firstName && !existing.first_name) updates.first_name = firstName;
    if (lastName && !existing.last_name) updates.last_name = lastName;
    if (email && !existing.email) updates.email = email;
    if (phone && !existing.phone) updates.phone = phone;
    if (fullName && fullName !== existing.full_name) updates.full_name = fullName;
    if (type && !existing.type) updates.type = type;

    await supabaseClient
      .from('agents')
      .update(updates)
      .eq('id', existing.id);

    return { id: existing.id, created: false, updated: true };
  }

  // Create new agent with property data
  const { data, error } = await supabaseClient
    .from('agents')
    .insert({
      first_name: firstName,
      last_name: lastName,
      full_name: fullName || null,
      email,
      phone,
      type,
      source: 'MLS_Just_Closed_Import',
      // Property fields
      property_address: property.fullAddress,
      property_city: property.city,
      property_state: property.state,
      property_zip: property.zip,
      property_country: property.country,
      property_county: property.county,
      property_price: property.price,
      property_close_date: property.closeDate,
      property_days_on_market: property.daysOnMarket,
      property_street_number: property.streetNumber,
      property_street_dir_prefix: property.streetDirPrefix,
      property_street_name: property.streetName,
      property_street_suffix: property.streetSuffix,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating agent:', error);
    throw error;
  }
  
  return { id: data.id, created: true, updated: false };
}
