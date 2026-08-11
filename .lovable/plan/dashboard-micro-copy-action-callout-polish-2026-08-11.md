# Dashboard Micro-Copy & Action Callout Polish

Three small, contained improvements to the existing dashboard. No layout redesign, no new backend, no auth changes.

## 1. Effort as a pill/chip

In the "Your next step" card, `Est. effort: {task.effort}` currently renders as plain inline text with a clock icon. It becomes a compact rounded chip (muted surface, subtle border, small clock icon, vertically centered) in the same spot. The value stays dynamic from roadmap data. The same chip treatment is reused where effort already appears in roadmap task rows so both views stay consistent.

## 2. Direct action CTAs inside "Your next step"

Roadmap tasks already support one optional action link (`actionHref` / `actionLabel`), used today only for "read the guide" and "see coaching options". Add an optional list of per-task quick actions so a step can offer the obvious real-world destinations, rendered as small outline buttons under the "Do this:" line.

Tasks that get them:

- Set up bookkeeping software: Connect QuickBooks, Connect Xero, Connect Wave
- Register for a D-U-N-S Number: Start D-U-N-S registration
- Business phone listed in directories: Open Google Business Profile
- Open Experian Business / Equifax profile: Open the bureau profile page

These point to the official external destinations (new tab, `rel="noopener noreferrer"`, with a screen-reader "opens in a new tab" label). No integration backend is invented and no OAuth is added. Tasks with no meaningful action stay exactly as they are — nothing extra renders.

## 3. Header cleanup

The dashboard currently shows two session controls: a "Log out" pill in the dashboard sub-header bar, and a "Sign out" button in the site header above it.

- Remove the standalone "Log out" button from the dashboard sub-header bar.
- Remove the standalone "Sign out" button from the desktop site header and replace it with an avatar button that opens a menu containing: Dashboard (or Admin), and Log out.
- Keep the "Welcome video" button in the dashboard bar unchanged.
- The mobile sheet menu keeps its existing sign-out item (it is a menu, not a redundant header button).
- Logout still calls the same `signOutAndClear` helper — no change to session or auth behavior.

Result: `[ Welcome video ] [ Avatar ▼ ]`.

## Accessibility and responsiveness

Chip and buttons use existing design tokens for contrast; icons get `aria-hidden` with adjacent text or an `aria-label`; the avatar trigger is a real button with an accessible name and visible focus ring; touch targets stay at or above current sizes; extra CTA buttons wrap on narrow screens.

## Technical notes

- `src/components/dashboard/PriorityTaskCard.tsx` — effort chip, quick-action buttons.
- `src/components/dashboard/RoadmapTaskRow.tsx` — reuse the effort chip (visual only).
- `src/lib/roadmap/types.ts` — add optional `quickActions?: { label: string; href: string; external?: boolean }[]` to `CatalogTask`.
- `src/lib/roadmap/taskCatalog.ts` — populate quick actions for the tasks listed above.
- `src/pages/dashboard/DashboardLayout.tsx` — drop the "Log out" button and its now-unused import/handler.
- `src/components/shared/SiteHeader.tsx` — swap desktop "Sign out" for an avatar dropdown (uses existing `avatar` and `dropdown-menu` primitives).