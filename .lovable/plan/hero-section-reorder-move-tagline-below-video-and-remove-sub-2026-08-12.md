# Hero section reorder: move tagline below video and remove subhead

## Goal
Rearrange the homepage hero so the headline and video sit above the fold, the tagline appears directly under the video in a smaller font, and the "Read the Free Guide" CTA remains visible without scrolling.

## Current state
In `src/components/landing/HeroSectionBright.tsx` the hero currently flows as:
1. Headline: "Money when you need it"
2. Tagline (large bold): "— between closings, before your next client, and when opportunity knocks."
3. Hero video
4. Subhead paragraph: "Commission income arrives in lumps..."
5. "Read the Free Guide" CTA button
6. Trust bullets / meta text

The tagline is above the video and the subhead pushes the CTA down, so the button can fall below the fold.

## Proposed change
- Keep the headline at the top.
- Move the hero video directly under the headline.
- Move the tagline below the video and reduce its font size (e.g., from `text-[clamp(1rem,2.8vw,1.5rem)] font-bold` to a smaller, lighter style such as `text-base sm:text-lg text-secondary/80`).
- Remove the subhead paragraph entirely.
- Keep the "Read the Free Guide" CTA immediately after the tagline.
- Tighten vertical margins/padding as needed so the CTA stays above the fold on common desktop and tablet viewports.
- Preserve the trust bullets and remaining meta text below the CTA.

## Files to modify
- `src/components/landing/HeroSectionBright.tsx`

## Verification
- Run the build/typecheck.
- Take a homepage screenshot at the current viewport (≈1018×643) to confirm the video, tagline, and CTA are all visible without scrolling.
