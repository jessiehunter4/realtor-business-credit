
# Program Readiness & Next Steps — Redesign Plan

## Goals
- Replace the vague "Investment readiness" prompt with a clear, action-oriented question.
- Give agents an inline, expandable path to pricing + next action right where they review their plan, so they don't have to navigate away.
- Route each readiness choice to the right destination (Stripe, prep guidance, 1:1 booking, or continued browsing).
- Keep the design extensible for future tiers and readiness options.

## Recommended Placement
Primary surface: **`PortalPlanView` (agent-facing plan)**, appended as a new Section 7 "Your Next Step" below `PlanDocument`. This is the highest-intent moment — they've just read their custom plan.

Secondary surfaces (reuse same component):
- Bottom of `SamplePlanPage` (drives sample viewers to book or explore pricing).
- Optional post-submit confirmation on `IntakeSurveyPage` (before their plan is ready, shows readiness capture only, not CTAs).

The intake survey itself keeps a simplified version of the question for coach context, but the *decision experience* moves to the plan view where a real plan justifies the ask.

## New Question & Options
Prompt: **"Where are you right now with starting the program?"** (subtitle: "Pick the option that fits — we'll show you exactly what to do next.")

Options (radio, each expands accordion-style on select):

1. **I'm ready to start now** → confirmation panel + primary CTA "Enroll & begin" → routes to `/checkout` (existing Stripe payment link). Secondary link "See what's included" opens the inline Pricing accordion.
2. **I want to start within 30 days** → "No problem — and no pressure." panel with a short prep checklist (gather EIN docs, review the guide, list current business accounts) + "Save my spot — email me reminders" (tags contact in GHL) + "See pricing while I prepare".
3. **I need more clarity first** → "Let's talk it through." panel + primary CTA "Book a free 1-on-1" → `/one-on-one` booking, plus a "Reply with a question" mailto/link.
4. **I'm just exploring** → "Take your time." panel with links to Guide, Sample Plan, and Pricing. No hard CTA, one soft "Send me the highlights" opt-in.

Everything except option 1 also surfaces the inline Pricing accordion so the price is never a hidden variable.

## Inline Pricing Accordion
New component `InlinePricingAccordion` built on shadcn `Accordion` (type=single, collapsible). One panel per tier, using the same tier data source that powers `PricingPage`:
- Self-Paced
- Cohort (highlighted "Most popular")
- 1:1 Coaching

Each panel shows: price, billing cadence, 4–6 bullet inclusions, primary CTA (Stripe link for that tier), "Compare all plans" link to `/pricing` for the full table. Extract tier definitions from `PricingPage` into `src/data/pricingTiers.ts` so both surfaces stay in sync — this is how future tiers plug in with zero redesign.

## Interaction Flow
```text
Plan renders
   │
   ▼
"Your Next Step" card (always visible under plan)
   │
   ├─ radio: Ready now         → green confirmation + Enroll CTA (Stripe)
   ├─ radio: Within 30 days    → prep checklist + reminder opt-in + pricing
   ├─ radio: Need more clarity → 1:1 booking CTA + pricing
   └─ radio: Just exploring    → resource links + pricing (soft)

Below radios: <InlinePricingAccordion />  (collapsed by default; auto-opens
first tier when the selected option's panel includes "See pricing")
```

Selection is persisted to `custom_plans.readiness_selection` (new column) and mirrored to `intake_surveys.investment_readiness` for backward compatibility so the coach view still shows it. Selection also fires a funnel event (`plan_readiness_selected`) and applies a GHL tag (`f-readiness-ready-now`, `f-readiness-30-days`, `f-readiness-clarity`, `f-readiness-exploring`).

## Copy Revisions
- Intake survey Step E question changes to "Where are you right now with starting the program?" with the four new option labels above (replacing "Ready now / Within 30 days / Need more clarity / Just exploring" wording — the values stored keep the same enum for DB compatibility).
- Admin coach view (`AdminIntakeCoachView.tsx` line 830) label updates to "Program readiness" and reuses the new option labels.
- `generate-plan` prompt (line 204): rename field label to "Program readiness" to keep coach/AI language aligned.
- Remove any lingering "investment" phrasing from Portal/Sample plan surfaces.

## Technical Changes

### New files
- `src/components/plan/NextStepPanel.tsx` — radio group + four expandable option panels + selection persistence.
- `src/components/plan/InlinePricingAccordion.tsx` — shadcn Accordion consuming shared tier data.
- `src/data/pricingTiers.ts` — canonical tier list (name, price, cadence, bullets, stripeUrl, highlighted flag).

### Modified files
- `src/pages/PortalPlanView.tsx` — render `<NextStepPanel planId={id} contactId={...} />` below `<PlanDocument />` inside the "Plan" tab.
- `src/pages/SamplePlanPage.tsx` — render the same panel in demo mode (no persistence, CTAs still live).
- `src/pages/PricingPage.tsx` — refactor to consume `pricingTiers.ts` (visual output unchanged).
- `src/pages/IntakeSurveyPage.tsx` — update Step E label + option copy; keep stored values compatible.
- `src/pages/AdminIntakeCoachView.tsx` — update label + options.
- `supabase/functions/generate-plan/index.ts` — relabel field in prompt.

### Database migration
- `ALTER TABLE public.custom_plans ADD COLUMN readiness_selection TEXT` (nullable, one of the four enum values).
- No changes to `intake_surveys` schema — existing `investment_readiness` column is reused for backward compatibility.

### Business logic
- `NextStepPanel` fetches `readiness_selection` on mount if present; on change it:
  1. Upserts to `custom_plans.readiness_selection`.
  2. Calls `tag-ghl-contact` edge function with the mapped tag.
  3. Logs a funnel event via existing `logFunnelEvent` helper.
- Stripe checkout CTAs continue to open the existing payment link in a new tab; the "Enroll" primary CTA carries `contactId` as a query param the same way `CheckoutPage` already does.

### Edge cases
- Anonymous viewer (no contactId): selection still works locally but skips GHL tagging and DB write (or writes with `null` contact).
- Sample plan mode: panel renders but persistence + tagging are no-ops (`demo` prop).
- Changing selection: overwrites previous value, replaces GHL tag (`tag-ghl-contact` handles idempotency).
- Draft/archived plans: panel hidden (only shown when `status === "published"`).
- Future tiers: add an entry to `pricingTiers.ts` — accordion and PricingPage pick it up automatically.
- Future readiness options: add to a single `READINESS_OPTIONS` array in `NextStepPanel` with `{ id, label, panel: ReactNode, primaryCta }`.

## Phased Rollout
1. **Phase 1 — Foundation:** extract `pricingTiers.ts`, refactor `PricingPage` to use it (no visual change). Ship migration for `custom_plans.readiness_selection`.
2. **Phase 2 — Panel:** build `InlinePricingAccordion` + `NextStepPanel`, mount on `PortalPlanView` + `SamplePlanPage`. Wire GHL tagging and funnel events.
3. **Phase 3 — Copy alignment:** update intake survey, admin coach view, and generate-plan prompt to the new "Program readiness" language.
4. **Phase 4 — Measure & iterate:** review funnel events by readiness bucket in the admin dashboard; adjust panel copy/CTAs based on conversion.
