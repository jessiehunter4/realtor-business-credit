# Global Green Button Hover/Active States

## Goal
Make every button across the site highlight green on hover and click, creating a consistent, branded interaction pattern. Destructive actions (delete/remove) will retain their red/coral semantics for safety.

## Current State
- The shadcn `Button` component (`src/components/ui/button.tsx`) defines the default button variants.
- `default` and `primary` buttons already use the brand teal/green.
- `secondary`, `outline`, and `ghost` variants currently hover toward navy, soft teal, or amber — not a unified green.
- Legacy utility classes `.btn-primary` and `.btn-secondary` exist in `src/index.css`.
- Several pages use inline `<button>` or `<a>` elements styled with custom Tailwind classes (e.g., `hover:bg-secondary/5`) that do not follow the global Button semantics.

## Plan

### 1. Update shadcn Button variants
Edit `src/components/ui/button.tsx` so all non-destructive variants shift to green on hover and active/pressed states:
- `default`: keep green base; hover darkens to `success-green-hover`; add `active:bg-success-green-hover`.
- `secondary`: change from navy base to a green-friendly treatment (e.g., green text on light green background, hover to solid green with white text) OR keep navy text but hover to green background/white text. Final choice: navy text on white/light surface, hover to `bg-success-green text-white`.
- `outline`: border stays neutral; hover fills `bg-success-green` with white text; active darkens.
- `ghost`: hover background `bg-primary/10` and text `text-primary`; active `bg-primary/20`.
- `link`: keep primary text; hover underline plus `text-success-green-hover`.
- Add `active:scale-[0.98]` or equivalent pressed feedback globally in the base class.
- Keep `destructive` unchanged (red/coral hover).

### 2. Add global active/focus states
- Ensure `focus-visible:ring-ring` remains green (already configured via `--ring`).
- Add `active:` color transition to the base `buttonVariants` class so every variant gets a pressed feedback.

### 3. Update legacy CSS button classes
Edit `src/index.css`:
- `.btn-primary`: ensure hover/active uses `--success-green-hover`.
- `.btn-secondary`: change hover/active to green instead of sky blue.

### 4. Audit and update inline custom buttons
Search for inline `<button>` / `<a>` elements that mimic buttons but do not use the `Button` component. Update hover classes on high-traffic pages:
- `/pricing` tier cards and "Launch" buttons.
- `/business-credit-cards-for-realtors` CTA buttons.
- `/checkout` and payment action buttons.
- `/guide` chapter CTAs.
- `/sample-plan` floating PDF button (already navy/green; verify consistency).
- Any remaining `hover:bg-secondary/5`, `hover:bg-secondary/80`, or `hover:text-secondary` button-like elements.

Where possible, replace inline styled buttons with the `Button` component to keep future updates centralized. Where not practical, apply the same green hover/active Tailwind classes.

### 5. Verify destructive buttons are excluded
- Confirm `destructive` variant and any explicit delete/remove buttons keep coral/red hover states so users do not mistake them for primary actions.

### 6. Visual regression check
- Spot-check the following routes after implementation:
  - Home page hero CTA
  - `/pricing` tier cards
  - `/guide` chapter CTAs and floating book button
  - `/sample-plan` floating PDF button
  - `/business-credit-cards-for-realtors`
  - Dashboard primary actions
- Confirm green hover/active states render and that destructive buttons still look distinct.

## Outcome
A single, predictable interaction pattern: every non-destructive button turns green on hover and provides a green pressed/active state, reinforcing the RE Pro Business Credit brand across the entire site.
