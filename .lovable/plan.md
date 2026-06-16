## Problem

The hero video player still displays the old "lady realtor" still image (`hero-money-flow.jpg`) as its poster/fallback. That image was added as a placeholder before the video was uploaded and was never removed. You want the image removed from the video player position, but the file kept in the assets folder for other uses.

## Fix

**Edit `src/components/landing/HeroSectionBright.tsx`:**
- Remove the `import heroImage from "@/assets/landing/hero-money-flow.jpg"` line.
- Remove the `poster={heroImage}` prop from the `<HeroVideo>` call.

**Edit `src/components/shared/HeroVideo.tsx`:**
- Make the `poster` prop optional.
- When no video URL is available (storage check pending or no file uploaded), render a neutral dark surface (e.g. `bg-secondary` matching the surrounding card) instead of the `<img>` fallback. Keep the same `aspect-video`/sizing wrapper so layout doesn't shift.
- On the `<video>` element, do not set a `poster` attribute — the browser will show the video's first frame, which is the Heygen intro of Jessie.

## Out of scope

- The image file `src/assets/landing/hero-money-flow.jpg` is **not** deleted — it remains available for other components.
- No changes to the uploaded video, captions, styling, copy, or other landing-page sections.
- No changes to the admin upload flow.
