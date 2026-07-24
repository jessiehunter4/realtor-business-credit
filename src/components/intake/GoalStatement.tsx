import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface GoalStatementProps {
  goals: string[];
  pains: string[];
  name?: string;
}

function joinPhrase(items: string[]): string {
  const clean = items.filter(Boolean);
  if (clean.length === 0) return "";
  if (clean.length === 1) return clean[0];
  if (clean.length === 2) return `${clean[0]} and ${clean[1]}`;
  return `${clean.slice(0, -1).join(", ")}, and ${clean[clean.length - 1]}`;
}

/**
 * Live "what you want" summary that updates as the user picks
 * goals and financial pains. Renders nothing until at least one
 * selection is made so it doesn't clutter an empty form.
 */
export default function GoalStatement({ goals, pains, name }: GoalStatementProps) {
  const goalPhrase = joinPhrase(goals.map((g) => g.toLowerCase()));
  const painPhrase = joinPhrase(pains.map((p) => p.toLowerCase()));

  if (!goalPhrase && !painPhrase) return null;

  const who = name?.trim() ? name.trim() : "You";

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="pt-5 pb-5 space-y-2">
        <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wide">
          <Sparkles className="h-3.5 w-3.5" />
          Your goal statement (updates as you choose)
        </div>
        <p className="text-sm text-foreground leading-relaxed">
          {goalPhrase ? (
            <>
              <span className="font-semibold">{who}</span> want to <span className="font-semibold">{goalPhrase}</span>
              {painPhrase ? (
                <>
                  {" "}— while solving <span className="font-semibold">{painPhrase}</span>.
                </>
              ) : (
                "."
              )}
            </>
          ) : (
            <>
              <span className="font-semibold">{who}</span> want to solve <span className="font-semibold">{painPhrase}</span>.
            </>
          )}
        </p>
        <p className="text-xs text-muted-foreground">
          Your custom plan will be built around this statement.
        </p>
      </CardContent>
    </Card>
  );
}