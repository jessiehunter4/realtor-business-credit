import { BookOpen, ClipboardList, Rocket, type LucideIcon } from "lucide-react";
import step1Image from "@/assets/journey-step-1.jpg";
import step2Image from "@/assets/journey-step-2.jpg";
import samplePlanAsset from "@/assets/journey-step-2-plan.png.asset.json";
import step3Image from "@/assets/journey-step-3.jpg";

export interface JourneyStepContent {
  id: string;
  step: number;
  eyebrow: string;
  icon: LucideIcon;
  title: string;
  whatYouDo: string;
  whyItMatters: string;
  deliverable: string;
  bullets: string[];
  bulletsTitle: string;
  image: string;
  imageAlt: string;
  reverse: boolean;
}

export const JOURNEY_RAIL = [
  { id: "step-educate", step: 1, label: "Educate", blurb: "Read the free guide", icon: BookOpen },
  { id: "step-plan", step: 2, label: "Plan", blurb: "Generate your custom plan", icon: ClipboardList },
  { id: "step-implement", step: 3, label: "Implement", blurb: "Pick your support level", icon: Rocket },
];

export const JOURNEY_STEPS: JourneyStepContent[] = [
  {
    id: "step-educate",
    step: 1,
    eyebrow: "Step 1 — Educate",
    icon: BookOpen,
    title: "Learn where your business actually stands",
    whatYouDo:
      "Read a short, Realtor-specific guide. It's built to skim in about 5–10 minutes, and you can come back to any chapter later.",
    whyItMatters:
      "You can't fix a structure you can't see. The guide shows you how lenders read your entity, your banking, and your credit — and where the gaps usually are for agents and brokers.",
    deliverable:
      "A clear picture of your current position, plus the language lenders actually use.",
    bulletsTitle: "A few of the 13 chapters",
    bullets: [
      "Why most Realtors never build a real business foundation",
      "Entity options for Realtors — Sole Prop, LLC, S-Corp, C-Corp",
      "The 3-Account Financial Foundation for lumpy commission income",
      "Fundability signals: Strong / Watch / Missing",
      "The Realtor Credit Ladder — vendor tradelines to high-limit cards",
    ],
    image: step1Image,
    imageAlt: "A real estate professional reading the RE Pro business credit guide at a desk",
    reverse: false,
  },
  {
    id: "step-plan",
    step: 2,
    eyebrow: "Step 2 — Plan",
    icon: ClipboardList,
    title: "Turn what you learned into your own 90-day plan",
    whatYouDo:
      "Answer a short set of questions about your business, your goals, and where things stand today. Your plan is generated from your answers.",
    whyItMatters:
      "A generic checklist doesn't know that your commissions route through your SSN, or that you've never had a business bank account. Your gaps are specific — the plan should be too.",
    deliverable:
      "A personalized business structure, finance & credit plan with prioritized 90-day actions.",
    bulletsTitle: "What your plan includes",
    bullets: [
      "Your goals and current snapshot in plain language",
      "Every fundability signal flagged Strong, Watch, or Missing",
      "A prioritized 90-day action list — what to do, in what order",
      "A 6–12 month roadmap tied to your production",
    ],
    image: samplePlanAsset.url,
    imageAlt: "Sample RE Pro Business Credit Plan showing goals snapshot and fundability flags",
    reverse: true,
  },
  {
    id: "step-implement",
    step: 3,
    eyebrow: "Step 3 — Implement",
    icon: Rocket,
    title: "Choose how you want to work the plan",
    whatYouDo:
      "Pick the level of support that fits how you work — on your own, alongside a small group, or one-on-one.",
    whyItMatters:
      "A plan only pays off when it gets executed. Most agents stall in month two, so the point of this step is momentum and accountability.",
    deliverable: "A path through the 90 days that matches your schedule and your budget.",
    bulletsTitle: "Three ways to implement",
    bullets: [
      "Self-Paced — work your plan on your own schedule, with the checklist and progress tracking.",
      "Small Cohort — move through the plan with 5–10 other Realtors and a coach guiding each phase.",
      "One-on-One Coaching — direct, personalized guidance on your specific structure and funding.",
    ],
    image: step3Image,
    imageAlt: "A small group of real estate professionals working through their plans together",
    reverse: false,
  },
];