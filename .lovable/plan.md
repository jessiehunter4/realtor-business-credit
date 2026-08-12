# Standardize Action Control Alignment on the 6–12 Month Roadmap

## Goal
Vertically center the three-dot menu icon, the "Working on it" status button, and the "Mark reached" button within each milestone card so all three sit on the same horizontal center line.

## Current State
- `src/components/dashboard/PlanItemRow.tsx` renders the action controls in a right-hand column.
- The outer container is `flex flex-col sm:flex-row items-center`, but the three-dot menu is a separate `h-8 w-8` icon button while the status buttons use `size="sm"` and may have different effective heights.
- On the 6–12 Month Roadmap page (`src/pages/dashboard/MilestonesSection.tsx`), `PlanItemRow` is called with `labels={{ start: "Working on it", done: "Mark reached", undo: "Undo" }}`.
- The misalignment is most visible on desktop, where the menu icon sits slightly above/below the two pill buttons.

## Proposed Changes

### 1. Unify action-control layout in `PlanItemRow.tsx`
- Wrap the three-dot menu and the status button group in a single flex row (`flex flex-col sm:flex-row items-center gap-1.5`).
- Give every control in that row the same effective height (`h-9` or `min-h-9`) so their center lines align.
- Keep the existing `items-center` alignment on both the outer container and any nested button groups.
- Preserve the current mobile stacking behavior (`flex-col` below `sm`, `flex-row` at `sm` and up).

### 2. Tighten the status button pair
- Ensure the "Working on it" and "Mark reached" buttons share identical `rounded-full text-xs` styling and vertical padding.
- Keep the active/inactive visual states unchanged.

### 3. Center the three-dot menu icon
- Apply `flex items-center justify-center` to the icon button so the `MoreVertical` icon is optically centered within its touch target.
- Match the icon button height to the adjacent pill buttons.

### 4. Verify no regression on other consumers
- `PlanItemRow` is also used by `GoalsSection` and `ActionPlanSection`. The alignment change should improve consistency there as well, but we will confirm the status buttons and menu icon still render correctly.

## Acceptance Criteria
- On `/dashboard/milestones`, the three-dot menu, "Working on it" button, and "Mark reached" button in each milestone card share a common vertical center line.
- Alignment holds on desktop (≥640px) and remains usable on mobile (<640px).
- No functional changes to status updates, editing, or milestone CRUD.
- Typecheck and build pass.

## Technical Details
- Primary file: `src/components/dashboard/PlanItemRow.tsx`
- Verification file: `src/pages/dashboard/MilestonesSection.tsx`
- No backend, schema, or route changes required.
