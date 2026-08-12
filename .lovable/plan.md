# Center Action Row Elements in Dashboard Cards

## Goal
Vertically center the action-row elements — the three-dot options menu, the "Working on it" status text, and the "Mark reached" button — so all three sit on the same horizontal center line within each card.

## Current State
The shared `PlanItemRow` component renders the action controls in a flex column on the right side of each goal/milestone card. The three-dot menu trigger, status badge, and status buttons can appear slightly misaligned because the container uses `flex flex-col` without an explicit vertical centering rule. The same component is reused on the Goals and Milestones dashboard pages.

## Proposed Changes
1. **Update `src/components/dashboard/PlanItemRow.tsx`**
   - Wrap the three-dot menu and status-button group in a single flex container.
   - Apply `items-center` (or equivalent) so the three-dot icon, any status label/badge, and the action buttons share the same vertical center line.
   - Preserve existing responsive behavior: buttons may stack vertically on very small screens, but within each breakpoint they remain centered.
   - Keep all existing functionality (status updates, dropdown options, saving spinner).

2. **Verify no regressions in `FundingSection.tsx`**
   - The Funding page uses its own card layout without a three-dot menu. Confirm its existing status-button row remains visually acceptable; apply the same centering rule there if it shares the misalignment.

## Acceptance Criteria
- On the Milestones page, the three-dot menu icon, "Working on it" badge, and "Mark reached" button are vertically centered within the same horizontal line.
- The same alignment improvement is visible on the Goals page because it uses the same `PlanItemRow` component.
- No layout breakage on mobile or tablet viewports.
- Existing interactions (status change, dropdown edit/delete/revert, saving spinner) continue to work.
