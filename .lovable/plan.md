# Use Green Highlight for Navbar Menu Hover and Active States

## Current state
In `src/components/shared/SiteHeader.tsx`, the desktop nav links currently highlight with the secondary (navy) color on hover and active states:
- Hover: `hover:text-secondary hover:bg-secondary/5`
- Active/clicked: `text-secondary bg-secondary/5`

## Goal
Change the navbar menu highlight to the brand green (primary) whenever a link is hovered or active/clicked, so the interaction color matches the site's primary accent.

## Plan
1. Update `src/components/shared/SiteHeader.tsx`:
   - Change the desktop primary nav link hover state from `hover:text-secondary hover:bg-secondary/5` to `hover:text-primary hover:bg-primary/10`.
   - Change the active/selected state from `text-secondary bg-secondary/5` to `text-primary bg-primary/10`.
   - Optionally add a subtle transition for the color change.

2. Keep the mobile Sheet menu visually consistent:
   - Update mobile nav link hover state to use `hover:text-primary hover:bg-primary/10` as well.

3. Verify the result:
   - Desktop: hovering over a nav link shows green text and a light green background; the active page link uses the same green treatment.
   - Mobile: the Sheet menu links highlight green on hover/tap.

## Files to change
- `src/components/shared/SiteHeader.tsx`

## Risk / note
This is a presentation-only change. No routing, auth, or business logic is affected.
