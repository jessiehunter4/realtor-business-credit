import { useEffect, useMemo, useRef, useState } from "react";
import { BookmarkCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tocItems } from "./guideChapters";
import { useGuideProgress } from "@/hooks/useGuideProgress";
import { postFunnelEvent } from "@/lib/logFunnelEvent";
import { useContactIdentity } from "@/hooks/useContactIdentity";

const labelFor = (id: string) => tocItems.find((i) => i.id === id)?.label ?? "";

/**
 * Compact resume prompt shown when the reader lands mid-page (scroll restore)
 * so the top-of-page resume card isn't the only way back to their bookmark.
 */
const GuideResumeFloating = () => {
  const { progress, syncing, completedSet } = useGuideProgress();
  const { contactId } = useContactIdentity();
  const [dismissed, setDismissed] = useState(false);
  const [show, setShow] = useState(false);
  const logged = useRef(false);

  const target = useMemo(() => {
    const last = progress.lastSectionId;
    if (!last) return null;
    if (!completedSet.has(last)) return last;
    return tocItems.find((i) => !completedSet.has(i.id))?.id ?? null;
  }, [progress.lastSectionId, completedSet]);

  // Only surface it when the saved section is off-screen and we're not at the
  // top of the page (where the inline resume card already lives).
  useEffect(() => {
    if (!target || dismissed || syncing) {
      setShow(false);
      return;
    }
    const evaluate = () => {
      if (window.scrollY < 400) return setShow(false);
      const el = document.getElementById(target);
      if (!el) return setShow(true);
      const r = el.getBoundingClientRect();
      setShow(!(r.top < window.innerHeight * 0.8 && r.bottom > 0));
    };
    evaluate();
    window.addEventListener("scroll", evaluate, { passive: true });
    return () => window.removeEventListener("scroll", evaluate);
  }, [target, dismissed, syncing]);

  useEffect(() => {
    if (!show || logged.current) return;
    logged.current = true;
    void postFunnelEvent({
      contactId,
      eventType: "guide_resume_shown",
      metadata: { section_id: target, placement: "floating" },
    }).catch(() => undefined);
  }, [show, contactId, target]);

  if (!show || !target) return null;

  const goTo = () => {
    const el = document.getElementById(target);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setDismissed(true);
    void postFunnelEvent({
      contactId,
      eventType: "guide_resume_clicked",
      metadata: { section_id: target, placement: "floating" },
    }).catch(() => undefined);
  };

  return (
    <div
      className="fixed bottom-6 left-1/2 z-40 w-[min(24rem,calc(100vw-2rem))] -translate-x-1/2 lg:left-auto lg:right-[336px] lg:translate-x-0"
      style={{ bottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-center gap-3 rounded-full border border-border bg-card px-4 py-2.5 shadow-xl">
        <BookmarkCheck className="h-5 w-5 shrink-0 text-primary" />
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
            Pick up where you left off
          </p>
          <p className="truncate text-sm font-semibold text-secondary">{labelFor(target)}</p>
        </div>
        <Button size="sm" onClick={goTo} className="shrink-0 rounded-full">
          Resume
        </Button>
        <button
          type="button"
          aria-label="Dismiss resume prompt"
          onClick={() => setDismissed(true)}
          className="shrink-0 rounded-full p-1 text-muted-foreground hover:text-secondary"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default GuideResumeFloating;
