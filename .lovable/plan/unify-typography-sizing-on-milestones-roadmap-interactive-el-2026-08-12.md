# Unify Typography & Sizing on Milestones/Roadmap Interactive Elements

## Goal
Make the "Working on it" text, "Mark reached" button, and bottom "+ Add a milestone" button feel proportionally matched in font size, font weight, padding, and overall tap target size.

## Current State
- `PlanItemRow.tsx` renders the status buttons (`Working on it`, `Mark reached`, `Undo`) with `size="sm"` and `text-xs`.
- `AddPlanItemForm.tsx` renders the "+ Add a milestone" trigger with `size="sm"`, `text-xs`, plus custom `min-h-11 min-w-[132px]` and a primary-colored outline style.
- The two button groups share the same `text-xs` size but differ in height, padding, weight, and visual emphasis.

## Proposed Changes
1. **Standardize the status action buttons in `PlanItemRow.tsx`**
   - Use a consistent height/padding (e.g., `h-10 px-4` or rely on a shared size class).
   - Set font size and weight to match the add-button (e.g., `text-sm font-medium`).
   - Keep rounded-full styling.
   - Add matching icons to both "Working on it" and "Mark reached" so both primary actions have visual parity.

2. **Update the "+ Add a milestone" trigger in `AddPlanItemForm.tsx`**
   - Match the same height/padding and font size/weight as the status buttons.
   - Preserve the current outline style but align internal padding so it no longer looks taller or shorter than the action buttons.

3. **Verification**
   - Run TypeScript typecheck.
   - Capture screenshots of `/dashboard/milestones` at desktop and mobile viewports to confirm the three interactive elements look proportionally matched.

## Scope
- Files: `src/components/dashboard/PlanItemRow.tsx`, `src/components/dashboard/AddPlanItemForm.tsx`.
- No backend or logic changes; purely presentational alignment.
