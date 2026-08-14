import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { tocItems } from "./guideChapters";
import ChapterCheckbox from "./ChapterCheckbox";
import { useGuideProgress } from "@/hooks/useGuideProgress";

const GuideFloatingTOC = () => {
  const [activeId, setActiveId] = useState<string>("");
  const [open, setOpen] = useState(false);
  const { isCompleted, toggle, completedCount, totalCount } = useGuideProgress();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    tocItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setOpen(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="fixed right-4 sm:right-6 z-40 h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-xl bg-secondary text-secondary-foreground hover:bg-success-green hover:text-white active:bg-success-green-hover"
          style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
        >
          <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[320px] sm:w-[380px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-secondary text-lg">Table of Contents</SheetTitle>
          <p className="text-left text-xs text-muted-foreground">
            {completedCount} of {totalCount} sections complete
          </p>
        </SheetHeader>
        <nav className="mt-6 space-y-1">
          {tocItems.map((item) => {
            const done = isCompleted(item.id);
            return (
              <div key={item.id} className="flex items-center gap-1">
                <ChapterCheckbox
                  idPrefix="floating-toc"
                  sectionId={item.id}
                  label={item.label}
                  checked={done}
                  onToggle={(next) => toggle(item.id, next)}
                  className="min-h-11 min-w-11"
                />
                <button
                  onClick={() => scrollTo(item.id)}
                  aria-current={activeId === item.id ? "true" : undefined}
                  className={`flex-1 min-h-11 text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    activeId === item.id
                      ? "bg-primary/10 text-primary font-semibold border-l-[3px] border-primary"
                      : done
                        ? "text-muted-foreground/70 hover:bg-primary/10 hover:text-primary active:bg-primary/20"
                        : "text-muted-foreground hover:bg-primary/10 hover:text-primary active:bg-primary/20"
                  }`}
                >
                  {item.label}
                </button>
              </div>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default GuideFloatingTOC;
