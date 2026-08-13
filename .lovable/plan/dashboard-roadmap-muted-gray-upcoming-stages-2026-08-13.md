# Dashboard Roadmap — Muted Gray Upcoming Stages

## Goal
Keep upcoming (not-yet-started) stages in the dashboard 5-stage roadmap rail in a clean, muted gray state so they visually recede behind the active and completed stages.

## Current State
`src/components/dashboard/ProgressSummary.tsx` renders the stage rail with three visual treatments:
- Completed stages: solid green circle with white checkmark + green progress bar.
- Active incomplete stage: empty circle with a primary-green ring highlight + primary progress bar.
- Incomplete stages with any completed tasks: progress bar uses `bg-primary/40` (light green).
- Fully upcoming stages: progress bar uses `bg-muted`.

The partially-completed light-green bar makes upcoming stages look "in progress" rather than cleanly upcoming.

## Changes
1. In the stage rail loop, classify each stage as:
   - `isComplete`: `p.complete`
   - `isActive`: `p.phase === metrics.currentPhase`
   - `isUpcoming`: not complete and not active
2. For upcoming stages, use a consistent muted gray palette:
   - Node: `border-muted bg-background` (no ring)
   - Progress bar: `bg-muted`
   - Label: keep `text-muted-foreground`
3. Remove the `p.completed > 0 ? "bg-primary/40"` partial-progress tint so only active and completed stages use primary green.
4. Preserve the active-stage ring highlight and completed green checkmark behavior.
5. Preserve existing layout, labels, and responsive behavior.

## Acceptance Criteria
- [ ] Upcoming stages (not active, not complete) render with muted gray node, muted progress bar, and muted label.
- [ ] No light-green partial-progress tint appears on upcoming stages.
- [ ] Active stage still shows the primary ring highlight.
- [ ] Completed stages still show the green checkmark and green progress bar.
- [ ] The 5-stage rail layout and labels remain unchanged on mobile/desktop.
