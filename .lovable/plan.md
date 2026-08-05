# Plan: Update Cost Comparison Chart Text Color

## Goal
Change the font color of the "High cost + FICO hit" label in the cash-flow calculator's SVG bar chart from white to black for better visibility.

## Change
In `src/components/landing/CashFlowCalculator.tsx`, update the SVG `<text>` element for the personal-credit bar label:
- Current: `fill="white"`
- New: `fill="black"` (or `hsl(var(--secondary))` if a themed dark color is preferred)

## Verification
- Load the homepage and scroll to the Cash-Flow Gap Calculator.
- Confirm the "High cost + FICO hit" text is now black and readable against the red bar.
