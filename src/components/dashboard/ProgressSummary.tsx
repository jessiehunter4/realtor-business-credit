import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Flag, ListTodo, Layers } from "lucide-react";
import { PHASE_BLURBS, PHASE_LABELS, type RoadmapMetrics } from "@/lib/roadmap";

export default function ProgressSummary({ metrics }: { metrics: RoadmapMetrics }) {
  const phaseLabel = metrics.currentPhase ? PHASE_LABELS[metrics.currentPhase] : "Complete";

  return (
    <section aria-label="Your progress" className="space-y-3">
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
              <ListTodo className="h-4 w-4" /> Overall
            </div>
            <div className="mt-2 text-2xl font-bold text-secondary">{metrics.overallPct}%</div>
            <Progress value={metrics.overallPct} className="h-1.5 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
              <CheckCircle2 className="h-4 w-4" /> Completed
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
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
              <Layers className="h-4 w-4" /> Current stage
            </div>
            <div className="mt-2 text-lg font-semibold text-secondary">{phaseLabel}</div>
            <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {metrics.currentPhase ? PHASE_BLURBS[metrics.currentPhase] : "Every stage is done — time to talk strategy."}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
              <Flag className="h-4 w-4" /> Milestones
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