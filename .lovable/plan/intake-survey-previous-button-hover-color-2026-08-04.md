# Intake Survey — Previous Button Hover Color

## Goal
Change the hover state of the sticky-bottom **Previous** button on `/intake` from the current orange/amber (`accent`) palette to a teal/success palette:
- Hover background: `#EAF8F5`
- Hover text: `#00A87E`
- Hover border: `#BFE9DD`

## Current State
- The sticky action bar uses the shadcn `Button` component.
- `Previous` uses `variant="outline"`, whose hover is currently `hover:bg-accent hover:text-accent-foreground` (amber/orange).
- Colors are defined as HSL CSS variables in `src/index.css` and mapped in `tailwind.config.ts`.

## Proposed Change
1. **Add semantic tokens** in `src/index.css` for the new hover palette (HSL equivalents):
   - `--hover-soft-bg: 162 60% 95%` (#EAF8F5)
   - `--hover-soft-text: 162 100% 33%` (#00A87E)
   - `--hover-soft-border: 162 47% 83%` (#BFE9DD)
2. **Map them in `tailwind.config.ts`** under `extend.colors` so Tailwind classes can reference them.
3. **Update `src/components/ui/button.tsx`**:
   - Change the `outline` variant hover classes from `hover:bg-accent hover:text-accent-foreground` to the new semantic tokens.
   - Keep the default border/input colors for the resting state.
   - Ensure focus ring and disabled states remain unchanged.
4. **Scope check**: If other outline buttons site-wide should keep the amber hover, create a dedicated `intakeNav` variant instead and apply it only to the Previous/Next bar in `src/pages/IntakeSurveyPage.tsx`. The default recommendation is to update `outline` globally because the new teal palette matches the brand primary and is more consistent.

## Acceptance Criteria
- Hovering the **Previous** button on `/intake` shows background `#EAF8F5`, text `#00A87E`, and border `#BFE9DD`.
- No other hover states are broken.
- Build passes and no hardcoded hex values are used in component files.
