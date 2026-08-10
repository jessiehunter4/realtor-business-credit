Add hover highlight to "How It Works" cards

## Goal
In the homepage "How It Works" section, the three step cards should visually highlight when hovered.

## Changes
- Modify `src/components/landing/HowItWorksRail.tsx`.
- Add a hover background (`hover:bg-hover-soft`) and hover border (`hover:border-hover-soft-border`) to the existing card classes.
- Keep the existing `hover:shadow-card-hover transition-all`.
- Keep the step number circle styled as-is (it is already the primary accent).

## Verification
- Run the TypeScript check and production build.
- Confirm via browser preview that each of the three cards gains a soft teal background and border highlight on hover.
