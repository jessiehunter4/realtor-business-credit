import { postFunnelEvent } from "@/lib/logFunnelEvent";
import { readContactIdentity } from "@/lib/contactIdentityStore";
import type { RoadmapTask } from "./types";

export type RoadmapEventType =
  | "dashboard_viewed"
  | "task_started"
  | "task_completed"
  | "task_reopened"
  | "phase_completed"
  | "roadmap_completed";

interface RoadmapEventMeta {
  task?: RoadmapTask | null;
  nextTask?: RoadmapTask | null;
  completionPct?: number;
  phase?: string | null;
  planId?: string | null;
}

/** Fire-and-forget: roadmap state changes feed the same email/SMS workflows. */
export function logRoadmapEvent(eventType: RoadmapEventType, meta: RoadmapEventMeta = {}) {
  let contactId: string | undefined;
  try {
    contactId = readContactIdentity()?.contactId ?? undefined;
  } catch {
    contactId = undefined;
  }

  void postFunnelEvent({
    contactId,
    eventType,
    metadata: {
      plan_id: meta.planId ?? null,
      task_key: meta.task?.key ?? null,
      task_label: meta.task?.title ?? null,
      task_phase: meta.task?.phase ?? meta.phase ?? null,
      task_priority: meta.task?.priority ?? null,
      next_task_key: meta.nextTask?.key ?? null,
      next_task_label: meta.nextTask?.title ?? null,
      completion_pct: meta.completionPct ?? null,
    },
  }).catch(() => {
    /* tracking must never break the dashboard */
  });
}