import { useEffect, useState } from "react";
import { chapterItems } from "./guideChapters";
import { cn } from "@/lib/utils";

const GuideChapterRail = () => {
  const [activeId, setActiveId] = useState<string>("");

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

  return (
    <nav
      aria-label="Chapter navigation"
      className="hidden md:flex fixed right-3 lg:right-4 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-1 rounded-full border border-border bg-background/90 backdrop-blur px-1.5 py-2 shadow-lg"
    >
      {chapterItems.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => scrollTo(item.id)}
          title={item.label}
          aria-label={item.label}
          aria-current={activeId === item.id ? "true" : undefined}
          className={cn(
            "group relative h-7 w-7 rounded-full text-xs font-semibold transition-colors",
            activeId === item.id
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          {item.number}
          <span className="pointer-events-none absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-secondary px-2 py-1 text-[11px] font-medium text-secondary-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100">
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
};

export default GuideChapterRail;
