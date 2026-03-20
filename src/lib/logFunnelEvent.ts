interface FunnelEventPayload {
  contactId?: string;
  eventType: string;
  metadata?: Record<string, unknown>;
}

interface PostOptions {
  keepalive?: boolean;
}

const BASE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/log-funnel-event`;
const API_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const TRACKING_URL = `${BASE_URL}?apikey=${encodeURIComponent(API_KEY)}`;

const normalizeContactId = (contactId?: string) => {
  const value = contactId?.trim();
  return value ? value : undefined;
};

const getPageContext = () => {
  if (typeof window === "undefined") return {};
  return {
    hostname: window.location.hostname,
    pathname: window.location.pathname,
    href: window.location.href,
  };
};

const buildPayload = ({ contactId, eventType, metadata = {} }: FunnelEventPayload) => ({
  contactId: normalizeContactId(contactId),
  eventType,
  metadata: {
    ...getPageContext(),
    ...metadata,
  },
});

export async function postFunnelEvent(payload: FunnelEventPayload, options: PostOptions = {}) {
  const response = await fetch(TRACKING_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: API_KEY,
    },
    body: JSON.stringify(buildPayload(payload)),
    keepalive: options.keepalive ?? true,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Tracking request failed (${response.status}): ${message}`);
  }

  return response.json().catch(() => null);
}

export function beaconFunnelEvent(payload: FunnelEventPayload) {
  if (typeof navigator === "undefined" || typeof navigator.sendBeacon !== "function") return false;
  return navigator.sendBeacon(TRACKING_URL, JSON.stringify(buildPayload(payload)));
}
