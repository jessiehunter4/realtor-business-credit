# Center the hero "Read the Free Guide" button horizontally

## Goal
Ensure the "Read the Free Guide" CTA button in the homepage hero is perfectly centered horizontally, aligning with the headline, supporting paragraph, and overall content container.

## Current state
In `src/components/landing/HeroSectionBright.tsx`:
- The hero content is wrapped in a centered `max-w-3xl mx-auto text-center` container.
- The CTA button sits inside a flex wrapper with `justify-center`.
- The `<Link>` wrapping the button currently has `w-full sm:w-auto`, which can make the button stretch full-width on mobile and may introduce subtle alignment inconsistencies.

## Proposed change
- Remove `w-full` from the `<Link>` and keep `w-auto` (or let it shrink to content) so the button only occupies its intrinsic width.
- Ensure the flex wrapper remains `justify-center` and does not stretch the child.
- Keep responsive behavior intact on mobile, tablet, and desktop.

## Files to modify
- `src/components/landing/HeroSectionBright.tsx`

## Verification
- Run the build/typecheck.
- Take a homepage screenshot at desktop and mobile widths to confirm the button aligns with the center of the headline and paragraph.
