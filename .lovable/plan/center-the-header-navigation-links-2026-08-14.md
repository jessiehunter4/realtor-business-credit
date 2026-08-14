# Center the Header Navigation Links

## Current state
`src/components/shared/SiteHeader.tsx` lays out the desktop header with `justify-between`, placing the logo on the left, the nav links in the middle, and the auth/CTA buttons on the right. Because the right-side buttons take up variable width, the nav links are visually pushed to the right of center.

## Goal
Visually center the primary navigation links (Guide, Sample Plan, Business Credit Cards, Pricing) in the desktop header while keeping the logo on the left and the Log in / Start Here (or account avatar) actions on the right.

## Plan
1. Update `src/components/shared/SiteHeader.tsx`:
   - Keep the logo in a left-aligned container.
   - Wrap the desktop `<nav>` in a container that is centered in the available header width.
   - Keep the right-side auth/CTA buttons in a container with a fixed or balanced width so the centering is stable.
   - Approaches to evaluate:
     a. Use `absolute inset-x-0` centering for the nav while the logo and actions sit in relative containers.
     b. Use a three-column grid (`grid-cols-[1fr_auto_1fr]`) so the nav auto-centers and the left/right columns balance each other.
   - Preserve existing link styles, active states, and responsive behavior.

2. Verify the result:
   - Desktop: nav links are horizontally centered under the headline area.
   - Tablet/mobile: no regression; the hamburger menu continues to work.

## Files to change
- `src/components/shared/SiteHeader.tsx`

## Risk / note
This is a presentation-only change. No routing, auth, or business logic is affected.
