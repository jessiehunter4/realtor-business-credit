import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  Shield,
  CreditCard,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useContactIdentity } from "@/hooks/useContactIdentity";
import { useEngagementTracker } from "@/hooks/useEngagementTracker";
import { supabase } from "@/integrations/supabase/client";
import Seo from "@/components/shared/Seo";
import SiteHeader from "@/components/shared/SiteHeader";
import SiteFooter from "@/components/shared/SiteFooter";
import { PRICING_TIERS } from "@/data/pricingTiers";
import { startCheckout, type CheckoutTierId } from "@/lib/startCheckout";

const validTierIds: CheckoutTierId[] = ["self-paced", "cohort", "one-on-one"];

const isCheckoutTier = (value: string | null): value is CheckoutTierId =>
  !!value && validTierIds.includes(value as CheckoutTierId);

const PAID_TIERS = PRICING_TIERS.filter((t) => !t.isFree);

const CheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const { contactId } = useContactIdentity();
  const taggedMount = useRef(false);
  const tierParam = searchParams.get("tier");
  const initialTier: CheckoutTierId = isCheckoutTier(tierParam)
    ? tierParam
    : "cohort";
  const [selectedTier, setSelectedTier] = useState<CheckoutTierId>(initialTier);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedPlan = useMemo(
    () => PRICING_TIERS.find((tier) => tier.id === selectedTier),
    [selectedTier],
  );

  const { logEvent } = useEngagementTracker({
    contactId,
    pageName: "checkout",
  });

  // Log visit + tag on mount
  useEffect(() => {
    if (taggedMount.current) return;
    taggedMount.current = true;

    logEvent("checkout_visited");

    if (contactId) {
      supabase.functions
        .invoke("tag-ghl-contact", {
          body: { contactId, tags: ["f-checkout-visited"] },
        })
        .catch((e) => console.error("Failed to tag checkout visit:", e));
    }
  }, [contactId, logEvent]);

  const handlePaymentClick = async () => {
    if (isLoading) return;
    logEvent("checkout_clicked");
    if (contactId) {
      supabase.functions
        .invoke("tag-ghl-contact", {
          body: { contactId, tags: ["f-checkout-clicked"] },
        })
        .catch((e) => console.error("Failed to tag checkout click:", e));
    }
    setIsLoading(true);
    setError(null);
    const result = await startCheckout(selectedTier);
    if (result.ok === false) {
      setError(result.message);
    }
    setIsLoading(false);
    if (result.ok) {
      window.setTimeout(() => setError(null), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main id="main-content">
      <Seo
        title="Enroll · RE Pro Business Credit Program"
        description="Secure enrollment for the RE Pro Business Credit program — coaching, cohort, and the implementation portal."
        path="/checkout"
        noindex
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-grad py-16 md:py-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -bottom-32 -right-16 w-[28rem] h-[28rem] rounded-full bg-sky/15 blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wide text-primary">
              Secure Checkout
            </span>
          </div>

          <h1 className="text-[clamp(2rem,6vw,3.25rem)] font-bold text-secondary mb-4 tracking-tight leading-[1.1] text-balance">
            Start Building Your
            <span className="text-primary"> Business Credit</span> Today
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            Enroll in the RE Pro Business Credit program and get your
            personalized plan, coaching, and step-by-step guidance.
          </p>

          {/* What's Included Card */}
          <Card className="bg-card border-border rounded-2xl shadow-card text-left mb-10 max-w-lg mx-auto">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-lg font-semibold text-secondary mb-5">
                Choose Your Program
              </h2>
              <div className="space-y-3">
                {PAID_TIERS.map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setSelectedTier(tier.id as CheckoutTierId)}
                    disabled={isLoading}
                    className={
                      "w-full rounded-xl border p-4 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-70 " +
                      (selectedTier === tier.id
                        ? "border-primary bg-primary/5"
                        : "border-border bg-background hover:border-primary/40")
                    }
                  >
                    <span className="flex items-start gap-3">
                      <CheckCircle
                        className={
                          "mt-0.5 h-5 w-5 shrink-0 " +
                          (selectedTier === tier.id ? "text-primary" : "text-secondary/35")
                        }
                      />
                      <span className="flex-1">
                        <span className="block text-sm font-semibold text-secondary">
                          {tier.name} · {tier.price}
                          {tier.originalPrice && (
                            <span className="ml-1.5 text-secondary/40 line-through font-normal">{tier.originalPrice}</span>
                          )}
                        </span>
                        <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                          {tier.who}
                        </span>
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CTA Button */}
          <button
            type="button"
            onClick={handlePaymentClick}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-8 py-4 text-lg font-semibold shadow-card hover:shadow-card-hover hover:bg-success-green-hover active:bg-success-green-hover transition-all disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Redirecting to Stripe…
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5" />
                Proceed to Payment{selectedPlan ? ` — ${selectedPlan.name}` : ""}
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>

          {error && (
            <p role="alert" className="mt-3 text-sm font-medium text-destructive">
              {error}
            </p>
          )}

          <p className="text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1.5">
            <Shield className="h-3.5 w-3.5" />
            Payments processed securely by Stripe
          </p>
        </div>
      </section>

      {/* Trust / FAQ area */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="bg-card border-border rounded-2xl shadow-card">
            <CardContent className="p-6 md:p-8">
              <h3 className="text-base font-semibold text-secondary mb-4">
                Questions?
              </h3>
              <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                If you have any questions about the program or need help with
                enrollment, reach out directly to your coach or email us.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Remember — this is about building a smarter financial
                foundation for your real estate business. You don't have to do
                this alone.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      </main>
      <SiteFooter />
    </div>
  );
};

export default CheckoutPage;
