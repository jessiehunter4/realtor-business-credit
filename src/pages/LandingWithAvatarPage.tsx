import { useParams } from "react-router-dom";
import SiteHeader from "@/components/shared/SiteHeader";
import SiteFooter from "@/components/shared/SiteFooter";
import AvatarHeroSection from "@/components/landing-avatar/AvatarHeroSection";
import ThreeStepSection from "@/components/landing-avatar/ThreeStepSection";
import AvatarFinalCTA from "@/components/landing-avatar/AvatarFinalCTA";
import Seo from "@/components/shared/Seo";
import { parseVisitorSlug } from "@/lib/visitorSlug";

const LandingWithAvatarPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const visitorName = parseVisitorSlug(slug).displayName;

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Money When Your Business Needs It — RE Pro Business Credit"
        description="A simple three-step path for real estate pros: read the free guide, get a custom 90-day plan, then choose how you implement it."
        path={`/landing-page/${slug || ""}`}
      />
      <SiteHeader />
      <AvatarHeroSection firstName={visitorName || undefined} />
      <ThreeStepSection />
      <AvatarFinalCTA />
      <SiteFooter />
    </div>
  );
};

export default LandingWithAvatarPage;