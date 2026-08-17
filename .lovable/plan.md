# Guide "Pick Up Where You Left Off" — Cross-Device Resume

The `/guide` page already has a working resume experience, but it is **device-local only**: reading position and chapter checkmarks live in `localStorage` (`rbc_guide_progress_v1`) via `src/lib/guideProgress.ts` and `useGuideProgress`. `GuideResumeCard` already renders under the cover, and all three tables of contents already show completion checkboxes.

This plan keeps that UI and behavior exactly as-is and adds a **server-backed layer** so a signed-in reader resumes from any device, plus a small amount of context (progress count, chapter title) in the resume card.

## What changes for the reader

- Signed out: unchanged — local-only progress, same resume card, nothing new is stored server-side.
- Signed in: the position and completed chapters follow them across devices and browsers.
- On first sign-in, whatever they read anonymously on that device is merged into their account (union of completed chapters; the newer `updatedAt` wins for last position).
- The resume card gains a quiet "Chapter X of 16 · N complete" line and keeps the existing "Continue reading" button. It still hides when there is no saved position and still switches to the completion state when everything is checked.
- While the server value is still loading, the card renders from the local snapshot instead of a spinner, so nothing jumps.

## Data model

New table `public.guide_progress`, one row per user per guide (the app has two guides today: `/guide` and `/card-guide`, so key on a guide slug rather than assuming one).

```text
guide_progress
  user_id          uuid  -> auth.users.id, on delete cascade
  guide_slug       text  ('structure-credit' for /guide, 'card' for /card-guide)
  last_section_id  text  null
  completed        text[]  default '{}'
  updated_at       timestamptz default now()
  primary key (user_id, guide_slug)
```

- `last_section_id` stores the existing DOM section id (`chapter-4`, `introduction`, …). Chapter titles are resolved client-side from `guideChapters.ts`, so a renamed or deleted chapter simply filters out and the card falls back to the next incomplete chapter, exactly as the current local reader does.
- Migration includes GRANTs (`select/insert/update/delete` to `authenticated`, `all` to `service_role`, no `anon`), RLS enabled, and four policies all scoped to `auth.uid() = user_id`.
- No new table is needed for manual bookmarks — see below.

## Manual bookmark: recommendation

Skip it. The guide is a single long scrolling page with three TOCs that already carry per-chapter checkboxes; an extra "save my place" control would duplicate the automatic position and force us to explain two similar concepts. The automatic last-read position plus the manual completion checkboxes already cover both "where was I" and "what have I finished." (If it is wanted later, it is one nullable `bookmark_section_id` column on the same table.)

## Technical approach

Phase 1 — storage abstraction (no behavior change)
- `src/lib/guideProgress.ts`: parameterize by guide slug, keep the existing key for `/guide` so no one loses local progress. Keep every function non-throwing.

Phase 2 — remote sync
- New `src/lib/guideProgressRemote.ts`: `fetchRemoteProgress(slug)`, `upsertRemoteProgress(slug, payload)` using `supabase.from("guide_progress")`. All failures are swallowed and logged; the local store stays authoritative for rendering.
- `src/hooks/useGuideProgress.ts`: on mount, read local immediately (instant render), then if `useAuthRole().session` exists fetch the remote row and merge (union of `completed`; last position from the newer `updated_at`). Write the merged value back to both local and remote once. Expose `syncing` for optional UI.
- Writes: every `toggle` upserts immediately (cheap, user-initiated). Position writes reuse the existing 1.5s dwell debounce in `useGuideReadingPosition` and additionally coalesce to at most one network write per ~10s, plus a final `flush` on `visibilitychange`/`pagehide` using `fetch(..., { keepalive: true })` as the codebase already does for analytics. Only a section id that is actually in `tocItems` is ever written, so chapter jumps cannot store a bogus value.

Phase 3 — auth transition
- Subscribe to the existing `AuthRoleProvider` session. On sign-in (`session` goes null → set), run the merge once for that user id. On sign-out, `signOut.ts` already clears visitor localStorage; the remote row is untouched and rehydrates on next login. No second auth/session system is introduced.

Phase 4 — resume UI
- `GuideResumeCard.tsx`: same layout, plus a progress line and a `min-h` on the card so the local→remote swap does not shift content. Keeps `aria-label="Continue reading: <chapter>"`, the 44px tap target, and moves focus to the target section heading (`tabIndex={-1}` + `focus()`) after the smooth scroll so keyboard users land in the right place. Existing `scroll-margin-top` handles the sticky header.
- No routing change: `/guide` and `/guide/:slug` both render `GuidePage`, and resume is an in-page scroll to an existing anchor.

Phase 5 — analytics (reuse `postFunnelEvent`, no new system)
- `guide_resume_shown` (once per page view), `guide_resume_clicked` (with target section), `guide_completed` (when the last chapter is checked). Deliberately **not** tracking every position update — that would flood `funnel_events`.

## Files affected

- New: `supabase/migrations/<ts>_guide_progress.sql`, `src/lib/guideProgressRemote.ts`
- Modified: `src/lib/guideProgress.ts`, `src/hooks/useGuideProgress.ts`, `src/components/guide/GuideResumeCard.tsx`, `src/pages/GuidePage.tsx` (analytics hooks only)
- Unchanged: `GuideTOC`, `GuideFloatingTOC`, `GuideChapterRail`, `ChapterCheckbox` — they consume the hook and get sync for free.

## Risks

- Merge conflicts across devices: resolved by union + newest-timestamp; worst case a reader gets a slightly older position on one device.
- Write chattiness: bounded by dwell debounce + 10s coalescing + one flush on unload.
- Losing existing local progress: avoided by keeping the current storage key and merging rather than overwriting.
- RLS/GRANT omission would silently break saving; the migration includes both and the guide degrades to local-only if either is wrong.

## Testing

Playwright at 1280px and 390px plus manual checks:
- New user, no saved position → no card rendered.
- Dwell in chapter 4, reload → card names chapter 4 and scrolls there.
- Sign in on device A, read, sign in on device B → position and checkmarks carry over.
- Anonymous reading then sign-up → local progress merged, nothing lost.
- Log out → local cleared, no card; log back in → restored from server.
- Continue Reading click, chapter navigation, page refresh, completed guide (completion state), invalid/removed section id (filtered, falls back).
- Network offline / forced 500 on the progress table → guide renders and reads normally, no error toast.
- Keyboard-only pass: tab to Continue Reading, activate, confirm focus lands on the chapter heading.
- Both guides tracked independently under their own slug.
