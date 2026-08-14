# Plan: Add spacing between homepage hero header text and video

## Goal
Increase the vertical gap between the homepage hero headline and the hero video so the two elements feel less cramped.

## Current state
In `src/components/landing/HeroSectionBright.tsx`:
- The `<h1>` headline has no bottom margin.
- The video wrapper immediately below it uses `mt-3 sm:mt-4`.
- The result is a tight gap between the header text and the video at all breakpoints.

## Proposed change
- Add a bottom margin to the headline (`mb-4 sm:mb-5 md:mb-6`) and/or increase the top margin on the video wrapper (`mt-5 sm:mt-6 md:mt-8`).
- Keep the tagline, CTA, and timestamp spacing intact so only the headline-to-video gap grows.
- Verify the change visually on desktop and mobile viewports.

## Files to modify
- `src/components/landing/HeroSectionBright.tsx`

## Verification
- Typecheck passes.
- Screenshot of homepage hero at desktop and mobile widths shows a clear, comfortable gap between the headline and the video.
