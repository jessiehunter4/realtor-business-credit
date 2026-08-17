import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import SiteHeader from "@/components/shared/SiteHeader";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { productPathForTier } from "@/data/pricingTiers";

export default function PaymentCancelledPage() {
  const [params] = useSearchParams();
  const tier = params.get("tier") ?? undefined;
  const backPath = productPathForTier(tier);

  useEffect(() => {
    supabase.functions
      .invoke("log-funnel-event", {
        body: {
          eventType: "checkout_cancelled",
          pathname: "/payment-cancelled",
          properties: { tier },
        },
      })
      .catch(() => {
        /* best effort */
      });
  }, [tier]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main id="main-content" className="mx-auto max-w-2xl px-6 py-16 md:py-24">
        <div className="rounded-2xl border bg-card p-8 md:p-12 text-center shadow-sm">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <AlertCircle className="h-10 w-10 text-amber-600" aria-hidden />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            No payment was processed
          </h1>
          <p className="mt-4 text-base text-muted-foreground">
            Your card was not charged. You can pick up right where you left off
            whenever you're ready to enroll.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link to={backPath}>
                {backPath === "/pricing" ? "Return to Pricing" : "Back to your program"}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}