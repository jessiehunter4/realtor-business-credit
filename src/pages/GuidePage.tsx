import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import GuideCover from "@/components/guide/GuideCover";
import GuideTOC from "@/components/guide/GuideTOC";
import GuideIntroduction from "@/components/guide/GuideIntroduction";
import GuideChapter1 from "@/components/guide/GuideChapter1";
import GuideChapter2 from "@/components/guide/GuideChapter2";
import GuideChapter3 from "@/components/guide/GuideChapter3";
import GuideChapter4 from "@/components/guide/GuideChapter4";
import GuideChapter5 from "@/components/guide/GuideChapter5";
import GuideChapter6 from "@/components/guide/GuideChapter6";
import GuideChapter7 from "@/components/guide/GuideChapter7";
import GuideChapter8 from "@/components/guide/GuideChapter8";
import GuideChapter9 from "@/components/guide/GuideChapter9";
import GuideConclusion from "@/components/guide/GuideConclusion";
import GuideResources from "@/components/guide/GuideResources";
import GuideFloatingTOC from "@/components/guide/GuideFloatingTOC";
import GuideProgressBar from "@/components/guide/GuideProgressBar";

const GuidePage = () => {
  return (
    <div className="min-h-screen bg-background scroll-smooth">
      {/* Sticky CTA Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-secondary/95 backdrop-blur-sm border-b border-border shadow-lg">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-secondary-foreground font-semibold text-sm md:text-base">
            Realtor Business Credit
          </span>
          <Button asChild size="sm" className="text-sm">
            <Link to="/get_started">
              <Calendar className="mr-2 h-4 w-4" />
              Book a One-on-One Session
            </Link>
          </Button>
        </div>
      </div>

      <GuideCover />
      <GuideTOC />
      <GuideIntroduction />
      <GuideChapter1 />
      <GuideChapter2 />
      <GuideChapter3 />
      <GuideChapter4 />
      <GuideChapter5 />
      <GuideChapter6 />
      <GuideChapter7 />
      <GuideChapter8 />
      <GuideChapter9 />
      <GuideConclusion />
      <GuideResources />

      <GuideProgressBar />
      <GuideFloatingTOC />
    </div>
  );
};

export default GuidePage;
