import type { LucideIcon } from "lucide-react";
import { Sparkles, Users, HeartHandshake, BookOpen } from "lucide-react";

export type PricingTier = {
  id: "free" | "self-paced" | "cohort" | "one-on-one";
  name: string;
  price: string;
  originalPrice?: string;
  cadence: string;
  cadenceNote?: string;
  who: string;
  features: string[];
  notIncluded?: string[];
  highlighted?: boolean;
  isFree?: boolean;
  ctaLabel: string;
  ctaHref: string;
  icon: LucideIcon;
};

export const STRIPE_LINKS = {
  selfPaced: "/checkout?tier=self-paced",
  cohort: "/checkout?tier=cohort",
  oneOnOne: "/checkout?tier=one-on-one",
} as const;

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    cadence: "no card required",
    cadenceNote: "Start reading in under a minute",
    who: "For Realtors who want to learn the system and see their own plan before investing.",
    features: [
      "Full Business Structure, Finance & Credit Guide",
      "Your customized plan from the intake survey",
      "Task checklist generated from your plan",
      "Progress tracking in your portal",
    ],
    notIncluded: ["Live coaching calls", "Cohort community", "Credit Suite portal + coach"],
    isFree: true,
    ctaLabel: "Read the Free Guide",
    ctaHref: "/guide",
    icon: BookOpen,
  },
  {
    id: "self-paced",
    name: "DIY (Do it Yourself)",
    price: "$497",
    cadence: "one-time",
    cadenceNote: "Billed once — lifetime access to your plan & portal",
    who: "For Realtors who want the plan and want to run with it on their own.",
    features: [
      "Custom Business, Finance & Credit Plan (PDF + portal)",
      "Guide + 7-step action checklist",
      "Credit Suite vendor & tradeline directory access",
      "Email support",
    ],
    notIncluded: ["Live coaching calls", "Cohort community"],
    ctaLabel: "Get Started",
    ctaHref: STRIPE_LINKS.selfPaced,
    icon: Sparkles,
  },
  {
    id: "cohort",
    name: "Pro Cohort",
    price: "$2,997",
    originalPrice: "$3,497",
    cadence: "90 days",
    cadenceNote: "Limited-time $500 discount applied at checkout",
    who: "Group coaching. For Realtors who want structure and accountability in a small group — no private 1:1 sessions.",
    features: [
      "Everything in DIY (Do it Yourself)",
      "90-day cohort with 5–10 Realtors",
      "Weekly live group coaching calls",
      "Private cohort community",
      "Credit Suite client portal + coach",
    ],
    notIncluded: ["Private 1:1 coaching sessions", "Dedicated Credit Suite specialist", "Quarterly plan reviews"],
    highlighted: true,
    ctaLabel: "Enroll in Cohort",
    ctaHref: STRIPE_LINKS.cohort,
    icon: Users,
  },
  {
    id: "one-on-one",
    name: "Cohort Plus",
    price: "$3,497",
    originalPrice: "$3,997",
    cadence: "per quarter",
    cadenceNote: "Limited-time $500 discount applied at checkout",
    who: "Group coaching plus private 1:1. Everything in Pro Cohort, with your own one-on-one coaching sessions.",
    features: [
      "Everything in Pro Cohort",
      "Private 1:1 coaching sessions with Jessie",
      "Dedicated Credit Suite specialist",
      "Priority response + funding strategy sessions",
      "Quarterly plan reviews",
    ],
    ctaLabel: "Start Cohort Plus",
    ctaHref: STRIPE_LINKS.oneOnOne,
    icon: HeartHandshake,
  },
];