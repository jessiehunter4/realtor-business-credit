import { useSearchParams } from "react-router-dom";
import HeroSection from "@/components/landing/HeroSection";
import TimingSection from "@/components/landing/TimingSection";
import TruthSection from "@/components/landing/TruthSection";
import ComparisonSection from "@/components/landing/ComparisonSection";
import ProblemsSection from "@/components/landing/ProblemsSection";
import GuideContentsSection from "@/components/landing/GuideContentsSection";
import FounderQuoteSection from "@/components/landing/FounderQuoteSection";
import CTASection from "@/components/landing/CTASection";

const LandingPage = () => {
  const [searchParams] = useSearchParams();
  const urlFirstName = searchParams.get("firstName") || "";

  return (
    <div className="min-h-screen bg-background">
      <HeroSection firstName={urlFirstName} />
      <TimingSection />
      <TruthSection />
      <ComparisonSection />
      <ProblemsSection />
      <GuideContentsSection />
      <CTASection />
      <FounderQuoteSection />
    </div>
  );
};

export default LandingPage;
