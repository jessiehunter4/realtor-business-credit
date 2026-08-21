// Shared normalised MLS ingest service.
// Both the CSV importer and the Trestle API adapter feed this module.
// Behaviour here is a faithful extraction of the original CSV import logic.

export interface PropertyData {
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

export interface AgentData {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  type: string;
  property: PropertyData;
  agentKey?: string | null;
}

/** The normalised record contract shared by the CSV parser and the API adapter. */
export interface NormalisedRecord {
  mlsId: string | null;
  listingKey?: string | null;
  standardStatus?: string | null;
  mlsStatusRaw?: string | null;
  contractStatusChangeDate?: string | null;
  modificationTimestamp?: string | null;
  property: PropertyData;
  listingAgent: AgentData;
  coListingAgent: AgentData | null;
}

export interface IngestContext {
  sourceSystem: 'csv' | 'trestle';
  importBatchId?: string | null;
  importRunId?: string | null;
  /** Downstream action for this record's status. CSV always uses 'lead_sync'. */
  action?: 'lead_sync' | 'store_only' | 'suppress';
}

export interface IngestOutcome {
  outcome: 'created' | 'updated' | 'unchanged' | 'skipped_duplicate' | 'failed';
  agentsCreated: number;
  agentsUpdated: number;
  coListingAgentsCreated: number;
  syncRecordsCreated: number;
  agentsSkippedNoContact: number;
  statusChanged: boolean;
  reason?: string;
}

export function hasContactMethod(email: string | null, phone: string | null): boolean {
  return Boolean(email?.trim()) || Boolean(phone?.trim());
}

export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function emptyOutcome(outcome: IngestOutcome['outcome'], reason?: string): IngestOutcome {
  return {
    outcome,
    agentsCreated: 0,
    agentsUpdated: 0,
    coListingAgentsCreated: 0,
    syncRecordsCreated: 0,
    agentsSkippedNoContact: 0,
    statusChanged: false,
    reason,
  };
}

/**
 * Duplicate rule preserved from the CSV importer:
 * same property address with a close date within ±30 days.
 */
export async function isDuplicateTransaction(
  db: any,
  propertyData: PropertyData,
): Promise<boolean> {
  if (!propertyData.fullAddress || !propertyData.closeDate) return false;

  const closeDate = new Date(propertyData.closeDate);
  const windowStart = new Date(closeDate);
  windowStart.setDate(windowStart.getDate() - 30);
  const windowEnd = new Date(closeDate);
  windowEnd.setDate(windowEnd.getDate() + 30);

  const { data, error } = await db
    .from('transactions')
    .select('id')
    .eq('property_address', propertyData.fullAddress)
    .gte('close_date', windowStart.toISOString().split('T')[0])
    .lte('close_date', windowEnd.toISOString().split('T')[0])
    .limit(1);

  if (error) {
    console.error('Error checking for duplicate transaction:', error);
    return false;
  }
  return Boolean(data && data.length > 0);
}

export async function upsertContactSync(db: any, agentId: string): Promise<void> {
  try {
    const { data: existing } = await db
      .from('contact_syncs')
      .select('id')
      .eq('agent_id', agentId)
      .maybeSingle();

    if (existing) {
      await db
        .from('contact_syncs')
        .update({
          status: 'pending',
          retry_count: 0,
          last_error_message: null,
          next_retry_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);
    } else {
      await db.from('contact_syncs').insert({ agent_id: agentId, status: 'pending', retry_count: 0 });
    }
  } catch (err) {
    console.error('Exception upserting contact_sync:', err);
  }
}

/** Cancel a pending sync (used when a status policy action is 'suppress'). */
export async function suppressContactSync(db: any, agentId: string): Promise<void> {
  try {
    await db
      .from('contact_syncs')
      .update({ status: 'suppressed', next_retry_at: null, updated_at: new Date().toISOString() })
      .eq('agent_id', agentId)
      .eq('status', 'pending');
  } catch (err) {
    console.error('Exception suppressing contact_sync:', err);
  }
}

/**
 * Agent deduplication rules (unchanged):
 * 1. match by normalised email
 * 2. else match by normalised phone (digits only)
 * 3. never name-only
 */
export async function findOrCreateAgent(
  db: any,
  agentData: AgentData,
  sourceSystem: 'csv' | 'trestle' = 'csv',
): Promise<{ id: string; created: boolean; updated: boolean }> {
  const { firstName, lastName, email, phone, type, property } = agentData;

  let existing: any = null;

  if (email?.trim()) {
    const normalized = normalizeEmail(email);
    const { data } = await db.from('agents').select('*').eq('email', normalized).maybeSingle();
    existing = data;
  }

  if (!existing && phone?.trim()) {
    const normalized = normalizePhone(phone);
    const { data } = await db.from('agents').select('*').eq('phone', phone.trim()).maybeSingle();

    if (!data && normalized.length >= 10) {
      const { data: allAgentsWithPhone } = await db.from('agents').select('*').not('phone', 'is', null);
      if (allAgentsWithPhone) {
        existing =
          allAgentsWithPhone.find((a: any) => a.phone && normalizePhone(a.phone) === normalized) || null;
      }
    } else {
      existing = data;
    }
  }

  const fullName = [firstName, lastName].filter(Boolean).join(' ');

  if (existing) {
    const updates: any = {
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

    if (firstName && !existing.first_name) updates.first_name = firstName;
    if (lastName && !existing.last_name) updates.last_name = lastName;
    if (email && !existing.email) updates.email = email;
    if (phone && !existing.phone) updates.phone = phone;
    if (fullName && fullName !== existing.full_name) updates.full_name = fullName;
    if (type && !existing.type) updates.type = type;
    if (sourceSystem === 'trestle') {
      updates.last_mls_sync_at = new Date().toISOString();
      if (agentData.agentKey && !existing.trestle_list_agent_key) {
        updates.trestle_list_agent_key = agentData.agentKey;
      }
    }

    await db.from('agents').update(updates).eq('id', existing.id);
    return { id: existing.id, created: false, updated: true };
  }

  const { data, error } = await db
    .from('agents')
    .insert({
      first_name: firstName,
      last_name: lastName,
      full_name: fullName || null,
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      type,
      source: 'MLS_Just_Closed_Import',
      source_system: sourceSystem,
      trestle_list_agent_key: agentData.agentKey ?? null,
      last_mls_sync_at: sourceSystem === 'trestle' ? new Date().toISOString() : null,
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

/**
 * Ingest a single normalised record through the established framework.
 * Creates or updates the transaction, upserts the agents, and applies the
 * downstream action (CRM sync queue) for the record's status.
 */
export async function ingestNormalisedRecord(
  db: any,
  record: NormalisedRecord,
  ctx: IngestContext,
): Promise<IngestOutcome> {
  const action = ctx.action ?? 'lead_sync';
  const property = record.property;

  // Locate an existing transaction by stable identifier (API path only).
  let existingTx: any = null;
  if (record.listingKey) {
    const { data } = await db
      .from('transactions')
      .select('*')
      .eq('source_system', ctx.sourceSystem)
      .eq('listing_key', record.listingKey)
      .maybeSingle();
    existingTx = data;
  }

  if (!existingTx) {
    // Preserve the CSV ±30 day duplicate gate for records without a stable key.
    if (!record.listingKey && (await isDuplicateTransaction(db, property))) {
      return emptyOutcome('skipped_duplicate', 'duplicate address within 30 days');
    }
  }

  const stats = emptyOutcome('created');

  // --- Listing agent ---
  const listingAgent = await findOrCreateAgent(db, record.listingAgent, ctx.sourceSystem);
  if (listingAgent.created) stats.agentsCreated++;
  else if (listingAgent.updated) stats.agentsUpdated++;

  const listingHasContact = hasContactMethod(record.listingAgent.email, record.listingAgent.phone);

  // --- Co-listing agent ---
  let coListingAgentId: string | null = null;
  if (record.coListingAgent && hasContactMethod(record.coListingAgent.email, record.coListingAgent.phone)) {
    const coAgent = await findOrCreateAgent(db, record.coListingAgent, ctx.sourceSystem);
    coListingAgentId = coAgent.id;
    if (coAgent.created) {
      stats.coListingAgentsCreated++;
      stats.agentsCreated++;
    } else if (coAgent.updated) {
      stats.agentsUpdated++;
    }
  }

  // --- Downstream action driven by the record status policy ---
  if (action === 'lead_sync') {
    if (listingHasContact) {
      await upsertContactSync(db, listingAgent.id);
      stats.syncRecordsCreated++;
    } else {
      stats.agentsSkippedNoContact++;
    }
    if (coListingAgentId) {
      await upsertContactSync(db, coListingAgentId);
      stats.syncRecordsCreated++;
    }
  } else if (action === 'suppress') {
    await suppressContactSync(db, listingAgent.id);
    if (coListingAgentId) await suppressContactSync(db, coListingAgentId);
  }

  const statusChanged =
    Boolean(existingTx) && existingTx.standard_status !== (record.standardStatus ?? null);

  const payload: Record<string, unknown> = {
    listing_agent_id: listingAgent.id,
    buyer_agent_id: coListingAgentId,
    price: property.price,
    property_address: property.fullAddress,
    property_city: property.city,
    property_state: property.state,
    property_zip: property.zip,
    mls_id: record.mlsId,
    source_system: ctx.sourceSystem,
    listing_key: record.listingKey ?? null,
    listing_id: record.mlsId,
    standard_status: record.standardStatus ?? null,
    mls_status_raw: record.mlsStatusRaw ?? record.standardStatus ?? null,
    contract_status_change_date: record.contractStatusChangeDate ?? null,
    modification_timestamp: record.modificationTimestamp ?? null,
    import_run_id: ctx.importRunId ?? null,
  };

  // Never blank an existing close date with a missing API value.
  if (property.closeDate) payload.close_date = property.closeDate;
  else if (!existingTx && ctx.sourceSystem === 'csv') {
    payload.close_date = new Date().toISOString().split('T')[0];
  }

  if (existingTx) {
    if (statusChanged) {
      payload.previous_status = existingTx.standard_status;
      payload.status_changed_at = new Date().toISOString();
    }
    const { error } = await db.from('transactions').update(payload).eq('id', existingTx.id);
    if (error) {
      console.error('Transaction update error:', error);
      return { ...stats, outcome: 'failed', reason: error.message };
    }
    if (statusChanged) {
      await db.from('mls_status_history').insert({
        transaction_id: existingTx.id,
        listing_key: record.listingKey ?? null,
        listing_id: record.mlsId,
        old_status: existingTx.standard_status,
        new_status: record.standardStatus ?? 'unknown',
        action_taken: action,
        run_id: ctx.importRunId ?? null,
      });
    }
    return { ...stats, outcome: statusChanged ? 'updated' : 'unchanged', statusChanged };
  }

  payload.import_batch_id = ctx.importBatchId ?? null;
  const { data: inserted, error } = await db.from('transactions').insert(payload).select('id').single();
  if (error) {
    console.error('Transaction insert error:', error);
    return { ...stats, outcome: 'failed', reason: error.message };
  }

  if (record.standardStatus) {
    await db.from('mls_status_history').insert({
      transaction_id: inserted.id,
      listing_key: record.listingKey ?? null,
      listing_id: record.mlsId,
      old_status: null,
      new_status: record.standardStatus,
      action_taken: action,
      run_id: ctx.importRunId ?? null,
    });
  }

  return { ...stats, outcome: 'created' };
}
