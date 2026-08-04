import { Link } from "react-router-dom";
import { CheckCircle2, Circle, Clock, Loader2, Lock, PlayCircle } from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TASK_BY_KEY, type RoadmapTask, type TaskStatus } from "@/lib/roadmap";
import { TaskHelpBubble } from "./TaskHelpBubble";

interface Props {
  task: RoadmapTask;
  saving: boolean;
  onStatusChange: (task: RoadmapTask, status: TaskStatus) => void;
  planId?: string | null;
}

function relative(iso?: string | null) {
  if (!iso) return null;
  try {
    return `${formatDistanceToNowStrict(new Date(iso))} ago`;
  } catch {
    return null;
  }
}

export default function RoadmapTaskRow({ task, saving, onStatusChange, planId }: Props) {
  const done = task.status === "completed";
  const stamp = done
    ? relative(task.completedAt ?? task.updatedAt)
    : task.status === "in_progress"
      ? relative(task.updatedAt)
      : null;
  const blockedLabel = task.blockedBy
    .map((k) => TASK_BY_KEY[k]?.title ?? k)
    .join(", ");

  return (
    <div
      className={`rounded-lg border p-3 sm:p-4 transition-colors ${
        done ? "border-primary/30 bg-primary/5" : task.blocked ? "border-border bg-muted/30" : "border-border bg-card"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">
          {done ? (
            <CheckCircle2 className="h-5 w-5 text-primary" />
          ) : task.blocked ? (
            <Lock className="h-5 w-5 text-muted-foreground" />
          ) : task.status === "in_progress" ? (
            <PlayCircle className="h-5 w-5 text-primary" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className={`font-medium ${done ? "text-muted-foreground line-through" : "text-secondary"}`}>
              {task.title}
            </p>
            <TaskHelpBubble task={task} planId={planId} />
            {task.status === "in_progress" && (
              <Badge variant="outline" className="text-[10px]">In progress</Badge>
            )}
            {task.source === "intake" && done && (
              <Badge variant="secondary" className="text-[10px]">From your intake</Badge>
            )}
          </div>

          {!done && <p className="text-sm text-muted-foreground mt-1">{task.explanation}</p>}
          {task.detail && done && <p className="text-xs text-muted-foreground mt-1">{task.detail}</p>}
          {stamp && (
            <p className="text-xs text-muted-foreground mt-1">
              {done ? "Completed" : "Started"} {stamp}
            </p>
          )}

          {!done && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {task.effort}
              </span>
              {task.blocked && <span>Unlocks after: {blockedLabel}</span>}
              {task.actionHref && (
                <Link to={task.actionHref} className="text-primary hover:underline">
                  {task.actionLabel ?? "Learn how"} →
                </Link>
              )}
            </div>
          )}
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row gap-1.5">
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mt-2" />
          ) : done ? (
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full text-xs"
              onClick={() => onStatusChange(task, "not_started")}
            >
              Undo
            </Button>
          ) : (
            <>
              {task.status !== "in_progress" && !task.blocked && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-xs"
                  onClick={() => onStatusChange(task, "in_progress")}
                >
                  Start
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-xs"
                onClick={() => onStatusChange(task, "completed")}
              >
                Done
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}