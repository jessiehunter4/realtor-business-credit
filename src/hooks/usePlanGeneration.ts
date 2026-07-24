import { useCallback, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type PlanGenState =
  | { status: "idle" }
  | { status: "generating" }
  | { status: "success"; planId: string; idempotent?: boolean; superseded?: boolean }
  | { status: "error"; message: string; retriable: boolean };

interface Args {
  intakeSurveyId: string;
  intakeToken?: string | null; // required for public/user-generated
  source: "user" | "admin";
}

/**
 * Shared plan-generation state machine used by the public intake flow
 * and the admin coach view. Handles idempotency, abort, and error mapping.
 */
export function usePlanGeneration() {
  const [state, setState] = useState<PlanGenState>({ status: "idle" });
  const abortRef = useRef<AbortController | null>(null);

  const generate = useCallback(async ({ intakeSurveyId, intakeToken, source }: Args) => {
    if (state.status === "generating") return;
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setState({ status: "generating" });

    // 60s client timeout
    const timeout = setTimeout(() => ctrl.abort(), 60_000);

    try {
      const body: Record<string, unknown> = { intake_survey_id: intakeSurveyId, source };
      if (source === "user" && intakeToken) body.intake_token = intakeToken;

      const { data, error } = await supabase.functions.invoke("generate-plan", { body });
      clearTimeout(timeout);

      if (error) {
        // Supabase FunctionsHttpError includes context.status for HTTP status.
        const status = (error as any)?.context?.status as number | undefined;
        const msg =
          status === 429
            ? "Our AI is a little busy right now. Please try again in a moment."
            : status === 402 || status === 403
              ? "The plan service is temporarily unavailable. Please contact support."
              : error.message || "We couldn't generate your plan. Please retry.";
        setState({ status: "error", message: msg, retriable: status !== 402 && status !== 403 });
        return;
      }
      if (data?.error) {
        setState({ status: "error", message: data.error, retriable: true });
        return;
      }
      if (!data?.plan_id) {
        setState({ status: "error", message: "Plan service returned no result. Please retry.", retriable: true });
        return;
      }
      setState({ status: "success", planId: data.plan_id, idempotent: data.idempotent, superseded: data.superseded });
    } catch (e) {
      clearTimeout(timeout);
      const aborted = (e as Error)?.name === "AbortError";
      setState({
        status: "error",
        message: aborted
          ? "Plan generation took too long. Please retry."
          : (e as Error)?.message || "Something went wrong. Please retry.",
        retriable: true,
      });
    }
  }, [state.status]);

  const reset = useCallback(() => setState({ status: "idle" }), []);

  return { state, generate, reset };
}