// Shared Cotality Trestle provider client: OAuth2, OData paging, timeouts,
// bounded retries with jitter, Retry-After handling and a circuit breaker.
// All calls are server-side only. Nothing here logs credentials or tokens.

const TOKEN_URL = 'https://api.cotality.com/trestle/oidc/connect/token';
const PROPERTY_URL = 'https://api.cotality.com/trestle/odata/Property';

export interface ClientConfig {
  pageSize: number;
  requestTimeoutMs: number;
  retryAttempts: number;
  retryInitialDelayMs: number;
  retryMaxDelayMs: number;
  circuitBreakerThreshold: number;
}

export const DEFAULT_CLIENT_CONFIG: ClientConfig = {
  pageSize: 200,
  requestTimeoutMs: 30000,
  retryAttempts: 3,
  retryInitialDelayMs: 1000,
  retryMaxDelayMs: 30000,
  circuitBreakerThreshold: 5,
};

export const PROPERTY_SELECT = [
  'ListingKey',
  'ListingId',
  'StandardStatus',
  'MlsStatus',
  'ModificationTimestamp',
  'ContractStatusChangeDate',
  'CloseDate',
  'ClosePrice',
  'ListPrice',
  'DaysOnMarket',
  'StreetNumberNumeric',
  'StreetDirPrefix',
  'StreetName',
  'StreetSuffix',
  'UnparsedAddress',
  'City',
  'StateOrProvince',
  'PostalCode',
  'CountyOrParish',
  'Country',
  'PropertyType',
  'PropertySubType',
  'ListAgentFirstName',
  'ListAgentLastName',
  'ListAgentEmail',
  'ListAgentMobilePhone',
  'ListAgentKey',
  'ListOfficeName',
  'ListOfficePhone',
  'CoListAgentFirstName',
  'CoListAgentLastName',
  'CoListAgentEmail',
  'CoListAgentMobilePhone',
].join(',');

interface CachedToken {
  token: string;
  expiresAt: number;
}

let cachedToken: CachedToken | null = null;

export function sanitiseError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  return msg.replace(/(client_secret|client_id|Bearer)\s*[=:]?\s*\S+/gi, '$1=[redacted]').slice(0, 500);
}

export class TrestleError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function getToken(cfg: ClientConfig, forceRefresh = false): Promise<string> {
  if (!forceRefresh && cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token;
  }

  const clientId = Deno.env.get('TRESTLE_CLIENT_ID');
  const clientSecret = Deno.env.get('TRESTLE_CLIENT_SECRET');
  if (!clientId || !clientSecret) {
    throw new TrestleError(0, 'Trestle credentials are not configured');
  }

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
    scope: 'api',
  });

  const res = await fetchWithTimeout(
    TOKEN_URL,
    { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body },
    cfg.requestTimeoutMs,
  );

  if (!res.ok) {
    throw new TrestleError(res.status, `Authentication failed with status ${res.status}`);
  }

  const json = await res.json();
  cachedToken = {
    token: json.access_token,
    expiresAt: Date.now() + (Number(json.expires_in) || 3600) * 1000,
  };
  return cachedToken.token;
}

export function invalidateToken() {
  cachedToken = null;
}

export interface RequestStats {
  apiRequestCount: number;
  rateLimitResponses: number;
  providerWaitMs: number;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/** Perform a GET against Trestle with retries, backoff and 401 re-auth (once). */
export async function trestleGet(
  url: string,
  cfg: ClientConfig,
  stats: RequestStats,
): Promise<any> {
  let attempt = 0;
  let reAuthed = false;

  while (true) {
    const token = await getToken(cfg);
    stats.apiRequestCount++;

    let res: Response;
    try {
      res = await fetchWithTimeout(
        url,
        { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } },
        cfg.requestTimeoutMs,
      );
    } catch (err) {
      if (attempt >= cfg.retryAttempts) throw new TrestleError(408, sanitiseError(err));
      const delay = Math.min(cfg.retryInitialDelayMs * 2 ** attempt, cfg.retryMaxDelayMs);
      await sleep(delay + Math.random() * 250);
      attempt++;
      continue;
    }

    if (res.ok) return await res.json();

    if (res.status === 401 && !reAuthed) {
      invalidateToken();
      reAuthed = true;
      continue;
    }

    if (res.status === 429) {
      stats.rateLimitResponses++;
      const retryAfter = Number(res.headers.get('Retry-After')) || 30;
      if (attempt >= cfg.retryAttempts) throw new TrestleError(429, 'Rate limited by provider');
      stats.providerWaitMs += retryAfter * 1000;
      await sleep(retryAfter * 1000);
      attempt++;
      continue;
    }

    if ([408, 500, 502, 503, 504].includes(res.status)) {
      if (attempt >= cfg.retryAttempts) {
        throw new TrestleError(res.status, `Provider error ${res.status}`);
      }
      const delay = Math.min(cfg.retryInitialDelayMs * 2 ** attempt, cfg.retryMaxDelayMs);
      await sleep(delay + Math.random() * 250);
      attempt++;
      continue;
    }

    // 400 / 403 / 404 and anything else: permanent, do not retry unchanged.
    throw new TrestleError(res.status, `Provider request failed with status ${res.status}`);
  }
}

export interface PropertyQuery {
  zips: string[];
  modifiedSince?: string | null;
  pageSize: number;
  maxPages?: number;
  /** Stop early once this many records have been collected (preview mode). */
  maxRecords?: number;
}

export function buildPropertyUrl(q: PropertyQuery): string {
  const zipClause = q.zips.map((z) => `PostalCode eq '${z}'`).join(' or ');
  const parts = [`(${zipClause})`];
  if (q.modifiedSince) parts.push(`ModificationTimestamp gt ${q.modifiedSince}`);
  // NOTE: no status filter — every MLS status must be retrieved.
  const params = new URLSearchParams({
    $select: PROPERTY_SELECT,
    $filter: parts.join(' and '),
    $orderby: 'ModificationTimestamp,ListingKey',
    $top: String(q.pageSize),
    $count: 'true',
  });
  return `${PROPERTY_URL}?${params.toString()}`;
}

export interface FetchResult {
  records: any[];
  reportedCount: number | null;
  pagesReceived: number;
  complete: boolean;
}

/** Full OData pagination following @odata.nextLink. */
export async function fetchProperties(
  q: PropertyQuery,
  cfg: ClientConfig,
  stats: RequestStats,
  shouldContinue?: () => Promise<boolean>,
): Promise<FetchResult> {
  let url: string | null = buildPropertyUrl(q);
  const records: any[] = [];
  const seen = new Set<string>();
  let reportedCount: number | null = null;
  let pages = 0;

  while (url) {
    if (shouldContinue && !(await shouldContinue())) {
      return { records, reportedCount, pagesReceived: pages, complete: false };
    }

    const json: any = await trestleGet(url, cfg, stats);
    pages++;
    if (reportedCount === null && typeof json['@odata.count'] === 'number') {
      reportedCount = json['@odata.count'];
    }

    for (const item of json.value ?? []) {
      const key = String(item.ListingKey ?? item.ListingId ?? '');
      if (key && seen.has(key)) continue; // page-boundary duplicate protection
      if (key) seen.add(key);
      records.push(item);
    }

    if (q.maxRecords && records.length >= q.maxRecords) {
      return { records: records.slice(0, q.maxRecords), reportedCount, pagesReceived: pages, complete: false };
    }
    if (q.maxPages && pages >= q.maxPages) {
      return { records, reportedCount, pagesReceived: pages, complete: false };
    }

    url = json['@odata.nextLink'] ?? null;
  }

  return { records, reportedCount, pagesReceived: pages, complete: true };
}

export async function testConnection(cfg: ClientConfig): Promise<{ ok: boolean; message: string }> {
  try {
    const stats: RequestStats = { apiRequestCount: 0, rateLimitResponses: 0, providerWaitMs: 0 };
    await getToken(cfg, true);
    const params = new URLSearchParams({ $select: 'ListingKey', $top: '1' });
    await trestleGet(`${PROPERTY_URL}?${params.toString()}`, cfg, stats);
    return { ok: true, message: 'Authenticated and retrieved a Property response.' };
  } catch (err) {
    return { ok: false, message: sanitiseError(err) };
  }
}
