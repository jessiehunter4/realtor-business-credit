// Status policy lookup: maps a raw MLS status to the app's internal status and
// downstream action. Unknown statuses are ingested with their raw value and
// flagged for review — never remapped onto a recognised status.

export type PolicyAction = 'lead_sync' | 'store_only' | 'suppress';

export interface PolicyEntry {
  raw_status: string;
  internal_status: string;
  action: PolicyAction;
  needs_review: boolean;
}

export async function loadStatusPolicy(db: any): Promise<Map<string, PolicyEntry>> {
  const { data } = await db.from('mls_status_policy').select('*');
  const map = new Map<string, PolicyEntry>();
  for (const row of data ?? []) map.set(String(row.raw_status).toLowerCase(), row);
  return map;
}

export async function resolveStatus(
  db: any,
  policy: Map<string, PolicyEntry>,
  rawStatus: string | null,
): Promise<PolicyEntry> {
  const key = (rawStatus ?? '').toLowerCase();
  const found = policy.get(key);
  if (found) return found;

  // Unrecognised status: record it for admin review, keep the raw value,
  // and default to storing the record without downstream outreach.
  const entry: PolicyEntry = {
    raw_status: rawStatus ?? 'unknown',
    internal_status: rawStatus ?? 'unknown',
    action: 'store_only',
    needs_review: true,
  };
  if (rawStatus) {
    await db
      .from('mls_status_policy')
      .upsert(
        {
          raw_status: rawStatus,
          internal_status: rawStatus,
          action: 'store_only',
          needs_review: true,
          notes: 'Automatically recorded from the feed. Requires an explicit mapping decision.',
        },
        { onConflict: 'raw_status' },
      );
    policy.set(key, entry);
  }
  return entry;
}
