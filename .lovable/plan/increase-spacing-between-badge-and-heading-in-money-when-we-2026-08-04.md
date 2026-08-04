# Increase spacing between badge and heading in "Money when we need it" section

## Goal
Add more vertical breathing room between the small "The #1 thing Realtors actually ask for" badge and the "Money when we need it" heading on the homepage.

## Current state
In `src/components/landing/MoneyWhenYouNeedItStrip.tsx`, the badge is an inline `<span>` and the `<h2>` heading currently has `mt-3`, creating a 0.75rem (12px) gap.

## Proposed change
Increase the top margin on the heading from `mt-3` to `mt-5` (1.25rem / 20px) so the badge feels less cramped against the headline while keeping the rest of the section layout intact.

## Files to modify
- `src/components/landing/MoneyWhenYouNeedItStrip.tsx`

## Verification
- Run the build/typecheck.
- Take a homepage screenshot to confirm the badge and heading are visually separated without breaking the centered alignment.
