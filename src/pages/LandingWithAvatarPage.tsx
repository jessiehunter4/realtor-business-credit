import { useParams } from "react-router-dom";
import SiteHeader from "@/components/shared/SiteHeader";
import SiteFooter from "@/components/shared/SiteFooter";
import HeyGenAvatar from "@/components/avatar/HeyGenAvatar";
import HeroSectionBright from "@/components/landing/HeroSectionBright";
import GuideIntroduction from "@/components/guide/GuideIntroduction";
import ProgramCurriculum from "@/components/landing/ProgramCurriculum";
import FinalCTABright from "@/components/landing/FinalCTABright";
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
  const greeting = visitorName
    ? `Congratulations on your recent closing, ${visitorName}. Welcome to RE Pro Business Credit. I'm excited to help you build the business structure, financial foundation, and separate business credit that can support your real estate business when you need it.`
    : `Congratulations on your recent closing. Welcome to RE Pro Business Credit. I'm excited to help you build the business structure, financial foundation, and separate business credit that can support your real estate business when you need it.`;

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Your Personal Welcome — RE Pro Business Credit"
        description="Personalized welcome from RE Pro Business Credit."
        path={`/landing-page/${slug || ""}`}
      />
      <SiteHeader />

      <section className="bg-hero-grad py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-secondary tracking-tight">
              {visitorName ? `A personal welcome for ${visitorName}` : "A personal welcome"}
            </h1>
            <p className="mt-2 text-muted-foreground">
              Press play if the video doesn't start automatically.
            </p>
          </div>
          <HeyGenAvatar greeting={greeting} />
        </div>
      </section>

      <HeroSectionBright firstName={visitorName || undefined} closingContext={!!visitorName} />
      <GuideIntroduction />
      <ProgramCurriculum />
      <FinalCTABright />
      <SiteFooter />
    </div>
  );
};

export default LandingWithAvatarPage;