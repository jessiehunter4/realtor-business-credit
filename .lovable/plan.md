# Reduce visual dominance of the "Money when you need it" badge

## Goal
Make the section badge (`💵 The #1 thing Realtors actually ask for`) on the homepage smaller and less visually dominant so the headline and supporting copy draw the eye first.

## What to change
Edit `src/components/landing/MoneyWhenYouNeedItStrip.tsx`:
- Shrink badge text to `text-[10px]` or `text-xs` (whichever is smaller than current).
- Reduce horizontal/vertical padding.
- Lower contrast/weight: remove the emoji or keep it minimal, use a subtler background (`bg-white/40` or `bg-secondary/5`), and use a lighter border (`border-secondary/10`).
- Optionally remove `font-semibold` in-context or switch to `font-medium`.
- Keep the badge accessible and readable; do not change the badge text copy itself.

## Acceptance criteria
- Badge no longer competes with the H2 headline for attention.
- Responsive behavior preserved on mobile and desktop.
- No other section content or layout is affected.

## Verification
- Open the homepage preview and visually confirm the badge recedes while remaining legible.
