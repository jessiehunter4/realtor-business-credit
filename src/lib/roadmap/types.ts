export type TaskStatus = "not_started" | "in_progress" | "completed";

export type TaskPhase = "foundation" | "credibility" | "bureaus" | "tradelines" | "funding";

export type TaskSource = "intake" | "plan" | "user";

export interface CatalogTask {
  /** Stable identifier — persisted in plan_task_progress.task_key. Never change. */
  key: string;
  title: string;
  explanation: string;
  /** What the user should actually do next. */
  nextAction: string;
  phase: TaskPhase;
  /** Lower = more important within a phase. */
  basePriority: number;
  dependsOn: string[];
  effort: string;
  actionHref?: string;
  actionLabel?: string;
  /** Keywords used to match AI-generated plan action items to this task. */
  keywords: string[];
}

export interface RoadmapTask extends CatalogTask {
  status: TaskStatus;
  /** Effective priority after phase ordering and intake signal boosts. */
  priority: number;
  blocked: boolean;
  blockedBy: string[];
  source: TaskSource;
  /** True when intake shows this is already handled and no coaching is needed. */
  alreadyInPlace: boolean;
  detail?: string;
  custom?: boolean;
}

export interface RoadmapMetrics {
  total: number;
  completed: number;
  inProgress: number;
  remaining: number;
  overallPct: number;
  currentPhase: TaskPhase | null;
  phases: Array<{
    phase: TaskPhase;
    label: string;
    total: number;
    completed: number;
    pct: number;
    complete: boolean;
  }>;
  milestonesAchieved: number;
}

export const PHASE_ORDER: TaskPhase[] = [
  "foundation",
  "credibility",
  "bureaus",
  "tradelines",
  "funding",
];

export const PHASE_LABELS: Record<TaskPhase, string> = {
  foundation: "Foundation",
  credibility: "Credibility",
  bureaus: "Bureau Profiles",
  tradelines: "Tradelines",
  funding: "Funding",
};

export const PHASE_BLURBS: Record<TaskPhase, string> = {
  foundation: "Get the business itself set up and separated from your personal finances.",
  credibility: "Make the business look real to lenders, vendors, and data providers.",
  bureaus: "Get on the business credit bureaus so activity can be scored.",
  tradelines: "Build a payment history that actually reports.",
  funding: "Turn that history into usable capacity — money when you need it.",
};