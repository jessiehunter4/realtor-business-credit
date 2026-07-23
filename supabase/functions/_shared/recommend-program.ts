// Deterministic, rule-based program recommender.
// Consumed by generate-plan; unit-testable in isolation.

export type Program = {
  slug: string;
  name: string;
  tagline?: string | null;
  price_display?: string | null;
  cadence?: string | null;
  cta_label: string;
  cta_href?: string | null;
  pricing_anchor?: string | null;
  fit_rules: Record<string, unknown>;
  sort_order: number;
};

export type ReasonBullet = { bullet: string; source_rule: string };

export type RecommendationResult = {
  slug: string;
  score: number;
  scores: Record<string, number>;
  rule_hits: Record<string, string[]>; // slug -> list of rule keys that fired
  reasoning: ReasonBullet[];
  needs_more_info: boolean;
};

// Small helpers ---------------------------------------------------------------

const norm = (v: unknown): string =>
  typeof v === "string" ? v.trim().toLowerCase().replace(/[\s\-]+/g, "_") : "";

const inList = (v: unknown, list: unknown): boolean => {
  if (!Array.isArray(list)) return false;
  const n = norm(v);
  return list.some((x) => norm(x) === n);
};

const isHighGci = (band: string): boolean => {
  // Any band that mentions 250k+, 500k+, 1m+ counts as high.
  return /(\$?250k\+|\$?500k\+|\$?1m|million)/i.test(band);
};

const isLargeTarget = (band: string): boolean => {
  return /(100k|250k\+|\$?500k)/i.test(band);
};

const isBroker = (licenseType: string): boolean => /broker/i.test(licenseType);

const isEarlyStage = (survey: any): boolean => {
  const entity = norm(survey.has_business_entity);
  const bank = norm(survey.has_business_bank_account);
  return (
    !entity ||
    entity === "none" ||
    entity === "not_sure" ||
    entity === "sole_proprietor" ||
    bank === "" ||
    bank === "personal_only"
  );
};

// Reasoning builders ----------------------------------------------------------

function buildReasoning(survey: any, hits: string[]): ReasonBullet[] {
  const b: ReasonBullet[] = [];
  const push = (rule: string, bullet: string) => b.push({ bullet, source_rule: rule });

  if (hits.includes("support_format")) {
    push(
      "support_format",
      `You told us you prefer ${survey.preferred_support_format || "this format"} — this program is built around that.`,
    );
  }
  if (hits.includes("readiness")) {
    push(
      "readiness",
      `Your readiness (“${survey.investment_readiness}”) matches the pace of this program.`,
    );
  }
  if (hits.includes("cohort_interest") && survey.interest_in_cohort) {
    push(
      "cohort_interest",
      `You said cohort interest is “${survey.interest_in_cohort}” — the small-group format gives you weekly accountability.`,
    );
  }
  if (hits.includes("high_gci_bonus") && survey.gci_last_12_months) {
    push(
      "high_gci_bonus",
      `At ${survey.gci_last_12_months} GCI, private 1:1 attention is worth the investment.`,
    );
  }
  if (hits.includes("broker_bonus") && survey.license_type) {
    push(
      "broker_bonus",
      `As a ${survey.license_type}, your funding needs are typically more complex — high-touch coaching fits.`,
    );
  }
  if (hits.includes("reduce_pg_bonus")) {
    push(
      "reduce_pg_bonus",
      "You want to reduce personal guarantees — this program's playbook is designed for exactly that.",
    );
  }
  if (hits.includes("large_target_bonus") && survey.target_funding_amount) {
    push(
      "large_target_bonus",
      `Your ${survey.target_funding_amount} target funding goal is best supported here.`,
    );
  }
  if (hits.includes("early_stage_bonus")) {
    push(
      "early_stage_bonus",
      "You're still setting up the basics of a business entity and banking — start here with no cost first.",
    );
  }
  if (hits.includes("base_weight") && b.length === 0) {
    push("base_weight", "Based on your overall profile, this is the most aligned starting point.");
  }
  return b;
}

// Core scorer ----------------------------------------------------------------

export function recommendProgram(
  survey: any,
  programs: Program[],
): RecommendationResult {
  const scores: Record<string, number> = {};
  const hitsBySlug: Record<string, string[]> = {};

  const supportFormat = norm(survey.preferred_support_format);
  const readiness = norm(survey.investment_readiness);
  const cohortInterest = norm(survey.interest_in_cohort);
  const pgComfort = norm(survey.personal_guarantee_comfort);
  const gci = survey.gci_last_12_months || "";
  const licenseType = survey.license_type || "";
  const target = survey.target_funding_amount || "";

  const needsMoreInfo = !supportFormat && !readiness && !cohortInterest;

  for (const p of programs) {
    let score = 0;
    const hits: string[] = [];
    const rules = p.fit_rules || {};

    if (typeof (rules as any).base_weight === "number") {
      score += (rules as any).base_weight as number;
      hits.push("base_weight");
    }

    if (supportFormat && inList(supportFormat, (rules as any).support_format)) {
      score += 3;
      hits.push("support_format");
    }
    if (readiness && inList(readiness, (rules as any).readiness)) {
      score += 3;
      hits.push("readiness");
    }
    if (cohortInterest && inList(cohortInterest, (rules as any).cohort_interest)) {
      score += 2;
      hits.push("cohort_interest");
    }
    if ((rules as any).high_gci_bonus && isHighGci(gci)) {
      score += 2;
      hits.push("high_gci_bonus");
    }
    if ((rules as any).broker_bonus && isBroker(licenseType)) {
      score += 2;
      hits.push("broker_bonus");
    }
    if ((rules as any).reduce_pg_bonus && /reduce/i.test(pgComfort)) {
      score += 1;
      hits.push("reduce_pg_bonus");
    }
    if ((rules as any).large_target_bonus && isLargeTarget(target)) {
      score += 1;
      hits.push("large_target_bonus");
    }
    if ((rules as any).early_stage_bonus && isEarlyStage(survey)) {
      score += 2;
      hits.push("early_stage_bonus");
    }

    scores[p.slug] = score;
    hitsBySlug[p.slug] = hits;
  }

  // Pick winner. Deterministic tiebreak: highest score, then sort_order asc.
  const sorted = [...programs].sort((a, b) => {
    const sa = scores[a.slug] ?? 0;
    const sb = scores[b.slug] ?? 0;
    if (sb !== sa) return sb - sa;
    return (a.sort_order ?? 0) - (b.sort_order ?? 0);
  });

  // If nothing scored above 0, fall back to free-discovery if present, else first program.
  const nothingScored = sorted.every((p) => (scores[p.slug] ?? 0) === 0);
  const winner = nothingScored
    ? programs.find((p) => p.slug === "free-discovery") ?? sorted[0]
    : sorted[0];

  const winnerHits = hitsBySlug[winner.slug] || [];
  const reasoning = buildReasoning(survey, winnerHits);

  return {
    slug: winner.slug,
    score: scores[winner.slug] ?? 0,
    scores,
    rule_hits: hitsBySlug,
    reasoning,
    needs_more_info: needsMoreInfo,
  };
}