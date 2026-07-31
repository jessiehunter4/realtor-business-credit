/**
 * Deterministic fundability scoring from intake survey answers.
 *
 * IMPORTANT: this mirrors `src/lib/roadmap/intakeSignals.ts` on the client.
 * Keep the two in sync — the generated plan document and the dashboard roadmap
 * must never disagree about what the user already has in place.
 */
export interface FundabilityItem {
  label: string;
  status: "strong" | "warning" | "missing";
  detail: string;
}

// deno-lint-ignore no-explicit-any
export function computeFundabilityItems(survey: any): FundabilityItem[] {
  const items: FundabilityItem[] = [];

  // Entity
  const entity = survey.has_business_entity;
  if (entity === "Corporation" || entity === "LLC") {
    items.push({ label: `Business Entity (${entity})`, status: "strong", detail: `Registered as ${entity}` });
  } else if (entity === "Sole Proprietor" || entity === "Partnership") {
    items.push({ label: `Business Entity (${entity})`, status: "warning", detail: `Operating as ${entity} — consider forming an LLC or Corp` });
  } else {
    items.push({ label: "Business Entity", status: "missing", detail: "No formal business entity established" });
  }

  // EIN — inferred from entity
  if (entity === "Corporation" || entity === "LLC") {
    items.push({ label: "EIN on File", status: "strong", detail: "Likely obtained with entity formation" });
  } else if (entity === "Sole Proprietor" || entity === "Partnership") {
    items.push({ label: "EIN on File", status: "warning", detail: "May or may not have a separate EIN" });
  } else {
    items.push({ label: "EIN on File", status: "missing", detail: "No EIN without a business entity" });
  }

  // Bank account
  const bank = survey.has_business_bank_account;
  if (bank === "Fully separate") {
    items.push({ label: "Separate Business Bank Account", status: "strong", detail: "Fully separate from personal" });
  } else if (bank === "Partially mixed") {
    items.push({ label: "Business Bank Account", status: "warning", detail: "Partially mixed with personal funds" });
  } else {
    items.push({ label: "Business Bank Account", status: "missing", detail: "Using personal account only" });
  }

  // Address
  const addr = survey.has_business_address;
  if (addr === "Physical office") {
    items.push({ label: "Business Address", status: "strong", detail: "Physical office address" });
  } else if (addr === "Virtual office" || addr === "Home address") {
    items.push({ label: "Business Address", status: "warning", detail: `Using ${addr?.toLowerCase()}` });
  } else {
    items.push({ label: "Business Address", status: "missing", detail: "No dedicated business address" });
  }

  // Phone
  items.push({
    label: "Business Phone in Directories",
    status: survey.has_business_phone ? "strong" : "missing",
    detail: survey.has_business_phone ? "Listed in directories" : "No separate business phone",
  });

  // Email
  items.push({
    label: "Business Email on Custom Domain",
    status: survey.has_business_email ? "strong" : "missing",
    detail: survey.has_business_email ? "Custom domain email" : "No custom domain email",
  });

  // Website
  items.push({
    label: "Business Website",
    status: survey.has_business_website ? "strong" : "missing",
    detail: survey.has_business_website ? "Has business website" : "No business website",
  });

  // Tradelines
  const tl = survey.vendor_tradelines;
  if (tl === "3+ reporting") {
    items.push({ label: "Vendor Tradelines Reporting", status: "strong", detail: "3+ tradelines reporting to bureaus" });
  } else if (tl === "1–2 reporting") {
    items.push({ label: "Vendor Tradelines Reporting", status: "warning", detail: "1–2 tradelines — need more" });
  } else {
    items.push({ label: "Vendor Tradelines Reporting", status: "missing", detail: "No tradelines reporting" });
  }

  // Credit bureaus
  const bureaus = survey.credit_reporting_bureaus || [];
  const realBureaus = bureaus.filter((b: string) => b !== "Not sure");
  if (realBureaus.length >= 2) {
    items.push({ label: "Business Credit Bureau Profiles", status: "strong", detail: `Reporting to ${realBureaus.join(", ")}` });
  } else if (realBureaus.length === 1) {
    items.push({ label: "Business Credit Bureau Profiles", status: "warning", detail: `Only reporting to ${realBureaus[0]}` });
  } else {
    items.push({ label: "Business Credit Bureau Profiles", status: "missing", detail: "Not reporting to any business credit bureau" });
  }

  return items;
}