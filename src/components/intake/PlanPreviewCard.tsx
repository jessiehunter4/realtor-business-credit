import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  onGenerate: () => void;
  disabled?: boolean;
}

const BULLETS = [
  "Your Goals Snapshot — the top priorities you told us matter most",
  "Fundability Assessment — where you're strong and where the gaps are",
  "90-Day Action Plan — clear, prioritized steps to start today",
  "6–12 Month Roadmap — milestones for building durable business credit",
  "Funding Opportunities & Program Recommendation — matched to your situation",
];

export default function PlanPreviewCard({ onGenerate, disabled }: Props) {
  return (
    <Card className="max-w-2xl mx-auto border-primary/20 shadow-lg">
      <CardContent className="pt-8 pb-8 px-6 md:px-10 space-y-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium mx-auto">
          <Sparkles className="h-3.5 w-3.5" /> Your survey is in
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
            Ready to generate your personalized plan?
          </h2>
          <p className="text-muted-foreground">
            In about 30 seconds we'll build a custom RE Pro Business Credit Plan based on the answers you just gave us.
          </p>
        </div>
        <ul className="text-left space-y-3 max-w-xl mx-auto">
          {BULLETS.map((b) => (
            <li key={b} className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm md:text-base text-foreground">{b}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-col items-center gap-3 pt-2">
          <Button
            size="lg"
            onClick={onGenerate}
            disabled={disabled}
            className="w-full sm:w-auto sm:min-w-[320px] h-12 text-base"
          >
            Generate My Personalized Plan
          </Button>
          <Link to="/sample-plan" className="text-xs text-muted-foreground underline underline-offset-4 hover:text-primary">
            See a sample plan first
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}