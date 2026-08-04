import { useCallback, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { PlanData } from "@/components/plan/PlanDocument";
import type { TaskStatus } from "@/lib/roadmap";
import {
  derivePlanItems,
  planNoteKey,
  type PlanItem,
  type PlanProgressRow,
} from "@/lib/planItems";

interface Args {
  planId?: string | null;
  planData?: PlanData | null;
  progress: PlanProgressRow[];
}

/**
 * Tracking for the plan-derived items (goals, 90-day actions, milestones,
 * funding). Shares the plan_task_progress store with the credit roadmap so
 * progress stays in one place.
 */
export function usePlanItems({ planId, planData, progress }: Args) {
  const [overrides, setOverrides] = useState<Record<string, TaskStatus>>({});
  const [noteOverrides, setNoteOverrides] = useState<Record<string, string>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const sets = useMemo(
    () => derivePlanItems({ planData, progress, overrides, noteOverrides }),
    [planData, progress, overrides, noteOverrides],
  );

  const setStatus = useCallback(
    async (item: PlanItem, status: TaskStatus) => {
      if (!planId) return;
      const previous = item.status;
      setOverrides((o) => ({ ...o, [item.key]: status }));
      setSavingKey(item.key);

      const { error } = await supabase.from("plan_task_progress").upsert(
        {
          plan_id: planId,
          task_key: item.key,
          task_label: item.title.slice(0, 300),
          status,
          completed: status === "completed",
          phase: item.group,
          source: "plan",
        },
        { onConflict: "plan_id,task_key" },
      );
      setSavingKey(null);

      if (error) {
        setOverrides((o) => ({ ...o, [item.key]: previous }));
        toast.error("Could not save that. Try again.");
        console.error(error);
        return;
      }
      if (status === "completed") toast.success("Nice — marked complete.");
    },
    [planId],
  );

  const setNote = useCallback(
    async (item: PlanItem, note: string) => {
      if (!planId) return;
      const key = planNoteKey(item.group, item.index);
      setNoteOverrides((n) => ({ ...n, [key]: note }));
      setSavingKey(key);

      const { error } = await supabase.from("plan_task_progress").upsert(
        {
          plan_id: planId,
          task_key: key,
          task_label: note.slice(0, 2000),
          status: "not_started",
          completed: false,
          phase: `${item.group}note`,
          source: "user",
        },
        { onConflict: "plan_id,task_key" },
      );
      setSavingKey(null);

      if (error) {
        toast.error("Could not save your note.");
        console.error(error);
        return;
      }
      toast.success("Note saved.");
    },
    [planId],
  );

  return { ...sets, setStatus, setNote, savingKey };
}