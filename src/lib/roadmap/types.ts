export type TaskStatus = "not_started" | "in_progress" | "completed";

export type TaskPhase = "foundation" | "credibility" | "bureaus" | "tradelines" | "funding";

export type TaskSource = "intake" | "plan" | "user";

/** Plain-English help shown in the dashboard "?" bubble. */
export interface TaskHelp {
  /** What this step actually means, in plain English. */
  what: string;
  /** Why it matters for getting funded. */
  why: string;
  /** How the user knows they're done. */
  doneLooksLike: string;
  /** Common mistakes to avoid. */
  mistakes?: string[];
}

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
  /** Long-form explanation surfaced by the help bubble. Optional. */
  help?: TaskHelp;
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
  /** Timestamps from saved progress, used for the "last updated" line. */
  completedAt?: string | null;
  updatedAt?: string | null;
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

/** Stage-level help for the milestone "?" bubbles. */
export const PHASE_HELP: Record<TaskPhase, { what: string; why: string; typicalTime: string }> = {
  foundation: {
    what:
      "Foundation is where your real estate business becomes its own thing on paper: an entity, an EIN, its own bank account, and clean books.",
    why:
      "Nothing else in business credit works until the business exists separately from you. Vendors, bureaus, and underwriters all start by asking who they are actually dealing with.",
    typicalTime: "Usually 2–4 weeks, mostly waiting on filings.",
  },
  credibility: {
    what:
      "Credibility is the set of details data providers and underwriters check to decide whether a business looks real: address, phone, email, website.",
    why:
      "These are cheap to fix and quietly decide a lot of approvals. A mismatch between what's on your application and what's findable online is a common reason for a decline.",
    typicalTime: "A few days to a couple of weeks.",
  },
  bureaus: {
    what:
      "This stage puts your business on file with Dun & Bradstreet, Experian Business, and Equifax Small Business.",
    why:
      "Payment history only helps you if there's a file for it to land in. Registering here is what makes your future activity scoreable.",
    typicalTime: "A few hours of work, then 1–4 weeks of processing.",
  },
  tradelines: {
    what:
      "Tradelines are accounts that report your payment behavior to the business bureaus — starter vendor accounts you actually use for business supplies.",
    why:
      "This is where a business credit profile is earned. Several reporting accounts paid on time (or early) is what moves you from invisible to fundable.",
    typicalTime: "Set up in an hour; 60–90 days for history to build.",
  },
  funding: {
    what:
      "Funding is the payoff stage: EIN-tied cards, higher limits, and lines of credit you can draw on between closings.",
    why:
      "This is the whole point — money available when your business needs it, without putting it all on your personal credit.",
    typicalTime: "Ongoing, typically starting around month 4–6.",
  },
};