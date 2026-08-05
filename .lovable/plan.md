# Add spacing between hero content and buttons

## Goal
Increase vertical breathing room between the descriptive subhead, the primary "Read the Free Guide" CTA, and the three benefit pills in the homepage hero so the elements no longer feel cramped.

## Current state
In `src/components/landing/HeroSectionBright.tsx`:
- The subhead paragraph uses `mt-4 sm:mt-5` above it.
- The CTA button wrapper uses `mt-4 sm:mt-5` below the subhead.
- The trust bullets list uses `mt-4 sm:mt-5` below the CTA.
- All three gaps are currently 16–20 px, which makes the circled section feel tight.

## Proposed change
- Increase the top margin on the CTA wrapper from `mt-4 sm:mt-5` to `mt-6 sm:mt-7` (24–28 px).
- Increase the top margin on the trust bullets list from `mt-4 sm:mt-5` to `mt-5 sm:mt-6` (20–24 px).
- Leave the subhead-to-video spacing unchanged so the video remains visually anchored to the headline.
- Keep responsive behavior intact on mobile and desktop.

## Files to modify
- `src/components/landing/HeroSectionBright.tsx`

## Verification
- Run the build/typecheck.
- Take a homepage screenshot to confirm the circled hero content has clearer vertical separation while remaining centered and balanced.
