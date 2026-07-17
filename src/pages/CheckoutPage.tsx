import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  Shield,
  CreditCard,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { useContactIdentity } from "@/hooks/useContactIdentity";
import { useEngagementTracker } from "@/hooks/useEngagementTracker";
import { supabase } from "@/integrations/supabase/client";
import Seo from "@/components/shared/Seo";
import SiteHeader from "@/components/shared/SiteHeader";
import SiteFooter from "@/components/shared/SiteFooter";

const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/00w3cu4RbbqO8vL1YfbfO00";

const CheckoutPage = () => {
  const { contactId } = useContactIdentity();
  const taggedMount = useRef(false);

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

  const handlePaymentClick = () => {
    logEvent("checkout_clicked");
    if (contactId) {
      supabase.functions
        .invoke("tag-ghl-contact", {
          body: { contactId, tags: ["f-checkout-clicked"] },
        })
        .catch((e) => console.error("Failed to tag checkout click:", e));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <Seo
        title="Enroll · Realtor Business Credit Program"
        description="Secure enrollment for the Realtor Business Credit program — coaching, cohort, and the implementation portal."
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
            Enroll in the Realtor Business Credit program and get your
            personalized plan, coaching, and step-by-step guidance.
          </p>

          {/* What's Included Card */}
          <Card className="bg-card border-border rounded-2xl shadow-card text-left mb-10 max-w-lg mx-auto">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-lg font-semibold text-secondary mb-5">
                What's Included
              </h2>
              <ul className="space-y-4">
                {[
                  "Personalized Realtor Business Credit Plan",
                  "1-on-1 coaching with a Realtor credit specialist",
                  "90-day action plan with milestones",
                  "Credit Suite portal & business funding directory",
                  "Cohort access with other Realtors building credit",
                  "Ongoing support and progress tracking",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm text-foreground/90">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* CTA Button */}
          <a
            href={STRIPE_PAYMENT_LINK}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handlePaymentClick}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-8 py-4 text-lg font-semibold shadow-card hover:shadow-card-hover hover:bg-primary/90 transition-all"
          >
            <CreditCard className="h-5 w-5" />
            Proceed to Payment
            <ArrowRight className="h-5 w-5" />
          </a>

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

      <SiteFooter />
    </div>
  );
};

export default CheckoutPage;
