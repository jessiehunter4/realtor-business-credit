# Personalized Dashboard with Interactive Workflow Integration

## Current state (verified)

- `src/pages/DashboardPage.tsx` (163 lines) renders: greeting, `PlanHeroCard`, a 3-card KPI strip, a single "Next action" card, and `MessagePreferencesCard`. It is mostly informational.
- `src/hooks/useDashboardData.ts` loads `profiles`, the latest **published** `custom_plans` row for `user_id`, and all `plan_task_progress` rows for that plan. It does **not** load the `intake_surveys` row.
- Tasks only exist in `plan_task_progress` **after** the user checks a box in `src/components/plan/PlanTaskChecklist.tsx` — rows are created lazily on toggle, keyed `action_{step}_{slug}`. So a brand-new user has `tasks = []` and the dashboard shows `0/—` and no next action. This is the core gap.
- Plan content lives in `custom_plans.plan_data.sections`: `goals_snapshot`, `fundability.items[{label,status:strong|warning|missing,detail}]`, `action_plan_90day.items[{step,text,effort}]`, `roadmap.milestones`, `funding_opportunities`, `next_steps`.
- `supabase/functions/generate-plan/index.ts` already contains a deterministic `computeFundabilityItems(survey)` rule function (entity, EIN, bank, address, phone, email, website, accounting, cards, tradelines, bureaus) that produces the strong/warning/missing statuses. The 90-day action items themselves are AI-generated, so their wording varies per user.
- Task states today are boolean only (`completed`); there is no "in progress".

## Architecture

```text
intake_surveys ──┐
                 ├─► rule engine (shared, deterministic) ─► Roadmap[]
custom_plans ────┘        (canonical task catalog)          │
plan_task_progress ───────────────────────────────────────► merged status
                                                            │
                                    ┌───────────────────────┴──────────────┐
                                    ▼                                      ▼
                            Dashboard UI                        funnel_events → GHL
                        (progress, next action)               (email/SMS workflows)
```

### 1. Canonical task catalog + rule engine

New `src/lib/roadmap/` module (pure TS, no I/O, unit-testable):

- `taskCatalog.ts` — a fixed, ordered catalog of ~16 canonical tasks with stable `task_key`s that never change wording (e.g. `entity_formed`, `ein_obtained`, `business_bank_account`, `business_address`, `business_phone_listed`, `business_email_domain`, `business_website`, `accounting_software`, `duns_registered`, `experian_profile`, `equifax_profile`, `vendor_tradelines_3`, `starter_business_card`, `expenses_off_personal`, `utilization_under_30`, `higher_limit_card_or_loc`). Each entry carries: title, short explanation, phase (`foundation` → `credibility` → `bureaus` → `tradelines` → `funding`), base priority, `dependsOn: string[]`, estimated effort, and an optional action link/label (e.g. D&B registration, `/guide#chapter-x`, `/pricing`).
- `rules.ts` — `deriveRoadmap(survey, planData, progressRows) => RoadmapTask[]`. Logic:
  1. Seed every catalog task as `not_started`.
  2. Apply **intake-derived auto-completion**, mirroring the existing `computeFundabilityItems` mapping so the dashboard and the plan never disagree: `strong` → `completed (source: intake)`, `warning` → `in_progress`, `missing` → `not_started`.
  3. Apply **skip rules**: if the survey shows established business credit (EIN-only cards + 3+ reporting tradelines + a bureau profile), suppress introductory foundation tasks from the active list and file them under "Already in place".
  4. Apply **user progress overlay**: any `plan_task_progress` row wins over the intake inference (explicit user action is authoritative).
  5. Apply **dependency gating**: a task whose `dependsOn` are not all completed is marked `blocked` and cannot become the highlighted next action.
  6. Compute effective priority = phase order → base priority → intake pain signals (`financial_pains`, `primary_goals` boost matching tasks, e.g. "money between closings" boosts LOC/tradeline tasks).
  7. Dedupe: AI-generated `action_plan_90day` items are matched to catalog tasks via a keyword map; unmatched AI items are appended as `custom` tasks (`custom_{n}`) rather than duplicated.
- Output type: `{ task_key, title, explanation, status, priority, phase, blocked, nextAction, actionHref?, source: 'intake'|'plan'|'user' }`.

Because the rules are deterministic and shared, two users with different intake answers get materially different dashboards while the logic stays standardized.

### 2. Data layer changes

- Extend `useDashboardData` to also fetch the user's `intake_surveys` row (`user_id = uid`, latest by `created_at`), and expose `roadmap` from `deriveRoadmap(...)` plus derived metrics.
- **Materialization**: on first dashboard load after a plan is published, upsert one `plan_task_progress` row per derived task (idempotent `onConflict: plan_id,task_key`) so tasks exist for workflow queries even before the user interacts. Rows carry `task_key`, `task_label`, and completion.
- **Schema migration** (`plan_task_progress`): add `status text not null default 'not_started'` (`not_started|in_progress|completed`), `priority int`, `phase text`, `source text`, `snoozed_until timestamptz`. Keep the existing `completed` boolean in sync via a trigger so `PlanTaskChecklist.tsx` and `PortalPlanView` keep working unchanged. RLS: reuse the existing owner-scoped policies; add GRANTs only if new columns require none (they don't).
- Migrate `PlanTaskChecklist.tsx`'s ad-hoc `action_{step}_{slug}` keys by having the roadmap matcher recognize legacy keys and re-map them once, so already-checked users don't lose progress.

### 3. Dashboard information architecture (top → bottom)

1. **Header row** — greeting, welcome video, log out (unchanged).
2. **Priority card (hero)** — the single highest-priority unblocked incomplete task: title, why it matters (1–2 lines), effort, primary action button, "Mark in progress" / "Mark complete" controls. Replaces today's thin "Next action" card and moves to the top.
3. **Progress strip** — overall completion %, completed vs. remaining, current phase (Foundation / Credibility / Bureaus / Tradelines / Funding), milestones achieved (from `roadmap.milestones` mapped to phase completion).
4. **Roadmap checklist** — tasks grouped by phase, each row: status chip, title, priority badge, explanation, action link, status control. Collapsed groups for completed and blocked tasks ("Already in place — 6 items").
5. **Plan card** — `PlanHeroCard` demoted below the roadmap; links to the full plan document and PDF.
6. **Recommended program** — from `recommended_program_slug`, with a link to `/pricing`.
7. **Message preferences** — unchanged.
8. **Empty state** — if no published plan: a focused "Finish your Needs Analysis" card linking to `/intake`, with no fake zero metrics.

### 4. Progress metrics

Computed in the hook, never stored denormalized:
- `overallPct` = completed / (total − skipped)
- completed vs. remaining counts
- phase completion (drives the "current implementation stage" label)
- milestones achieved = phases fully complete
All recompute on every status change; optimistic UI update then upsert, with rollback + toast on failure (same pattern already used in `PlanTaskChecklist`).

### 5. Workflow integration (email/SMS)

- New shared helper `src/lib/roadmap/events.ts` calls the existing `log-funnel-event` function on: `dashboard_viewed`, `task_started`, `task_completed`, `phase_completed`, `roadmap_completed`, each with `{ task_key, phase, priority, next_task_key }`.
- New edge function `sync-roadmap-state` (called after any status change, fire-and-forget): pushes the user's current `next_task_key`, `phase`, and `completion_pct` to GHL as contact custom fields, then applies tags via a **separate** API call (per the established upsert-then-tag rule) — e.g. `RBC_Task_business_website`, `RBC_Phase_Bureaus`. GHL workflows key off those tags/fields so reminder emails and SMS always reinforce exactly the task the dashboard is showing.
- Because both surfaces read from the same derived `next_task_key`, completing a task on the dashboard automatically advances the workflow on the next sync — no parallel content model.
- SMS sends remain gated on the existing `sms_eligible` / consent flags; email-only contacts get email reminders only.

### 6. Responsive design

- Mobile: single column; priority card full-width and sticky-adjacent to the top; phase groups as accordions; status control becomes a tap-through action sheet.
- ≥`sm`: two-column metrics; ≥`lg`: three-column metrics with the roadmap full width below.
- All colors via existing semantic tokens (navy/green/amber design system) — no hardcoded color utilities.

## Implementation phases

- **Phase 1 — Rules foundation:** `src/lib/roadmap/` catalog + `deriveRoadmap` + unit tests against several synthetic intake profiles (no-entity beginner, mid-stage, already-funded). No UI change.
- **Phase 2 — Data:** migration for `plan_task_progress` status columns + sync trigger; extend `useDashboardData` with survey fetch, roadmap derivation, and idempotent materialization; legacy key remap.
- **Phase 3 — Dashboard UI:** new components `PriorityTaskCard`, `ProgressSummary`, `RoadmapChecklist`, `RoadmapTaskRow`, `PhaseGroup`; restructure `DashboardPage.tsx`; empty state.
- **Phase 4 — Status transitions:** in-progress/complete controls, optimistic updates, funnel event logging.
- **Phase 5 — Workflow sync:** `sync-roadmap-state` edge function + GHL field/tag mapping; admin visibility of a user's roadmap state in the coach view.

Dependencies: Phase 2 requires Phase 1's task keys to be final (they become database identifiers). Phase 5 requires Phase 4's events. Phases 3 and 4 can be built together.

## Technical notes

- The rule engine is duplicated conceptually with `computeFundabilityItems` in the edge function; Phase 1 should extract the shared mapping into `supabase/functions/_shared/` and have the client module import an identical copy, so plan generation and the dashboard can never drift.
- No changes to `PlanDocument.tsx` / `PlanPDF.tsx` output; the plan stays the document, the dashboard becomes the workspace.
