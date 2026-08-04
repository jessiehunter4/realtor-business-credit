import type { PlanData } from "@/components/plan/PlanDocument";
import type { TaskStatus } from "@/lib/roadmap";

export type PlanItemGroup = "goal" | "d90" | "milestone" | "funding";

export interface PlanItem {
  key: string;
  group: PlanItemGroup;
  title: string;
  detail?: string;
  /** Extra context line (horizon, effort, target month, target amount). */
  meta?: string;
  status: TaskStatus;
  note?: string;
  completedAt?: string | null;
  updatedAt?: string | null;
  index: number;
}

export interface PlanProgressRow {
  task_key: string;
  task_label?: string | null;
  status?: string | null;
  completed?: boolean;
  completed_at?: string | null;
  updated_at?: string | null;
}

export const PLAN_ITEM_PREFIX = "plan";

export function planItemKey(group: PlanItemGroup, index: number) {
  return `${PLAN_ITEM_PREFIX}:${group}:${index}`;
}

export function planNoteKey(group: PlanItemGroup, index: number) {
  return `${PLAN_ITEM_PREFIX}:${group}note:${index}`;
}

function toStatus(row?: PlanProgressRow): TaskStatus {
  if (!row) return "not_started";
  if (row.status === "in_progress" || row.status === "completed" || row.status === "not_started") {
    return row.status;
  }
  return row.completed ? "completed" : "not_started";
}

/** Which 30-day window a 90-day action item belongs to. */
export function windowForStep(step: number, total: number) {
  const perWindow = Math.max(1, Math.ceil(total / 3));
  const idx = Math.min(2, Math.floor((step - 1) / perWindow));
  return (["Days 1–30", "Days 31–60", "Days 61–90"] as const)[idx];
}

interface DeriveArgs {
  planData?: PlanData | null;
  progress: PlanProgressRow[];
  overrides?: Record<string, TaskStatus>;
  noteOverrides?: Record<string, string>;
}

export interface PlanItemSets {
  goals: PlanItem[];
  actions: PlanItem[];
  milestones: PlanItem[];
  funding: PlanItem[];
  all: PlanItem[];
}

export function derivePlanItems({ planData, progress, overrides = {}, noteOverrides = {} }: DeriveArgs): PlanItemSets {
  const byKey = new Map<string, PlanProgressRow>();
  for (const row of progress) byKey.set(row.task_key, row);

  const build = (group: PlanItemGroup, index: number, title: string, detail?: string, meta?: string): PlanItem => {
    const key = planItemKey(group, index);
    const row = byKey.get(key);
    return {
      key,
      group,
      index,
      title,
      detail,
      meta,
      status: overrides[key] ?? toStatus(row),
      note: noteOverrides[planNoteKey(group, index)] ?? byKey.get(planNoteKey(group, index))?.task_label ?? "",
      completedAt: row?.completed_at ?? null,
      updatedAt: row?.updated_at ?? null,
    };
  };

  const sections = planData?.sections;

  const goals = (sections?.goals_snapshot?.goals ?? []).map((g, i) =>
    build(
      "goal",
      i,
      g.label,
      g.why_it_matters,
      [g.priority ? `${g.priority} goal` : null, g.horizon, g.target_amount].filter(Boolean).join(" · ") || undefined,
    ),
  );

  const actionItems = sections?.action_plan_90day?.items ?? [];
  const actions = actionItems.map((a, i) =>
    build("d90", i, a.text, undefined, [windowForStep(a.step ?? i + 1, actionItems.length), a.effort].filter(Boolean).join(" · ")),
  );

  const milestones = (sections?.roadmap?.milestones ?? []).map((m, i) =>
    build("milestone", i, m.description, undefined, m.month),
  );

  const funding = (sections?.funding_opportunities?.items ?? []).map((f, i) =>
    build("funding", i, f.type, f.description),
  );

  return { goals, actions, milestones, funding, all: [...goals, ...actions, ...milestones, ...funding] };
}

export function countDone(items: PlanItem[]) {
  return items.filter((i) => i.status === "completed").length;
}

export function pct(items: PlanItem[]) {
  if (items.length === 0) return 0;
  return Math.round((countDone(items) / items.length) * 100);
}