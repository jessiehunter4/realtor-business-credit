# Increase Card Internal Padding in Dashboard Program Section

The selected card is the "Credit Suite / Lendavo platforms" card in `src/pages/dashboard/ProgramSection.tsx`. Its internal padding is currently set to `p-5` on the `CardContent` element, which feels tight.

## Change

Increase the internal padding of the selected card's `CardContent` from `p-5` to `p-6` (or `p-8` if the layout allows) to create more breathing room between the card border and its content.

## Location

- File: `src/pages/dashboard/ProgramSection.tsx`
- Element: `CardContent` at line 45, className currently `"p-5 space-y-3"`

## Verification

- Check the preview at `/dashboard/program` to confirm the card content no longer feels cramped.
- Ensure the change does not break adjacent layout or overflow on mobile viewports.
