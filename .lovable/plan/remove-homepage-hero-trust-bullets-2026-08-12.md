# Remove homepage hero trust bullets

## Goal
Remove the three benefit pills that appear below the "Read the Free Guide" button on the homepage hero.

## Current state
In `src/components/landing/HeroSectionBright.tsx`:
- A `trustBullets` array defines three items:
  - "Know where you stand"
  - "Get a 90-day plan"
  - "Choose how to implement"
- These are rendered as a three-column card list (`<ul>`) directly below the CTA button.

## Proposed change
- Delete the `trustBullets` array.
- Delete the `<ul>` that renders the three benefit pills.
- Keep the "Read the Free Guide" CTA and the "Free to read · about 5–10 minutes · no signup required" line intact.
- Leave spacing as-is so the page does not feel cramped after removal.

## Files to modify
- `src/components/landing/HeroSectionBright.tsx`

## Verification
- Run the build/typecheck.
- Take a homepage screenshot to confirm the pills are gone and the remaining hero elements still look balanced.
