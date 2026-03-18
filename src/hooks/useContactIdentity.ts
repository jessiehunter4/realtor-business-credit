import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

const STORAGE_KEY = "rbc_contact";

interface ContactIdentity {
  contactId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const IDENTITY_KEYS: (keyof ContactIdentity)[] = [
  "contactId",
  "firstName",
  "lastName",
  "email",
  "phone",
];

function readStored(): Partial<ContactIdentity> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeStored(data: Partial<ContactIdentity>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage full or blocked – silently ignore
  }
}

/**
 * Centralised contact-identity hook.
 *
 * 1. Reads identity params from the current URL search params.
 * 2. If `contactId` is present in the URL the full set is persisted to
 *    localStorage (latest wins).
 * 3. If `contactId` is NOT in the URL, falls back to localStorage values.
 *
 * Returns the best-available identity plus a helper to build a forwarding
 * query-string for internal links.
 */
export function useContactIdentity() {
  const [searchParams] = useSearchParams();

  const identity = useMemo<ContactIdentity>(() => {
    const fromUrl: Partial<ContactIdentity> = {};
    for (const key of IDENTITY_KEYS) {
      const val = searchParams.get(key);
      if (val) fromUrl[key] = val;
    }

    if (fromUrl.contactId) {
      // Merge with any previously stored values so we don't lose fields
      // that might not be in this particular URL.
      const merged = { ...readStored(), ...fromUrl };
      writeStored(merged);
      return {
        contactId: merged.contactId ?? "",
        firstName: merged.firstName ?? "",
        lastName: merged.lastName ?? "",
        email: merged.email ?? "",
        phone: merged.phone ?? "",
      };
    }

    // Fallback to stored
    const stored = readStored();
    return {
      contactId: stored.contactId ?? "",
      firstName: stored.firstName ?? "",
      lastName: stored.lastName ?? "",
      email: stored.email ?? "",
      phone: stored.phone ?? "",
    };
  }, [searchParams]);

  /** Build a URLSearchParams string (without leading `?`) for link forwarding. */
  const buildForwardParams = useMemo(() => {
    return () => {
      const params = new URLSearchParams();
      for (const key of IDENTITY_KEYS) {
        if (identity[key]) params.set(key, identity[key]);
      }
      return params.toString();
    };
  }, [identity]);

  return { ...identity, buildForwardParams };
}
