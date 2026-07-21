// Mock data for the /mock-dashboard prototype. UI-only, replace with
// real fetches once auth + backend are wired.

export type TaskCadence = "week" | "month" | "milestone";

export interface DashboardTask {
  id: string;
  label: string;
  cadence: TaskCadence;
  dueLabel: string;
  done: boolean;
}

export const DASHBOARD_TASKS: DashboardTask[] = [
  { id: "t1", label: "Confirm your business entity with an attorney/CPA", cadence: "milestone", dueLabel: "Foundations", done: true },
  { id: "t2", label: "Obtain your EIN from the IRS", cadence: "milestone", dueLabel: "Foundations", done: true },
  { id: "t3", label: "Open a dedicated business bank account", cadence: "milestone", dueLabel: "Foundations", done: true },
  { id: "t4", label: "Set up business phone, address, email on custom domain", cadence: "week", dueLabel: "Due Fri", done: true },
  { id: "t5", label: "Register D-U-N-S, Experian Business, Equifax Small Business", cadence: "week", dueLabel: "Due this week", done: false },
  { id: "t6", label: "Establish 3 vendor tradelines that report", cadence: "month", dueLabel: "By month end", done: false },
  { id: "t7", label: "Apply for your first EIN-only business card", cadence: "milestone", dueLabel: "Day 60-90", done: false },
  { id: "t8", label: "Upload profit & loss statement to shared drive", cadence: "week", dueLabel: "Due Wed", done: false },
  { id: "t9", label: "Reach $500 vendor spend to trigger first bureau report", cadence: "month", dueLabel: "By month end", done: false },
];

export interface GuideEntry {
  id: string;
  title: string;
  description: string;
  to: string;
  progress: number;
  status: "new" | "in-progress" | "complete";
  downloadable: boolean;
  accent: "teal" | "sky" | "amber";
}

export const DASHBOARD_GUIDES: GuideEntry[] = [
  {
    id: "g1",
    title: "Realtor Business Credit Guide",
    description: "The full 13-chapter blueprint on structure, finance, and credit.",
    to: "/guide",
    progress: 42,
    status: "in-progress",
    downloadable: true,
    accent: "teal",
  },
  {
    id: "g2",
    title: "Business Credit Cards for Realtors",
    description: "Which cards report, which don't, and how to stack limits.",
    to: "/business-credit-cards-for-realtors",
    progress: 0,
    status: "new",
    downloadable: false,
    accent: "sky",
  },
  {
    id: "g3",
    title: "Your Sample Plan",
    description: "See what a fully-built Realtor plan looks like end-to-end.",
    to: "/sample-plan",
    progress: 100,
    status: "complete",
    downloadable: true,
    accent: "amber",
  },
];

export interface Goal {
  id: string;
  title: string;
  nextStep: string;
  progress: number;
  status: "not-started" | "in-progress" | "on-track" | "complete";
}

export const DASHBOARD_GOALS: Goal[] = [
  { id: "goal1", title: "Build Business Credit", nextStep: "Register D-U-N-S number", progress: 55, status: "in-progress" },
  { id: "goal2", title: "Obtain First Business Credit Card", nextStep: "Reach 3 reporting tradelines", progress: 30, status: "in-progress" },
  { id: "goal3", title: "Reach Funding Eligibility", nextStep: "Complete Fundability Scan", progress: 20, status: "not-started" },
  { id: "goal4", title: "Improve Fundability", nextStep: "Add business phone in directories", progress: 62, status: "on-track" },
  { id: "goal5", title: "Separate Personal & Business Credit", nextStep: "Move recurring expenses to business account", progress: 80, status: "on-track" },
];

export interface RoadmapStep {
  id: string;
  label: string;
  state: "done" | "current" | "upcoming";
}

export const ROADMAP: RoadmapStep[] = [
  { id: "r1", label: "Foundations", state: "done" },
  { id: "r2", label: "Fundability", state: "current" },
  { id: "r3", label: "Tradelines", state: "upcoming" },
  { id: "r4", label: "Cards", state: "upcoming" },
  { id: "r5", label: "Funding", state: "upcoming" },
];

export interface Recommendation {
  id: string;
  title: string;
  detail: string;
  priority: "high" | "medium" | "low";
}

export const RECOMMENDATIONS: Recommendation[] = [
  { id: "rec1", title: "Register D-U-N-S number", detail: "Free through Dun & Bradstreet — foundational for business credit.", priority: "high" },
  { id: "rec2", title: "Open Uline account", detail: "Reports to Experian Business after first $50 order.", priority: "high" },
  { id: "rec3", title: "Move marketing spend to business debit", detail: "Cleaner books, faster path to a business card underwrite.", priority: "medium" },
  { id: "rec4", title: "Add business phone to directories", detail: "Yelp, Google Business, 411 listings boost fundability score.", priority: "low" },
];

export interface FinancingMilestone {
  window: string;
  title: string;
  detail: string;
}

export const FINANCING_ROADMAP: FinancingMilestone[] = [
  { window: "0–90 days", title: "Foundation + first tradelines", detail: "Entity clean-up, EIN, D-U-N-S, 3 reporting vendors." },
  { window: "3–6 months", title: "First business credit card", detail: "EIN-only card with $2k–$8k starter limit." },
  { window: "6–12 months", title: "Business line of credit", detail: "$15k–$50k LOC once scores season and tradelines age." },
];

export interface Purchase {
  date: string;
  product: string;
  amount: string;
  status: "paid" | "active" | "refunded";
  invoice: string;
}

export const PURCHASES: Purchase[] = [
  { date: "Feb 12, 2026", product: "One-on-One Coaching (Quarter)", amount: "$1,997", status: "active", invoice: "#INV-2026-014" },
  { date: "Jan 08, 2026", product: "Fundability Scan Add-On", amount: "$149", status: "paid", invoice: "#INV-2026-003" },
  { date: "Dec 22, 2025", product: "Guide + Action Plan", amount: "$0", status: "paid", invoice: "#INV-2025-091" },
];

export interface ActivityItem {
  icon: "file" | "calendar" | "sparkles" | "check";
  text: string;
  when: string;
}

export const RECENT_ACTIVITY: ActivityItem[] = [
  { icon: "file", text: "You downloaded the Realtor Business Credit Guide", when: "2 days ago" },
  { icon: "calendar", text: "One-on-One session booked for Thursday 2:00 PM PT", when: "3 days ago" },
  { icon: "sparkles", text: "Custom plan generated from your intake survey", when: "3 days ago" },
  { icon: "check", text: "Completed: Open dedicated business bank account", when: "5 days ago" },
];

// 8-week tasks-completed trend
export const TASKS_OVER_TIME = [
  { week: "W1", completed: 1 },
  { week: "W2", completed: 2 },
  { week: "W3", completed: 2 },
  { week: "W4", completed: 3 },
  { week: "W5", completed: 3 },
  { week: "W6", completed: 4 },
  { week: "W7", completed: 4 },
  { week: "W8", completed: 4 },
];

export const CREDIT_BUILDING = [
  { category: "Structure", score: 90 },
  { category: "Banking", score: 75 },
  { category: "Tradelines", score: 40 },
  { category: "Cards", score: 20 },
  { category: "Reporting", score: 55 },
];

export const FUNDING_READINESS = 62;