# Funding Page — Dynamic Status Badge Colors

## Goal
Make the top-right status pill badge on each `/dashboard/funding` card reflect the currently selected action button color, so the badge and active button are visually coordinated.

## Current State
In `src/pages/dashboard/FundingSection.tsx`, the status badge is hard-coded to:
- `variant="default"` (primary/green) only when `status === "completed"`
- `variant="secondary"` (navy) for `"not_started"` and `"in_progress"`

The action buttons below use `variant="default"` for whichever status is currently selected. This creates a mismatch: the active button is green, but the badge stays navy for "Not yet" / "Exploring".

## Proposed Change
Update the badge variant logic so it always uses the same active-state styling as the selected button.

### Implementation
1. In `src/pages/dashboard/FundingSection.tsx`, change the `Badge` variant from:
   ```tsx
   variant={f.status === "completed" ? "default" : "secondary"}
   ```
   to:
   ```tsx
   variant="default"
   ```
   (The badge only ever displays the current status, so it should always render as the active/selected state.)

2. Preserve the existing `text-[10px] shrink-0` className and the `STATUS_LABEL` text.

3. Keep all existing card layout, button behavior, `setStatus` handler, and accessibility attributes unchanged.

## Acceptance Criteria
- The status badge on every funding card renders with the primary green background when any status is selected.
- The badge color visually matches the currently selected action button.
- No layout, spacing, or functional changes to the funding cards.
- TypeScript compiles and the page renders correctly on desktop and mobile.
