import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useContactIdentity } from "@/hooks/useContactIdentity";
import { postFunnelEvent } from "@/lib/logFunnelEvent";
import HeroSectionBright from "@/components/landing/HeroSectionBright";
import MoneyWhenYouNeedItStrip from "@/components/landing/MoneyWhenYouNeedItStrip";
import HowItWorksRail from "@/components/landing/HowItWorksRail";
import JourneyStep from "@/components/landing/JourneyStep";
import WhatThisIs from "@/components/landing/WhatThisIs";
import { JOURNEY_STEPS } from "@/data/homepageJourney";
import TestimonialsBright from "@/components/landing/TestimonialsBright";
import FinalCTABright from "@/components/landing/FinalCTABright";
import StickyMobileCTABar from "@/components/shared/StickyMobileCTABar";
import SiteFooter from "@/components/shared/SiteFooter";
import SiteHeader from "@/components/shared/SiteHeader";
import Seo from "@/components/shared/Seo";

const STEP_IDS = JOURNEY_STEPS.map((s) => s.id);

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

  const stepCtas: Record<string, { label: string; to: string; analyticsId?: string; variant?: "primary" | "link" }> = {
    "step-educate": { label: "Read the Free Guide", to: guideLink, analyticsId: "cta-guide-step1" },
    "step-plan": {
      label: "See a sample plan",
      to: "/sample-plan",
      analyticsId: "cta-sample-plan-step2",
      variant: "link",
    },
    "step-implement": {
      label: "See program details",
      to: "/pricing",
      analyticsId: "cta-pricing-step3",
      variant: "link",
    },
  };

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, IntersectionObserverEntry | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          sectionRefs.current[entry.target.id] = entry;
        });

        const visible = STEP_IDS.filter((id) => sectionRefs.current[id]?.isIntersecting);
        if (visible.length === 1) {
          setActiveSection(visible[0]);
        } else if (visible.length > 1) {
          const best = visible.reduce((prev, curr) => {
            const prevEntry = sectionRefs.current[prev];
            const currEntry = sectionRefs.current[curr];
            return (currEntry?.intersectionRatio ?? 0) > (prevEntry?.intersectionRatio ?? 0) ? curr : prev;
          });
          setActiveSection(best);
        }
      },
      { threshold: [0.25, 0.5, 0.75], rootMargin: "-80px 0px -40% 0px" }
    );

    STEP_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Seo
        title="RE Pro Business Credit: Turn Your Closings Into Business Credit Capacity"
        description="Free guide and custom plan for real estate agents and brokers. Build a fundable business structure, financial foundation, and separate business credit — without relying on personal credit."
        path="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "RE Pro Business Credit",
          url: "https://realtorbusinesscredit.com",
          parentOrganization: { "@type": "Organization", name: "My Better Business Credit" },
          founder: { "@type": "Person", name: "Jessie Hunter" },
        }}
      />
      <SiteHeader />
      <HeroSectionBright firstName={firstName} guideLink={guideLink} closingContext={closingContext} />
      <MoneyWhenYouNeedItStrip />
      <HowItWorksRail activeSection={activeSection} />
      {JOURNEY_STEPS.map((s) => (
        <JourneyStep key={s.id} {...s} cta={stepCtas[s.id]} />
      ))}
      <WhatThisIs />
      <TestimonialsBright />
      <FinalCTABright guideLink={guideLink} />
      <SiteFooter />
      <StickyMobileCTABar guideLink={guideLink} />
    </div>
  );
};

export default LandingPage;
