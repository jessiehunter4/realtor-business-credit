# Dashboard: Preference Feedback & Roadmap State Clarity

Two focused polish passes on existing dashboard components. No routing, auth, data model, or save logic changes.

## 1. Notification preference feedback

File: `src/components/dashboard/MessagePreferencesCard.tsx`

Today both toggles show the same generic "Preferences updated." message, and a rapid double-click can fire two toasts.

- Replace the generic message with state-specific copy, shown only after the save succeeds:
  - Email on: "Email preferences saved" / off: "Email updates turned off"
  - Text on: "Text update preferences saved" / off: "Text updates turned off"
- Keep the existing error toast path (no success toast when the update errors).
- Prevent duplicate toasts: ignore a toggle for a field that is already saving, and give each toast a stable id per field so a repeat replaces rather than stacks.
- Accessibility: keep the switches labelled, add `aria-busy` while saving, and keep the "Saving…" line as a polite live region so screen readers hear the state change.

Existing consent fields, timestamps, and database update payloads stay exactly as they are.

## 2. Roadmap visual state clarity

Files: `src/components/dashboard/RoadmapTaskRow.tsx` (primary), light touch on `src/components/dashboard/RoadmapChecklist.tsx`.

The four existing states (completed, in_progress, not_started, blocked/locked) currently look very similar — a small icon change and a faint background. Using only these existing states:

- Completed: keep the check icon and strikethrough, soften the row (muted surface, primary-tinted check) so finished work recedes.
- Current / in progress: strongest treatment — primary border, tinted surface, a subtle ring, an "In progress" badge, and the action button promoted to the solid primary button so the next action is unmistakable.
- Upcoming / not started: neutral card surface, muted icon and secondary-styled actions; readable but clearly quieter than the current step.
- Locked (blocked): muted surface, lock icon, reduced emphasis, and the existing "Unlocks after…" line kept visible; the action buttons stay hidden as they are now.
- The single highest-priority task (the one already surfaced by `pickPriorityTask`) gets an additional "Next up" marker in the list so the roadmap page and the Overview priority card agree.

Ordering, phase grouping, task content, and all completion logic are untouched — this is styling plus one badge derived from existing data.

## 3. Responsive and accessibility

- Touch targets on all row buttons stay at least 40px tall; buttons wrap rather than overflow on mobile.
- State is never communicated by colour alone: each state keeps its icon and a text label/badge.
- Visible focus rings preserved on every interactive element; contrast checked against existing navy/green tokens.

## Technical notes

- All colours come from existing semantic tokens (`primary`, `muted`, `border`, `secondary`) — no hardcoded hex or `text-white`/`bg-black` utilities.
- Toast copy uses the existing `sonner` `toast` import already present in the card.
- No new components, no changes to `useRoadmap`, `deriveRoadmap`, or the `plan_task_progress` writes.
