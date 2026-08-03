import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import SiteHeader from "@/components/shared/SiteHeader";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const REDIRECT_MS = 6000;

const tierLabels: Record<string, string> = {
  "self-paced": "Self-Paced",
  cohort: "Cohort",
  "one-on-one": "One-on-One",
};

type VerifyState = "verifying" | "success" | "failed";

type VerifyResult = {
  success?: boolean;
  status?: string;
  product?: string;
  amount?: number;
  currency?: string;
  alreadyProcessed?: boolean;
};

function formatAmount(amount?: number, currency?: string) {
  if (typeof amount !== "number") return null;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: (currency ?? "usd").toUpperCase(),
    }).format(amount / 100);
  } catch {
    return `${(amount / 100).toFixed(2)} ${(currency ?? "").toUpperCase()}`;
  }
}

export default function PaymentSuccessPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = params.get("session_id") ?? undefined;
  const tier = params.get("tier") ?? undefined;
  const tierLabel = tier ? tierLabels[tier] ?? tier : undefined;
  const [secondsLeft, setSecondsLeft] = useState(Math.round(REDIRECT_MS / 1000));
  const [state, setState] = useState<VerifyState>("verifying");
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const loggedRef = useRef(false);

  const verify = useCallback(async () => {
    if (!sessionId) {
      setState("failed");
      setErrorMessage("No checkout reference was found in the link.");
      return;
    }
    setState("verifying");
    setErrorMessage(null);
    try {
      const { data, error } = await supabase.functions.invoke("verify-stripe-payment", {
        body: { session_id: sessionId },
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || "Payment not confirmed");
      setResult(data as VerifyResult);
      setState("success");
    } catch (err) {
      console.error("Payment verification failed:", err);
      setState("failed");
      setErrorMessage((err as Error).message || null);
    }
  }, [sessionId]);

  useEffect(() => {
    void verify();
  }, [verify]);

  // Log the funnel event only once verification actually confirms the payment.
  useEffect(() => {
    if (state !== "success" || loggedRef.current) return;
    loggedRef.current = true;
    supabase.functions
      .invoke("log-funnel-event", {
        body: {
          eventType: "checkout_completed",
          pathname: "/payment-success",
          properties: { session_id: sessionId, tier, product: result?.product },
        },
      })
      .catch(() => {
        /* best effort */
      });
  }, [state, sessionId, tier, result?.product]);

  // Redirect only after a verified payment.
  useEffect(() => {
    if (state !== "success") return;
    const tick = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    const to = setTimeout(() => navigate("/dashboard", { replace: true }), REDIRECT_MS);
    return () => {
      clearInterval(tick);
      clearTimeout(to);
    };
  }, [state, navigate]);

  const amountLabel = formatAmount(result?.amount, result?.currency);
  const productLabel = result?.product ?? tierLabel;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-6 py-16 md:py-24">
        <div className="rounded-2xl border bg-card p-8 md:p-12 text-center shadow-sm">
          {state === "verifying" && (
            <>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Loader2 className="h-9 w-9 animate-spin text-primary" aria-hidden />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                Confirming your payment
              </h1>
              <p className="mt-4 text-base text-muted-foreground">
                We're verifying this transaction securely with Stripe. This only takes a
                moment — please don't close this window.
              </p>
            </>
          )}

          {state === "success" && (
            <>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="h-10 w-10 text-emerald-600" aria-hidden />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                Payment successful!
              </h1>
              {productLabel && (
                <p className="mt-3 text-lg text-muted-foreground">
                  You're enrolled in{" "}
                  <span className="font-semibold text-foreground">{productLabel}</span>.
                </p>
              )}

              <dl className="mx-auto mt-8 max-w-sm space-y-3 rounded-xl border bg-background/60 p-5 text-left text-sm">
                {productLabel && (
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-muted-foreground">Program</dt>
                    <dd className="font-medium text-foreground">{productLabel}</dd>
                  </div>
                )}
                {amountLabel && (
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-muted-foreground">Amount paid</dt>
                    <dd className="font-medium text-foreground">{amountLabel}</dd>
                  </div>
                )}
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">Status</dt>
                  <dd className="font-medium text-emerald-600">Paid</dd>
                </div>
              </dl>

              <p className="mt-6 text-sm text-muted-foreground">
                Taking you to your dashboard in {secondsLeft}s.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button asChild size="lg">
                  <Link to="/dashboard">Go to Dashboard now</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/pricing">View Pricing</Link>
                </Button>
              </div>
            </>
          )}

          {state === "failed" && (
            <>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                <AlertTriangle className="h-9 w-9 text-amber-600" aria-hidden />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                Payment could not be verified
              </h1>
              <p className="mt-4 text-base text-muted-foreground">
                We weren't able to confirm this payment with Stripe. If you were charged,
                nothing is lost — please contact support with the reference below and
                we'll sort it out right away.
              </p>
              {errorMessage && (
                <p className="mt-3 text-sm text-muted-foreground">{errorMessage}</p>
              )}

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button size="lg" onClick={() => void verify()}>
                  Try again
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
              </div>
            </>
          )}

          {sessionId && (
            <p className="mt-8 text-xs text-muted-foreground">
              Reference: <span className="font-mono">{sessionId}</span>
            </p>
          )}
        </div>
      </main>
    </div>
  );
}