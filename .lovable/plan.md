# Automatic Cotality Trestle MLS Ingestion (replacing the manual CSV step)

Revised per the updated brief: **no image work at all**, **every MLS status is retrieved and ingested**, and a **re-poll loop that detects status changes on existing records and updates them**.

## 1. Current CSV ingestion path (audit)

`/admin/mls-import` reads the file in the browser and posts `{ filename, content }` to the `process-mls-import` edge function (admin-guarded). That single function does everything:

1. `parseCSV(content)` → array of raw header→value rows.
2. `extractPropertyData(row)` → normalised property object: `city, state, zip, country, county, price, closeDate, daysOnMarket, streetNumber, streetDirPrefix, streetName, streetSuffix, fullAddress` (address assembled from the four street parts; price from `CurrentPrice`/`ClosePrice`; date coerced to `YYYY-MM-DD`).
3. Duplicate gate: same `property_address` with a `close_date` within ±30 days ⇒ whole row skipped.
4. `findOrCreateAgent()` for `ListAgentFirstName/LastName/Email/MobilePhone` (type `Listing Agent`), and for `CoListAgent*` only when an email or phone exists. Match order: normalised email → normalised phone. **Never name-only.** Existing agents get property fields overwritten; contact fields only fill blanks.
5. `upsertContactSync(agentId)` queues the agent for `sync-to-ghl` (Just-Closed tagging) whenever email or phone exists.
6. `transactions` insert with `mls_id`, close date, price, address parts, listing/co-listing agent ids, `import_batch_id`.
7. Stats rolled up onto `import_batches`; per-row failures only `console.error`.

**Normalised contract to reuse:** `{ property: PropertyData, listingAgent: AgentData, coListingAgent: AgentData | null, mlsId }`, processed one record at a time.

**Smallest safe refactor:** move steps 3–7 verbatim into `supabase/functions/_shared/mlsIngest.ts` exporting `ingestNormalisedRecord(db, record, ctx)`. `process-mls-import` keeps only CSV parsing and calls it; the Trestle adapter calls the same function. Zero behaviour change on the CSV path.

```text
CSV parser ──────────────┐
                         ├─→ ingestNormalisedRecord() → agents / transactions / contact_syncs → GHL
Trestle API adapter ─────┘
```

## 2. Architecture (new server-side modules)

```text
_shared/mlsIngest.ts          extracted existing import contract (shared)
_shared/trestle/auth.ts       OAuth2 client-credentials, cached token, single 401 retry
_shared/trestle/client.ts     OData GET, $select/$filter/$orderby, nextLink paging,
                              timeout, bounded retry + jitter, Retry-After, circuit breaker
_shared/trestle/adapter.ts    Property JSON → the normalised contract above
_shared/trestle/eligibility.ts ZIP allow-list + in-memory numeric filters (never status)
trestle-test-connection/      admin only, read-only
trestle-preview-run/          admin only, zero writes, CSV-parity diff
trestle-ingest/               worker: mode = new | update | reconcile
trestle-scheduler/            pg_cron tick → atomic due-job claim by lease
```

Secrets `TRESTLE_CLIENT_ID` / `TRESTLE_CLIENT_SECRET` server-side only; no browser ever touches Cotality; no Media endpoint, no image binaries, no storage, no `x-region`.

## 3. Status handling — all statuses in, action decided downstream

- `$filter` contains **ZIP only**. No status filter anywhere in the query, job config or ingestion gate.
- Raw `StandardStatus` (and `MlsStatus` if present) is stored verbatim on the transaction alongside `ContractStatusChangeDate`.
- A new admin-managed `mls_status_policy` table maps each raw status to an internal status plus the downstream action for this app: `lead_sync` (queue the agent to GHL, today's Just-Closed behaviour), `store_only` (record kept, no outreach), or `suppress` (record kept, any pending sync cancelled).
- Seeded defaults, all editable in the admin UI before anything runs: `Closed` and `Leased` → `lead_sync`; `Active`, `Active Under Contract`, `Pending`, `Coming Soon`, `Hold`, `Withdrawn`, `Cancelled`/`Canceled`, `Expired`, `Incomplete` → `store_only`; `Deleted` → `suppress`.
- **Unknown status is never remapped.** The record is still ingested with its raw value, its action defaults to `store_only`, and an admin alert requires an explicit mapping decision.

## 4. Re-poll and status-change detection

The `update` mode is a first-class job, independent of `new`:

1. Query `Property` with the ZIP filter plus `ModificationTimestamp gt <committed watermark - overlap>`, ordered by `ModificationTimestamp,ListingKey`.
2. Match each record by `(source_system,'trestle', listing_key)`, falling back to `listing_id`.
3. Diff normalised values; write only changed MLS-owned fields; never null out a populated value.
4. When `standard_status` changes: write `previous_status`, `status_changed_at`, append a `mls_status_history` row, and apply the policy action for the new status (e.g. Active → Closed queues the agent for the Just-Closed sequence exactly as a CSV import would; Closed → Cancelled suppresses a pending sync).
5. A **reconciliation** mode (manual, confirmed) re-polls the full ZIP population regardless of watermark to catch records whose modification was missed. Absence from an incremental response is never treated as deletion.

## 5. Trestle `$select` (minimum needed for this contract)

`ListingKey, ListingId, StandardStatus, MlsStatus, ModificationTimestamp, ContractStatusChangeDate, CloseDate, ClosePrice, ListPrice, DaysOnMarket, StreetNumberNumeric, StreetDirPrefix, StreetName, StreetSuffix, UnparsedAddress, City, StateOrProvince, PostalCode, CountyOrParish, Country, PropertyType, PropertySubType, ListAgentFirstName, ListAgentLastName, ListAgentEmail, ListAgentMobilePhone, ListAgentStateLicense, ListAgentKey, ListOfficeName, ListOfficePhone, CoListAgentFirstName, CoListAgentLastName, CoListAgentEmail, CoListAgentMobilePhone`

Mapping (Trestle → existing CSV field → normalised field): `ClosePrice`/`ListPrice` → `CurrentPrice` → `price`; `CloseDate` → `CloseDate` → `closeDate` (null for non-closed statuses — never manufactured); street parts map 1:1 and, when absent, `UnparsedAddress` is used for `fullAddress`; agent/co-agent fields map 1:1 to the existing names. Nothing is referenced in the mapper unless it is in `$select`.

## 6. Database changes (additive only, ingestion-scoped)

- `mls_import_jobs` — name, enabled, zip group, interval_hours, `import_new`, `update_existing`, `daily_new_limit`, bed/price min-max, optional max DOM, `watermark_committed`, `watermark_proposed`, `last_run_at`, `next_sync_at`, `lease_owner`, `lease_expires_at`.
- `mls_zip_groups` / `mls_zips` — city/town, CA county, five-digit ZIP, enabled, note. Single source of truth.
- `mls_settings` — master kill switch, global new/update toggles, page size, concurrency, timeout, retries, backoff, circuit-breaker, timezone `America/Los_Angeles`.
- `mls_status_policy` — raw status, internal status, action, needs_review, notes.
- `mls_status_history` — transaction, old status, new status, changed_at, run id.
- `mls_import_runs` — job, trigger, mode, status, scheduled/started/completed/elapsed, filters + ZIP groups used, window and watermarks, pages expected/received, counts (reported, fetched, accepted, filtered, created, updated, unchanged, deferred, failed), API request count, 429s, provider wait, sanitised error, next run.
- `mls_import_record_errors` — run, `listing_key`/`listing_id`, stage, intended action, outcome, filter/rejection reason, error category + sanitised message, retry count, next retry, admin-action-required flag.
- `mls_settings_audit` — actor, time, old, new.
- `transactions`: add `source_system` (default `csv`), `listing_key`, `listing_id`, `standard_status`, `mls_status_raw`, `previous_status`, `status_changed_at`, `contract_status_change_date`, `modification_timestamp`, `import_run_id`; **unique index on `(source_system, listing_key)` where `listing_key is not null`**; make `close_date` nullable for non-closed statuses.
- `agents`: add `source_system`, `trestle_list_agent_key`, `last_mls_sync_at`.
- Backfill report (read-only) matching existing CSV rows to `listing_id` via the current `mls_id`, listing unmatched/ambiguous rows for review — no automatic merging.

All new tables: RLS on, admin-only read via `has_role(auth.uid(),'admin')`, writes service-role only, explicit GRANTs, no anon grants.

## 7. Admin UI — `/admin/mls`

Tabs: **Settings** (master kill switch, new/update toggles, interval hours, daily new-record limit with used/remaining, page size, timeouts, retries), **ZIP Groups**, **Jobs** (per-job filters, schedule, watermark, next run), **Status Policy** (raw status → internal status + action, unmapped statuses highlighted), **Activity** (run history with filtering by date/job/result/ZIP group/identifier/action/error category, drill-down to record errors, retry eligible failures), **Manual actions** (Test API connection, Preview next ingestion, Import new now, Update existing now, Full reconciliation with confirmation). The CSV uploader stays exactly as-is, relabelled **Manual CSV import (fallback)**.

## 8. Scheduler, limits, resilience

`next_sync_at` is recomputed and persisted after **every** outcome (success, partial, failure, skip, cancel) — the reference defect is not reproduced. Atomic lease claim, stale-lease recovery, no overlap, kill switch re-read between pages, UTC storage with IANA timezone maths (no fixed offset). Daily new-record limit counted transactionally on committed new records only, updates excluded, excess deferred deterministically, 0 = none. Every request timed out; 400 no-retry, 401 re-auth once, 403 entitlement report, 429 honours `Retry-After`, 5xx/408 bounded backoff with jitter, circuit breaker on repeated failure. Page progress persisted for resume; expected vs processed mismatch marks the run partial and the watermark does not advance.

## 9. Deliberately not ported

Public listing pages, property search, photo/media pipeline, `rehostListingPhotos()`, `x-region: us-west-1`, storage buckets, display-compliance UI, retention/`computed_status` client-side logic, campaign automation, listing approval workflow, and the reference schema. No downstream RE Pro behaviour (plans, portal, funnel, GHL tagging rules) is redesigned.

## 10. Blockers before automation is switched on

1. `TRESTLE_CLIENT_ID` / `TRESTLE_CLIENT_SECRET` for this app.
2. Confirmation the entitlement returns **agent contact fields** (`ListAgentEmail`, `ListAgentMobilePhone`) — the reference app only proved rental property data.
3. Whether outreach to agents sourced from the feed is permitted under the CRMLS/Cotality agreement — the whole funnel emails and texts these agents.
4. Official rate limits, max page size, permitted polling frequency, `Retry-After` guidance, the exact `StandardStatus` value set for this entitlement, deleted-record handling, sandbox vs production.

Automation stays OFF until 1–4 are resolved.

## 11. Phases and rollback

1. Refactor the shared ingest service (no behaviour change) + additive migrations, everything OFF.
2. Trestle client, OAuth, Test connection (read-only).
3. Preview run: pagination, mapping, filters, CSV-parity diff — zero writes.
4. Controlled writes: one small ZIP group, low daily limit, manual trigger, new records then updates.
5. Automation and alerts, only after §10.
6. Reconciliation and an explicit decision on retiring the CSV uploader.

Rollback at any phase: flip the master kill switch (stops all API work instantly), and the CSV path plus all existing records remain untouched because every migration is additive.
