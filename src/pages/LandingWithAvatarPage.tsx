import { useParams } from "react-router-dom";
import SiteHeader from "@/components/shared/SiteHeader";
import SiteFooter from "@/components/shared/SiteFooter";
import AvatarHeroSection from "@/components/landing-avatar/AvatarHeroSection";
import ThreeStepSection from "@/components/landing-avatar/ThreeStepSection";
import AvatarFinalCTA from "@/components/landing-avatar/AvatarFinalCTA";
import Seo from "@/components/shared/Seo";

const cleanVisitorName = (slug?: string) => {
  if (!slug) return "";

  const decoded = decodeURIComponent(slug)
    .replace(/[+_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!decoded) return "";

  return decoded
    .split(" ")
    .map((part) => (part.length > 1 ? `${part.charAt(0).toUpperCase()}${part.slice(1)}` : part.toUpperCase()))
    .join(" ");
};

const LandingWithAvatarPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const visitorName = cleanVisitorName(slug);

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={visitorName ? `Welcome, ${visitorName} — RE Pro Business Credit` : "Your Personal Welcome — RE Pro Business Credit"}
        description="A personal welcome and Jessie's 3-Step Rule: Read the Guide, Create Your Customized Plan, and Implementation."
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