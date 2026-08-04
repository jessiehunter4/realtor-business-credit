# Dashboard: Task Tracking + "What does this mean?" Help Bubbles

Goal: keep the current dashboard layout, but make every milestone and task self-explaining with a small question-mark bubble the user can tap for a plain-English explanation.

## What the user will see

1. **Help bubble on every task row** — a small `?` icon next to each task title in the roadmap checklist. Click/tap opens a popover with:
   - What this means (plain English)
   - Why it matters for funding
   - What "done" looks like
   - Common mistakes to avoid
   - Optional link into the matching guide chapter
2. **Help bubble on each stage/milestone** — next to the five stage headers (Foundation, Credibility, Bureau Profiles, Tradelines, Funding) and on the stage rail in the progress summary, explaining what the stage accomplishes and roughly how long it takes.
3. **Help bubble on the "Your next step" card and the four KPI tiles** (Overall, Completed, Current stage, Milestones) so the numbers themselves are explained.
4. **Mobile behavior** — on small screens the same content opens as a bottom sheet/drawer instead of a popover, so the text is readable and dismissible with a tap.

Tracking itself stays as it is today (Start / Done / Undo, auto-saved), with two small additions:
- A per-task **last updated** line ("Started 3 days ago", "Completed Jul 28") so progress feels tracked over time.
- The task row keeps showing its short explanation; the deep detail moves into the bubble to reduce visual noise.

## Content

Each of the tasks in the roadmap catalog gets its own written help content (what/why/done-looks-like/mistakes). Written in the program's voice: calm, concrete, no guarantees, with the standard "check with your attorney/CPA" note where entity or tax topics come up. Each of the five stages gets a short stage-level explanation.

## Technical notes

- Extend `CatalogTask` in `src/lib/roadmap/types.ts` with optional `help?: { what: string; why: string; doneLooksLike: string; mistakes?: string[] }`. Optional means nothing breaks if a task lacks content; the bubble hides.
- Populate `help` for all tasks in `src/lib/roadmap/taskCatalog.ts`; add `PHASE_HELP` alongside `PHASE_BLURBS`.
- New `src/components/dashboard/HelpBubble.tsx`: a reusable trigger (`HelpCircle` icon button, `aria-label="What does this mean?"`) that renders shadcn `Popover` on `sm+` and `Drawer` on mobile (`useIsMobile` already exists). Accepts a title + structured body.
- Wire into `RoadmapTaskRow.tsx`, `RoadmapChecklist.tsx` (stage headers — bubble sits outside the collapse button so it doesn't toggle the section), `ProgressSummary.tsx`, and `PriorityTaskCard.tsx`.
- Timestamps: `plan_task_progress` already stores `completed_at`; surface it plus `updated_at` in `useDashboardData` / `useRoadmap` and render a relative date on the row. No schema change if `updated_at` exists; otherwise fall back to `completed_at` only.
- Optional analytics: log a `task_help_opened` roadmap event so we can see which steps confuse people. Requires adding the event name to the allowed list in `log-funnel-event`.
- All colors via existing semantic tokens; no new dependencies.
