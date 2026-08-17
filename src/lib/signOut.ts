import { supabase } from "@/integrations/supabase/client";

/** Wipe all sessionStorage. Safe in private-mode browsers where access throws. */
export function clearSessionStorage() {
  try {
    sessionStorage.clear();
  } catch {
    // ignore
  }
}

/**
 * Visitor-scoped localStorage keys (identity, guide opt-in, intake drafts).
 * These must go on sign-out or the next visitor on this browser skips the
 * opt-in gate and gets dropped straight into /intake with stale identity.
 * The Supabase auth key is NOT touched — the client manages it.
 */
const VISITOR_LOCAL_KEYS = [
  "rbc_contact",
  "rbc_guide_optin_completed",
  "rbc_intake_draft",
  "rbc_intake_draft_v1",
  "rbc_intake_draft_v2",
  "rbc_intake_draft_v3",
  "rbc_guide_progress_v1",
  "rbc_guide_progress_v1_card",
];

export function clearVisitorLocalStorage() {
  try {
    for (const k of VISITOR_LOCAL_KEYS) localStorage.removeItem(k);
  } catch {
    // ignore
  }
}

interface SignOutOptions {
  /**
   * Where to send the user after signing out. Pass `null` to stay on the
   * current page (used by auth pages that reject a session inline).
   */
  redirectTo?: string | null;
}

/**
 * Single entry point for signing out. Clears sessionStorage before and after
 * the sign-out so nothing written during teardown survives, then performs a
 * full page navigation so no in-memory React state carries over.
 */
export async function signOutAndClear(options: SignOutOptions = {}) {
  const { redirectTo = "/" } = options;

  clearSessionStorage();
  try {
    await supabase.auth.signOut();
  } catch {
    // Already signed out / network hiccup — never block the redirect.
  }
  clearSessionStorage();
  clearVisitorLocalStorage();

  if (redirectTo) {
    window.location.href = redirectTo;
  }
}
