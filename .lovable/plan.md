# Realtor Client Dashboard Redesign (/mock-dashboard)

UI-only refactor of `src/pages/MockDashboardPage.tsx`. Keeps mock data (no auth/backend changes), reuses the bright design system (shadow-card, pill buttons, primary/secondary tokens, `bg-hero-grad`), and stays fully responsive.

## Information Architecture

Replace the current single-scroll layout with a **sticky sub-nav (tabs)** below the welcome header. Six tabs, each rendering a section on the same page (no route changes):

```text
[ Overview | Guides | My Plan | 90-Day Plan | Goals | Purchases ]
```

Mobile: horizontal scroll tab bar (`overflow-x-auto`, snap). Desktop: centered tab row.

## Section Breakdown

### 1. Header (persistent)
- Welcome, {firstName} + eyebrow "Your success dashboard"
- Right side: Log out (existing), avatar circle with initials
- Below header: **4 KPI stat cards** (replaces current 3)
  - Fundability Score (62/100, +8)
  - Business Credit Score (mock: "Building" state with dashed ring until data)
  - 90-Day Plan Progress (x/y)
  - Next Session (Thu 2 PM PT)

### 2. Overview tab (default)
- **Next Recommended Action** hero card — big, primary-tinted, single CTA ("Register your D-U-N-S number →")
- **Current Roadmap Stage** — horizontal stepper (Foundations → Fundability → Tradelines → Cards → Funding), current step highlighted
- **Upcoming Tasks** — top 3 open tasks from 90-day plan with quick-complete
- **Recent Activity** — existing list, condensed

### 3. Guides Library tab
- Grid of guide cards (3-col desktop, 1-col mobile):
  - Business Credit Guide → `/guide` (with "Continue reading" if `guideScrollMemory` has a saved position; else "Start")
  - Business Credit Cards for Realtors → `/business-credit-cards-for-realtors`
  - Sample Plan → `/sample-plan`
- Each card: thumbnail (gradient block + icon), title, 1-line description, progress bar (mock %), badges (New / In Progress / Complete), Download PDF button where applicable.

### 4. My Plan tab
- Summary card: goals snapshot from mock intake
- **Recommendations** list (3-5 items with priority badges)
- **Financing Roadmap** — vertical timeline: 0-90d, 3-6mo, 6-12mo milestones
- Link to full plan (`/sample-plan`), Download PDF button (reuse existing pattern)

### 5. 90-Day Action Plan tab
- Interactive checklist grouped by cadence:
  - **This Week** (daily/weekly tasks)
  - **This Month** (weekly)
  - **Milestones** (monthly)
- Overall progress bar + segmented progress by group
- Reuse existing `toggleTask` logic; extend `INITIAL_TASKS` with `cadence` + `dueLabel` fields
- Empty/complete state: celebratory card ("You've cleared this week — book your next 1:1")

### 6. Goals tab
- Card grid of goal tiles (5 goals from spec):
  - Build Business Credit
  - Obtain First Business Credit Card
  - Reach Funding Eligibility
  - Improve Fundability
  - Separate Personal & Business Credit
- Each tile: icon, status pill (Not started / In progress / On track / Complete), circular progress, "Next step" line, small CTA

### 7. Purchases & Payments tab
- **Active Services** card (mock: "One-on-One Coaching — Active", renewal date)
- **Purchase History** table (Date, Product, Amount, Status, Invoice link) — 2-3 mock rows
- **Subscription** panel with remaining access period bar
- CTA to `/pricing` for upgrades

### 8. Progress Analytics (embedded on Overview + dedicated card in Goals)
- Use `recharts` (already available via shadcn chart) for:
  - Line: Tasks completed over time (weekly)
  - Radial: Funding readiness score
  - Bar: Credit-building progress by category
- Compact, 2-column on desktop, stacked on mobile

## Component Plan

New files under `src/components/dashboard/`:
- `DashboardTabs.tsx` — sticky tab bar
- `StatCard.tsx` — extracted from existing inline `StatCard`
- `NextActionCard.tsx`
- `RoadmapStepper.tsx`
- `GuideCard.tsx`
- `GoalTile.tsx`
- `ChecklistGroup.tsx`
- `PurchaseHistoryTable.tsx`
- `ProgressCharts.tsx` (recharts wrappers)

Mock data lives in `src/data/mockDashboard.ts` (new): tasks, guides, goals, purchases, activity, chart series. Keeps `MockDashboardPage.tsx` a thin composition file.

## Design Tokens & Behavior
- Colors: existing `primary`, `secondary`, `accent`, `muted-foreground`, `bg-hero-grad`, `shadow-card`. No hardcoded hex.
- Radius: `rounded-3xl` cards, `rounded-full` buttons and pills.
- Motion: subtle fade/slide on tab change (framer-motion already in stack) or CSS `transition`.
- Responsive: single-column stack < md; 2-col md; 3-col lg where relevant.
- Accessibility: tabs use shadcn `Tabs` (roving focus, aria), all interactive tiles are buttons/links.

## Out of Scope
- Real auth, real data, Supabase reads/writes (still mock per existing TODO comment).
- Route or navigation changes outside this page.
- New backend tables or edge functions.

## QA Checklist
- Renders cleanly at 360, 768, 1024, 1440 widths.
- All CTAs link to existing routes (`/guide`, `/sample-plan`, `/one-on-one`, `/pricing`, `/business-credit-cards-for-realtors`).
- Tab state preserved on scroll; sticky sub-nav doesn't overlap KPI cards.
- Task toggles persist within session (component state, as today).
- No console errors; typecheck clean.
