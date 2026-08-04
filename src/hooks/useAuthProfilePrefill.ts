import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthRole } from "@/hooks/useAuthRole";

export interface AuthProfilePrefill {
  /** True until the session + profile lookups resolve. */
  loading: boolean;
  isAuthenticated: boolean;
  firstName: string;
  lastName: string;
  email: string;
  /** Latest not-yet-submitted intake survey belonging to this user, if any. */
  existingDraft: { id: string; access_token: string; data: Record<string, unknown> } | null;
}

const EMPTY: Omit<AuthProfilePrefill, "loading"> = {
  isAuthenticated: false,
  firstName: "",
  lastName: "",
  email: "",
  existingDraft: null,
};

/**
 * Resolves the signed-in user's basic identity (first/last name + email) so the
 * public intake survey can be pre-filled without duplicate data entry.
 *
 * Resolution order: profiles row -> auth user metadata -> session email.
 * Anonymous visitors resolve to empty values, leaving the public flow untouched.
 */
export function useAuthProfilePrefill(): AuthProfilePrefill {
  const { session, loading: authLoading } = useAuthRole();
  const [state, setState] = useState<AuthProfilePrefill>({ loading: true, ...EMPTY });

  const resolve = useCallback(async () => {
    if (authLoading) return;
    const user = session?.user;
    if (!user) {
      setState({ loading: false, ...EMPTY });
      return;
    }

    const meta = (user.user_metadata || {}) as Record<string, unknown>;
    let firstName = typeof meta.first_name === "string" ? meta.first_name : "";
    let lastName = typeof meta.last_name === "string" ? meta.last_name : "";
    let email = user.email ?? "";
    let existingDraft: AuthProfilePrefill["existingDraft"] = null;

    try {
      const [{ data: profile }, { data: draft }] = await Promise.all([
        supabase
          .from("profiles")
          .select("first_name, last_name, email")
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("intake_surveys")
          .select("*")
          .eq("user_id", user.id)
          .neq("status", "submitted")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);

      if (profile?.first_name) firstName = profile.first_name;
      if (profile?.last_name) lastName = profile.last_name;
      if (profile?.email) email = profile.email;

      if (draft?.id && draft?.access_token) {
        const { access_token, ...rest } = draft as Record<string, unknown> & {
          id: string;
          access_token: string;
        };
        existingDraft = { id: draft.id, access_token: draft.access_token, data: rest };
      }
    } catch {
      // Fail open: never block the intake form because a lookup failed.
    }

    setState({ loading: false, isAuthenticated: true, firstName, lastName, email, existingDraft });
  }, [authLoading, session]);

  useEffect(() => {
    void resolve();
  }, [resolve]);

  return state;
}
