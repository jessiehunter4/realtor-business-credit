import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PartyPopper } from "lucide-react";

interface Props {
  planId: string;
  contactEmail?: string;
  onPrimary: () => void;
  primaryLabel?: string;
  secondary?: { label: string; onClick: () => void };
  heading?: string;
  subheading?: string;
  autoAdvanceMs?: number;
}

export default function PlanSuccessCelebration({
  planId,
  onPrimary,
  primaryLabel = "View My Plan",
  secondary,
  heading = "🎉 Your Plan Is Ready",
  subheading = "Your personalized RE Pro Business Credit Plan has been generated and saved. Let's take a look.",
  autoAdvanceMs,
}: Props) {
  const firedRef = useRef(false);
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    headingRef.current?.focus();
    if (reduce) return;
    // Lazy-load confetti so SSR / non-browser paths don't break.
    import("canvas-confetti").then(({ default: confetti }) => {
      const end = Date.now() + 1200;
      const colors = ["#3eaf7c", "#f59e0b", "#1e3a5f"];
      (function frame() {
        confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0, y: 0.7 }, colors });
        confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, colors });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();
      confetti({ particleCount: 80, spread: 90, origin: { y: 0.3 }, colors });
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!autoAdvanceMs) return;
    const t = setTimeout(onPrimary, autoAdvanceMs);
    return () => clearTimeout(t);
  }, [autoAdvanceMs, onPrimary]);

  return (
    <Card className="max-w-xl mx-auto border-primary/30 shadow-xl">
      <CardContent className="pt-10 pb-10 text-center space-y-5" role="status" aria-live="polite">
        <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
          <PartyPopper className="h-8 w-8 text-primary" />
        </div>
        <h2 ref={headingRef} tabIndex={-1} className="text-2xl md:text-3xl font-semibold text-foreground focus:outline-none">
          {heading}
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">{subheading}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button size="lg" onClick={onPrimary} className="w-full sm:w-auto sm:min-w-[220px]">
            {primaryLabel}
          </Button>
          {secondary && (
            <Button size="lg" variant="outline" onClick={secondary.onClick} className="w-full sm:w-auto">
              {secondary.label}
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">Plan ID: {planId.slice(0, 8)}</p>
      </CardContent>
    </Card>
  );
}