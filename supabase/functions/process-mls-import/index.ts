import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CSVRow {
  [key: string]: string;
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
    };

    try {
      // Parse CSV
      const rows = parseCSV(content);
      stats.rowsProcessed = rows.length;

      console.log(`Processing ${rows.length} rows from ${filename}`);

      // Process each row
      for (const row of rows) {
        try {
          // Extract listing agent data
          const listingAgent = await findOrCreateAgent(supabaseClient, {
            firstName: row['Listing Agent First Name'] || row['listing_agent_first_name'],
            lastName: row['Listing Agent Last Name'] || row['listing_agent_last_name'],
            email: row['Listing Agent Email'] || row['listing_agent_email'],
            phone: row['Listing Agent Phone'] || row['listing_agent_phone'],
            officeName: row['Listing Office'] || row['listing_office'],
            officePhone: row['Listing Office Phone'] || row['listing_office_phone'],
            state: row['State'] || row['state'] || row['Property State'] || row['property_state'],
            type: 'listing_agent',
          });

          if (listingAgent.created) stats.agentsCreated++;
          else if (listingAgent.updated) stats.agentsUpdated++;

          // Extract buyer agent data
          let buyerAgentId = null;
          if (row['Buyer Agent First Name'] || row['buyer_agent_first_name']) {
            const buyerAgent = await findOrCreateAgent(supabaseClient, {
              firstName: row['Buyer Agent First Name'] || row['buyer_agent_first_name'],
              lastName: row['Buyer Agent Last Name'] || row['buyer_agent_last_name'],
              email: row['Buyer Agent Email'] || row['buyer_agent_email'],
              phone: row['Buyer Agent Phone'] || row['buyer_agent_phone'],
              officeName: row['Buyer Office'] || row['buyer_office'],
              officePhone: row['Buyer Office Phone'] || row['buyer_office_phone'],
              state: row['State'] || row['state'] || row['Property State'] || row['property_state'],
              type: 'buyer_agent',
            });

            buyerAgentId = buyerAgent.id;
            if (buyerAgent.created) stats.agentsCreated++;
            else if (buyerAgent.updated) stats.agentsUpdated++;
          }

          // Create transaction
          const closeDate = row['Close Date'] || row['close_date'] || row['Closing Date'] || row['closing_date'];
          const price = row['Price'] || row['price'] || row['Sale Price'] || row['sale_price'];

          const { error: txError } = await supabaseClient
            .from('transactions')
            .insert({
              import_batch_id: batch.id,
              listing_agent_id: listingAgent.id,
              buyer_agent_id: buyerAgentId,
              close_date: closeDate ? new Date(closeDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              price: price ? parseFloat(price.replace(/[^0-9.-]+/g, '')) : null,
              property_address: row['Address'] || row['address'] || row['Property Address'] || row['property_address'],
              property_city: row['City'] || row['city'] || row['Property City'] || row['property_city'],
              property_state: row['State'] || row['state'] || row['Property State'] || row['property_state'],
              property_zip: row['ZIP'] || row['zip'] || row['Property ZIP'] || row['property_zip'],
              property_type: row['Property Type'] || row['property_type'],
              mls_id: row['MLS ID'] || row['mls_id'] || row['MLS #'] || row['mls_number'],
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

function parseCSV(content: string): CSVRow[] {
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const rows: CSVRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
    const row: CSVRow = {};
    
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    rows.push(row);
  }

  return rows;
}

async function findOrCreateAgent(supabaseClient: any, agentData: {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  officeName?: string;
  officePhone?: string;
  state?: string;
  type?: string;
}): Promise<{ id: string; created: boolean; updated: boolean }> {
  const { firstName, lastName, email, phone, officeName, officePhone, state, type } = agentData;
  
  // Try to find existing agent by email or phone
  let query = supabaseClient.from('agents').select('*');
  
  if (email) {
    query = query.eq('email', email);
  } else if (phone) {
    query = query.eq('phone', phone);
  } else if (firstName && lastName) {
    query = query.eq('first_name', firstName).eq('last_name', lastName);
  } else {
    // Can't identify agent, create a new one
    const fullName = [firstName, lastName].filter(Boolean).join(' ');
    const { data, error } = await supabaseClient
      .from('agents')
      .insert({
        first_name: firstName,
        last_name: lastName,
        full_name: fullName,
        email,
        phone,
        office_name: officeName,
        office_phone: officePhone,
        state,
        type,
        source: 'MLS_Just_Closed_Import',
      })
      .select()
      .single();

    if (error) throw error;
    return { id: data.id, created: true, updated: false };
  }

  const { data: existing } = await query.maybeSingle();

  if (existing) {
    // Update agent if we have new info
    const updates: any = {};
    if (firstName && !existing.first_name) updates.first_name = firstName;
    if (lastName && !existing.last_name) updates.last_name = lastName;
    if (email && !existing.email) updates.email = email;
    if (phone && !existing.phone) updates.phone = phone;
    if (officeName && !existing.office_name) updates.office_name = officeName;
    if (officePhone && !existing.office_phone) updates.office_phone = officePhone;
    if (state && !existing.state) updates.state = state;
    
    const fullName = [firstName || existing.first_name, lastName || existing.last_name].filter(Boolean).join(' ');
    if (fullName && fullName !== existing.full_name) updates.full_name = fullName;

    const hasUpdates = Object.keys(updates).length > 0;
    
    if (hasUpdates) {
      await supabaseClient
        .from('agents')
        .update(updates)
        .eq('id', existing.id);
    }

    return { id: existing.id, created: false, updated: hasUpdates };
  }

  // Create new agent
  const fullName = [firstName, lastName].filter(Boolean).join(' ');
  const { data, error } = await supabaseClient
    .from('agents')
    .insert({
      first_name: firstName,
      last_name: lastName,
      full_name: fullName,
      email,
      phone,
      office_name: officeName,
      office_phone: officePhone,
      state,
      type,
      source: 'MLS_Just_Closed_Import',
    })
    .select()
    .single();

  if (error) throw error;
  return { id: data.id, created: true, updated: false };
}
