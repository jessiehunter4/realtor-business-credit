// Manual CSV MLS import (retained as a fallback alongside the Trestle API feed).
// Parsing lives here; all downstream processing is the shared ingest service.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { requireAdmin } from '../_shared/requireAdmin.ts';
import {
  ingestNormalisedRecord,
  type AgentData,
  type NormalisedRecord,
  type PropertyData,
} from '../_shared/mls/ingest.ts';

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
    const guard = await requireAdmin(req);
    if (guard instanceof Response) return guard;

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const userId = guard.userId;
    const { filename, content } = await req.json();

    const { data: batch, error: batchError } = await supabaseClient
      .from('import_batches')
      .insert({ filename, uploaded_by: userId, status: 'processing' })
      .select()
      .single();

    if (batchError || !batch) {
      throw new Error('Failed to create import batch');
    }

    const stats = {
      rowsProcessed: 0,
      agentsCreated: 0,
      agentsUpdated: 0,
      transactionsCreated: 0,
      transactionsSkippedDuplicate: 0,
      coListingAgentsCreated: 0,
      syncRecordsCreated: 0,
      agentsSkippedNoContact: 0,
    };

    try {
      const rows = parseCSV(content);
      stats.rowsProcessed = rows.length;

      console.log(`Processing ${rows.length} rows from ${filename}`);

      for (const row of rows) {
        try {
          const record = normaliseRow(row);

          const result = await ingestNormalisedRecord(supabaseClient, record, {
            sourceSystem: 'csv',
            importBatchId: batch.id,
            action: 'lead_sync',
          });

          if (result.outcome === 'skipped_duplicate') {
            stats.transactionsSkippedDuplicate++;
            continue;
          }
          if (result.outcome === 'created') stats.transactionsCreated++;

          stats.agentsCreated += result.agentsCreated;
          stats.agentsUpdated += result.agentsUpdated;
          stats.coListingAgentsCreated += result.coListingAgentsCreated;
          stats.syncRecordsCreated += result.syncRecordsCreated;
          stats.agentsSkippedNoContact += result.agentsSkippedNoContact;
        } catch (rowError) {
          console.error('Error processing row:', rowError);
        }
      }

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

      return new Response(JSON.stringify({ success: true, batchId: batch.id, stats }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (processingError) {
      console.error('Processing error:', processingError);

      await supabaseClient
        .from('import_batches')
        .update({
          status: 'failed',
          error_message:
            processingError instanceof Error ? processingError.message : String(processingError),
        })
        .eq('id', batch.id);

      throw processingError;
    }
  } catch (error) {
    console.error('Error in process-mls-import:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});

/** CSV row → the shared normalised record contract. */
function normaliseRow(row: CSVRow): NormalisedRecord {
  const property = extractPropertyData(row);

  const listingAgent: AgentData = {
    firstName: row['ListAgentFirstName'] || null,
    lastName: row['ListAgentLastName'] || null,
    email: row['ListAgentEmail'] || null,
    phone: row['ListAgentMobilePhone'] || null,
    type: 'Listing Agent',
    property,
  };

  const coListEmail = row['CoListAgentEmail'] || null;
  const coListPhone = row['CoListAgentMobilePhone'] || null;
  const coListingAgent: AgentData | null =
    coListEmail?.trim() || coListPhone?.trim()
      ? {
          firstName: row['CoListAgentFirstName'] || null,
          lastName: row['CoListAgentLastName'] || null,
          email: coListEmail,
          phone: coListPhone,
          type: 'Co-Listing Agent',
          property,
        }
      : null;

  return {
    mlsId: row['ListingId'] || null,
    listingKey: null,
    standardStatus: row['StandardStatus'] || null,
    mlsStatusRaw: row['MlsStatus'] || row['StandardStatus'] || null,
    property,
    listingAgent,
    coListingAgent,
  };
}

function extractPropertyData(row: CSVRow): PropertyData {
  const streetNumber = row['StreetNumberNumeric'] || null;
  const streetDirPrefix = row['StreetDirPrefix'] || null;
  const streetName = row['StreetName'] || null;
  const streetSuffix = row['StreetSuffix'] || null;

  const addressParts = [streetNumber, streetDirPrefix, streetName, streetSuffix].filter(Boolean);
  const fullAddress = addressParts.length > 0 ? addressParts.join(' ') : null;

  const rawPrice = row['CurrentPrice'] || row['ClosePrice'] || null;
  const price = rawPrice ? parseFloat(rawPrice.replace(/[^0-9.-]+/g, '')) : null;

  const rawCloseDate = row['CloseDate'] || null;
  let closeDate: string | null = null;
  if (rawCloseDate) {
    try {
      const parsed = new Date(rawCloseDate);
      if (!isNaN(parsed.getTime())) closeDate = parsed.toISOString().split('T')[0];
    } catch {
      closeDate = null;
    }
  }

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
  const lines = content.split('\n').filter((line) => line.trim());
  if (lines.length < 2) return [];

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
