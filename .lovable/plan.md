# Intake Survey Redesign — Steps 1–5

Note: The current survey has 5 steps (Profile, Goals, Business Structure, Credit & Funding, Program Fit). The request says "Steps 1–4" — I'll treat this as **all form steps** for consistency. Confirm if you want Step 5 excluded.

## UX Review — Current State

- Single-page stepper in `src/pages/IntakeSurveyPage.tsx` (~1047 lines) using shadcn `Card` + `CardHeader/CardContent`.
- No instructional media on any step; heading + description only.
- Dense forms (Steps A, C, D each render 6–10 fields in one card) with `space-y-4` — desktop feels cramped, mobile feels long.
- Progress indicator, autosave (`AUTOSAVE_DEBOUNCE_MS`, localStorage `rbc_intake_draft_v2`), Prev/Next nav, validation, and plan-preview handoff all live in this one file.

Pain points:
- No visual anchor at the top of each step — user drops straight into fields.
- Field grouping is flat; related fields (e.g. business address block, business identity toggles) aren't visually grouped.
- On desktop the single-column card wastes horizontal space; on mobile the CTAs sit far below the fold.

## Proposed Layout

Two-column on desktop (≥lg), stacked on mobile:

```text
lg (≥1024px)                          md/sm (<1024px)
┌──────────────┬──────────────────┐   ┌──────────────────┐
│ Video        │ Step Header      │   │ Step Header      │
│ Placeholder  │ ─────────────    │   ├──────────────────┤
│ 16:9         │ Form fieldsets   │   │ Video (16:9)     │
│ sticky top-24│ (grouped)        │   ├──────────────────┤
│              │ Prev / Next CTAs │   │ Form fieldsets   │
└──────────────┴──────────────────┘   │ Prev / Next CTAs │
                                      └──────────────────┘
```

Proportions: `lg:grid-cols-[minmax(0,420px)_1fr]`, gap-8. Video sticks (`lg:sticky lg:top-24`) so it stays visible while the form scrolls. On mobile the video sits above the form and is collapsible ("Watch intro ▾") to keep fields near the fold.

## Video Placeholder Component

New `src/components/intake/StepVideoPlaceholder.tsx`:

Props:
- `stepNumber: number`
- `title: string` (e.g. "Step 1 · Profile walkthrough")
- `description?: string` ("2 min · What Jessie covers on this page")
- `videoUrl?: string` — when provided, renders `<HeroVideo>`-style player; when absent, renders placeholder
- `storagePath?: string` — supabase storage key for future upload
- `posterUrl?: string`

Placeholder visuals:
- 16:9 `aspect-video` container, `rounded-2xl border border-border bg-hero-grad`
- Centered play icon (Lucide `PlayCircle`, ~64px) in brand teal, subtle ring
- Title + "Video coming soon" chip in top-left
- Duration/description caption below
- Skeleton shimmer overlay (subtle, respects `prefers-reduced-motion`)

Reuses `HeroVideo.tsx` playback path when a `storagePath` is added later — swap is one prop change per step. Upload is already managed via `AdminVideoUpload` page; we'll add step slots (`intake-step-1.mp4` … `intake-step-5.mp4`) there.

## Form Experience Improvements

- Split each step into `<fieldset>` groupings with subtle divider + section eyebrow (e.g. Step A: "You" / "Your Business" / "Production"; Step C: "Entity" / "Address & Contact" / "Banking & Accounting"; Step D: "Cards & Tradelines" / "Bureaus" / "Funding Needs").
- Two-column field grid inside groups on `md+` (`grid md:grid-cols-2 gap-4`) where fields are short (name, city, state, zip, phone, license type…). Textareas + multi-selects remain full width.
- Consistent `Label` + helper text pattern; inline validation messages under fields (aria-describedby) instead of toast-only.
- Sticky action bar at the bottom of the form column (`sticky bottom-0 bg-background/95 backdrop-blur border-t`) containing Prev/Next + autosave status ("Saved just now"). Improves reachability on mobile.
- Progress: keep numeric step count, add a slim `Progress` bar and step labels above the two-column area, sticky under the header.

## Impact Analysis

Files touched:
- `src/pages/IntakeSurveyPage.tsx` — layout scaffold, per-step wrappers, sticky action bar, grouping. Business logic (autosave, validation, plan generation handoff) unchanged.
- New `src/components/intake/StepVideoPlaceholder.tsx`.
- New `src/components/intake/StepShell.tsx` — reusable two-column shell (video slot + form slot + header + sticky footer). Keeps each step block small.
- Optional: extract each step's fields into `src/components/intake/steps/StepProfile.tsx`, `StepGoals.tsx`, `StepStructure.tsx`, `StepCredit.tsx`, `StepProgramFit.tsx` to shrink the 1047-line page. Recommended but scoped as Phase 2.
- `src/pages/AdminVideoUpload.tsx` — add upload slots for `intake-step-{1..5}.mp4` (Phase 3, optional).

Unaffected (verified): autosave debounce + `DRAFT_STORAGE_KEY`, `usePlanGeneration` handoff, `PlanPreviewCard/Loader/Celebration`, edge functions (`intake-survey`, `generate-plan`), DB schema, admin coach view.

## Responsive Behavior

- `<768px`: single column, video collapsible above form, sticky bottom action bar, groups full-width.
- `768–1023px`: single column but form uses 2-col field grid inside groups; video full-width above.
- `≥1024px`: two-column shell, video sticky, form scrolls; max content width `max-w-6xl`.
- Respect `prefers-reduced-motion` on shimmer/transitions.
- Touch targets ≥44px on inputs and Prev/Next.

## Accessibility

- Placeholder uses `role="img"` with `aria-label`; real video uses `<video controls>` with captions track (mirrors `HeroVideo`).
- Fieldsets with `<legend>` (visually styled as eyebrows).
- Live region announces "Saved" and step changes.
- Focus moves to step heading on Next/Prev.

## Performance

- Placeholder is pure CSS + one SVG icon — zero network cost.
- When real videos land, reuse `HeroVideo` signed-URL flow (already lazy, `preload="metadata"`).
- Extracting steps into subcomponents enables per-step code-splitting later if needed (not required now).

## Risks & Testing

Risks:
- Sticky footer overlapping mobile keyboards on iOS — mitigate with `pb-[env(safe-area-inset-bottom)]` and non-sticky variant when a text input is focused (feature-detect).
- Two-column shell on tablets in landscape at 1024px can feel tight — cap video column at 420px and allow form to flex.
- Autosave status placement change — ensure existing "Saved"/"Saving" state wiring still fires.

Testing:
- Manual: all 5 steps at 375 / 768 / 1024 / 1440 widths; keyboard-only nav; screen reader step announcements; autosave still writes to `rbc_intake_draft_v2` and edge PUT.
- Regression: token flow (`?token=`), direct-access mode, plan generation handoff, admin coach view unchanged.
- Visual: dark mode not currently used on `/intake`, so no dark-mode QA needed.

## Phased Implementation

1. **Phase 1 — Shell + placeholder (no logic change).**
   - Build `StepVideoPlaceholder` and `StepShell`.
   - Wrap each of the 5 existing step Cards in `StepShell` with the placeholder in the video slot.
   - Add sticky action bar, move Prev/Next inside it.
   - Ship — visually redesigned, behaviorally identical.

2. **Phase 2 — Field grouping & 2-col grids.**
   - Introduce fieldset groups + `md:grid-cols-2` inside each step.
   - Inline validation messages under fields.
   - Optional: extract steps into `src/components/intake/steps/*` for maintainability.

3. **Phase 3 — Real video wiring (when assets exist).**
   - Add `intake-step-{n}.mp4` slots in `AdminVideoUpload`.
   - Pass `storagePath` to `StepVideoPlaceholder`; it delegates to `HeroVideo` when the file exists (reuses the existence-check pattern to avoid 404 noise).

## Open Question

- Confirm scope: redesign **all 5 steps** (Profile, Goals, Structure, Credit & Funding, Program Fit) or only Steps 1–4 excluding "Program Fit"?
