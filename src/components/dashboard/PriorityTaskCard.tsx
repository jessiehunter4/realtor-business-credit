import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Clock, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PHASE_LABELS, type RoadmapTask, type TaskStatus } from "@/lib/roadmap";

interface Props {
  task: RoadmapTask | null;
  saving: boolean;
  onStatusChange: (task: RoadmapTask, status: TaskStatus) => void;
}

export default function PriorityTaskCard({ task, saving, onStatusChange }: Props) {
  if (!task) {
    return (
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <Sparkles className="h-5 w-5" /> Everything on your roadmap is done
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Bring this to your next coaching call and let's talk about stacking real capacity.
          </p>
          <Link to="/pricing" className="inline-block mt-3">
            <Button size="sm" className="rounded-full">See coaching options</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/40 shadow-sm">
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-xs uppercase tracking-wide font-semibold text-primary">
            Your next step
          </span>
          <Badge variant="secondary" className="text-[10px]">{PHASE_LABELS[task.phase]}</Badge>
          {task.status === "in_progress" && (
            <Badge variant="outline" className="text-[10px]">In progress</Badge>
          )}
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-secondary leading-snug">{task.title}</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-2xl">{task.explanation}</p>

        <div className="mt-3 rounded-lg bg-muted/50 px-3 py-2 text-sm text-secondary">
          <span className="font-semibold">Do this: </span>
          {task.nextAction}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
          <Clock className="h-3.5 w-3.5" /> Est. effort: {task.effort}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button
            className="rounded-full"
            disabled={saving}
            onClick={() => onStatusChange(task, "completed")}
          >
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
            Mark complete
          </Button>
          {task.status !== "in_progress" && (
            <Button
              variant="outline"
              className="rounded-full"
              disabled={saving}
              onClick={() => onStatusChange(task, "in_progress")}
            >
              I'm working on it
            </Button>
          )}
          {task.actionHref && (
            <Link to={task.actionHref} className="sm:ml-auto">
              <Button variant="ghost" className="rounded-full w-full sm:w-auto">
                {task.actionLabel ?? "Learn how"} <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}