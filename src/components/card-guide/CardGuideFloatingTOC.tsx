import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cardTocItems } from "./cardGuideChapters";

const CardGuideFloatingTOC = () => {
  const [activeId, setActiveId] = useState<string>("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );
    cardTocItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          aria-label="Open table of contents"
          className="fixed right-4 sm:right-6 z-40 h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-xl bg-secondary text-secondary-foreground hover:bg-secondary/90"
          style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
        >
          <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[320px] sm:w-[380px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-secondary text-lg">Table of Contents</SheetTitle>
        </SheetHeader>
        <nav className="mt-6 space-y-1">
          {cardTocItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors ${
                activeId === item.id
                  ? "bg-primary/10 text-primary font-semibold border-l-[3px] border-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default CardGuideFloatingTOC;