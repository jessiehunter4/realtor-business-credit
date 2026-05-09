import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Download, Loader2 } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { GuidePDF } from "@/components/GuidePDF";
import { supabase } from "@/integrations/supabase/client";
import { useContactIdentity } from "@/hooks/useContactIdentity";
import { useEngagementTracker } from "@/hooks/useEngagementTracker";
import { postFunnelEvent } from "@/lib/logFunnelEvent";
import GuideCover from "@/components/guide/GuideCover";
import GuideTOC from "@/components/guide/GuideTOC";
import GuideSkim from "@/components/guide/GuideSkim";
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
import GuideOptInGate from "@/components/guide/GuideOptInGate";
import SiteFooter from "@/components/shared/SiteFooter";
import StateEntityWidget from "@/components/shared/StateEntityWidget";
import Seo from "@/components/shared/Seo";

const GUIDE_TAG_MAP: Record<number, { add: string; remove?: string }> = {
  25: { add: "g-guide-25pct" },
  50: { add: "g-guide-50pct", remove: "g-guide-25pct" },
  75: { add: "g-guide-75pct", remove: "g-guide-50pct" },
  100: { add: "g-guide-complete", remove: "g-guide-75pct" },
};

const GUIDE_EVENT_MAP: Record<number, string> = {
  25: "guide_read_25",
  50: "guide_read_50",
  75: "guide_read_75",
  100: "guide_read_100",
};

const SCROLL_THRESHOLDS = [25, 50, 75, 100] as const;

const GuidePage = () => {
  const { contactId, buildForwardParams } = useContactIdentity();
  const [accessGranted, setAccessGranted] = useState(!!contactId);
  const [generating, setGenerating] = useState(false);
  const taggedMount = useRef(false);

  const handleThreshold = useCallback(
    async (pct: number) => {
      console.log(`[Guide] Scroll threshold reached: ${pct}%`);
      const tagInfo = GUIDE_TAG_MAP[pct];
      const eventType = GUIDE_EVENT_MAP[pct];

      if (eventType) {
        try {
          await postFunnelEvent({
            contactId: contactId || undefined,
            eventType,
            metadata: {},
          });
        } catch (e) {
          console.error(`Failed to log ${eventType}:`, e);
        }
      }

      // Apply/replace GHL tags
      if (contactId && tagInfo) {
        try {
          await supabase.functions.invoke("tag-ghl-contact", {
            body: {
              contactId,
              tags: [tagInfo.add],
              ...(tagInfo.remove ? { removeTags: [tagInfo.remove] } : {}),
            },
          });
        } catch (e) {
          console.error(`Failed to tag at ${pct}%:`, e);
        }
      }
    },
    [contactId],
  );

  // Stable thresholds array
  const thresholds = useMemo(() => [...SCROLL_THRESHOLDS], []);

  const { logEvent } = useEngagementTracker({
    contactId,
    pageName: "guide",
    scrollThresholds: thresholds,
    onThreshold: handleThreshold,
  });

  // Tag known visitor + log guide_view on mount
  useEffect(() => {
    if (taggedMount.current) return;
    taggedMount.current = true;

    console.log("[Guide] Logging guide_view, contactId:", contactId);
    // Log guide_view event
    logEvent("guide_view");

    // Tag known visitors
    if (contactId) {
      supabase.functions
        .invoke("tag-ghl-contact", {
          body: { contactId, tags: ["c-clicked-rbc-guide"] },
        })
        .then(({ error }) => {
          if (error) console.error("[Guide] tag error:", error);
        })
        .catch((e) => console.error("[Guide] Failed to tag guide visitor:", e));
    }
  }, [contactId, logEvent]);

  const handleAccessGranted = () => {
    setAccessGranted(true);
  };

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

      // Log guide download
      void postFunnelEvent({
        contactId: contactId || undefined,
        eventType: "guide_download",
        metadata: { source: "sticky_cta_bar" },
      }).catch((e) => console.error("[Guide] Failed to log guide_download:", e));
    } catch (e) {
      console.error("PDF generation failed:", e);
    } finally {
      setGenerating(false);
    }
  }, [contactId]);

  if (!accessGranted) {
    return <GuideOptInGate onAccessGranted={handleAccessGranted} />;
  }

  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <Seo
        title="Why Most Realtors Don't Establish Separate Business Credit (Free Guide)"
        description="A 9-chapter guide for real estate agents and brokers: why business credit matters, the 7-step setup, timelines, and what it actually costs to keep using personal credit."
        path="/guide"
      />
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
              <Link to={`/one-on-one${buildForwardParams() ? `?${buildForwardParams()}` : ""}`}>
                <Calendar className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Book a One-on-One Session</span>
                <span className="sm:hidden">Book Session</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <GuideCover />
      <GuideSkim />
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
      <section className="container mx-auto max-w-3xl px-4 py-12">
        <StateEntityWidget />
      </section>
      <GuideConclusion />
      <GuideResources />

      <GuideProgressBar />
      <GuideFloatingTOC />
      <SiteFooter />
    </div>
  );
};

export default GuidePage;
