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
  isNextUp?: boolean;
}

function relative(iso?: string | null) {
  if (!iso) return null;
  try {
    return `${formatDistanceToNowStrict(new Date(iso))} ago`;
  } catch {
    return null;
  }
}

export default function RoadmapTaskRow({ task, saving, onStatusChange, planId, isNextUp }: Props) {
  const done = task.status === "completed";
  const active = task.status === "in_progress";
  const upcoming = !done && !active && !task.blocked;
  const stamp = done
    ? relative(task.completedAt ?? task.updatedAt)
    : task.status === "in_progress"
      ? relative(task.updatedAt)
      : null;
  const blockedLabel = task.blockedBy
    .map((k) => TASK_BY_KEY[k]?.title ?? k)
    .join(", ");

  const stateLabel = done
    ? "Completed"
    : active
      ? "In progress"
      : task.blocked
        ? "Locked"
        : "Not started";

  const shell = done
    ? "border-border bg-muted/40"
    : active
      ? "border-primary bg-primary/5 ring-1 ring-primary/30 shadow-sm"
      : task.blocked
        ? "border-dashed border-border bg-muted/30"
        : isNextUp
          ? "border-primary/40 bg-card"
          : "border-border bg-card";

  return (
    <div
      aria-label={`${task.title} — ${stateLabel}`}
      className={`rounded-lg border p-3 sm:p-4 transition-colors ${shell}`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">
          {done ? (
            <CheckCircle2 className="h-5 w-5 text-primary/70" />
          ) : task.blocked ? (
            <Lock className="h-5 w-5 text-muted-foreground/70" />
          ) : active ? (
            <PlayCircle className="h-5 w-5 text-primary" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p
              className={`font-medium ${
                done
                  ? "text-muted-foreground line-through"
                  : task.blocked
                    ? "text-muted-foreground"
                    : active
                      ? "text-secondary font-semibold"
                      : "text-secondary"
              }`}
            >
              {task.title}
            </p>
            <TaskHelpBubble task={task} planId={planId} />
            {active && (
              <Badge className="text-[10px]">In progress</Badge>
            )}
            {isNextUp && !active && !done && !task.blocked && (
              <Badge variant="outline" className="text-[10px] border-primary text-primary">Next up</Badge>
            )}
            {task.blocked && (
              <Badge variant="outline" className="text-[10px] text-muted-foreground">Locked</Badge>
            )}
            {task.source === "intake" && done && (
              <Badge variant="secondary" className="text-[10px]">From your intake</Badge>
            )}
          </div>

          {!done && (
            <p className={`text-sm mt-1 ${upcoming || task.blocked ? "text-muted-foreground" : "text-secondary/80"}`}>
              {task.explanation}
            </p>
          )}
          {active && (
            <div className="mt-2 rounded-md bg-background/70 border border-primary/20 px-3 py-2 text-sm text-secondary">
              <span className="font-semibold">Do this: </span>
              {task.nextAction}
            </div>
          )}
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
              className="rounded-full text-xs min-h-10"
              onClick={() => onStatusChange(task, "not_started")}
            >
              Undo
            </Button>
          ) : (
            <>
              {!active && !task.blocked && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-xs min-h-10"
                  onClick={() => onStatusChange(task, "in_progress")}
                >
                  Start
                </Button>
              )}
              <Button
                variant={active ? "default" : "outline"}
                size="sm"
                className="rounded-full text-xs min-h-10"
                onClick={() => onStatusChange(task, "completed")}
              >
                {active ? "Mark complete" : "Mark as Done?"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}