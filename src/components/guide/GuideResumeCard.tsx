import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookmarkCheck, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tocItems } from "./guideChapters";
import { useGuideProgress } from "@/hooks/useGuideProgress";
import { postFunnelEvent } from "@/lib/logFunnelEvent";
import { useContactIdentity } from "@/hooks/useContactIdentity";

const labelFor = (id: string) => tocItems.find((i) => i.id === id)?.label ?? "";
const indexFor = (id: string) => tocItems.findIndex((i) => i.id === id) + 1;

const GuideResumeCard = () => {
  const { progress, syncing, completedSet, completedCount, totalCount } = useGuideProgress();
  const { contactId } = useContactIdentity();

  // Pin the resume target to the first saved position we see (local on mount,
  // or the server copy once it merges in) so the card doesn't shuffle while
  // the reader scrolls.
  const [pinned, setPinned] = useState<string | null>(() => progress.lastSectionId);
  useEffect(() => {
    if (!pinned && progress.lastSectionId) setPinned(progress.lastSectionId);
  }, [pinned, progress.lastSectionId]);

  const target = useMemo(() => {
    if (!pinned) return null;
    if (!completedSet.has(pinned)) return { id: pinned, isNext: false };
    const next = tocItems.find((i) => !completedSet.has(i.id));
    return next ? { id: next.id, isNext: true } : null;
  }, [pinned, completedSet]);

  const allDone = completedCount === totalCount && totalCount > 0;
  const visible = Boolean(pinned) || allDone;
  const label = target ? labelFor(target.id) : "";

  const loggedShown = useRef(false);
  useEffect(() => {
    if (!visible || syncing || loggedShown.current) return;
    loggedShown.current = true;
    void postFunnelEvent({
      contactId,
      eventType: "guide_resume_shown",
      metadata: { section_id: target?.id ?? null, completed: completedCount, total: totalCount },
    }).catch(() => undefined);
  }, [visible, syncing, contactId, target?.id, completedCount, totalCount]);

  // While the first sync is in flight and we have nothing local, reserve the
  // card's height so the page doesn't jump when it resolves.
  if (syncing && !visible) {
    return <div className="container mx-auto max-w-3xl px-4 pt-6" aria-hidden="true"><div className="h-[86px]" /></div>;
  }

  if (!visible) return null;

  const goTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    // Land keyboard focus in the resumed section.
    const heading = el.querySelector<HTMLElement>("h1, h2, h3") ?? el;
    heading.setAttribute("tabindex", "-1");
    window.setTimeout(() => heading.focus({ preventScroll: true }), 400);
    void postFunnelEvent({
      contactId,
      eventType: "guide_resume_clicked",
      metadata: { section_id: id },
    }).catch(() => undefined);
  };

  if (allDone || !target) {
    return (
      <div className="container mx-auto max-w-3xl px-4 pt-6">
        <div className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-4 sm:px-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <PartyPopper className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-secondary">
                You've completed the guide
              </p>
              <p className="text-sm text-muted-foreground">
                All {totalCount} sections marked complete. Ready for your customized plan?
              </p>
            </div>
          </div>
          <Button asChild size="sm">
            <Link to="/intake">Create My Plan</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 pt-6">
      <div className="rounded-xl border border-border bg-card shadow-card-soft px-4 py-4 sm:px-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <BookmarkCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
              {target.isNext ? "Next up" : "Pick up where you left off"}
            </p>
            <p className="mt-1 text-sm sm:text-base font-semibold text-secondary break-words">
              {label}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Section {indexFor(target.id)} of {totalCount} · {completedCount} marked complete
            </p>
          </div>
        </div>
        <Button
          size="sm"
          onClick={() => goTo(target.id)}
          aria-label={`Continue reading: ${label}`}
          className="min-h-11"
        >
          Continue reading
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default GuideResumeCard;
