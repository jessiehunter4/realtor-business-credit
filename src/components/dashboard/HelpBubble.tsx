import { type ReactNode, useState } from "react";
import { HelpCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

export interface HelpBubbleProps {
  title: string;
  /** Short one-line summary rendered above the sections. */
  summary?: string;
  sections?: Array<{ label: string; body: ReactNode }>;
  footer?: ReactNode;
  /** Optional callback fired the first time the bubble is opened. */
  onOpen?: () => void;
  className?: string;
  size?: "sm" | "md";
}

function HelpBody({ summary, sections, footer }: Pick<HelpBubbleProps, "summary" | "sections" | "footer">) {
  return (
    <div className="space-y-3 text-sm">
      {summary && <p className="text-muted-foreground">{summary}</p>}
      {sections?.map((s) => (
        <div key={s.label}>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">{s.label}</p>
          <div className="text-muted-foreground mt-0.5 leading-relaxed">{s.body}</div>
        </div>
      ))}
      {footer && <div className="pt-1 border-t border-border text-xs text-muted-foreground">{footer}</div>}
    </div>
  );
}

export default function HelpBubble({
  title,
  summary,
  sections,
  footer,
  onOpen,
  className = "",
  size = "sm",
}: HelpBubbleProps) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [logged, setLogged] = useState(false);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next && !logged) {
      setLogged(true);
      onOpen?.();
    }
  };

  const icon = (
    <HelpCircle className={size === "sm" ? "h-4 w-4" : "h-[1.1rem] w-[1.1rem]"} />
  );
  const triggerClass = `inline-flex items-center justify-center shrink-0 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
    size === "sm" ? "h-6 w-6" : "h-7 w-7"
  } ${className}`;

  if (isMobile) {
    return (
      <>
        <button
          type="button"
          aria-label={`What does "${title}" mean?`}
          className={triggerClass}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleOpenChange(true);
          }}
        >
          {icon}
        </button>
        <Drawer open={open} onOpenChange={handleOpenChange}>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle className="text-base text-secondary">{title}</DrawerTitle>
              <DrawerDescription className="sr-only">Explanation of this step</DrawerDescription>
            </DrawerHeader>
            <div className="px-4 pb-8 max-h-[65vh] overflow-y-auto">
              <HelpBody summary={summary} sections={sections} footer={footer} />
            </div>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`What does "${title}" mean?`}
          className={triggerClass}
          onClick={(e) => e.stopPropagation()}
        >
          {icon}
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[22rem] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
        <p className="font-semibold text-secondary text-sm mb-2">{title}</p>
        <HelpBody summary={summary} sections={sections} footer={footer} />
      </PopoverContent>
    </Popover>
  );
}
