import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, CheckCircle2, Flag, ListTodo, Layers } from "lucide-react";
import { PHASE_BLURBS, PHASE_LABELS, type RoadmapMetrics } from "@/lib/roadmap";
import HelpBubble from "./HelpBubble";
import { PhaseHelpBubble } from "./TaskHelpBubble";

export default function ProgressSummary({
  metrics,
  planId,
}: {
  metrics: RoadmapMetrics;
  planId?: string | null;
}) {
  const phaseLabel = metrics.currentPhase ? PHASE_LABELS[metrics.currentPhase] : "Complete";

  return (
    <section aria-label="Your progress" className="space-y-3">
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
              <ListTodo className="h-4 w-4" /> Overall
              <HelpBubble
                title="Overall progress"
                className="ml-auto"
                sections={[
                  {
                    label: "What this means",
                    body:
                      "The share of every step on your roadmap that you've marked complete — across all five stages.",
                  },
                  {
                    label: "How to move it",
                    body:
                      "Work top down. The steps are ordered so earlier ones unlock the later ones; skipping ahead usually stalls.",
                  },
                ]}
              />
            </div>
            <div className="mt-2 text-2xl font-bold text-secondary">{metrics.overallPct}%</div>
            <Progress value={metrics.overallPct} className="h-1.5 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
              <CheckCircle2 className="h-4 w-4" /> Completed
              <HelpBubble
                title="Completed steps"
                className="ml-auto"
                sections={[
                  {
                    label: "What this means",
                    body:
                      "How many roadmap steps you've marked done out of the total generated from your Needs Analysis answers.",
                  },
                  {
                    label: "Note",
                    body:
                      "Some steps start out complete because your intake answers showed they were already handled. You can reopen any of them.",
                  },
                ]}
              />
            </div>
            <div className="mt-2 text-2xl font-bold text-secondary">
              {metrics.completed}
              <span className="text-base font-medium text-muted-foreground">/{metrics.total}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">{metrics.remaining} remaining</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
              <Layers className="h-4 w-4" /> Current stage
              {metrics.currentPhase ? (
                <span className="ml-auto">
                  <PhaseHelpBubble phase={metrics.currentPhase} planId={planId} />
                </span>
              ) : null}
            </div>
            <div className="mt-2 text-lg font-semibold text-secondary">{phaseLabel}</div>
            <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {metrics.currentPhase ? PHASE_BLURBS[metrics.currentPhase] : "Every stage is done — time to talk strategy."}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
              <Flag className="h-4 w-4" /> Milestones
              <HelpBubble
                title="Milestones"
                className="ml-auto"
                sections={[
                  {
                    label: "What this means",
                    body:
                      "A milestone is a full stage finished — Foundation, Credibility, Bureau Profiles, Tradelines, Funding.",
                  },
                  {
                    label: "Why it matters",
                    body:
                      "Each completed stage unlocks the next set of options. Two or three milestones in is usually where funding starts to feel real.",
                  },
                ]}
              />
            </div>
            <div className="mt-2 text-2xl font-bold text-secondary">
              {metrics.milestonesAchieved}
              <span className="text-base font-medium text-muted-foreground">/{metrics.phases.length}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">stages complete</div>
          </CardContent>
        </Card>
      </div>

      {/* Stage rail */}
      <div className="grid grid-cols-5 gap-1.5" aria-hidden>
        {metrics.phases.map((p) => (
          <div key={p.phase} className="space-y-1">
            <div className="flex justify-center h-5">
              {p.complete ? (
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
              ) : (
                <span className="h-5 w-5 rounded-full border-2 border-muted bg-background" />
              )}
            </div>
            <div
              className={`h-1.5 rounded-full ${
                p.complete ? "bg-primary" : p.completed > 0 ? "bg-primary/40" : "bg-muted"
              }`}
            />
            <div className="text-[10px] sm:text-xs text-muted-foreground truncate">{p.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}