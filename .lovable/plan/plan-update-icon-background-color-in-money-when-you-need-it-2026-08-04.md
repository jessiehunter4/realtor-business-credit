# Plan: Update Icon Background Color in "Money When You Need It" Section

## Goal
Change the circular icon background color in the three cards of the `MoneyWhenYouNeedItStrip` section so it aligns with the site's primary brand palette instead of the current amber/accent tone.

## Current State
In `src/components/landing/MoneyWhenYouNeedItStrip.tsx`, each card icon container uses:

```tsx
<div className="inline-flex w-10 h-10 rounded-xl items-center justify-center bg-accent/20 text-accent-foreground">
  <Icon className="h-5 w-5" />
</div>
```

This renders an amber-tinted background (`bg-accent/20`) with dark navy text (`text-accent-foreground`).

## Proposed Change
- Replace `bg-accent/20` with a teal-tinted background using the site's primary success/teal palette, e.g. `bg-primary/15` or `bg-success-green/15`.
- Keep `text-accent-foreground` or switch to `text-primary` / `text-success-green` so the icon color remains readable and consistent with the background.
- Ensure the change is applied to all three cards in the section (Hourglass, Wallet, Rocket icons).

## Files to Modify
- `src/components/landing/MoneyWhenYouNeedItStrip.tsx`

## Acceptance Criteria
- [ ] Icon backgrounds no longer use the amber/accent palette.
- [ ] New icon background color is drawn from the site's primary teal/green or navy palette.
- [ ] Icons remain visually balanced and readable against the light blue/teal section background.
- [ ] Build passes and homepage preview reflects the update.
