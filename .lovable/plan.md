# RE Pro Business Credit Card Guide — How & Why of Credit Card Stacking

Build a second full-length guide focused on business credit card stacking for real estate professionals, and rewrite the Business Credit Cards page into its landing page — both written inside the affiliate compliance rules in the uploaded Playbook and Do's & Don'ts addendum.

## 1. New guide at `/card-guide`

Same architecture as the existing `/guide`: cover, table of contents, skim summary, numbered chapters, floating TOC + chapter rail, reading progress bar, per-chapter CTA, closing, resources, and a PDF download.

Chapter outline (concise, story-driven, Realtor-first but inclusive of brokers, investors, and other real estate professionals):

```text
Welcome from Jessie — why I looked at card stacking after 2008 and 2020
1.  What "credit card stacking" actually is (and what it is not)
2.  Why real estate income makes this different from a W-2 business
3.  Business cards vs personal cards: the separation that protects your FICO
4.  Personal guarantee, personal liability, and what actually gets reported
5.  The introductory 0% APR window — a tool, not free money
6.  Why the business entity comes first (and why projections differ from personal apps)
7.  The application sequence: why order and timing drive approvals
8.  The part nobody prepares you for: bank verification calls
9.  Using cards for things that "don't take cards" — and the real fees involved
10. Real estate use cases: marketing, staging, renovations, buy-downs, team hires
11. How to spot a bad stacking company (red flags)
12. What this is not: not credit repair, not a loan, not a line of credit
13. Your next step — free customized plan, then choose implementation
Closing message · Resources & full disclosures
```

Content sourced only from the approved partner materials: the 12-month coaching and support program, entity setup help, strategic application sequencing, business credit profile building with the business bureaus, ongoing coaching across multiple funding rounds, the "hand-holding through the bank approval process" positioning, the honest "no special bank relationships" positioning, red flags of bad stackers, and responsible-use guidance.

Stories and examples will be drawn from approved partner content and reframed for real estate (a listing agent funding a renovation credit, a broker covering payroll between closings, an investor funding a rehab) — presented as illustrative examples, not as testimonials or typical results.

## 2. Compliance guardrails (non-negotiable in the copy)

- The funding partner is referenced generically ("our funding partner") in body copy; the affiliate disclosure and enrollment link appear at the CTA points.
- Affiliate disclosure placed above the fold and repeated near every enrollment CTA: a clear statement that we are a paid affiliate and may receive compensation if you enroll through our link.
- Banned everywhere: guaranteed approval/funding/results, instant or pre-approval, no credit check, "line of credit" (only "business credit cards that can be used like a line of credit"), "loans", credit repair or score-boost claims, insider or special bank relationships, guaranteed timelines, and rate/payment trigger terms beyond the disclosed introductory-rate framing.
- Always phrased as "up to $300,000 … for well-qualified clients, results vary."
- Explicit statements that the partner is not a lender, not a loan broker, and not a credit repair organization; all credit decisions are made by third-party lenders.
- A full disclosure block (product and approval, introductory rate reverting, balance-transfer and bill-pay service fees, personal credit impact and personal guarantee, services provided, results disclosure with the typical range, financial risk) rendered at the bottom of both the page and the PDF.
- No outbound calls or texts promoting the partner; any "call" CTA directs to the partner directly.

Note: per the Playbook, this page and guide must be submitted to the partner for review and approved before publishing. I'll build it as draft-ready copy; you publish after their sign-off.

## 3. Rewritten `/business-credit-cards-for-realtors`

Becomes the landing/registration page for the card guide, mirroring the partner's webinar registration page structure but in RE Pro branding and voice:

- Hero: headline and subhead, **RE Pro Business Credit Card video placeholder** using the same `HeroVideo` component pattern as the home and guide pages, primary CTA, trust badge, and the affiliate disclosure line.
- A "sneak peek at what's coming your way" benefits block, tailored: 2026 business lending trends, how the strategy works, hidden pitfalls that trigger automated denials, how to use cards for escrow, renovations, and purchases the way real estate pros need, and what you get for free.
- Who this is for: Realtors first, then brokers, investors, and other real estate professionals.
- How it works: the 12-month coaching program components (entity setup, strategic applications, bureau profile building, ongoing coaching over multiple rounds).
- Red flags section (how to spot a bad stacker) — a trust builder.
- Retain the existing card-category grid, filter tabs, sticky jump-link sidebar, and FAQs, with copy revised for compliance; FAQs extended with stacking-specific questions.
- Primary CTA: the partner masterclass/affiliate link (configurable constant, placeholder until you supply the URL). Secondary CTA: read the card guide or create your free plan.
- Full disclosure footer block.

## 4. Technical notes

- New route `/card-guide`; `/business-credit-cards-for-realtors` keeps its path.
- New components under `src/components/card-guide/` reusing the existing guide primitives (`Callout`, `JessieNote`, `GoodNugget`, `ChapterTakeaway`, `ChapterHeader`) so styling matches.
- `src/components/CardGuidePDF.tsx` built with `@react-pdf/renderer`, matching the existing guide PDF layout (8.5x11, cover, TOC, chapters, disclosures page).
- `src/config/partner.ts` holding the affiliate link, disclosure text, and disclaimer copy in one place so it can be updated after partner review.
- Video placeholder wired to the existing `HeroVideo` storage-slot pattern so you can upload the RE Pro card video from the admin video page.
- Three or four AI-generated illustrative images and diagrams in the guide (stacking sequence, timing and rounds, use-case grid) in the existing brand palette; no fabricated logos, screenshots, or partner branding.
- SEO: title and description, single H1, and a link from the main guide's resources section.

## Open item

I'll use a placeholder for the affiliate/masterclass URL until you paste it in; everything else ships ready.