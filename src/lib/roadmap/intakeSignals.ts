import type { TaskStatus } from "./types";

/**
 * Maps raw intake_surveys answers to a fundability signal per canonical task key.
 *
 * IMPORTANT: this mirrors `computeFundabilityItems` in
 * supabase/functions/_shared/fundability.ts. Keep the two in sync — the plan
 * document and the dashboard must never disagree about what is already done.
 *
 * strong  -> completed
 * warning -> in_progress
 * missing -> not_started
 */
export type Signal = "strong" | "warning" | "missing";

export interface IntakeSignal {
  status: TaskStatus;
  signal: Signal;
  detail: string;
}

export interface IntakeSurveyLike {
  has_business_entity?: string | null;
  has_business_address?: string | null;
  has_business_phone?: boolean | null;
  has_business_email?: boolean | null;
  has_business_website?: boolean | null;
  has_business_bank_account?: string | null;
  uses_accounting_software?: string | null;
  accounting_software_name?: string | null;
  business_credit_cards?: string | null;
  vendor_tradelines?: string | null;
  credit_reporting_bureaus?: string[] | null;
  funding_gap_methods?: string[] | null;
  desired_funding_types?: string[] | null;
  financial_pains?: string[] | null;
  primary_goals?: string[] | null;
  personal_credit_score_range?: string | null;
}

const toStatus = (s: Signal): TaskStatus =>
  s === "strong" ? "completed" : s === "warning" ? "in_progress" : "not_started";

const sig = (signal: Signal, detail: string): IntakeSignal => ({
  signal,
  detail,
  status: toStatus(signal),
});

export function deriveIntakeSignals(
  survey: IntakeSurveyLike | null | undefined,
): Record<string, IntakeSignal> {
  const out: Record<string, IntakeSignal> = {};
  if (!survey) return out;

  const entity = survey.has_business_entity ?? "";
  const hasFormalEntity = entity === "Corporation" || entity === "LLC";
  const hasInformalEntity = entity === "Sole Proprietor" || entity === "Partnership";

  out.entity_formed = hasFormalEntity
    ? sig("strong", `Registered as ${entity}.`)
    : hasInformalEntity
      ? sig("warning", `Operating as ${entity} — consider a formal entity with your attorney/CPA.`)
      : sig("missing", "No formal business entity established.");

  out.ein_obtained = hasFormalEntity
    ? sig("strong", "Likely obtained with entity formation.")
    : hasInformalEntity
      ? sig("warning", "You may or may not have a separate EIN — confirm it.")
      : sig("missing", "No EIN without a business entity.");

  const bank = survey.has_business_bank_account ?? "";
  out.business_bank_account =
    bank === "Fully separate"
      ? sig("strong", "Fully separate from personal.")
      : bank === "Partially mixed"
        ? sig("warning", "Partially mixed with personal funds.")
        : sig("missing", "Using a personal account only.");

  const acct = survey.uses_accounting_software ?? "";
  out.accounting_software =
    acct === "Yes" || acct === "QuickBooks" || acct === "Xero" || !!survey.accounting_software_name
      ? sig("strong", survey.accounting_software_name ? `Using ${survey.accounting_software_name}.` : "Bookkeeping software in place.")
      : acct === "Spreadsheet"
        ? sig("warning", "Tracking in a spreadsheet — upgrade to real bookkeeping software.")
        : sig("missing", "No bookkeeping system in place.");

  const addr = survey.has_business_address ?? "";
  out.business_address =
    addr === "Physical office"
      ? sig("strong", "Physical office address.")
      : addr === "Virtual office" || addr === "Home address"
        ? sig("warning", `Using a ${addr.toLowerCase()}.`)
        : sig("missing", "No dedicated business address.");

  out.business_phone_listed = survey.has_business_phone
    ? sig("strong", "Business line in place.")
    : sig("missing", "No separate business phone.");

  out.business_email_domain = survey.has_business_email
    ? sig("strong", "Custom-domain email in place.")
    : sig("missing", "No custom-domain business email.");

  out.business_website = survey.has_business_website
    ? sig("strong", "Business website in place.")
    : sig("missing", "No business website you control.");

  const bureaus = (survey.credit_reporting_bureaus ?? []).filter((b) => b && b !== "Not sure");
  const has = (name: string) => bureaus.some((b) => b.toLowerCase().includes(name));

  out.duns_registered = has("dun")
    ? sig("strong", "D-U-N-S Number on file.")
    : sig("missing", "No D-U-N-S Number yet.");
  out.experian_profile = has("experian")
    ? sig("strong", "Experian Business profile active.")
    : sig("missing", "No Experian Business profile yet.");
  out.equifax_profile = has("equifax")
    ? sig("strong", "Equifax Small Business profile active.")
    : sig("missing", "No Equifax Small Business profile yet.");

  const tl = survey.vendor_tradelines ?? "";
  out.vendor_tradelines_3 = tl.startsWith("3+")
    ? sig("strong", "3+ tradelines reporting.")
    : tl.includes("1") && tl.includes("2")
      ? sig("warning", "1–2 tradelines reporting — you need at least three.")
      : sig("missing", "No vendor tradelines reporting.");

  const gapMethods = survey.funding_gap_methods ?? [];
  const usesPersonal = gapMethods.some((m) =>
    /personal credit|personal loan|heloc/i.test(m),
  );
  out.expenses_off_personal = usesPersonal
    ? sig("missing", "Currently covering gaps with personal credit.")
    : gapMethods.some((m) => /business/i.test(m))
      ? sig("strong", "Business accounts already cover the gaps.")
      : sig("warning", "Some business spend may still sit on personal accounts.");

  const cards = survey.business_credit_cards ?? "";
  out.starter_business_card = /ein[- ]only/i.test(cards)
    ? sig("strong", "EIN-only business cards in place.")
    : /personal guarantee/i.test(cards)
      ? sig("warning", "Business cards exist but carry a personal guarantee.")
      : sig("missing", "No business credit cards yet.");

  const score = survey.personal_credit_score_range ?? "";
  out.utilization_under_30 = /7\d\d|8\d\d|Excellent|Very good/i.test(score)
    ? sig("warning", "Strong personal profile — confirm per-card utilization.")
    : sig("missing", "Personal utilization not yet confirmed under 30%.");

  const hasRealCapacity = /ein[- ]only/i.test(cards) && tl.startsWith("3+");
  out.higher_limit_card_or_loc = hasRealCapacity
    ? sig("warning", "Foundation is there — time to stack real capacity.")
    : sig("missing", "Not yet positioned for higher-limit funding.");

  return out;
}

/** True when the survey shows an already-established business credit profile. */
export function hasEstablishedCredit(survey: IntakeSurveyLike | null | undefined): boolean {
  if (!survey) return false;
  const cards = survey.business_credit_cards ?? "";
  const tl = survey.vendor_tradelines ?? "";
  const bureaus = (survey.credit_reporting_bureaus ?? []).filter((b) => b && b !== "Not sure");
  return /ein[- ]only/i.test(cards) && tl.startsWith("3+") && bureaus.length >= 1;
}