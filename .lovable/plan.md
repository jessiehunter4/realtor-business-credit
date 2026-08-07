# Floating chapter numbers on the guide

Add a slim floating rail of numbered chapter buttons on `/guide` so readers can jump straight to any chapter with one click.

## What it looks like

- A vertical, pill-shaped rail fixed to the right edge, vertically centered, showing the numbers **1–13** (one per chapter).
- The number of the chapter currently in view is highlighted; the others are muted.
- Clicking a number smooth-scrolls to that chapter heading.
- Hovering a number shows a small tooltip with the chapter title (e.g. "4. Personal credit is the bridge").
- Shown on tablet/desktop only. On phones the existing book-icon table of contents panel stays as-is, so the rail never crowds the small screen.
- The rail sits above page content but clears the existing floating buttons (table of contents and plan CTA) in the bottom-right corner.

## Technical notes

- New component `src/components/guide/GuideChapterRail.tsx`.
- Reuses the chapter list/ids already used by `GuideFloatingTOC` (`chapter-1` … `chapter-13`); extract that array into a shared `src/components/guide/guideChapters.ts` so both components stay in sync.
- Active-chapter detection uses the same `IntersectionObserver` approach as `GuideFloatingTOC`.
- Rendered from `src/pages/GuidePage.tsx` next to `<GuideFloatingTOC />`, styled with existing semantic tokens (primary/muted), `hidden md:flex`, right-aligned, `top-1/2 -translate-y-1/2`.
- No data, backend, or content changes.
