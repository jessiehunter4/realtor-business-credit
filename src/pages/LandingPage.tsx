import { useSearchParams } from "react-router-dom";
import HeroSection from "@/components/landing/HeroSection";
import TimingSection from "@/components/landing/TimingSection";
import TruthSection from "@/components/landing/TruthSection";
import ComparisonSection from "@/components/landing/ComparisonSection";
import ProblemsSection from "@/components/landing/ProblemsSection";
import GuideContentsSection from "@/components/landing/GuideContentsSection";
import LaunchSpecialSection from "@/components/landing/LaunchSpecialSection";
import LeadForm from "@/components/landing/LeadForm";
import FounderQuoteSection from "@/components/landing/FounderQuoteSection";

const LandingPage = () => {
  const [searchParams] = useSearchParams();

  const urlFirstName = searchParams.get("firstName") || "";
  const urlLastName = searchParams.get("lastName") || "";
  const urlEmail = searchParams.get("email") || "";
  const urlPhone = searchParams.get("phone") || "";
  const urlState = searchParams.get("state") || "";
  const urlContactId = searchParams.get("contactId") || "";

  return (
    <div className="min-h-screen bg-background">
      <HeroSection firstName={urlFirstName} />
      <TimingSection />
      <TruthSection />
      <ComparisonSection />
      <ProblemsSection />
      <GuideContentsSection />
      <LaunchSpecialSection />
      <LeadForm
        defaultValues={{
          firstName: urlFirstName,
          lastName: urlLastName,
          email: urlEmail,
          phone: urlPhone,
          state: urlState,
          contactId: urlContactId,
        }}
      />
      <FounderQuoteSection />
    </div>
  );
};

export default LandingPage;
