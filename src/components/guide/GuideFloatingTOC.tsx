import { useState, useEffect } from "react";
import { BookOpen, CalendarDays, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { tocItems, chapterItems } from "./guideChapters";
import logoAsset from "@/assets/rbc-logo-transparent.png.asset.json";

const GuideFloatingTOC = () => {
  const [activeId, setActiveId] = useState<string>("");
  const [open, setOpen] = useState(false);

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
          className="fixed right-4 sm:right-6 z-40 h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-xl bg-secondary text-secondary-foreground hover:bg-secondary/90"
          style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
        >
          <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[320px] sm:w-[380px] overflow-y-auto p-0">
        <div className="px-5 pt-5 pb-4 border-b border-border">
          <img src={logoAsset.url} alt="RE Pro Business Credit" className="h-9 w-auto" />
        </div>
        <SheetHeader className="px-5 pt-5 pb-3 space-y-0.5 text-left">
          <SheetTitle className="text-xs font-bold uppercase tracking-[0.14em] text-secondary">
            Guide Contents
          </SheetTitle>
          <p className="text-sm text-muted-foreground">
            {chapterItems.length} Chapters · 20 min read
          </p>
        </SheetHeader>
        <nav className="px-3 pb-4 space-y-1.5">
          {tocItems.map((item, index) => {
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`group w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                  isActive
                    ? "bg-primary/10 border-l-[3px] border-primary"
                    : "border-l-[3px] border-transparent hover:bg-muted"
                }`}
              >
                <span
                  className={`shrink-0 grid h-8 w-8 place-items-center rounded-lg border text-sm font-bold ${
                    isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-secondary"
                  }`}
                >
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={`block truncate text-sm font-semibold ${
                      isActive ? "text-primary" : "text-secondary"
                    }`}
                  >
                    {item.short ?? item.label}
                  </span>
                  {item.sub && (
                    <span className="block truncate text-xs text-muted-foreground">{item.sub}</span>
                  )}
                </span>
                {isActive && <Home className="h-4 w-4 shrink-0 text-primary" />}
              </button>
            );
          })}
        </nav>
        <div className="px-4 pb-6">
          <div className="rounded-xl border border-border bg-muted/40 p-4">
            <div className="flex items-start gap-3">
              <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-semibold text-primary">Ready to get started?</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Create your customized plan and see your next steps.
                </p>
              </div>
            </div>
            <Button asChild className="mt-4 w-full rounded-lg font-semibold">
              <Link to="/intake" onClick={() => setOpen(false)}>
                Build My Custom Plan
              </Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default GuideFloatingTOC;
