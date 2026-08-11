import type { CatalogTask } from "./types";
import { TASK_HELP } from "./taskHelp";

/**
 * Canonical, ordered task catalog for the RE Pro Business Credit roadmap.
 *
 * `key` values are persisted as plan_task_progress.task_key — they are database
 * identifiers. Titles and copy can be edited freely; keys cannot.
 */
const BASE_TASKS: CatalogTask[] = [
  // ---------------------------------------------------------------- foundation
  {
    key: "entity_formed",
    title: "Form or confirm your business entity",
    explanation:
      "Lenders and business credit bureaus need a business that exists on paper, separate from you personally. Confirm what's allowed for your license in your state with your attorney and CPA.",
    nextAction: "Confirm your entity type with your attorney/CPA and file if needed.",
    phase: "foundation",
    basePriority: 1,
    dependsOn: [],
    effort: "1–2 weeks",
    actionHref: "/guide",
    actionLabel: "Read the entity chapter",
    keywords: ["entity", "llc", "s-corp", "corporation", "incorporat", "sole propriet"],
  },
  {
    key: "ein_obtained",
    title: "Get your EIN",
    explanation:
      "Your EIN is the business equivalent of an SSN. Every business bank account, vendor account, and EIN-tied credit card starts here.",
    nextAction: "Apply for an EIN with the IRS (free, takes about 15 minutes online).",
    phase: "foundation",
    basePriority: 2,
    dependsOn: ["entity_formed"],
    effort: "20 min",
    keywords: ["ein", "employer identification"],
  },
  {
    key: "business_bank_account",
    title: "Open a fully separate business bank account",
    explanation:
      "Mixed personal and business money is the single fastest way to look unfundable. All commission income and business spend should flow through one business account.",
    nextAction: "Open a business checking account under your EIN and route all business activity through it.",
    phase: "foundation",
    basePriority: 3,
    dependsOn: ["ein_obtained"],
    effort: "1 hour",
    keywords: ["bank account", "business checking", "banking"],
  },
  {
    key: "accounting_software",
    title: "Set up bookkeeping software",
    explanation:
      "Clean books make underwriting faster and tax season painless. It also proves the business is actually operating.",
    nextAction: "Set up QuickBooks, Xero, or Wave and categorize the last 90 days.",
    phase: "foundation",
    basePriority: 4,
    dependsOn: ["business_bank_account"],
    effort: "2 hours",
    keywords: ["quickbook", "xero", "bookkeep", "accounting software"],
    quickActions: [
      { label: "Connect QuickBooks", href: "https://quickbooks.intuit.com/", external: true },
      { label: "Connect Xero", href: "https://www.xero.com/signup/", external: true },
      { label: "Connect Wave", href: "https://www.waveapps.com/", external: true },
    ],
  },

  // --------------------------------------------------------------- credibility
  {
    key: "business_address",
    title: "Establish a business address",
    explanation:
      "A real, deliverable business address (not a P.O. box) is checked by data providers and many card issuers.",
    nextAction: "Set up a physical or virtual office address and use it consistently everywhere.",
    phase: "credibility",
    basePriority: 1,
    dependsOn: [],
    effort: "1–3 days",
    keywords: ["address", "office", "p.o. box", "po box"],
  },
  {
    key: "business_phone_listed",
    title: "Get a business phone listed in directories",
    explanation:
      "A separate business line that shows up in 411 and your Google Business Profile is one of the cheapest credibility wins available.",
    nextAction: "Get a business number and list it in Google Business Profile and 411 directories.",
    phase: "credibility",
    basePriority: 2,
    dependsOn: [],
    effort: "30 min",
    keywords: ["phone", "411", "directory", "google business"],
    quickActions: [
      { label: "Open Google Business Profile", href: "https://www.google.com/business/", external: true },
    ],
  },
  {
    key: "business_email_domain",
    title: "Move to a custom-domain business email",
    explanation:
      "A Gmail address on an application signals hobby, not business. A yourname@yourbrand.com address signals the opposite.",
    nextAction: "Set up email on your own domain and update it on all business accounts.",
    phase: "credibility",
    basePriority: 3,
    dependsOn: [],
    effort: "1 hour",
    keywords: ["email", "custom domain", "gmail"],
  },
  {
    key: "business_website",
    title: "Stand up a business website you control",
    explanation:
      "Not your brokerage's profile page — a site on your own domain that describes the business. Underwriters look.",
    nextAction: "Publish a simple site on your own domain with services, address, and phone.",
    phase: "credibility",
    basePriority: 4,
    dependsOn: [],
    effort: "1 day",
    keywords: ["website", "web site", "domain"],
  },

  // ------------------------------------------------------------------- bureaus
  {
    key: "duns_registered",
    title: "Register for a D-U-N-S Number",
    explanation:
      "Dun & Bradstreet is the anchor business credit bureau. Without a D-U-N-S, most vendor reporting has nowhere to land.",
    nextAction: "Request a free D-U-N-S Number from Dun & Bradstreet.",
    phase: "bureaus",
    basePriority: 1,
    dependsOn: ["ein_obtained"],
    effort: "20 min + 1–4 wk wait",
    keywords: ["d-u-n-s", "duns", "dun & bradstreet", "dun and bradstreet"],
    quickActions: [
      { label: "Start D-U-N-S registration", href: "https://www.dnb.com/duns-number/get-a-duns.html", external: true },
    ],
  },
  {
    key: "experian_profile",
    title: "Establish your Experian Business profile",
    explanation:
      "Experian Business builds a profile automatically once reporting activity exists — but you should confirm the data is accurate.",
    nextAction: "Check for an existing Experian Business profile and correct any wrong details.",
    phase: "bureaus",
    basePriority: 2,
    dependsOn: ["ein_obtained"],
    effort: "30 min",
    keywords: ["experian"],
    quickActions: [
      { label: "Open Experian Business", href: "https://www.experian.com/small-business/business-credit", external: true },
    ],
  },
  {
    key: "equifax_profile",
    title: "Establish your Equifax Small Business profile",
    explanation:
      "The third major business bureau. Several card issuers pull here specifically.",
    nextAction: "Verify or open your Equifax Small Business profile.",
    phase: "bureaus",
    basePriority: 3,
    dependsOn: ["ein_obtained"],
    effort: "30 min",
    keywords: ["equifax"],
    quickActions: [
      { label: "Open Equifax Small Business", href: "https://www.equifax.com/business/small-business/", external: true },
    ],
  },

  // ---------------------------------------------------------------- tradelines
  {
    key: "vendor_tradelines_3",
    title: "Open 3+ vendor tradelines that report",
    explanation:
      "Three reporting vendor accounts, paid early for 60–90 days, is what turns an empty bureau file into a scoreable one.",
    nextAction: "Open 3 starter vendor accounts that report, and use them for real business supplies.",
    phase: "tradelines",
    basePriority: 1,
    dependsOn: ["duns_registered"],
    effort: "1 hour + 60–90 days",
    keywords: ["tradeline", "trade line", "vendor", "uline", "quill", "grainger"],
  },
  {
    key: "expenses_off_personal",
    title: "Move business spend off your personal cards",
    explanation:
      "Marketing, lead-gen, staging, and tech on your personal Visa is what drives your utilization up and your FICO down.",
    nextAction: "Audit the last 90 days and move recurring business charges onto business accounts.",
    phase: "tradelines",
    basePriority: 2,
    dependsOn: ["business_bank_account"],
    effort: "1 hour audit",
    keywords: ["personal card", "off personal", "utilization", "move expenses"],
  },

  // ------------------------------------------------------------------- funding
  {
    key: "starter_business_card",
    title: "Open your first EIN-tied business credit card",
    explanation:
      "Once tradelines report, starter cards in the $2K–$7.5K range season the profile for bigger limits later.",
    nextAction: "Apply for 1–2 starter business cards that report to the business bureaus.",
    phase: "funding",
    basePriority: 1,
    dependsOn: ["vendor_tradelines_3"],
    effort: "1 hour",
    keywords: ["business credit card", "starter card", "ein-only", "ein only"],
  },
  {
    key: "utilization_under_30",
    title: "Bring personal card utilization under 30%",
    explanation:
      "Most business credit approvals still look at your personal profile. Lower utilization means better limits and better terms.",
    nextAction: "Pay down or shift balances until each personal card is under 30% utilization.",
    phase: "funding",
    basePriority: 2,
    dependsOn: ["expenses_off_personal"],
    effort: "Ongoing",
    keywords: ["utilization", "personal credit score", "paydown", "pay down"],
  },
  {
    key: "higher_limit_card_or_loc",
    title: "Secure a higher-limit card or business line of credit",
    explanation:
      "This is the payoff: real capacity you can draw on between closings, before a marketing push, or when opportunity knocks.",
    nextAction: "With a seasoned profile, apply for a higher-limit card or a business LOC.",
    phase: "funding",
    basePriority: 3,
    dependsOn: ["starter_business_card"],
    effort: "2–4 weeks",
    actionHref: "/pricing",
    actionLabel: "See coaching options",
    keywords: ["line of credit", "loc", "higher-limit", "higher limit", "term loan", "funding"],
  },
];

/** Catalog with plain-English help content attached for the dashboard bubbles. */
export const TASK_CATALOG: CatalogTask[] = BASE_TASKS.map((task) => ({
  ...task,
  help: TASK_HELP[task.key],
}));

export const TASK_BY_KEY: Record<string, CatalogTask> = Object.fromEntries(
  TASK_CATALOG.map((t) => [t.key, t]),
);