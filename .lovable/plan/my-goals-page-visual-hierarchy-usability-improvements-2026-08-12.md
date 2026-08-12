# My Goals Page — Visual Hierarchy & Usability Improvements

## Goal
Polish the existing `/dashboard/goals` page so goals are easier to scan, status controls are clearer, and the profile/narrative card feels distinct — without changing layout, data logic, or functionality.

## Affected Components
- `src/pages/dashboard/GoalsSection.tsx`
- `src/components/dashboard/PlanItemRow.tsx`
- `src/components/dashboard/AddPlanItemForm.tsx`

## Changes

### 1. Bio / Narrative Card Styling (`GoalsSection.tsx`)
- Wrap the narrative `Card` with a subtle treatment that separates it from goal cards.
- Apply `border-l-4 border-primary` left accent, `bg-muted/50` light fill, and keep `p-4 sm:p-5`.
- Optionally add a small "Your plan summary" label above the narrative in `text-xs uppercase tracking-wide text-muted-foreground`.
- Keep the card visually subordinate to goals (no heavy shadows or large typography).

### 2. Goal Card Hierarchy (`PlanItemRow.tsx`)
- Goal title: change from `font-semibold` to `font-bold` and use `text-foreground` for stronger contrast.
- Keep title at the current base size; do not enlarge.
- Metadata line (`item.meta`) — timeline, target amount, etc. — render as a compact `Badge` or pill with `bg-secondary/10 text-secondary` so timelines and dollar amounts scan quickly.
- Detail text remains `text-sm text-secondary/80` but ensure line-height is comfortable.

### 3. Status Controls (`PlanItemRow.tsx`)
- Convert the "Working on it" / "Achieved" buttons into a segmented/toggle-style pair with clear active/inactive states.
- Active state (`in_progress`): `bg-primary text-primary-foreground` solid fill.
- Achieved/completed state: `bg-success-green text-white` solid fill (when showing "Achieved" or "Reopen").
- Inactive state: `variant="outline"` with subdued `text-muted-foreground`.
- Maintain existing click behavior and `onStatusChange` calls.
- Keep the "Reopen" button visible when completed, styled as an outline secondary action.

### 4. Action Buttons (`PlanItemRow.tsx`, `AddPlanItemForm.tsx`)
- "+ Add a note" button:
  - Add a small `Plus` or `StickyNote` icon.
  - Use `text-secondary hover:text-primary hover:underline` or a subtle pill style.
  - Ensure `min-h-11` touch target on mobile.
  - Add visible `focus:ring-2 focus:ring-ring` focus state.
- "+ Add a goal" button (`AddPlanItemForm.tsx`):
  - Keep `variant="outline"` but use `border-primary/40 text-primary hover:bg-primary/10` to make it more noticeable.
  - Add `min-h-11 min-w-[132px]` for tap target.
  - Add `focus-visible:ring-2 focus-visible:ring-ring`.

### 5. Visual Spacing (`GoalsSection.tsx`)
- Increase separation between "Top priority" and "Also working toward" sections.
- Change the "Also working toward" label top spacing from `pt-2` to `pt-6`.
- Add `mb-1` below each section header label for clearer grouping.
- Keep the overall page compact; do not add excessive whitespace.

### 6. Responsive & Accessibility
- Verify all touch targets are at least 44×44 px (buttons already `size="sm"` or larger; ensure `Add a note` and status buttons meet this).
- Preserve keyboard navigation on all buttons and dropdowns.
- Maintain visible `focus-visible` rings on interactive elements.
- Keep screen-reader labels (`aria-label` on icon-only options button, button text on all text buttons).
- Confirm no changes on mobile layout beyond spacing/tap targets.

## Acceptance Criteria
- Narrative card looks visually distinct from goal cards.
- Goal titles are bolder and higher contrast.
- Timeline/target metadata is badge/pill-styled and easy to scan.
- "Working on it" / "Achieved" states are immediately distinguishable.
- "+ Add a note" and "+ Add a goal" feel clickable with hover/focus states.
- Spacing between "Top priority" and "Also working toward" is increased.
- All existing goal data, status updates, notes, edits, and removals continue to work unchanged.
