import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookmarkCheck, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tocItems } from "./guideChapters";
import { readGuideProgress } from "@/lib/guideProgress";
import { useGuideProgress } from "@/hooks/useGuideProgress";

const labelFor = (id: string) => tocItems.find((i) => i.id === id)?.label ?? "";

const GuideResumeCard = () => {
  // Snapshot the saved position once on mount so the card doesn't shuffle
  // while the reader is scrolling.
  const [snapshot] = useState(() => readGuideProgress());
  const { completedSet, completedCount, totalCount } = useGuideProgress();

  const target = useMemo(() => {
    if (!snapshot.lastSectionId) return null;
    if (!completedSet.has(snapshot.lastSectionId)) {
      return { id: snapshot.lastSectionId, isNext: false };
    }
    const next = tocItems.find((i) => !completedSet.has(i.id));
    return next ? { id: next.id, isNext: true } : null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snapshot.lastSectionId, completedSet]);

  if (!snapshot.lastSectionId) return null;

  const allDone = completedCount === totalCount && totalCount > 0;

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
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

  const label = labelFor(target.id);

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
          </div>
        </div>
        <Button
          size="sm"
          onClick={() => scrollTo(target.id)}
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