import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  PHASE_BLURBS,
  PHASE_LABELS,
  PHASE_ORDER,
  type RoadmapTask,
  type TaskPhase,
  type TaskStatus,
} from "@/lib/roadmap";
import RoadmapTaskRow from "./RoadmapTaskRow";

interface Props {
  tasks: RoadmapTask[];
  savingKey: string | null;
  onStatusChange: (task: RoadmapTask, status: TaskStatus) => void;
}

export default function RoadmapChecklist({ tasks, savingKey, onStatusChange }: Props) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const phases = PHASE_ORDER.map((phase: TaskPhase) => {
    const inPhase = tasks.filter((t) => t.phase === phase);
    const done = inPhase.filter((t) => t.status === "completed").length;
    return { phase, tasks: inPhase, done, allDone: inPhase.length > 0 && done === inPhase.length };
  }).filter((p) => p.tasks.length > 0);

  return (
    <section aria-label="Your roadmap" className="space-y-3">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-bold text-secondary">Your roadmap</h2>
        <span className="text-xs text-muted-foreground">Built from your Needs Analysis answers</span>
      </div>

      {phases.map(({ phase, tasks: phaseTasks, done, allDone }) => {
        const isCollapsed = collapsed[phase] ?? allDone;
        return (
          <Card key={phase}>
            <button
              type="button"
              className="w-full text-left px-4 sm:px-5 py-3 flex items-center gap-3"
              onClick={() => setCollapsed((c) => ({ ...c, [phase]: !isCollapsed }))}
              aria-expanded={!isCollapsed}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-secondary">{PHASE_LABELS[phase]}</span>
                  <span className="text-xs text-muted-foreground">
                    {done}/{phaseTasks.length}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{PHASE_BLURBS[phase]}</p>
                <Progress value={Math.round((done / phaseTasks.length) * 100)} className="h-1 mt-2" />
              </div>
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${
                  isCollapsed ? "" : "rotate-180"
                }`}
              />
            </button>

            {!isCollapsed && (
              <CardContent className="pt-0 px-4 sm:px-5 pb-4 space-y-2">
                {phaseTasks.map((task) => (
                  <RoadmapTaskRow
                    key={task.key}
                    task={task}
                    saving={savingKey === task.key}
                    onStatusChange={onStatusChange}
                  />
                ))}
              </CardContent>
            )}
          </Card>
        );
      })}
    </section>
  );
}