import type { PlanData } from "@/components/plan/PlanDocument";

export const SAMPLE_PLAN: PlanData = {
  contact_name: "Sarah Mitchell",
  contact_email: "sarah@example.com",
  city: "Sacramento",
  state: "CA",
  license_type: "Residential Broker",
  sections: {
    goals_snapshot: {
      narrative:
        "Sarah closed 14 sides in the last 12 months for approximately $185K GCI. Her #1 stated need is money when she needs it — between closings, before she launches her spring marketing push, and when team-hiring opportunities come up. Her #1 financial goal over the next 12 months is to secure $25,000–$50,000 in dedicated business credit capacity so she can stop putting marketing, lead-gen, and her transaction coordinator on her personal Visa. She also wants to reduce her personal-card utilization (currently ~62%) so her FICO is ready when she refinances her primary residence next year.",
    },
    fundability: {
      narrative:
        "Sarah has a solid foundation — entity, EIN, and a real business bank account. The fast wins are getting her business phone listed in directories, registering for D-U-N-S, and opening 3 starter vendor tradelines that report. Those three moves alone will move her from 'looks personal' to 'looks fundable' inside 60–90 days.",
      items: [
        { label: "Business Entity (S-Corp)", status: "strong", detail: "Filed in CA, in good standing." },
        { label: "EIN on File", status: "strong", detail: "Issued; on bank account." },
        { label: "Separate Business Bank Account", status: "strong", detail: "Chase Business, used exclusively." },
        { label: "Business Phone in Directories", status: "warning", detail: "Has a number; not listed in 411/Google Business." },
        { label: "Custom-Domain Business Email", status: "warning", detail: "Uses Gmail; brokerage domain available." },
        { label: "D-U-N-S Number Registered", status: "missing", detail: "Required for most business credit reporting." },
        { label: "Experian Business Profile", status: "missing", detail: "No profile yet." },
        { label: "Vendor Tradelines Reporting", status: "missing", detail: "0 reporting; needs 3+ to anchor a score." },
      ],
    },
    action_plan_90day: {
      items: [
        { step: 1, text: "List business phone in Google Business Profile and 411 directories.", effort: "30 min" },
        { step: 2, text: "Switch business email to a custom domain (yourname@yourbrand.com).", effort: "1 hour" },
        { step: 3, text: "Register for a D-U-N-S Number with Dun & Bradstreet (free).", effort: "20 min + 1–4 wk wait" },
        { step: 4, text: "Open Experian Business profile via a reporting vendor account.", effort: "30 min" },
        { step: 5, text: "Open 3 starter vendor tradelines that report (Uline, Quill, Grainger).", effort: "1 hour" },
        { step: 6, text: "Use vendor accounts for normal business supplies; pay early for 60 days.", effort: "Ongoing" },
        { step: 7, text: "Move 80% of business-card expenses off personal cards onto current cards under EIN.", effort: "1 hour audit" },
        { step: 8, text: "Open QuickBooks Online; categorize last 90 days of business transactions.", effort: "2 hours" },
        { step: 9, text: "Schedule a 30-min review at Day 60 to confirm reporting hit the bureaus.", effort: "30 min" },
      ],
    },
    roadmap: {
      milestones: [
        { month: "Month 1", description: "Phone listed, custom email live, D-U-N-S submitted, QuickBooks live." },
        { month: "Month 2", description: "Vendor tradelines opened and paid early; first business profile activity." },
        { month: "Month 3", description: "3 tradelines reporting; D-U-N-S issued; ready for starter business credit cards." },
        { month: "Month 6", description: "Apply for 2 higher-limit business cards reporting to bureaus only; reduce personal utilization toward 30%." },
        { month: "Month 9", description: "Apply for business line of credit ($15K–$30K) for marketing runway and TC support." },
        { month: "Month 12", description: "Stack to $50K+ in available business credit; personal-card utilization under 20%." },
      ],
    },
    funding_opportunities: {
      items: [
        { type: "Starter business credit cards (EIN-tied)", description: "After 3 tradelines report, 1–2 cards in the $2K–$7.5K range to season the profile." },
        { type: "Higher-limit business credit cards", description: "Months 6–9, $7.5K–$25K limits possible based on income docs and reporting depth." },
        { type: "Business line of credit (LOC)", description: "$15K–$50K bank or fintech LOC for between-closing runway." },
        { type: "Vehicle / equipment financing under EIN", description: "Useful for showings vehicle, photography kit, or office build-out." },
      ],
    },
    next_steps: {
      narrative:
        "Sarah is a strong fit for the 90-day Realtor Cohort. She already has structure in place — she mainly needs accountability and a guided sequence so her tradelines, bureau profiles, and first card applications happen in the right order. Self-paced is fine if her schedule is too unpredictable for live calls.",
      program_options: [
        { name: "Realtor Financial Credit Coach (1:1)", description: "Private weekly calls with a Realtor-specific business credit coach. Best if Sarah wants a custom pace." },
        { name: "Realtor Financial Credit Cohort (5–10 Realtors)", description: "90-day live cohort with shared milestones, accountability, and a Credit Suite implementation portal." },
      ],
    },
  },
};