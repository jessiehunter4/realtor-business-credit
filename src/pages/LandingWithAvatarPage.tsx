import { useParams } from "react-router-dom";
import SiteHeader from "@/components/shared/SiteHeader";
import SiteFooter from "@/components/shared/SiteFooter";
import HeroSectionBright from "@/components/landing/HeroSectionBright";
import GuideIntroduction from "@/components/guide/GuideIntroduction";
import ProgramCurriculum from "@/components/landing/ProgramCurriculum";
import FinalCTABright from "@/components/landing/FinalCTABright";
import Seo from "@/components/shared/Seo";

const LandingWithAvatarPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const visitorName = (slug || "").trim();
  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Your Personal Welcome — RE Pro Business Credit"
        description="Personalized welcome from RE Pro Business Credit."
        path={`/landing-page/${visitorName}`}
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
          <div className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg border border-border bg-black">
            <iframe
              src="https://embed.liveavatar.com/v1/bf17648d-3168-458c-a9c4-44312fc338f0?orientation=horizontal"
              allow="microphone; autoplay"
              title="LiveAvatar Embed"
              className="w-full block"
              style={{ aspectRatio: "16 / 9", border: 0 }}
            />
          </div>
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