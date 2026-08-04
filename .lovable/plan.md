# Increase spacing between card title and body in "Money when we need it" section

## Goal
Add more vertical breathing room between each card's title (e.g. "Between closings") and its descriptive body text in the "Money when we need it" section.

## Current state
In `src/components/landing/MoneyWhenYouNeedItStrip.tsx`, each card uses:
- `<h3 className="mt-3 font-bold text-secondary">{title}</h3>`
- `<p className="mt-1 text-sm text-muted-foreground leading-relaxed flex-grow">{desc}</p>`

The `mt-1` (0.25rem / 4px) gap between the title and body feels tight.

## Proposed change
Increase the top margin on the body paragraph from `mt-1` to `mt-3` (0.75rem / 12px) so the title and body are visually separated without breaking the card's compact feel.

## Files to modify
- `src/components/landing/MoneyWhenYouNeedItStrip.tsx`

## Verification
- Run the build/typecheck.
- Take a homepage screenshot to confirm the title-to-body spacing looks balanced inside each card.
