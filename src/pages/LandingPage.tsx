import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useContactIdentity } from "@/hooks/useContactIdentity";
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

  // Tag known visitors on landing page mount
  useEffect(() => {
    if (!contactId) return;
    const tagVisitor = async () => {
      try {
        await supabase.functions.invoke("tag-ghl-contact", {
          body: { contactId, tags: ["l-visited-rbc-site"] },
        });
      } catch (e) {
        console.error("Failed to tag landing visitor:", e);
      }
    };
    tagVisitor();
  }, [contactId]);

  return (
    <div className="min-h-screen bg-background">
      <HeroSection firstName={urlFirstName} guideLink={guideLink} />
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
