import { useState, useEffect } from "react";
import { BookOpen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface TOCItem {
  id: string;
  label: string;
  isChapter: boolean;
}

const tocItems: TOCItem[] = [
  { id: "introduction", label: "Introduction", isChapter: true },
  { id: "chapter-1", label: "Chapter 1: My Story", isChapter: true },
  { id: "chapter-2", label: "Chapter 2: What Business Credit Is", isChapter: true },
  { id: "chapter-3", label: "Chapter 3: The True Cost", isChapter: true },
  { id: "chapter-4", label: "Chapter 4: Questions & Objections", isChapter: true },
  { id: "chapter-5", label: "Chapter 5: The Seven-Step Process", isChapter: true },
  { id: "chapter-6", label: "Chapter 6: The Emotional Journey", isChapter: true },
  { id: "chapter-7", label: "Chapter 7: Professional Guidance", isChapter: true },
  { id: "chapter-8", label: "Chapter 8: Success Stories", isChapter: true },
  { id: "chapter-9", label: "Chapter 9: Advanced Strategies", isChapter: true },
  { id: "conclusion", label: "Conclusion: Your Next Steps", isChapter: true },
  { id: "resources", label: "Resources", isChapter: true },
];

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
      <SheetContent side="right" className="w-[320px] sm:w-[380px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-secondary text-lg">Table of Contents</SheetTitle>
        </SheetHeader>
        <nav className="mt-6 space-y-1">
          {tocItems.map((item) => (
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

export default GuideFloatingTOC;
