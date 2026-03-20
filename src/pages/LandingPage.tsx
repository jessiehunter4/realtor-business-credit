import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useContactIdentity } from "@/hooks/useContactIdentity";
import { postFunnelEvent } from "@/lib/logFunnelEvent";
import HeroSection from "@/components/landing/HeroSection";
import TimingSection from "@/components/landing/TimingSection";
import TruthSection from "@/components/landing/TruthSection";
import ComparisonSection from "@/components/landing/ComparisonSection";
import ProblemsSection from "@/components/landing/ProblemsSection";
import GuideContentsSection from "@/components/landing/GuideContentsSection";
import CTASection from "@/components/landing/CTASection";
import FounderQuoteSection from "@/components/landing/FounderQuoteSection";

const LandingPage = () => {
  const { contactId, firstName, buildForwardParams } = useContactIdentity();
  const fwd = buildForwardParams();
  const guideLink = `/guide${fwd ? `?${fwd}` : ""}`;
  const logged = useRef(false);

  useEffect(() => {
    if (logged.current) return;
    logged.current = true;

    void postFunnelEvent({
      contactId: contactId || undefined,
      eventType: "site_visit",
    }).catch((e) => console.error("[Landing] Failed to log site_visit:", e));

    // Tag known visitors
    if (contactId) {
      supabase.functions
        .invoke("tag-ghl-contact", {
          body: { contactId, tags: ["l-visited-rbc-site"] },
        })
        .catch((e) => console.error("Failed to tag landing visitor:", e));
    }
  }, [contactId]);

  return (
    <div className="min-h-screen bg-background">
      <HeroSection firstName={firstName} guideLink={guideLink} />
      <TimingSection />
      <TruthSection />
      <ComparisonSection />
      <ProblemsSection />
      <GuideContentsSection />
      <CTASection guideLink={guideLink} />
      <FounderQuoteSection />
    </div>
  );
};

export default LandingPage;
