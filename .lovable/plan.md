# Move Intake Step Indicator Below the Video

## Goal
On the public `/intake` survey, move the progress bar and step label currently shown above the walkthrough video so it appears directly below the video, while preserving readability and responsive spacing.

## Current State
In `src/pages/IntakeSurveyPage.tsx`, the step indicator (segmented progress bar, "Step X of Y: Title", helper text, and autosave status) is rendered before the `<StepVideoPlaceholder>` component. The video placeholder then sits between the indicator and the first form card.

## Proposed Change
1. Reorder the JSX in the main intake layout so the `<StepVideoPlaceholder>` renders first, followed immediately by the progress bar and step text block.
2. Keep the indicator block centered and constrained to `max-w-3xl mx-auto` so it aligns with the video and form cards.
3. Adjust vertical spacing:
   - Add a small top margin/padding between the video and the indicator so they are visually grouped but not cramped.
   - Keep the existing gap between the indicator and the first form card.
4. Preserve all existing behavior:
   - Stepper segments remain clickable to jump between completed/current steps.
   - Autosave status text ("Saving…" / "Saved") continues to appear.
   - The sticky bottom navigation bar and form content are unaffected.

## Files to Modify
- `src/pages/IntakeSurveyPage.tsx` — reorder the step indicator and video placeholder; adjust wrapper spacing.
- `src/components/intake/StepVideoPlaceholder.tsx` — no change required unless spacing tweaks are easier to apply here.

## Acceptance Criteria
- [ ] The segmented progress bar and "Step X of Y" label appear below the video placeholder on all steps.
- [ ] Visual spacing feels balanced on desktop and mobile.
- [ ] No functionality changes to navigation, autosave, or form validation.
- [ ] Build passes and the `/intake` preview matches the requested layout.
