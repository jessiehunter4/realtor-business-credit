import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { pdf } from "@react-pdf/renderer";
import { Download, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Seo from "@/components/shared/Seo";
import SiteHeader from "@/components/shared/SiteHeader";
import SiteFooter from "@/components/shared/SiteFooter";
import GuideProgressBar from "@/components/guide/GuideProgressBar";
import CardGuideCover from "@/components/card-guide/CardGuideCover";
import CardGuideTOC from "@/components/card-guide/CardGuideTOC";
import CardGuideFloatingTOC from "@/components/card-guide/CardGuideFloatingTOC";
import CardGuideDisclosures from "@/components/card-guide/CardGuideDisclosures";
import PartnerCTA from "@/components/card-guide/PartnerCTA";
import CardGuidePDF from "@/components/CardGuidePDF";
import ChapterPlanCTA from "@/components/guide/ChapterPlanCTA";
import {
  CardIntro,
  CardCh01,
  CardCh02,
  CardCh03,
  CardCh04,
  CardCh05,
  CardCh06,
  CardCh07,
  CardCh08,
  CardCh09,
  CardCh10,
  CardCh11,
  CardCh12,
  CardCh13,
  CardConclusion,
} from "@/components/card-guide/cardGuideChapters";

const CardGuidePage = () => {
  const [generating, setGenerating] = useState(false);

  const handleDownload = useCallback(async () => {
    setGenerating(true);
    try {
      const blob = await pdf(<CardGuidePDF />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "RE-Pro-Business-Credit-Card-Guide.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Card guide PDF generation failed:", e);
    } finally {
      setGenerating(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <Seo
        title="Business Credit Card Stacking Guide for Real Estate Pros"
        description="A free, plain-English guide to business credit card stacking for Realtors, brokers, and investors — how the sequence works, what it costs, and the structure you need first."
        path="/card-guide"
      />
      <SiteHeader />
      <div className="relative">
        <GuideProgressBar />
      </div>

      <CardGuideCover />

      <div className="container mx-auto px-4 pt-4">
        <div className="mx-auto max-w-3xl flex flex-wrap items-center justify-center gap-3">
          <Button variant="outline" onClick={handleDownload} disabled={generating}>
            {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            {generating ? "Generating..." : "Download this guide as a PDF"}
          </Button>
          <Button asChild variant="ghost">
            <Link to="/guide">
              Read the main structure &amp; credit guide
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <CardGuideTOC />
      <CardIntro />
      <CardCh01 />
      <ChapterPlanCTA />
      <CardCh02 />
      <CardCh03 />
      <ChapterPlanCTA />
      <CardCh04 />
      <CardCh05 />
      <ChapterPlanCTA />
      <CardCh06 />
      <CardCh07 />
      <ChapterPlanCTA />
      <CardCh08 />
      <CardCh09 />
      <ChapterPlanCTA />
      <CardCh10 />
      <CardCh11 />
      <CardCh12 />
      <ChapterPlanCTA />
      <CardCh13 />
      <section className="container mx-auto px-4 pb-14">
        <PartnerCTA />
      </section>
      <CardConclusion />
      <CardGuideDisclosures />
      <div className="h-20 sm:h-24" aria-hidden="true" />

      <CardGuideFloatingTOC />
      <SiteFooter />
    </div>
  );
};

export default CardGuidePage;