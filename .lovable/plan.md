# Program Recommendation Feature — Implementation Plan

After a user's Custom Plan is generated, we recommend the best-fit program (Free, Self-Paced, Cohort, 1:1 — plus room for future offerings) with personalized reasoning drawn from their intake survey and plan.

---

## 1. Available Programs & Recommendation Criteria

Programs are stored as data (not hardcoded UI) so new offerings drop in without code changes. Each program has a `fit_rules` object the recommender scores against.

| Program | Best for | Primary signals from intake |
|---|---|---|
| **Free Guide + 1:1 Discovery** | Just exploring, not ready to invest, weak/unknown profile | `investment_readiness = "just exploring"` OR very early stage (no entity, no bank acct) |
| **Self-Paced Blueprint** ($497) | Self-starters, moderate goals, want the plan and will execute alone | `preferred_support_format = "self-paced"`, `investment_readiness = "ready now / 30 days"`, moderate GCI, low cohort interest |
| **Realtor Credit Cohort** ($1,997) | Want structure + accountability, mid-stage business, active funding goals | `interest_in_cohort = yes/maybe`, `preferred_support_format = "cohort"`, meaningful funding target, PG-reduction goals |
| **1:1 Private Coaching** ($4,997/qtr) | High GCI, brokers, complex funding needs, want high-touch | `preferred_support_format = "1:1"`, high GCI band, broker license type, large target funding amount, "want to reduce PGs" |
| **(Future) Team/Brokerage Plan** | Broker-owners with agents | Added later via same rules engine |

### Scoring approach
Weighted rule-based scoring (not AI-only) so results are deterministic and explainable:
- `preferred_support_format` → strongest signal (weight 3)
- `investment_readiness` → weight 3
- `interest_in_cohort` → weight 2
- Business stage (entity + bank + tradelines from fundability items) → weight 2
- GCI band + license type → weight 2
- `desired_funding_types` breadth and `target_funding_amount` size → weight 1
- `personal_guarantee_comfort` (wanting to reduce PGs favors Cohort/1:1) → weight 1

Highest total = recommended program. Ties broken by: readiness → cohort interest → support format. The rule engine returns the winner **plus** the per-rule contributions, which become the "why" bullets.

### Personalized reasoning
For each recommendation we render 3–5 "why this fits you" bullets built from the matched rules, e.g.:
- "You told us your top goal is *grow marketing spend* within 3 months — the Cohort's weekly accountability keeps that on pace."
- "You're at ~$X GCI with no tradelines reporting yet — the Cohort's guided tradeline sequence is designed for exactly this stage."

A short AI-generated paragraph (Lovable AI, same gateway as `generate-plan`) turns the matched rules into a warm 2–3 sentence summary. Rule bullets are the source of truth; the AI paragraph is presentation only.

---

## 2. User Experience Flow

1. **Plan generated** (existing `generate-plan` edge function).
2. Recommender runs automatically at the end of `generate-plan` and stores results on the plan row.
3. User sees the recommendation in **three surfaces**:
   - **Portal Plan view** (`/portal/plan/...`) — new "Recommended Next Step" section at the top of the plan (above Goals) with the recommended program card, personalized reasoning, and CTA to that tier on `/pricing` (deep-linked and pre-highlighted).
   - **PDF plan** — mirrored section in `PlanPDF.tsx` so the downloadable plan carries the recommendation.
   - **Dashboard** (`/mock-dashboard`, later real dashboard) — "Your recommended program" card with CTA.
4. **Admin coach view** (`AdminIntakeCoachView.tsx`) shows the computed recommendation with:
   - Score breakdown (which rules fired, how much they contributed)
   - Dropdown to override the recommendation
   - Textarea to customize the reasoning bullets
   - "Publish" reuses existing publish flow; overrides are what the user sees.

---

## 3. Technical Architecture

### Database (single migration)
- New table `public.programs` (seeded with Free/Self-Paced/Cohort/1:1):
  - `slug`, `name`, `price_display`, `cadence`, `stripe_link`, `cta_label`, `pricing_anchor` (for deep-link), `fit_rules` jsonb, `sort_order`, `active`
  - RLS: `SELECT` to `anon` + `authenticated` (public catalog); write to `service_role`/admin only.
- New columns on `public.custom_plans`:
  - `recommended_program_slug text`
  - `recommendation_reasoning jsonb` (array of `{ bullet, source_rule }` + `summary` string)
  - `recommendation_score jsonb` (per-program totals + rule contributions)
  - `recommendation_overridden_by uuid`, `recommendation_overridden_at timestamptz`
- Grants + policies follow existing `custom_plans` pattern; no policy widening.

### Edge functions
- **New shared module** `supabase/functions/_shared/recommend-program.ts` — pure rule-scoring function taking `(survey, planData, programs)` returning `{ slug, score, rule_hits[] }`. Deterministic, unit-testable.
- **Modify `generate-plan`**: after building `planData`, load active `programs`, run recommender, generate the short AI reasoning paragraph via the existing Lovable AI gateway call (small extra tool schema entry — `recommendation_summary` string), and write all recommendation fields on the same insert/update. Reasoning bullets come from rule hits, not AI.
- **New `override-recommendation`** edge function (admin-only, JWT + `has_role('admin')`) that updates the recommendation fields and stamps `recommendation_overridden_by/at`.

### Frontend
- **New component** `src/components/plan/RecommendedProgramCard.tsx` — shared card used in `PlanDocument`, dashboard.
- **New PDF component** section in `PlanPDF.tsx` mirroring the card.
- **`PortalPlanView.tsx` / `PlanDocument.tsx`** — render the card at the top of the plan when `recommended_program_slug` is present.
- **`AdminIntakeCoachView.tsx`** — new "Program Recommendation" panel: shows computed pick + score breakdown, override dropdown (loaded from `programs` table), reasoning editor, save button calls `override-recommendation`.
- **`PricingPage.tsx`** — accept `?highlight=<slug>` query param; scroll to and visually emphasize the matching tier.
- **`MockDashboardPage.tsx`** — recommended-program card in the hero row.

### AI prompt updates
- Extend `generate-plan` tool schema with `recommendation_summary` (2–3 sentences). System prompt gets a short instruction: "Given the matched program `{slug}` and rule hits `{...}`, write a warm, specific 2–3 sentence explanation. Do not contradict the matched program."
- Rules are computed in code and **passed into** the AI prompt, so the AI can't pick a different program.

### Business rules / guardrails
- If intake is missing key signals (e.g., no `preferred_support_format` and no `investment_readiness`), default to **Free / 1:1 Discovery** and flag `needs_more_info: true` in reasoning.
- Admins can mark a plan `recommendation_locked` (implicit via override) so re-running `generate-plan` won't overwrite their choice.
- No pricing shown to users who haven't seen `/pricing` yet — the card links out; we don't hardcode prices in the plan.

### Extensibility for future programs
- Add a row to `programs` with `fit_rules` — no code change required for scoring, coach dropdown, or pricing highlight.
- `fit_rules` schema supports: `must_have`, `nice_to_have`, `disqualifiers`, `weight_overrides` — enough to describe new offerings (team plan, broker plan, etc.).

---

## 4. Phased Implementation

**Phase 1 — Data + engine (backend only)**
- Migration: `programs` table (seeded) + new columns on `custom_plans` + grants/RLS.
- `_shared/recommend-program.ts` with rule engine + unit-style sanity checks.
- Wire recommender into `generate-plan`; store slug, score, bullet reasoning. Skip AI summary in this phase.

**Phase 2 — User-facing surfaces**
- `RecommendedProgramCard` component.
- Render in `PlanDocument` (web) and `PlanPDF` (PDF).
- Add `?highlight=` support and scroll/emphasis to `PricingPage`.
- Add dashboard card.

**Phase 3 — AI reasoning + admin override**
- Extend `generate-plan` tool schema with `recommendation_summary`; render alongside bullets.
- Build admin panel in `AdminIntakeCoachView` (score breakdown, override dropdown, reasoning editor).
- Add `override-recommendation` edge function.

**Phase 4 — Polish + future-proofing**
- Add `recommendation_locked` behavior on re-generation.
- Analytics: log a funnel event when the recommendation card is viewed and when its CTA is clicked (reuses `log-funnel-event`).
- Documentation stub for adding a new program (rows-only change).

---

## Dependencies / Risks
- Requires the existing Lovable AI gateway (already in use) for the summary paragraph — no new secrets.
- Pricing tiers live in `PricingPage.tsx` today; Phase 2 introduces `programs` as the single source of truth. Pricing page can either read from the table or stay static and be kept in sync manually — decision point at Phase 2 start.
- Overrides must persist across plan regeneration — handled by the `recommendation_overridden_by` check in `generate-plan`.
