import { TASK_CATALOG, TASK_BY_KEY } from "./taskCatalog";
import { deriveIntakeSignals, hasEstablishedCredit, type IntakeSurveyLike } from "./intakeSignals";
import {
  PHASE_LABELS,
  PHASE_ORDER,
  type RoadmapMetrics,
  type RoadmapTask,
  type TaskPhase,
  type TaskStatus,
} from "./types";

export interface ProgressRowLike {
  task_key: string;
  task_label?: string | null;
  completed?: boolean | null;
  status?: string | null;
}

export interface PlanDataLike {
  sections?: {
    action_plan_90day?: { items?: Array<{ step: number; text: string; effort?: string }> };
  };
}

const legacyKey = (step: number, text: string) =>
  `action_${step}_${text.slice(0, 40).toLowerCase().replace(/[^a-z0-9]+/g, "_")}`;

/** Match an AI-generated action item to a canonical catalog task, if possible. */
export function matchCatalogKey(text: string): string | null {
  const lower = text.toLowerCase();
  let best: { key: string; score: number } | null = null;
  for (const task of TASK_CATALOG) {
    const score = task.keywords.reduce((acc, kw) => (lower.includes(kw) ? acc + kw.length : acc), 0);
    if (score > 0 && (!best || score > best.score)) best = { key: task.key, score };
  }
  return best?.key ?? null;
}

const rank = (s: TaskStatus) => (s === "completed" ? 2 : s === "in_progress" ? 1 : 0);

function normalizeStatus(row: ProgressRowLike): TaskStatus {
  if (row.status === "completed" || row.status === "in_progress" || row.status === "not_started") {
    return row.status;
  }
  return row.completed ? "completed" : "not_started";
}

/** Signals from intake that should bump matching tasks up the list. */
function painBoosts(survey: IntakeSurveyLike | null | undefined): Record<string, number> {
  const boosts: Record<string, number> = {};
  const text = [...(survey?.financial_pains ?? []), ...(survey?.primary_goals ?? []), ...(survey?.desired_funding_types ?? [])]
    .join(" ")
    .toLowerCase();
  if (!text) return boosts;

  const bump = (key: string, amount: number) => {
    boosts[key] = (boosts[key] ?? 0) + amount;
  };
  if (/between closings|cash flow|runway|money when/.test(text)) {
    bump("vendor_tradelines_3", 20);
    bump("higher_limit_card_or_loc", 20);
  }
  if (/personal credit|utilization|fico|credit score/.test(text)) {
    bump("expenses_off_personal", 25);
    bump("utilization_under_30", 20);
  }
  if (/line of credit|loc|higher limit|card/.test(text)) {
    bump("starter_business_card", 15);
  }
  if (/tax|bookkeep|mixed|separate/.test(text)) {
    bump("business_bank_account", 15);
    bump("accounting_software", 10);
  }
  return boosts;
}

export interface DeriveRoadmapInput {
  survey?: IntakeSurveyLike | null;
  planData?: PlanDataLike | null;
  progress?: ProgressRowLike[] | null;
}

/**
 * Deterministic rule engine: intake answers + generated plan + saved progress
 * -> a prioritized, dependency-aware roadmap.
 */
export function deriveRoadmap({ survey, planData, progress }: DeriveRoadmapInput): RoadmapTask[] {
  const signals = deriveIntakeSignals(survey);
  const established = hasEstablishedCredit(survey);
  const boosts = painBoosts(survey);

  // Index saved progress by canonical key, remapping legacy `action_{n}_{slug}` keys.
  const progressByKey = new Map<string, ProgressRowLike>();
  const aiItems = planData?.sections?.action_plan_90day?.items ?? [];
  const legacyToCanonical = new Map<string, string>();
  for (const item of aiItems) {
    const canonical = matchCatalogKey(item.text);
    if (canonical) legacyToCanonical.set(legacyKey(item.step, item.text), canonical);
  }
  for (const row of progress ?? []) {
    const key = legacyToCanonical.get(row.task_key) ?? row.task_key;
    const existing = progressByKey.get(key);
    if (!existing || rank(normalizeStatus(row)) > rank(normalizeStatus(existing))) {
      progressByKey.set(key, { ...row, task_key: key });
    }
  }

  // 1–4: seed, apply intake inference, then let explicit user progress win.
  const tasks: RoadmapTask[] = TASK_CATALOG.map((task) => {
    const signal = signals[task.key];
    let status: TaskStatus = signal?.status ?? "not_started";
    let source: RoadmapTask["source"] = signal ? "intake" : "plan";

    const saved = progressByKey.get(task.key);
    if (saved) {
      status = normalizeStatus(saved);
      source = "user";
    }

    const alreadyInPlace =
      status === "completed" ||
      (established && (task.phase === "foundation" || task.phase === "credibility") && status !== "not_started");

    return {
      ...task,
      status,
      source,
      detail: signal?.detail,
      alreadyInPlace,
      blocked: false,
      blockedBy: [],
      priority: 0,
    };
  });

  const byKey = new Map(tasks.map((t) => [t.key, t]));

  // 5: dependency gating.
  for (const task of tasks) {
    const unmet = task.dependsOn.filter((dep) => byKey.get(dep)?.status !== "completed");
    task.blockedBy = unmet;
    task.blocked = task.status !== "completed" && unmet.length > 0;
  }

  // 6: effective priority = phase order, base priority, minus intake boosts.
  for (const task of tasks) {
    const phaseWeight = PHASE_ORDER.indexOf(task.phase) * 100;
    task.priority = phaseWeight + task.basePriority * 5 - (boosts[task.key] ?? 0);
  }

  // 7: append AI-generated items that don't map onto the catalog.
  let customIndex = 0;
  for (const item of aiItems) {
    if (matchCatalogKey(item.text)) continue;
    customIndex += 1;
    const key = `custom_${customIndex}`;
    const saved = progressByKey.get(key) ?? progressByKey.get(legacyKey(item.step, item.text));
    tasks.push({
      key,
      title: item.text,
      explanation: "From your personalized 90-day plan.",
      nextAction: item.text,
      phase: "funding",
      basePriority: 90 + customIndex,
      dependsOn: [],
      effort: item.effort ?? "Varies",
      keywords: [],
      status: saved ? normalizeStatus(saved) : "not_started",
      source: saved ? "user" : "plan",
      alreadyInPlace: false,
      blocked: false,
      blockedBy: [],
      priority: PHASE_ORDER.length * 100 + customIndex,
      custom: true,
    });
  }

  return tasks.sort((a, b) => a.priority - b.priority);
}

/** Highest-priority task the user can actually act on right now. */
export function pickPriorityTask(tasks: RoadmapTask[]): RoadmapTask | null {
  const actionable = tasks.filter((t) => t.status !== "completed" && !t.blocked);
  if (actionable.length === 0) return null;
  const inProgress = actionable.filter((t) => t.status === "in_progress");
  const pool = inProgress.length > 0 ? inProgress : actionable;
  return pool.reduce((best, t) => (t.priority < best.priority ? t : best), pool[0]);
}

export function computeMetrics(tasks: RoadmapTask[]): RoadmapMetrics {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;

  const phases = PHASE_ORDER.map((phase: TaskPhase) => {
    const inPhase = tasks.filter((t) => t.phase === phase);
    const done = inPhase.filter((t) => t.status === "completed").length;
    return {
      phase,
      label: PHASE_LABELS[phase],
      total: inPhase.length,
      completed: done,
      pct: inPhase.length ? Math.round((done / inPhase.length) * 100) : 0,
      complete: inPhase.length > 0 && done === inPhase.length,
    };
  });

  const currentPhase = phases.find((p) => !p.complete)?.phase ?? null;

  return {
    total,
    completed,
    inProgress,
    remaining: total - completed,
    overallPct: total ? Math.round((completed / total) * 100) : 0,
    currentPhase,
    phases,
    milestonesAchieved: phases.filter((p) => p.complete).length,
  };
}

