# MLS API Migration: CSV → Cotality Trestle (RE Pro Business Credit)

## 1. Discovery: what this app actually does with MLS data

This app is **not** a listings/IDX site. It is a lead-generation funnel:

- Admin uploads an MLS "just closed" CSV at `/admin/mls-import` → `process-mls-import` edge function.
- Each row creates/updates an **agent** (the lead), a **transaction** (the closed sale), and a **contact_sync** row that the `sync-to-ghl` cron pushes into EveryCatch/GoHighLevel with Just-Closed tags.
- Property fields live denormalised on the agent record (address, city, state, zip, county, price, close date, DOM) so GHL merge fields can reference them.
- Dedup: agents by normalised email → normalised phone (never name-only); transactions by full address + close date ±30 days.
- No public listing pages, no photos, no slugs, no approval workflow, no IDX display of MLS data to anonymous users.

**Consequence:** roughly a third of the brief (public compliance display, Coming Soon badges, image references, address-display permission, booking/showing gates, slugs/redirects, sanitised public views) has **no surface in this app**. Those requirements are satisfied by "MLS data is never exposed anonymously" rather than by building display-compliance machinery. Everything about auth, pagination, watermarks, identity, field ownership, scheduling, kill switches, limits, run history and the R-1…R-26 defect list **does** apply and will be built.

The other real difference: the reference app polls **active rentals**; this app needs **closed sales** (`StandardStatus eq 'Closed'`, ordered by `CloseDate`/`ModificationTimestamp`) with agent contact fields — a different Trestle entitlement question (see §8).

## 2. Target architecture

Server-side only, modular, under `supabase/functions/`:

```text
_shared/trestle/
  auth.ts        OAuth2 client-credentials, cached token, single 401 re-auth
  client.ts      OData GET, $select/$filter/$top, nextLink paging, timeouts,
                 retry+jitter, 429 Retry-After, circuit breaker
  adapter.ts     Property JSON -> internal ClosedSale model
  eligibility.ts ZIP allow-list, status, close-date window, contact-method rule
  identity.ts    ListingKey/ListingId keying, agent match rules (reuse CSV rules)
  ownership.ts   field-ownership diff (MLS vs app vs admin owned)
trestle-test-connection/   admin-only read-only probe
trestle-preview-run/       admin-only dry run, zero writes
trestle-sync-agents/       the worker (mode: new | update | reconcile)
trestle-scheduler/         pg_cron tick -> claims due jobs by lease
```

No browser ever calls Cotality. `TRESTLE_CLIENT_ID` / `TRESTLE_CLIENT_SECRET` stored as backend secrets only.

## 3. Migrations (additive, nothing destructive)

- `mls_source_jobs` — name, enabled, zip group ref, interval_hours, allowed statuses, close-date lookback days, min/max price, `import_new`, `update_existing`, `daily_new_limit`, `watermark_committed`, `watermark_proposed`, `next_sync_at`, `lease_owner`, `lease_expires_at`.
- `mls_zip_groups` / `mls_zips` — town/city, CA county, 5-digit ZIP, enabled, notes. Single source of truth for filtering.
- `mls_settings` — master kill switch, global new/update toggles, page size, timeouts, retry/backoff, circuit-breaker thresholds, timezone (`America/Los_Angeles`), source mode (`csv_only` | `api_preview` | `api_writes` | `api_authoritative`). All changes audited.
- `mls_sync_runs` — job, trigger, mode, status, scheduled/started/completed, window + prior/proposed/committed watermark, pages, expected/fetched/processed, created/updated/unchanged/rejected/deferred/failed, API calls, 429s, wait time, sanitised error.
- `mls_sync_records` — run, `listing_key`, `listing_id`, action, outcome, eligibility/rejection reason, changed fields, sanitised error, retry state, resolution notes.
- `mls_settings_audit` — actor, time, old, new.
- `agents`: add `source_system`, `trestle_list_agent_key`, `mls_agent_mls_id`, `last_mls_sync_at`.
- `transactions`: add `source_system` (`csv` default), `listing_key`, `listing_id`, `modification_timestamp`; **unique index on (source_system, listing_key)** partial where listing_key is not null. Existing CSV rows keep working; a backfill report matches CSV rows to `listing_id` (from existing `mls_id`) and lists unmatched/ambiguous rows for review — no automatic merging.

All new tables: service-role writes only, admin-only SELECT via `has_role(auth.uid(),'admin')`, explicit GRANTs, RLS on, no anon grants.

## 4. Field mapping (Trestle Property → target)

`$select` is explicit and every selected field is mapped; nothing assumed.

| Trestle | Target |
|---|---|
| `ListingKey` / `ListingId` | `transactions.listing_key` / `listing_id` (+ legacy `mls_id`) |
| `UnparsedAddress` or street parts | `property_address` / street components |
| `City`, `StateOrProvince`, `PostalCode`, `CountyOrParish`, `Country` | matching property columns |
| `ClosePrice` (fallback `ListPrice`) | `price` / `property_price` |
| `CloseDate`, `DaysOnMarket` | `close_date`, `property_days_on_market` |
| `StandardStatus`, `MlsStatus`, `ModificationTimestamp` | lifecycle + watermark |
| `ListAgentFirstName/LastName/Email/MobilePhone/StateLicense/Key` | listing agent record |
| `ListOfficeName`, `ListOfficePhone` | `office_name`, `office_phone` |
| `CoListAgent*` | co-listing agent (same rules as CSV path) |
| `BuyerAgent*` (if entitled) | buyer agent — new lead source, off by default |

**Ownership matrix:** MLS-owned = property/transaction facts + agent name/office. App-owned = `sms_eligible`, `source`, funnel state, `contact_syncs`, plan/portal data — never overwritten. Admin-owned = manual corrections (flagged, respected). Derived = `full_name`, normalised phone/email. Legacy = CSV-origin rows, untouched unless matched by `listing_key`. Updates diff normalised values and never null out a populated field.

## 5. Status handling

Only `Closed` (and, if configured, `Leased`) produces a lead. Every other returned status (`Active`, `Pending`, `Cancelled`, `Expired`, `Withdrawn`, `Hold`, `Incomplete`, `Deleted`, …) is recorded with a rejection reason and creates no lead. **Unknown status fails closed**: no write, run flagged, visible admin error requiring explicit mapping. A retracted/cancelled sale after import suppresses further GHL sync rather than deleting the agent.

## 6. Sync mechanics

- **Pagination:** provider-limit page size, follow `@odata.nextLink`, `$count=true` where supported, deterministic order by `ModificationTimestamp,ListingKey`, dedupe across pages, persist page progress for resume, expected vs processed reconciliation — mismatch ⇒ run marked partial and the watermark does **not** advance.
- **Incremental:** per-job committed watermark on `ModificationTimestamp` with a configurable overlap window; idempotent upserts make overlap safe. Separate admin-triggered full reconciliation mode.
- **Scheduler:** cron ticks frequently, runs a job only when `next_sync_at` is due; `next_sync_at` always advances on every outcome (success, partial, failure with backoff); atomic lease claim, stale-lease recovery, no overlap, kill switch re-read between pages, DST-safe via `America/Los_Angeles` (never a fixed −08:00).
- **Daily limit:** transactional count of committed *new* agents/transactions per day in the configured timezone; updates don't count; excess deterministically deferred; 0 = none.
- **Images: entirely excluded.** The Media endpoint is never queried, no binaries fetched, nothing stored or re-hosted.

## 7. Admin UI

`/admin/mls` with tabs: **Settings** (kill switch, new/update toggles, daily limit, interval hours, mode, rate/timeout config), **ZIP Groups**, **Jobs**, **Activity** (run history + per-record drill-down, retry failures), **Manual actions** (Test API connection, Preview next run, Run new import now, Run updates now, Full reconciliation with confirmation). The existing CSV upload page stays, relabelled **Legacy CSV import**, and is disabled automatically once mode is `api_authoritative`.

## 8. Blockers to resolve before any live call

1. Trestle **client ID/secret** for this app (I'll request them as secrets when we implement).
2. Confirmation the entitlement covers **closed sales with agent contact fields** (`ListAgentEmail`, `ListAgentMobilePhone`) — the reference app only proved active rentals.
3. Whether **marketing/solicitation use of agent contact data** from the feed is permitted under the CRMLS/Cotality agreement — this is the highest-risk item, since the whole funnel texts and emails these agents.
4. Official rate limits, page size, polling frequency, deleted-record support, sandbox vs production. Automation stays OFF until documented.

## 9. Delivery phases

1. Migrations + admin UI shell + settings/audit, automation OFF.
2. Trestle client, auth, Test connection (read-only).
3. Preview run: paging, mapping, eligibility, CSV parity report — zero writes.
4. Controlled new leads: one ZIP group, low daily limit, manual trigger.
5. Controlled updates with diffs and ownership.
6. Scheduler + alerts, enabled only after §8 is resolved.
7. CSV reconciliation and cutover decision.

An R-1…R-26 remediation matrix with file-level evidence ships at the end of phase 6.
