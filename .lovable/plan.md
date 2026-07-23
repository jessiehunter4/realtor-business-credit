## Goal

On the Intake Survey (Step E — Program Fit & Support), directly under the "Preferred cohort times" (1st/2nd choice) block, add:

1. An expanding **"Take a look at our pricing"** FAQ-style accordion — same tiers as the Pricing page, no navigation required.
2. A **readiness response block** that reacts to the existing "Where are you right now with starting the program?" radio group. Each choice reveals a dropdown-style panel with a tailored message + CTA.

The existing radio question stays as-is (used for saving `readiness` to the DB). The new block reads its value and renders response content.

## Copy per choice

- **Ready now** → "Great — let's get started." Primary CTA: **Enroll now** (Stripe checkout link from `pricingTiers.ts`, defaults to Cohort tier).
- **Within 30 days** → "No problem, no pressure. We'll help you prep so day one moves fast." No hard CTA; small secondary link to pricing accordion above.
- **Need more clarity** → "Okay — schedule a free 1:1 with a coach and we'll walk it through together." Primary CTA: **Book a free 1-on-1** → `/one-on-one`.
- **Just exploring** → "No problem — we'll keep you updated." Secondary link: **Read the free guide** → `/guide`.

Each response uses the same accent-card styling already used in `NextStepPanel` (green/amber/sky/neutral).

## Placement

`src/pages/IntakeSurveyPage.tsx`, Step E, immediately after the two preferred-time Select dropdowns and before the "Anything else" textarea. Both new blocks render inside the existing card, so the survey flow is uninterrupted.

## Technical details

- **New component:** `src/components/intake/IntakePricingAndReadiness.tsx`
  - Props: `readiness: string` (current radio value).
  - Renders `<InlinePricingAccordion />` (reuse existing component from `src/components/plan/InlinePricingAccordion.tsx`) with a friendly headline: "Take a look at our pricing".
  - Renders a conditional response card below, keyed on `readiness`. Uses a local map of `{ headline, body, cta }` mirroring `NextStepPanel`'s options but scoped to survey context (no funnel event / no GHL tagging — those already fire when the plan is generated).
- **Edit:** `src/pages/IntakeSurveyPage.tsx`
  - Import and mount the new component in Step E, passing the current `readiness` state value.
  - No schema changes, no edge function changes.
- **Reuse:** `PRICING_TIERS` and `InlinePricingAccordion` (already shared between Pricing page and Plan portal), so pricing stays in sync everywhere.

## Out of scope

- No changes to `NextStepPanel` on the plan portal.
- No new DB columns; `readiness` already persists via existing intake save logic.
- No Stripe changes — reuses existing tier links.
