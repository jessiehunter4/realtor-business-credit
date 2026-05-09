import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useContactIdentity } from "@/hooks/useContactIdentity";
import { postFunnelEvent } from "@/lib/logFunnelEvent";
import HeroSection from "@/components/landing/HeroSection";
import TrustStrip from "@/components/landing/TrustStrip";
import AudienceSegmenter from "@/components/landing/AudienceSegmenter";
import TimingSection from "@/components/landing/TimingSection";
import TruthSection from "@/components/landing/TruthSection";
import ComparisonSection from "@/components/landing/ComparisonSection";
import ProblemsSection from "@/components/landing/ProblemsSection";
import GuideContentsSection from "@/components/landing/GuideContentsSection";
import CTASection from "@/components/landing/CTASection";
import FounderQuoteSection from "@/components/landing/FounderQuoteSection";
import SiteFooter from "@/components/shared/SiteFooter";

const LandingPage = () => {
  const { contactId, firstName, buildForwardParams } = useContactIdentity();
  const [searchParams] = useSearchParams();
  const fwd = buildForwardParams();
  const guideLink = `/guide${fwd ? `?${fwd}` : ""}`;
  const logged = useRef(false);
  const closingContext = !!contactId || searchParams.get("closing") === "1";

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
      <HeroSection firstName={firstName} guideLink={guideLink} closingContext={closingContext} />
      <TrustStrip />
      <AudienceSegmenter />
      <TimingSection />
      <TruthSection />
      <ComparisonSection />
      <ProblemsSection />
      <GuideContentsSection />
      <CTASection guideLink={guideLink} />
      <FounderQuoteSection />
      <SiteFooter />
    </div>
  );
};

export default LandingPage;
