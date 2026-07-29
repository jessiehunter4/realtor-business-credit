import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2 } from "lucide-react";
import SiteHeader from "@/components/shared/SiteHeader";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const REDIRECT_MS = 6000;

const tierLabels: Record<string, string> = {
  "self-paced": "Self-Paced",
  cohort: "Cohort",
  "one-on-one": "One-on-One",
};

export default function PaymentSuccessPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = params.get("session_id") ?? undefined;
  const tier = params.get("tier") ?? undefined;
  const tierLabel = tier ? tierLabels[tier] ?? tier : undefined;
  const [secondsLeft, setSecondsLeft] = useState(Math.round(REDIRECT_MS / 1000));

  useEffect(() => {
    supabase.functions
      .invoke("log-funnel-event", {
        body: {
          eventType: "checkout_completed",
          pathname: "/payment-success",
          properties: { session_id: sessionId, tier },
        },
      })
      .catch(() => {
        /* best effort */
      });
  }, [sessionId, tier]);

  useEffect(() => {
    const tick = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    const to = setTimeout(() => navigate("/dashboard", { replace: true }), REDIRECT_MS);
    return () => {
      clearInterval(tick);
      clearTimeout(to);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-6 py-16 md:py-24">
        <div className="rounded-2xl border bg-card p-8 md:p-12 text-center shadow-sm">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" aria-hidden />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Payment received
          </h1>
          {tierLabel && (
            <p className="mt-3 text-lg text-muted-foreground">
              Thanks for enrolling in the <span className="font-semibold">{tierLabel}</span> program.
            </p>
          )}
          <p className="mt-4 text-base text-muted-foreground">
            We're confirming your payment with Stripe. You'll be redirected to your
            dashboard in {secondsLeft}s.
          </p>

          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            <span>Confirming payment…</span>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/dashboard">Go to Dashboard now</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/pricing">View Pricing</Link>
            </Button>
          </div>

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