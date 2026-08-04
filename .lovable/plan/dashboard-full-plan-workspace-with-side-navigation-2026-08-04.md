# Dashboard: Full Plan Workspace with Side Navigation

Today the dashboard only surfaces the derived roadmap (foundation, credibility, bureaus, tradelines, funding). The generated plan has five more sections — Goals & Snapshot, 90-Day Action Plan, 6–12 Month Roadmap, Funding Opportunities, and Program Options & Next Steps — that the user can read in the plan view but cannot work with. This turns the dashboard into a workspace for the whole plan.

## What we build

A collapsible side menu on the dashboard (icon rail when collapsed, full labels when open; a top trigger on mobile) with these sections:

```text
Overview       progress summary + next best action + plan hero
My Goals       goals from the plan, editable, with notes
90-Day Plan    action items as checkable milestones, grouped by month
Roadmap        the credit-building checklist (today's view)
6-12 Month     milestone timeline, checkable
Funding        funding opportunities matched to their profile
My Program     recommended program, options, next steps
```

Each section is a route under `/dashboard/...` so links are shareable and the back button works.

## Section behavior

- **Overview** — what's there today (plan hero, priority task, progress summary) plus a completion strip showing where they stand across all areas.
- **My Goals** — goals from their plan, each with a status (working on it / achieved) and an editable note. Their intake goal text is shown as the starting point.
- **90-Day Plan** — each action item becomes a trackable item with the same start/done controls the roadmap uses, grouped into Days 1–30 / 31–60 / 61–90.
- **Roadmap** — unchanged behavior, moved under its own tab.
- **6–12 Month** — milestones as a vertical timeline, each checkable, with target month.
- **Funding** — funding opportunities as cards (type, target amount, why it matters), each with a not yet / exploring / obtained status.
- **My Program** — recommended program with reasoning, other options for comparison, link to pricing. Free-tier users see what paid tiers add.

Help bubbles ("?") keep working and get added to the new sections.

## Editing and tracking

Everything checkable writes to the same task-progress store the roadmap already uses, with distinct key prefixes per section. That gives one consistent progress model, one sync path to the CRM, and an overall completion number that reflects the whole plan rather than only the credit tasks.

Goal notes and user-edited text save back to the plan record so they persist and show up in the coach view and PDF export.

## What each tier sees

- **Free** — full access to viewing, editing, and tracking every plan section. No feature is held back on the tracking side.
- **DIY ($497)** — everything in Free, plus a Resources area in the side menu: vetted providers and how-to walkthroughs for a business virtual office, a directory-listed business phone, EIN filing, and the other foundation items. Resource links appear inline on the matching roadmap tasks. Free users see these cards locked with a short upsell.
- **Pro Cohort / Cohort Plus +** — everything in DIY, plus a "My Program" panel that hands off to the Credit Suite / Lendavo platforms with a direct launch link from the dashboard, alongside cohort schedule and coach access. Lower tiers see this as a locked card explaining what the transition includes.

Tier gating reads from the existing entitlements hook, so the dashboard adjusts automatically after checkout.

## Technical notes

- New `DashboardLayout` using the existing shadcn sidebar primitives; `/dashboard` becomes a nested route set with an `Outlet`, with `/dashboard` redirecting to Overview.
- Extend `deriveRoadmap` / task catalog with dynamic tasks generated from `plan_data.sections` (`action_plan_90day.items`, `roadmap.milestones`, `funding_opportunities.items`, `goals_snapshot.goals`) using stable generated keys, alongside the existing static catalog.
- `plan_task_progress` already carries `phase`, `source`, `status`, `priority` — reuse it. New group values widen the `TaskPhase` union; if the `phase` column is constrained, a small migration comes with it.
- Goal notes: stored inside `plan_data` on `custom_plans` via an authenticated update (default), unless we decide per-goal history is needed, in which case a small notes table.
- `useDashboardData` already fetches `plan_data`; `useRoadmap` splits metrics per group.
- Existing components (`RoadmapChecklist`, `RoadmapTaskRow`, `PriorityTaskCard`, help bubbles) are reused as-is inside the new sections.