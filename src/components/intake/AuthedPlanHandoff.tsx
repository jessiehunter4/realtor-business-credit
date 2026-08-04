import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface Props {
  intakeId: string;
  accessToken: string;
  /** Called to move the user into their dashboard. */
  onContinue: () => void;
  /** Rendered when the session turned out to be invalid/expired. */
  fallback: React.ReactNode;
  autoRedirectMs?: number;
}

type State =
  | { status: "linking" }
  | { status: "ready" }
  | { status: "conflict" }
  | { status: "expired" }
  | { status: "error"; message: string };

/**
 * Post-plan handoff for visitors who are ALREADY signed in: links the intake +
 * plan to their account, then sends them straight to the dashboard. No account
 * creation, no password setup, no second login.
 */
export default function AuthedPlanHandoff({
  intakeId,
  accessToken,
  onContinue,
  fallback,
  autoRedirectMs = 2500,
}: Props) {
  const [state, setState] = useState<State>({ status: "linking" });
  const startedRef = useRef(false);

  const link = async () => {
    setState({ status: "linking" });
    const { error } = await supabase.functions.invoke("link-intake-to-user", {
      body: { intake_id: intakeId, access_token: accessToken },
    });
    if (!error) {
      setState({ status: "ready" });
      return;
    }
    const status = (error as { context?: { status?: number } })?.context?.status;
    if (status === 401) setState({ status: "expired" });
    else if (status === 409) setState({ status: "conflict" });
    else setState({ status: "error", message: error.message || "We couldn't link your plan to your account." });
  };

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    void link();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-advance once linking succeeded.
  useEffect(() => {
    if (state.status !== "ready" || !autoRedirectMs) return;
    const t = setTimeout(onContinue, autoRedirectMs);
    return () => clearTimeout(t);
  }, [state.status, autoRedirectMs, onContinue]);

  if (state.status === "expired") return <>{fallback}</>;

  if (state.status === "linking") {
    return (
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        Saving your plan to your account…
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="space-y-3 pt-2">
        <p className="text-sm text-destructive">{state.message} Your plan is saved — you can retry.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button size="lg" onClick={() => void link()}>Try again</Button>
          <Button size="lg" variant="outline" onClick={onContinue}>Go to my dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 pt-2">
      {state.status === "conflict" && (
        <p className="text-sm text-muted-foreground">
          This plan is already linked to another account. Your dashboard is still available below.
        </p>
      )}
      <Button size="lg" onClick={onContinue} className="w-full sm:w-auto sm:min-w-[220px]">
        View My Plan
      </Button>
      {state.status === "ready" && (
        <p className="text-xs text-muted-foreground">Taking you to your dashboard…</p>
      )}
    </div>
  );
}
