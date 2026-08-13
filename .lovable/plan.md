# Replace Guide Hero Image

## Goal
Swap the current `/guide` hero header image (`src/assets/guide/hero-agent.jpg`) for a new AI-generated image of a male real estate professional writing at a laptop, in a different pose, against a dusty blue wall background.

## Steps
1. Generate a new hero image matching the requested subject/pose/background.
2. Save it as `src/assets/guide/hero-agent.jpg`, overwriting the existing file.
3. Keep the existing imports/usages in `GuideCover.tsx`, `CardGuideCover.tsx`, and `GuidePDF.tsx` unchanged so the new image appears automatically across all three surfaces.
4. Update the `alt` text in `GuideCover.tsx` to reflect the new scene if needed.
5. Verify the new image renders correctly on `/guide` and `/card-guide`.

## Notes
- No layout or component changes are required; only the asset source changes.
- The image should remain professional and consistent with the RE Pro Business Credit brand.
