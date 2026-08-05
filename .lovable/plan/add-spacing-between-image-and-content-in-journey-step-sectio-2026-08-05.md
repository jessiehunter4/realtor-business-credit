# Add spacing between image and content in Journey Step sections

## Goal
Increase the horizontal and vertical breathing room between the image column and the text content column in the three-step homepage journey sections so the layout feels less condensed, starting with the "Step 1 — Educate" section the user selected.

## Current state
In `src/components/landing/JourneyStep.tsx`:
- The image and content live in a two-column grid: `grid lg:grid-cols-2 gap-8 lg:gap-12`.
- The current gap is 32 px on mobile (stacked) and 48 px on desktop (side-by-side).
- The selected `#step-educate` instance renders this component using data from `src/data/homepageJourney.ts`.

## Proposed change
- Increase the grid gap to `gap-10 lg:gap-16` (40 px mobile / 64 px desktop).
- Keep all other layout behavior intact: column ordering via the `reverse` prop, max-width container, rounded image frame, and typography.
- Apply the change to the shared `JourneyStep` component so all three steps (Educate, Plan, Implement) receive the same improved spacing automatically.

## Files to modify
- `src/components/landing/JourneyStep.tsx`

## Verification
- Run the build/typecheck.
- Take a homepage screenshot at desktop and mobile widths to confirm the image and content in the selected section no longer feel compressed.
