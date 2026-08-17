import type { LucideIcon } from "lucide-react";
import { Sparkles, Users, HeartHandshake, BookOpen } from "lucide-react";

export type PaidTierSlug = "diy" | "pro-cohort" | "cohort-plus";

export type IncludedGroup = {
  title: string;
  items: string[];
};

/**
 * Sales-page content for a paid tier. Copy is derived from the pricing data in
 * this file — no new claims, prices, or guarantees are introduced elsewhere.
 */
export type ProductPageContent = {
  slug: PaidTierSlug;
  /** Value-focused headline for the product page hero. */
  headline: string;
  /** Short supporting description under the headline. */
  subhead: string;
  /** 3 short proof points shown under the hero. */
  heroBullets: string[];
  /** Categorized "What's included" groups. */
  includedGroups: IncludedGroup[];
  /** Highlighted inclusion callout. */
  highlight?: { title: string; body: string };
  /** Product-specific CTA label ("Join Pro Cohort"). */
  joinLabel: string;
  /** Explains payment plans / BNPL for this tier. */
  paymentPlanNote: string;
  /** Refund / guarantee statement (only where it applies). */
  refundNote?: string;
  /** Partner resource access included at this tier. */
  partnerAccess?: string;
  /** What changes in the dashboard once purchased. */
  dashboardCapabilityNote: string;
  faqs: { q: string; a: string }[];
};

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
  /** Present on paid tiers only — powers /programs/:slug. */
  productPage?: ProductPageContent;
};

export const STRIPE_LINKS = {
  selfPaced: "/checkout?tier=self-paced",
  cohort: "/checkout?tier=cohort",
  oneOnOne: "/checkout?tier=one-on-one",
} as const;

/** Shared FAQs that apply to every paid tier. */
const SHARED_FAQS = [
  {
    q: "Is my payment secure?",
    a: "Yes. All payments are processed by Stripe over an encrypted connection. We never see or store your card details, and your receipt is delivered instantly by email.",
  },
  {
    q: "Can I switch or upgrade plans later?",
    a: "Yes. Many Realtors start with DIY (Do it Yourself) or the Pro Cohort and move up to Cohort Plus later. Your custom plan carries over, so nothing is lost.",
  },
  {
    q: "Do you guarantee approval amounts or credit limits?",
    a: "No. Business credit outcomes depend on your entity, funding readiness, personal credit, income, and lender criteria. We share realistic expectations and typical timelines — never guarantees.",
  },
  {
    q: "Do you provide legal or tax advice?",
    a: "No. Everything we do is educational and coaching. We strongly encourage you to consult your broker, attorney, and CPA about your specific situation.",
  },
];

const PAYMENT_PLAN_NOTE =
  "Checkout accepts credit and debit cards, plus Klarna and Affirm where you're eligible — so you can split the investment into installments and start right away.";

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
    productPage: {
      slug: "diy",
      headline: "Your full plan, ready to run with on your own.",
      subhead:
        "For Realtors who want the plan and want to run with it on their own — the custom plan, the guide, the checklist, and the vendor directory, all in one place.",
      heroBullets: [
        "Custom plan in your portal and as a PDF",
        "7-step action checklist with progress tracking",
        "Credit Suite vendor & tradeline directory access",
      ],
      includedGroups: [
        {
          title: "Your plan",
          items: [
            "Custom Business, Finance & Credit Plan (PDF + portal)",
            "Guide + 7-step action checklist",
          ],
        },
        {
          title: "Resources & support",
          items: [
            "Credit Suite vendor & tradeline directory access",
            "Email support",
          ],
        },
      ],
      joinLabel: "Get DIY Access",
      paymentPlanNote: PAYMENT_PLAN_NOTE,
      partnerAccess: "Credit Suite vendor & tradeline directory access.",
      dashboardCapabilityNote:
        "Unlocks the resource library in your dashboard — your plan, checklist, and progress tracking stay exactly where they are.",
      faqs: SHARED_FAQS,
    },
  },
  {
    id: "cohort",
    name: "Pro Cohort",
    price: "$2,997",
    originalPrice: "$3,497",
    cadence: "90 days",
    cadenceNote: "Limited-time $500 discount applied at checkout",
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
    productPage: {
      slug: "pro-cohort",
      headline: "90 days, a small group, and money when you need it.",
      subhead:
        "For Realtors who want structure, accountability, and a small group — weekly live coaching plus the Credit Suite client portal and coach.",
      heroBullets: [
        "90-day cohort with 5–10 Realtors",
        "Weekly live coaching calls",
        "Credit Suite client portal + coach",
      ],
      includedGroups: [
        {
          title: "Everything in DIY",
          items: [
            "Custom Business, Finance & Credit Plan (PDF + portal)",
            "Guide + 7-step action checklist",
            "Credit Suite vendor & tradeline directory access",
          ],
        },
        {
          title: "Coaching & community",
          items: [
            "90-day cohort with 5–10 Realtors",
            "Weekly live coaching calls",
            "Private cohort community",
          ],
        },
        {
          title: "Implementation platforms",
          items: ["Credit Suite client portal + coach"],
        },
      ],
      highlight: {
        title: "Accountability is the difference",
        body: "Most Realtors don't stall because the plan is wrong — they stall because nobody is checking in. The cohort keeps 5–10 Realtors moving through the same steps every week.",
      },
      joinLabel: "Join Pro Cohort",
      paymentPlanNote: PAYMENT_PLAN_NOTE,
      refundNote:
        "30-day satisfaction guarantee: if within 30 days of enrolling you feel the program isn't the right fit, email us and we'll refund your enrollment.",
      partnerAccess:
        "Credit Suite client portal and a dedicated Credit Suite coach, plus the vendor & tradeline directory.",
      dashboardCapabilityNote:
        "Unlocks the Credit Suite / Lendavo implementation platforms and the resource library in your dashboard.",
      faqs: SHARED_FAQS,
    },
  },
  {
    id: "one-on-one",
    name: "Cohort Plus",
    price: "$3,497",
    originalPrice: "$3,997",
    cadence: "per quarter",
    cadenceNote: "Limited-time $500 discount applied at checkout",
    who: "For Realtors and brokers who want private, high-touch guidance.",
    features: [
      "Everything in Cohort",
      "Private 1:1 coaching with Jessie",
      "Dedicated Credit Suite specialist",
      "Priority response + funding strategy sessions",
      "Quarterly plan reviews",
    ],
    ctaLabel: "Start Cohort Plus",
    ctaHref: STRIPE_LINKS.oneOnOne,
    icon: HeartHandshake,
    productPage: {
      slug: "cohort-plus",
      headline: "Private, high-touch guidance on top of the cohort.",
      subhead:
        "For Realtors and brokers who want private, high-touch guidance — everything in the cohort, plus 1:1 coaching, a dedicated specialist, and quarterly plan reviews.",
      heroBullets: [
        "Private 1:1 coaching with Jessie",
        "Dedicated Credit Suite specialist",
        "Quarterly plan reviews",
      ],
      includedGroups: [
        {
          title: "Everything in Pro Cohort",
          items: [
            "90-day cohort with 5–10 Realtors",
            "Weekly live coaching calls",
            "Private cohort community",
            "Credit Suite client portal + coach",
          ],
        },
        {
          title: "Private guidance",
          items: [
            "Private 1:1 coaching with Jessie",
            "Priority response + funding strategy sessions",
            "Quarterly plan reviews",
          ],
        },
        {
          title: "Dedicated support",
          items: ["Dedicated Credit Suite specialist"],
        },
      ],
      highlight: {
        title: "Built for brokers and higher-volume agents",
        body: "When your production, entity, and funding strategy are more complex, quarterly reviews and priority access keep the plan matched to where the business actually is.",
      },
      joinLabel: "Join Cohort Plus",
      paymentPlanNote: PAYMENT_PLAN_NOTE,
      refundNote:
        "30-day satisfaction guarantee: if within 30 days of enrolling you feel the program isn't the right fit, email us and we'll refund your enrollment.",
      partnerAccess:
        "Credit Suite client portal with a dedicated specialist, plus the vendor & tradeline directory.",
      dashboardCapabilityNote:
        "Unlocks the Credit Suite / Lendavo implementation platforms and the resource library in your dashboard.",
      faqs: SHARED_FAQS,
    },
  },
];

/** Paid tier id ↔ product page slug. Single place for the mapping. */
export const SLUG_BY_TIER: Record<"self-paced" | "cohort" | "one-on-one", PaidTierSlug> = {
  "self-paced": "diy",
  cohort: "pro-cohort",
  "one-on-one": "cohort-plus",
};

export function tierBySlug(slug?: string) {
  return PRICING_TIERS.find((t) => t.productPage?.slug === slug);
}

/** Product page path for a paid tier id (falls back to /pricing). */
export function productPathForTier(tierId?: string | null): string {
  const slug = tierId ? SLUG_BY_TIER[tierId as keyof typeof SLUG_BY_TIER] : undefined;
  return slug ? `/programs/${slug}` : "/pricing";
}