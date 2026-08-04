# Increase spacing between descriptive text and CTA button in PlanHeroCard empty state

## Goal
Add more vertical breathing room between the descriptive paragraph ("You're one step away...") and the "Complete My Intake" button in the dashboard's empty-state plan card.

## Current state
In `src/components/dashboard/PlanHeroCard.tsx`, the empty-state card uses:

```tsx
<CardContent className="p-6 sm:p-8 text-center space-y-4">
  <h2 className="text-xl font-semibold text-secondary">Finish your intake to unlock your plan</h2>
  <p className="text-muted-foreground text-sm">
    You're one step away. Complete the 5-minute Needs Analysis and we'll generate your personalized plan.
  </p>
  <Link to="/intake">
    <Button size="lg" className="rounded-full">
      Complete My Intake <ArrowRight className="h-4 w-4 ml-1" />
    </Button>
  </Link>
</CardContent>
```

The `space-y-4` utility applies a 1rem (16px) gap between all direct children, making the button feel tight against the paragraph above it.

## Proposed change
Increase the top margin of the button/link wrapper to roughly 24–32px while keeping the rest of the rhythm intact. Two equivalent options:

1. **Increase the shared stack gap** — change `space-y-4` to `space-y-6` (1.5rem / 24px) on `CardContent`. This increases spacing between the heading, paragraph, and button consistently.
2. **Target only the button** — keep `space-y-4` and add `mt-6` or `mt-8` to the `<Link>` wrapper to push just the CTA down.

Recommended approach: Option 2 (`mt-6` on the `<Link>`), because it specifically solves the user's complaint without altering the heading-to-paragraph spacing.

## Files to modify
- `src/components/dashboard/PlanHeroCard.tsx`

## Verification
- Run the build/typecheck.
- View the `/dashboard` empty state at desktop and mobile widths to confirm the button no longer crowds the text and the card remains centered and responsive.
