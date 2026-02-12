import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Download, Loader2 } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { GuidePDF } from "@/components/GuidePDF";
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
  const [generating, setGenerating] = useState(false);

  const handleDownload = useCallback(async () => {
    setGenerating(true);
    try {
      const blob = await pdf(<GuidePDF />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Realtor-Business-Credit-Guide.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("PDF generation failed:", e);
    } finally {
      setGenerating(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background scroll-smooth">
      {/* Sticky CTA Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-secondary/95 backdrop-blur-sm border-b border-border shadow-lg">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-secondary-foreground font-semibold text-sm md:text-base">
            Realtor Business Credit
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-sm border-primary/40 text-primary hover:bg-primary/10"
              onClick={handleDownload}
              disabled={generating}
            >
              {generating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              <span className="hidden sm:inline">{generating ? "Generating..." : "Download PDF"}</span>
            </Button>
            <Button asChild size="sm" className="text-sm">
              <Link to="/get_started">
                <Calendar className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Book a One-on-One Session</span>
                <span className="sm:hidden">Book Session</span>
              </Link>
            </Button>
          </div>
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
