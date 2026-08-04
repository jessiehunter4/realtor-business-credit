import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface OnboardingStatus {
  /** True until the session + lookups have resolved. */
  loading: boolean;
  /** True when a Supabase session exists. */
  isAuthenticated: boolean;
  /** True when the signed-in user already has an intake survey row. */
  hasSurvey: boolean;
  /** True when the signed-in user already has a published customized plan. */
  hasPlan: boolean;
}

const EMPTY: Omit<OnboardingStatus, "loading"> = {
  isAuthenticated: false,
  hasSurvey: false,
  hasPlan: false,
};

/**
 * Resolves whether the current visitor has already completed onboarding
 * (intake survey + generated plan). Anonymous visitors always resolve to
 * "not complete" so the public funnel is untouched.
 */
export function useOnboardingStatus(): OnboardingStatus {
  const [state, setState] = useState<OnboardingStatus>({ loading: true, ...EMPTY });

  const resolve = useCallback(async (userId: string | null) => {
    if (!userId) {
      setState({ loading: false, ...EMPTY });
      return;
    }
    try {
      const [{ data: survey }, { data: plan }] = await Promise.all([
        supabase.from("intake_surveys").select("id").eq("user_id", userId).limit(1).maybeSingle(),
        supabase
          .from("custom_plans")
          .select("id")
          .eq("user_id", userId)
          .eq("status", "published")
          .limit(1)
          .maybeSingle(),
      ]);
      setState({
        loading: false,
        isAuthenticated: true,
        hasSurvey: Boolean(survey),
        hasPlan: Boolean(plan),
      });
    } catch {
      // Fail open: never block the funnel because a lookup failed.
      setState({ loading: false, isAuthenticated: true, hasSurvey: false, hasPlan: false });
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!cancelled) void resolve(session?.user.id ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!cancelled) void resolve(session?.user.id ?? null);
    });
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [resolve]);

  return state;
}
