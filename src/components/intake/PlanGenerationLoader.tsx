import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const STEPS = [
  "Analyzing your answers…",
  "Mapping your fundability gaps…",
  "Building your 90-day action plan…",
  "Matching funding opportunities…",
  "Finalizing your recommendations…",
];

export default function PlanGenerationLoader({ compact = false }: { compact?: boolean }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % STEPS.length), 5000);
    return () => clearInterval(t);
  }, []);

  if (compact) {
    return (
      <div className="flex items-center gap-3 text-sm text-muted-foreground" role="status" aria-live="polite">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <span>{STEPS[i]}</span>
      </div>
    );
  }

  return (
    <Card className="max-w-xl mx-auto">
      <CardContent className="pt-10 pb-10 text-center space-y-5" role="status" aria-live="polite">
        <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground">Generating your personalized plan</h3>
          <p className="text-sm text-muted-foreground min-h-[1.5em] transition-opacity">{STEPS[i]}</p>
        </div>
        <p className="text-xs text-muted-foreground">This usually takes 20–40 seconds. Please don't close this tab.</p>
      </CardContent>
    </Card>
  );
}