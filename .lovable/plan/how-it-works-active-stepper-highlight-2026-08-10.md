# How It Works active stepper highlight

## Goal
Add an active highlight state to the three stepper buttons in the homepage "How it works" section so the button matching the currently visible step gets a bold border and accent fill.

## Scope
- `src/components/landing/HowItWorksRail.tsx`
- `src/pages/LandingPage.tsx` (orchestrates the active-section state)
- No changes to journey section content or step data.

## Implementation
1. Track the active section in `LandingPage.tsx` using an `IntersectionObserver` on the three `JourneyStep` sections (`step-educate`, `step-plan`, `step-implement`). Report the section most in view to state.
2. Pass the active `sectionId` to `HowItWorksRail` as a prop.
3. In `HowItWorksRail.tsx`, conditionally apply the active style to the matching button:
   - Bold border: `border-primary` or `border-2 border-primary`
   - Accent fill: `bg-primary/10` or similar
   - Keep the inactive style as the current default.
4. Ensure the active state updates on scroll (desktop and mobile) without jarring re-renders. Use a stable observer or throttle if needed.

## Verification
- Scroll the homepage; the stepper button corresponding to the visible section should visually highlight.
- Clicking a stepper button should still smooth-scroll to the matching section and update the active state.
- No regressions in existing layout or click behavior.
