import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Check, ChevronRight, List, X } from "lucide-react";
import { chapterItems } from "./guideChapters";
import ChapterCheckbox from "./ChapterCheckbox";
import { useGuideProgress } from "@/hooks/useGuideProgress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const GuideChapterRail = () => {
  const [activeId, setActiveId] = useState<string>("");
  const [open, setOpen] = useState(true);
  const { isCompleted, toggle, completedCount, totalCount } = useGuideProgress();
  const showCta = false; // hidden per request
  const visible = false; // entire rail hidden per request

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );
    chapterItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!visible) return null;

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open guide contents"
        className="hidden lg:inline-flex fixed right-4 top-1/2 -translate-y-1/2 z-30 items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-semibold text-secondary shadow-lg hover:border-success-green hover:bg-success-green hover:text-white active:bg-success-green-hover transition-colors"
      >
        <List className="h-4 w-4 text-primary" />
        Contents
      </button>
    );
  }

  return (
    <nav
      aria-label="Guide contents"
      className="hidden lg:flex fixed right-4 top-1/2 -translate-y-1/2 z-30 w-[300px] max-h-[82vh] flex-col rounded-2xl border border-border bg-card shadow-xl overflow-hidden"
    >
      <div className="flex items-start justify-between gap-2 px-5 pt-5 pb-3 border-b border-border">
        <div>
          <p className="text-[11px] font-bold tracking-[0.14em] text-secondary uppercase">
            Guide Contents
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {completedCount} of {totalCount} complete
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close guide contents"
          className="rounded-full p-1 text-muted-foreground hover:text-primary hover:bg-primary/10 active:bg-primary/20 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {chapterItems.map((item) => {
          const isActive = activeId === item.id;
          const done = isCompleted(item.id);
          return (
            <div
              key={item.id}
              className={cn(
                "flex items-center gap-1 rounded-lg border-l-[3px] transition-colors",
                isActive ? "border-primary bg-primary/10" : "border-transparent",
              )}
            >
              <ChapterCheckbox
                idPrefix="rail"
                sectionId={item.id}
                label={item.title}
                checked={done}
                onToggle={(next) => toggle(item.id, next)}
                className="ml-1.5"
              />
              <button
                type="button"
                onClick={() => scrollTo(item.id)}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "group flex-1 min-w-0 flex items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors",
                  !isActive && "hover:bg-primary/10 hover:text-primary active:bg-primary/20",
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border text-sm font-bold",
                    isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : done
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-border bg-background text-secondary",
                  )}
                >
                  {done && !isActive ? <Check className="h-4 w-4" /> : item.number}
                </span>
                <span className="min-w-0">
                  <span
                    className={cn(
                      "block truncate text-sm font-semibold",
                      isActive ? "text-primary" : done ? "text-secondary/70" : "text-secondary",
                    )}
                  >
                    {item.title}
                  </span>
                  {item.subtitle && (
                    <span className="block truncate text-xs text-muted-foreground">
                      {item.subtitle}
                    </span>
                  )}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {showCta && (
        <div className="border-t border-border p-4">
          <div className="rounded-xl border border-border bg-muted/40 p-4">
            <div className="flex items-start gap-2">
              <CalendarDays className="h-4 w-4 mt-0.5 text-primary shrink-0" />
              <div>
                <p className="text-sm font-semibold text-primary">Ready to get started?</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Create your customized plan and walk away with clear next steps.
                </p>
              </div>
            </div>
            <Button asChild className="mt-3 w-full">
              <Link to="/intake">
                Get Started
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default GuideChapterRail;
