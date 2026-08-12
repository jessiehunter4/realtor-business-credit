/**
 * Funding-partner configuration and compliance copy.
 *
 * All affiliate-facing language lives here so it can be updated in one place
 * after partner review. Body copy elsewhere on the site should reference the
 * partner generically ("our funding partner") and pull disclosures from here.
 */

/** Generic partner reference used in body copy. */
export const PARTNER_NAME = "our funding partner";

/**
 * Affiliate enrollment / masterclass URL.
 * Placeholder until the approved affiliate link is supplied.
 */
export const PARTNER_MASTERCLASS_URL = "https://reprobusinesscredit.com/partner-masterclass";

/** Short affiliate disclosure — used above the fold and next to every CTA. */
export const AFFILIATE_DISCLOSURE_SHORT =
  "Affiliate disclosure: RE Pro Business Credit is a paid affiliate of our funding partner. If you enroll through our link, we may receive compensation at no additional cost to you.";

/** Program description in approved, compliant language. */
export const PARTNER_PROGRAM_SUMMARY =
  "A 12-month coaching and support program that helps you set up your business entity correctly, sequence business credit card applications strategically, build your business credit profile with the business bureaus, and receive ongoing coaching across multiple funding rounds.";

/** Approved results framing. Never state or imply guaranteed amounts. */
export const RESULTS_STATEMENT =
  "Well-qualified clients may access up to $300,000 in business credit across multiple rounds. Results vary and depend on your credit profile, business details, and the decisions of third-party issuers.";

/** Full disclosure block rendered at the bottom of the card guide and landing page. */
export const FULL_DISCLOSURES: { title: string; body: string }[] = [
  {
    title: "Product and approval",
    body: "This program helps you apply for business credit cards. Business credit cards can be used like a line of credit, but they are not a line of credit and they are not loans. All credit decisions are made solely by third-party issuers and lenders. No approval, amount, timeline, or outcome is promised or guaranteed.",
  },
  {
    title: "Introductory rates",
    body: "Some business credit cards offer an introductory rate for a limited time. Introductory rates expire and the card's standard rate then applies to remaining balances. Terms are set by the issuer and can change at any time.",
  },
  {
    title: "Service fees",
    body: "Balance transfer, bill-pay, and liquidity services offered by third parties carry their own fees. Review all fee schedules and terms before using any service.",
  },
  {
    title: "Personal credit and personal guarantee",
    body: "Applications typically involve a credit inquiry and most business credit cards require a personal guarantee. Applying for business credit can affect your personal credit profile, and you may be personally responsible for balances.",
  },
  {
    title: "Services provided",
    body: "Our funding partner is not a lender, not a loan broker, and not a credit repair organization. The program provides education, coaching, and application support only. Nothing here is legal, tax, accounting, or investment advice — confirm your specific situation with your broker, CPA, attorney, and state licensing board.",
  },
  {
    title: "Results",
    body: RESULTS_STATEMENT,
  },
  {
    title: "Financial risk",
    body: "Business credit is debt. Borrowing carries real financial risk, including the risk of loss. Only use credit for expenses you have a realistic plan to repay, and build reserves before you need them.",
  },
];

/** Language that must never appear in card-guide or partner-facing copy. */
export const PROHIBITED_TERMS = [
  "guaranteed approval",
  "guaranteed funding",
  "guaranteed results",
  "pre-approved",
  "instant approval",
  "no credit check",
  "line of credit (standalone)",
  "loan",
  "credit repair",
  "boost your score",
  "special bank relationships",
] as const;