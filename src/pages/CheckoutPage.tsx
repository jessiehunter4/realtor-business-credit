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
    <div className="min-h-screen bg-secondary text-secondary-foreground">
      <SiteHeader />
      <Seo
        title="Enroll · Realtor Business Credit Program"
        description="Secure enrollment for the Realtor Business Credit program — coaching, cohort, and the implementation portal."
        path="/checkout"
        noindex
      />
      {/* Header */}
      <header className="border-b border-border/20 bg-secondary/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm font-bold text-primary-foreground leading-tight">
                Realtor Business Credit
              </p>
              <p className="text-[10px] text-muted-foreground leading-tight">
                by My Better Business Credit
              </p>
            </div>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-primary">
              Secure Checkout
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4 leading-tight">
            Start Building Your
            <span className="text-primary"> Business Credit</span> Today
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
            Enroll in the Realtor Business Credit program and get your
            personalized plan, coaching, and step-by-step guidance.
          </p>

          {/* What's Included Card */}
          <Card className="bg-card/5 border-border/20 text-left mb-10 max-w-lg mx-auto">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-lg font-semibold text-primary-foreground mb-5">
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
                    <span className="text-sm text-muted-foreground">
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
          >
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-10 py-6 rounded-lg font-semibold shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
            >
              <CreditCard className="h-5 w-5 mr-2" />
              Proceed to Payment
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
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
          <Card className="bg-card/5 border-border/20">
            <CardContent className="p-6 md:p-8">
              <h3 className="text-base font-semibold text-primary-foreground mb-4">
                Questions?
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                If you have any questions about the program or need help with
                enrollment, reach out directly to your coach or email us.
              </p>
              <p className="text-sm text-muted-foreground">
                Remember — this is about building a smarter financial
                foundation for your real estate business. You don't have to do
                this alone.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/20 py-8">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} My Better Business Credit. All rights
            reserved.
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">
            This program provides education and coaching only — not legal, tax,
            or financial advice.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CheckoutPage;
