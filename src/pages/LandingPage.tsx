import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useContactIdentity } from "@/hooks/useContactIdentity";
import { postFunnelEvent } from "@/lib/logFunnelEvent";
import HeroSectionBright from "@/components/landing/HeroSectionBright";
import IsThisForMe from "@/components/landing/IsThisForMe";
import MoneyWhenYouNeedItStrip from "@/components/landing/MoneyWhenYouNeedItStrip";
import ThreePillarsDiagram from "@/components/landing/ThreePillarsDiagram";
import ComparisonBright from "@/components/landing/ComparisonBright";
import CashFlowCalculator from "@/components/landing/CashFlowCalculator";
import GuideContentsBright from "@/components/landing/GuideContentsBright";
import SamplePlanPreview from "@/components/landing/SamplePlanPreview";
import OneOnOneStepsBlock from "@/components/landing/OneOnOneStepsBlock";
import TestimonialsBright from "@/components/landing/TestimonialsBright";
import FinalCTABright from "@/components/landing/FinalCTABright";
import StickyMobileCTABar from "@/components/shared/StickyMobileCTABar";
import SiteFooter from "@/components/shared/SiteFooter";
import SiteHeader from "@/components/shared/SiteHeader";
import Seo from "@/components/shared/Seo";

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
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Seo
        title="Realtor Business Credit: Turn Your Closings Into Business Credit Capacity"
        description="Free guide and free one-on-one for real estate agents and brokers. Build a fundable business structure, financial foundation, and separate business credit — without relying on personal credit."
        path="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Realtor Business Credit",
          url: "https://realtorbusinesscredit.com",
          parentOrganization: { "@type": "Organization", name: "My Better Business Credit" },
          founder: { "@type": "Person", name: "Jessie Hunter" },
        }}
      />
      <SiteHeader />
      <HeroSectionBright firstName={firstName} guideLink={guideLink} closingContext={closingContext} />
      <IsThisForMe />
      <MoneyWhenYouNeedItStrip />
      <ThreePillarsDiagram />
      <ComparisonBright />
      <CashFlowCalculator guideLink={guideLink} />
      <GuideContentsBright guideLink={guideLink} />
      <SamplePlanPreview />
      <OneOnOneStepsBlock />
      <TestimonialsBright />
      <FinalCTABright guideLink={guideLink} />
      <SiteFooter />
      <StickyMobileCTABar guideLink={guideLink} />
    </div>
  );
};

export default LandingPage;
