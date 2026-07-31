import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  computeMetrics,
  deriveRoadmap,
  logRoadmapEvent,
  pickPriorityTask,
  type IntakeSurveyLike,
  type PlanDataLike,
  type ProgressRowLike,
  type RoadmapTask,
  type TaskStatus,
} from "@/lib/roadmap";

interface UseRoadmapArgs {
  planId: string | null | undefined;
  planData: PlanDataLike | null | undefined;
  survey: IntakeSurveyLike | null | undefined;
  progress: ProgressRowLike[];
  ready: boolean;
}

export function useRoadmap({ planId, planData, survey, progress, ready }: UseRoadmapArgs) {
  // Local overrides let the UI update optimistically without refetching.
  const [overrides, setOverrides] = useState<Record<string, TaskStatus>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const materializedFor = useRef<string | null>(null);

  useEffect(() => {
    setOverrides({});
  }, [planId]);

  const tasks = useMemo(() => {
    const rows: ProgressRowLike[] = [
      ...progress,
      ...Object.entries(overrides).map(([task_key, status]) => ({ task_key, status })),
    ];
    return deriveRoadmap({ survey, planData, progress: rows });
  }, [survey, planData, progress, overrides]);

  const metrics = useMemo(() => computeMetrics(tasks), [tasks]);
  const priorityTask = useMemo(() => pickPriorityTask(tasks), [tasks]);

  // Materialize derived tasks once per plan so workflows can query them
  // even before the user has interacted with the dashboard.
  useEffect(() => {
    if (!ready || !planId || tasks.length === 0) return;
    if (materializedFor.current === planId) return;
    materializedFor.current = planId;

    const rows = tasks.map((t) => ({
      plan_id: planId,
      task_key: t.key,
      task_label: t.title,
      status: t.status,
      completed: t.status === "completed",
      priority: t.priority,
      phase: t.phase,
      source: t.source,
    }));

    void supabase
      .from("plan_task_progress")
      .upsert(rows, { onConflict: "plan_id,task_key", ignoreDuplicates: true })
      .then(({ error }) => {
        if (error) console.error("Roadmap materialization failed", error);
      });
  }, [ready, planId, tasks]);

  const setTaskStatus = useCallback(
    async (task: RoadmapTask, status: TaskStatus) => {
      if (!planId) return;
      const previous = task.status;
      setOverrides((o) => ({ ...o, [task.key]: status }));
      setSavingKey(task.key);

      const { error } = await supabase.from("plan_task_progress").upsert(
        {
          plan_id: planId,
          task_key: task.key,
          task_label: task.title,
          status,
          completed: status === "completed",
          priority: task.priority,
          phase: task.phase,
          source: "user",
        },
        { onConflict: "plan_id,task_key" },
      );
      setSavingKey(null);

      if (error) {
        setOverrides((o) => ({ ...o, [task.key]: previous }));
        toast.error("Could not save your progress. Try again.");
        console.error(error);
        return;
      }

      const nextTasks = deriveRoadmap({
        survey,
        planData,
        progress: [
          ...progress,
          ...Object.entries({ ...overrides, [task.key]: status }).map(([task_key, s]) => ({
            task_key,
            status: s,
          })),
        ],
      });
      const nextMetrics = computeMetrics(nextTasks);
      const nextTask = pickPriorityTask(nextTasks);

      const eventType =
        status === "completed" ? "task_completed" : status === "in_progress" ? "task_started" : "task_reopened";
      logRoadmapEvent(eventType, {
        planId,
        task: { ...task, status },
        nextTask,
        completionPct: nextMetrics.overallPct,
      });

      if (status === "completed") {
        const phase = nextMetrics.phases.find((p) => p.phase === task.phase);
        if (phase?.complete) {
          logRoadmapEvent("phase_completed", {
            planId,
            phase: task.phase,
            nextTask,
            completionPct: nextMetrics.overallPct,
          });
        }
        if (nextMetrics.overallPct === 100) {
          logRoadmapEvent("roadmap_completed", { planId, completionPct: 100 });
        }
        toast.success("Nice — marked complete.");
      }

      // Keep GHL (email/SMS workflows) pointed at the same next step.
      void supabase.functions
        .invoke("sync-roadmap-state", {
          body: {
            plan_id: planId,
            next_task_key: nextTask?.key ?? null,
            next_task_label: nextTask?.title ?? null,
            phase: nextMetrics.currentPhase,
            completion_pct: nextMetrics.overallPct,
          },
        })
        .catch(() => {
          /* non-blocking */
        });
    },
    [planId, survey, planData, progress, overrides],
  );

  return { tasks, metrics, priorityTask, setTaskStatus, savingKey };
}