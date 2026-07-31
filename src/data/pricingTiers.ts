import type { LucideIcon } from "lucide-react";
import { Sparkles, Users, HeartHandshake, BookOpen } from "lucide-react";

export type PricingTier = {
  id: "free" | "self-paced" | "cohort" | "one-on-one";
  name: string;
  price: string;
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
      "Free Fundability Scan",
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
    price: "$1,997",
    cadence: "90 days",
    cadenceNote: "One-time enrollment for the 90-day program",
    who: "For Realtors who want structure, accountability, and a small group.",
    features: [
      "Everything in Self-Paced",
      "90-day cohort with 5–10 Realtors",
      "Weekly live coaching calls",
      "Private cohort community",
      "Credit Suite client portal + coach",
    ],
    notIncluded: ["Private 1:1 coaching with Jessie"],
    highlighted: true,
    ctaLabel: "Enroll in Cohort",
    ctaHref: STRIPE_LINKS.cohort,
    icon: Users,
  },
  {
    id: "one-on-one",
    name: "Cohort Plus +",
    price: "$4,997",
    cadence: "per quarter",
    cadenceNote: "Quarterly engagement, renewable",
    who: "For Realtors and brokers who want private, high-touch guidance.",
    features: [
      "Everything in Cohort",
      "Private 1:1 coaching with Jessie",
      "Dedicated Credit Suite specialist",
      "Priority response + funding strategy sessions",
      "Quarterly plan reviews",
    ],
    ctaLabel: "Start 1:1 Coaching",
    ctaHref: STRIPE_LINKS.oneOnOne,
    icon: HeartHandshake,
  },
];