import { useCallback, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { PlanData } from "@/components/plan/PlanDocument";
import type { TaskStatus } from "@/lib/roadmap";
import {
  derivePlanItems,
  encodePayload,
  planCustomKey,
  planEditKey,
  planNoteKey,
  type PlanItem,
  type PlanItemGroup,
  type PlanItemPayload,
  type PlanProgressRow,
} from "@/lib/planItems";

interface Args {
  planId?: string | null;
  planData?: PlanData | null;
  progress: PlanProgressRow[];
  /** Refetch progress rows from the server after a write. */
  refresh?: () => Promise<void> | void;
}

/**
 * Tracking for the plan-derived items (goals, 90-day actions, milestones,
 * funding). Shares the plan_task_progress store with the credit roadmap so
 * progress stays in one place.
 */
export function usePlanItems({ planId, planData, progress, refresh }: Args) {
  const [overrides, setOverrides] = useState<Record<string, TaskStatus>>({});
  const [noteOverrides, setNoteOverrides] = useState<Record<string, string>>({});
  const [payloadOverrides, setPayloadOverrides] = useState<Record<string, PlanItemPayload | null>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const sets = useMemo(
    () => derivePlanItems({ planData, progress, overrides, noteOverrides, payloadOverrides }),
    [planData, progress, overrides, noteOverrides, payloadOverrides],
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
          // Custom items keep their JSON payload in task_label.
          task_label: item.custom
            ? encodePayload({ title: item.title, detail: item.detail, meta: item.meta })
            : item.title.slice(0, 300),
          status,
          completed: status === "completed",
          phase: item.group,
          source: item.custom ? "user" : "plan",
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

  /** Writes a JSON payload row (edit override or custom item). */
  const writePayload = useCallback(
    async (key: string, group: PlanItemGroup, payload: PlanItemPayload | null, phaseSuffix: string) => {
      if (!planId) return false;
      const previous = payloadOverrides[key];
      setPayloadOverrides((p) => ({ ...p, [key]: payload }));
      setSavingKey(key);

      const { error } = payload
        ? await supabase.from("plan_task_progress").upsert(
            {
              plan_id: planId,
              task_key: key,
              task_label: encodePayload(payload),
              status: "not_started",
              completed: false,
              phase: `${group}${phaseSuffix}`,
              source: "user",
            },
            { onConflict: "plan_id,task_key" },
          )
        : await supabase.from("plan_task_progress").delete().eq("plan_id", planId).eq("task_key", key);

      setSavingKey(null);

      if (error) {
        setPayloadOverrides((p) => ({ ...p, [key]: previous ?? null }));
        toast.error("Could not save that change.");
        console.error(error);
        return false;
      }
      await refresh?.();
      return true;
    },
    [planId, payloadOverrides, refresh],
  );

  /** Edit the text of a generated item, or of a custom item. */
  const updateItem = useCallback(
    async (item: PlanItem, patch: PlanItemPayload) => {
      const merged: PlanItemPayload = {
        title: patch.title ?? item.title,
        detail: patch.detail ?? item.detail,
        meta: patch.meta ?? item.meta,
      };
      const key = item.custom ? item.key : planEditKey(item.group, item.index);
      const ok = await writePayload(key, item.group, merged, item.custom ? "custom" : "edit");
      if (ok) toast.success("Saved.");
    },
    [writePayload],
  );

  /** Restore a generated item to the wording the plan produced. */
  const revertItem = useCallback(
    async (item: PlanItem) => {
      if (item.custom) return;
      const ok = await writePayload(planEditKey(item.group, item.index), item.group, null, "edit");
      if (ok) toast.success("Reverted to the original wording.");
    },
    [writePayload],
  );

  /** Add a user-created goal / action / milestone. */
  const addItem = useCallback(
    async (group: PlanItemGroup, payload: PlanItemPayload) => {
      const key = planCustomKey(group, crypto.randomUUID());
      const ok = await writePayload(key, group, payload, "custom");
      if (ok) toast.success("Added to your plan.");
    },
    [writePayload],
  );

  /** Delete a custom item, or hide a generated one. */
  const removeItem = useCallback(
    async (item: PlanItem) => {
      if (item.custom) {
        const ok = await writePayload(item.key, item.group, null, "custom");
        if (ok) toast.success("Removed.");
        return;
      }
      const ok = await writePayload(
        planEditKey(item.group, item.index),
        item.group,
        { title: item.title, detail: item.detail, meta: item.meta, hidden: true },
        "edit",
      );
      if (ok) toast.success("Hidden from your plan.");
    },
    [writePayload],
  );

  return { ...sets, setStatus, setNote, updateItem, addItem, removeItem, revertItem, savingKey };
}