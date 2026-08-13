# Dashboard Roadmap — Active Stage Highlight

## Goal
Add a clear visual highlight (ring/border) around the currently active stage node in the existing 5-stage roadmap progress bar on `/dashboard`, while keeping the completed green checkmark behavior and overall layout unchanged.

## Current State
`src/components/dashboard/ProgressSummary.tsx` renders the stage rail as a 5-column grid. Each node is either:
- Completed: solid green circle with white checkmark
- Incomplete: empty circle with a muted border

There is no visual treatment for the current active stage (e.g., "Foundation").

## Changes
1. In the stage rail loop, compare each `p.phase` to `metrics.currentPhase`.
2. For the matching active stage, render a prominent ring/border around the node:
   - Use the existing primary/success color tokens (`bg-primary` / `text-primary`) so the highlight coordinates with the completed checkmarks.
   - Add a concentric ring or thicker border so the active node stands out from both completed and upcoming stages.
3. Preserve existing completed-node green checkmark styling.
4. Preserve existing layout, labels, and responsive behavior.

## Acceptance Criteria
- [ ] The active stage node (the one matching `metrics.currentPhase`) displays a visible highlighted ring/border.
- [ ] Completed stages still show the green checkmark.
- [ ] Upcoming/incomplete stages remain muted.
- [ ] The 5-stage rail layout and labels do not shift or break on mobile/desktop.
