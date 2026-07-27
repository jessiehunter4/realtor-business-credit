// Lightweight helpers to write identity fields (including leadId) into the
// same localStorage bucket used by useContactIdentity, so subsequent pages
// (Guide → Intake) can auto-fill and link back to the correct Lead.

const STORAGE_KEY = "rbc_contact";

interface StoredIdentity {
  contactId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  leadId?: string;
}

export function readContactIdentity(): StoredIdentity {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredIdentity) : {};
  } catch {
    return {};
  }
}

export function mergeContactIdentity(patch: StoredIdentity): StoredIdentity {
  try {
    const current = readContactIdentity();
    const merged: StoredIdentity = { ...current };
    for (const [k, v] of Object.entries(patch)) {
      if (v !== undefined && v !== null && v !== "") {
        (merged as Record<string, string>)[k] = String(v);
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return merged;
  } catch {
    return patch;
  }
}