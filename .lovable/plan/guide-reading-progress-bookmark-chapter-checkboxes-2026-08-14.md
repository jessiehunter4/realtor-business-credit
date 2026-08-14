# Guide Reading Progress: Bookmark + Chapter Checkboxes

Add a "Pick up where you left off" resume card and manual completion checkboxes to the existing Guide, using browser-local storage only. No content, layout, or design overhaul.

## What the reader gets

- A resume card near the top of the guide (below the cover) showing the last chapter they were reading, with a "Continue reading" action that smooth-scrolls there. Hidden entirely for first-time readers.
- A checkbox next to every chapter in all three tables of contents (main TOC section, floating mobile sheet, desktop chapter rail). Clicking the title still navigates; clicking the checkbox marks complete.
- Completed chapters get a subtle treatment — green check, slightly muted title — while staying fully readable.
- A small "X of 16 sections complete" line in the TOC header and chapter rail.
- Nothing is auto-completed by scrolling. Completion is always the reader's choice.

## Files affected

New:
- `src/lib/guideProgress.ts` — storage module (read/write/subscribe, versioned, self-healing).
- `src/hooks/useGuideProgress.ts` — React hook: completed set, last position, toggle, resume target; keeps the three TOCs in sync via a simple event.
- `src/components/guide/GuideResumeCard.tsx` — the "Pick up where you left off" card.
- `src/components/guide/ChapterCheckbox.tsx` — small labeled checkbox used in all TOCs.

Modified:
- `src/components/guide/guideChapters.ts` — treat the existing `tocItems` (intro + 13 chapters + conclusion + resources) as the single source of section IDs; no structural change.
- `src/components/guide/GuideTOC.tsx` — add checkbox column + progress count.
- `src/components/guide/GuideFloatingTOC.tsx` — add checkbox in the mobile sheet rows.
- `src/components/guide/GuideChapterRail.tsx` — add checkbox in desktop rail rows.
- `src/pages/GuidePage.tsx` — render `GuideResumeCard`; mount the reading-position tracker.

## Storage model

Single localStorage key `rbc_guide_progress_v1`:

```text
{
  version: 1,
  completed: ["chapter-1", "chapter-4"],
  lastSectionId: "chapter-4",
  updatedAt: 1723600000000
}
```

Rules:
- One system only — no second bookmark store is introduced. The unrelated `ScrollMemory` scroll-restoration logic stays as-is.
- On read, unknown or removed section IDs are filtered against the current `tocItems`. If `lastSectionId` no longer exists, the bookmark resets silently.
- Wrong/absent `version`, malformed JSON, or storage errors (private mode) → treated as "no progress", never a thrown error.

## Reading-position detection

Reuse the IntersectionObserver pattern already in `GuideFloatingTOC`/`GuideChapterRail`: observe each section element, track the top-most visible section. Write to storage only when:
- the active section actually changes, and
- it has been the active section for ~1.5s (debounce), so fast scroll-throughs don't set a bookmark.

Landing on the cover therefore never creates a resume position; the reader has to actually dwell in a section.

## Resume card behavior

- Rendered only when a valid `lastSectionId` exists on mount (snapshot taken once, so the card doesn't shuffle while reading).
- If that chapter is already marked complete, the card offers the next incomplete chapter instead and labels it "Next up".
- If every chapter is complete, the card shows a short "You've completed the guide" state with a link to create the plan.
- Clicking scrolls smoothly to the section.

## Accessibility

- Each checkbox is a shadcn `Checkbox` with `aria-label="Mark <chapter title> as complete"` and an id prefixed per TOC instance to avoid duplicate ids across the three TOCs.
- The checkbox sits outside the navigation link/button so click targets never overlap; click handlers stop propagation in the rail rows where the row itself is a button.
- Tab order: checkbox, then chapter title; visible focus rings via existing `focus-visible` tokens.
- Resume action is a button with `aria-label="Continue reading: <chapter title>"`.
- Tap targets in the mobile sheet at least 44px tall.

## Edge cases covered

No progress yet; guide fully complete; manual uncheck (count and resume recompute); chapter IDs changed or removed (filtered/reset); multiple devices (independent local progress, expected with local-only storage); logout/login (progress is device-local, untouched by auth); stale/older payloads ignored and rewritten.

## Testing

- Playwright pass at 1280px and 390px: dwell in chapter 4, reload, confirm the resume card names chapter 4 and scrolls there; toggle checkboxes in all three TOCs and confirm they stay in sync and survive reload.
- Corrupt the storage key and confirm the guide still renders with no resume card.
- Keyboard-only pass through the TOC.

## Dependencies

None new — uses the existing shadcn `Checkbox`, lucide icons, and localStorage.