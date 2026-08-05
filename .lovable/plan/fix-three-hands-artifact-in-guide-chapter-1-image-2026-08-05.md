# Fix Three-Hands Artifact in Guide Chapter 1 Image

## Problem
The split comparison image used in Chapter 1 (`src/assets/guide/personal-vs-business.jpg`) has a visible AI artifact: the man on the left appears to have three hands — both hands pressed to his face plus an additional hand holding the credit card.

## Goal
Repair the left side of the image so the man has only two hands and the credit card is held naturally. Preserve the overall split-comparison concept, mood (stressed/relieved), and brand color tones.

## Approach
1. Use the existing image-editing tool to inpaint/correct the left panel.
2. Keep the right panel and the split composition unchanged.
3. Re-export to the same path (`src/assets/guide/personal-vs-business.jpg`) so the guide component picks it up automatically.
4. Verify the final image in the preview to confirm the artifact is gone and the image still communicates the same message.

## Files affected
- `src/assets/guide/personal-vs-business.jpg` (regenerated/edited)
- `src/components/guide/chapters/Ch01.tsx` (no code change unless alt/caption needs adjustment)
