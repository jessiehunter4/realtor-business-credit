import { supabase } from "@/integrations/supabase/client";

/** Wipe all sessionStorage. Safe in private-mode browsers where access throws. */
export function clearSessionStorage() {
  try {
    sessionStorage.clear();
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

  if (redirectTo) {
    window.location.href = redirectTo;
  }
}
