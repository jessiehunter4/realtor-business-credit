# Keep the Intake Video Above the Fold (Steps 1–4)

## What's happening now

On `/intake`, each step renders in this vertical order inside a `max-w-3xl` column:

```text
SiteHeader
Page title + welcome paragraph      (centered, ~110px)
Video slot (full-width 16:9)        (~432px tall at 768px wide)
Progress bar
"Step X of Y" + autosave text
Form card (title, description, fields)
```

The video is technically first in the content column, but the page title block above it plus the full-width 16:9 ratio means that on a typical 1338x855 desktop viewport the video bottom lands near the fold and the form starts below it. On mobile the header + title push it down further.

## The fix, in short

Cap the video's height instead of letting the 16:9 ratio dictate it, compress the header block, and move the step/progress metadata into a compact row so the video, step title, and the first form fields all fit in the first screen.

## Layout changes

### 1. Compact page header
- Reduce the page wrapper's top padding (`pt-8` -> `pt-4 sm:pt-6`) and the section gap (`space-y-6` -> `space-y-4 sm:space-y-5`).
- Shrink the H1 (`text-2xl md:text-3xl` -> `text-xl sm:text-2xl`) and drop the welcome paragraph to `text-sm`; on small screens hide the welcome paragraph entirely (`hidden sm:block`) since the step description already orients the user.

### 2. Height-capped, centered video
- Replace the pure `aspect-video w-full` sizing in `StepVideoPlaceholder` with an aspect ratio plus a max-height clamp so it never eats the viewport:
  - `max-h-[38vh] sm:max-h-[40vh] lg:max-h-[42vh]` with `mx-auto` and `w-auto`-style centering so the box shrinks by height while keeping 16:9.
  - Add an absolute pixel ceiling (`max-w-[560px] lg:max-w-[620px]`) so it stays proportionate on very wide screens.
- Keep the existing rounded border, gradient, badges, and play icon; scale the play icon down (`h-12 w-12 sm:h-16 sm:w-16`) and clamp the description to one or two lines so the inner content never overflows the shorter box.
- Expose an optional `compact` prop so the same component can be used elsewhere without the clamp if needed later.

### 3. Merge progress + step meta into one row
- Combine the progress bar, "Step X of Y: Title", the time-remaining hint, and the autosave indicator into a single compact block directly under the video:
  - Row 1: segmented progress bar (unchanged behavior, same click-to-jump buttons).
  - Row 2: left-aligned "Step X of Y · Title", right-aligned autosave status + time hint (stacks on mobile).
- This removes roughly 40–60px of stacked centered text.

### 4. Form directly beneath
- Set a consistent gap between the video block and the form card (`mt-4 sm:mt-5`).
- Reduce the form `Card`'s header padding on mobile and tighten field grid gaps from `gap-4` to `gap-3 sm:gap-4` so the first input row is visible on load.

### 5. Same treatment on every step
All of the above lives in the shared page shell (header, video slot, progress row) that wraps every step, so Steps 1–4 (and Program Fit when enabled) get identical spacing automatically. Only the per-step `Card` internals need the gap tightening, applied uniformly.

## Cross-device behavior

| Viewport | Video max height | Expected above-fold content |
|---|---|---|
| Mobile (~360x740) | ~38vh (~280px) | Title, video, progress row, step title + first field |
| Tablet (~768x1024) | ~40vh (~410px) | Same, plus 2–3 fields |
| Desktop (1280x800+) | ~42vh (~336–420px, capped at 620px wide) | Header, video, progress row, first field row |

Because the video is height-clamped rather than width-driven, short laptop viewports (800–900px tall) no longer push the form off screen.

## UX recommendations
- Keep the video visually distinct but secondary: it is a helper, not the hero — the clamped size signals that.
- Preserve click-to-jump on the progress segments; add `aria-current` on the active segment.
- When the real player replaces the placeholder, keep the same clamped container so autoplay/poster frames don't change layout height.
- Reserve the video box's space (fixed ratio + clamp) so there is no layout shift while the player loads.

## Preserved functionality
No changes to state, handlers, or data flow. Autosave, step navigation, validation, progress state, direct/token mode branching, and future video playback wiring all remain untouched — this is presentation-only (Tailwind classes and JSX nesting).

## Technical notes
- `src/components/intake/StepVideoPlaceholder.tsx` — add height clamp, centering, responsive inner scaling, optional `compact` prop.
- `src/pages/IntakeSurveyPage.tsx` — tighten wrapper padding/spacing, compact the H1/welcome block, restructure the progress + step-meta rows, tighten card/grid gaps.

## Testing checklist
- [ ] Video fully visible without scrolling at 1440x900, 1280x800, 1024x768, 768x1024, 390x844, 360x740.
- [ ] Steps 1–4 (and Program Fit if enabled) all render with identical header/video/progress spacing.
- [ ] No layout shift when switching steps; video box height stays constant.
- [ ] Progress segments still jump between steps; active state correct.
- [ ] Autosave indicator still appears and does not shift the layout when it toggles.
- [ ] Validation errors on the first step still render without pushing the video off screen.
- [ ] Direct mode (name/email fields shown) and token mode both fit.
- [ ] Typecheck passes.

## Phases
1. Video component clamp + responsive inner scaling.
2. Page shell header/spacing compaction and progress-row restructure.
3. Per-step card gap tightening.
4. Screenshot verification across the six viewports above, then adjust the clamp values if any step still overflows.
