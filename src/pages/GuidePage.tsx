import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Download, Loader2, Menu, X } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { GuidePDF } from "@/components/GuidePDF";
import jessieHeadshot from "@/assets/jessie-hunter-headshot.png.asset.json";
import structureDiagram from "@/assets/guide-structure-diagram.png.asset.json";
import structureHowItWorks from "@/assets/guide-structure-how-it-works.png.asset.json";
import { supabase } from "@/integrations/supabase/client";
import { useContactIdentity } from "@/hooks/useContactIdentity";
import { useEngagementTracker } from "@/hooks/useEngagementTracker";
import { postFunnelEvent } from "@/lib/logFunnelEvent";
import GuideCover from "@/components/guide/GuideCover";
import GuideTOC from "@/components/guide/GuideTOC";
import GuideSkim from "@/components/guide/GuideSkim";
import GuideIntroduction from "@/components/guide/GuideIntroduction";
import Ch01 from "@/components/guide/chapters/Ch01";
import Ch02 from "@/components/guide/chapters/Ch02";
import Ch03 from "@/components/guide/chapters/Ch03";
import Ch04 from "@/components/guide/chapters/Ch04";
import Ch05 from "@/components/guide/chapters/Ch05";
import Ch06 from "@/components/guide/chapters/Ch06";
import Ch07 from "@/components/guide/chapters/Ch07";
import Ch08 from "@/components/guide/chapters/Ch08";
import Ch09 from "@/components/guide/chapters/Ch09";
import Ch10 from "@/components/guide/chapters/Ch10";
import Ch11 from "@/components/guide/chapters/Ch11";
import Ch12 from "@/components/guide/chapters/Ch12";
import Ch13 from "@/components/guide/chapters/Ch13";
import GuideConclusion from "@/components/guide/GuideConclusion";
import GuideResources from "@/components/guide/GuideResources";
import GuideFloatingTOC from "@/components/guide/GuideFloatingTOC";
import GuideProgressBar from "@/components/guide/GuideProgressBar";
import GuideOptInGate from "@/components/guide/GuideOptInGate";
import ChapterPlanCTA from "@/components/guide/ChapterPlanCTA";
import FloatingPlanCTA from "@/components/guide/FloatingPlanCTA";
import SiteFooter from "@/components/shared/SiteFooter";
import StateEntityWidget from "@/components/shared/StateEntityWidget";
import Seo from "@/components/shared/Seo";
import { cn } from "@/lib/utils";

const guideNavLinks = [
  { to: "/guide", label: "Guide" },
  { to: "/sample-plan", label: "Sample Plan" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
];

const guideMobileOnlyLinks = [
  { to: "/business-credit-cards-for-realtors", label: "Cards" },
];

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accessGranted, setAccessGranted] = useState(() => {
    if (contactId) return true;
    try {
      if (localStorage.getItem("rbc_guide_optin_completed") === "true") return true;
    } catch {
      // ignore
    }
    return false;
  });

  // Grant access to authenticated users automatically (they've already identified themselves).
  useEffect(() => {
    if (accessGranted) return;
    let cancelled = false;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!cancelled && session) {
        setAccessGranted(true);
        try {
          localStorage.setItem("rbc_guide_optin_completed", "true");
        } catch {
          // ignore
        }
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) {
        setAccessGranted(true);
        try {
          localStorage.setItem("rbc_guide_optin_completed", "true");
        } catch {
          // ignore
        }
      }
    });
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [accessGranted]);
  const [generating, setGenerating] = useState(false);
  const taggedMount = useRef(false);

  // Close mobile menu on Escape + lock body scroll while open
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [mobileMenuOpen]);

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
      const toDataUrl = async (url: string) => {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`fetch ${url} ${res.status}`);
        const blob = await res.blob();
        if (!blob.type.startsWith("image/")) {
          throw new Error(`not image: ${blob.type}`);
        }
        return await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      };
      const [headshotSrc, structureSrc, howItWorksSrc] = await Promise.all([
        toDataUrl(jessieHeadshot.url).catch(() => undefined),
        toDataUrl(structureDiagram.url).catch(() => undefined),
        toDataUrl(structureHowItWorks.url).catch(() => undefined),
      ]);
      const blob = await pdf(
        <GuidePDF
          headshotSrc={headshotSrc}
          structureSrc={structureSrc}
          howItWorksSrc={howItWorksSrc}
        />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "RE-Pro-Business-Credit-Guide.pdf";
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
        title="Real Estate Professional Business Finance & Credit Guide (Free)"
        description="A free Realtor-specific guide to business structure, finance, and credit — plus a 5-step interactive process to generate your own Customized Plan and a private RE Pro dashboard."
        path="/guide"
      />
      {/* Sticky CTA Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-secondary/95 backdrop-blur-sm border-b border-border shadow-lg">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-3.5 flex md:grid md:grid-cols-3 items-center gap-2">
          <div className="flex items-center justify-start min-w-0 flex-shrink">
            <Link
              to="/"
              className="text-secondary-foreground font-semibold text-sm md:text-base hover:text-primary transition-colors truncate"
            >
              <span className="hidden sm:inline">RE Pro Business Credit</span>
              <span className="sm:hidden">RE Pro Guide</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center justify-center gap-0.5 lg:gap-1 flex-nowrap whitespace-nowrap">
            {guideNavLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  cn(
                    "px-1.5 lg:px-2.5 py-1.5 rounded-full text-xs lg:text-sm font-medium whitespace-nowrap text-secondary-foreground/80 hover:text-secondary-foreground hover:bg-white/10 transition-colors",
                    isActive && "text-secondary-foreground bg-white/10"
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center justify-end gap-1.5 sm:gap-2 ml-auto flex-shrink-0">
            {/* Desktop: Download + Book */}
            <Button
              variant="outline"
              size="sm"
              className="hidden md:inline-flex text-xs sm:text-sm border-primary/40 text-primary hover:bg-primary/10 px-2 sm:px-3"
              onClick={handleDownload}
              disabled={generating}
            >
              {generating ? (
                <Loader2 className="sm:mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="sm:mr-2 h-4 w-4" />
              )}
              <span className="hidden sm:inline">{generating ? "Generating..." : "Download PDF"}</span>
            </Button>
            {/* Primary CTA stays visible on all breakpoints */}
            <Button asChild size="sm" className="text-xs sm:text-sm px-2.5 sm:px-3">
              <Link
                to={`/intake${buildForwardParams() ? `?${buildForwardParams()}` : ""}`}
              >
                <Calendar className="sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Create My Plan</span>
                <span className="sm:hidden">My Plan</span>
              </Link>
            </Button>
            {/* Mobile hamburger */}
            <button
              type="button"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="guide-mobile-menu"
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-full text-secondary-foreground hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        <div
          id="guide-mobile-menu"
          className={cn(
            "md:hidden overflow-hidden border-t border-white/10 transition-[max-height,opacity] duration-300 ease-out",
            mobileMenuOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="container mx-auto px-3 sm:px-4 py-3 flex flex-col gap-1 bg-secondary/95">
            {guideNavLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "px-3 py-2.5 rounded-lg text-sm font-medium text-secondary-foreground/85 hover:text-secondary-foreground hover:bg-white/10 transition-colors",
                    isActive && "text-secondary-foreground bg-white/10"
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="h-px bg-white/10 my-2" />
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-center border-primary/40 text-primary hover:bg-primary/10"
              onClick={() => {
                setMobileMenuOpen(false);
                handleDownload();
              }}
              disabled={generating}
            >
              {generating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              {generating ? "Generating..." : "Download PDF"}
            </Button>
            <Button asChild size="sm" className="w-full justify-center">
              <Link
                to={`/intake${buildForwardParams() ? `?${buildForwardParams()}` : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Create My Customized Plan
              </Link>
            </Button>
          </div>
        </div>
        <GuideProgressBar />
      </div>

      <GuideCover />
      <GuideSkim />
      <GuideTOC />
      <GuideIntroduction />
      <Ch01 />
      <ChapterPlanCTA />
      <Ch02 />
      <ChapterPlanCTA />
      <Ch03 />
      <ChapterPlanCTA />
      <Ch04 />
      <ChapterPlanCTA />
      <Ch05 />
      <ChapterPlanCTA />
      <Ch06 />
      <ChapterPlanCTA />
      <Ch07 />
      <ChapterPlanCTA />
      <Ch08 />
      <ChapterPlanCTA />
      <Ch09 />
      <ChapterPlanCTA />
      <Ch10 />
      <ChapterPlanCTA />
      <Ch11 />
      <ChapterPlanCTA />
      <Ch12 />
      <ChapterPlanCTA />
      <Ch13 />
      <ChapterPlanCTA />
      <section className="container mx-auto max-w-3xl px-4 py-12">
        <StateEntityWidget />
      </section>
      <GuideConclusion />
      <GuideResources />
      {/* Spacer so floating buttons don't cover final content on small screens */}
      <div className="h-20 sm:h-24" aria-hidden="true" />

      <GuideFloatingTOC />
      <FloatingPlanCTA />
      <SiteFooter />
    </div>
  );
};

export default GuidePage;
