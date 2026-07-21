# Restructure Funnel Analytics Dashboard

Refactor the existing **Funnel Analytics** tab in `src/pages/AdminDashboard.tsx` so stages flow in true customer-lifecycle order and terminate in **Sales**. No new dashboard is created — the existing tab, data source (`funnel_events`), date range, and host filters are preserved.

## New funnel order

Stages, in display order, mapped to existing `event_type` values in `funnel_events` (nothing new needs to be tracked to ship this):

1. **Visitors** — `site_visit`
2. **Leads Captured** — `guide_view` (first identified touch after arrival)
3. **Qualified Leads** — `guide_read_50` (meaningful engagement threshold)
4. **Guide Completed** — `guide_read_100`
5. **Consultation Page Visit** — `one_on_one_visited`
6. **Bookings Confirmed** — `booking_confirmed`
7. **Intake Submitted** — `intake_submitted` (attended-ready signal)
8. **Checkout Reached** — `checkout_visited`
9. **Sales** *(final conversion)* — `checkout_clicked` today, with a TODO to swap to a future `purchase_completed` event once Stripe webhooks write it. `checkout_clicked` is the closest existing proxy for a completed sale.

`FUNNEL_ORDER`, `FUNNEL_LABELS`, and `BAR_COLORS` in `AdminDashboard.tsx` are updated to match this list. The final Sales bar uses a distinct accent color so it stands out from upstream stages.

## Per-stage metrics

Each stage row/card shows:

- Total count for the selected date range and host
- Conversion rate from the previous stage (`count / prevCount`)
- Drop-off percentage from the previous stage (`1 - conversionRate`)
- Overall funnel progression (`count / visitors`) so Sales-vs-Visitors is always visible

## Dashboard layout changes

Inside the existing **Funnel Analytics** `TabsContent`, replace the current single bar chart + conversion-rate grid with:

1. **Headline strip** — four KPI cards: Visitors, Leads Captured, Bookings Confirmed, Sales (with overall Visitor→Sales rate under Sales).
2. **Funnel Progression chart** — reuse the existing recharts `BarChart`, reordered, with the Sales bar highlighted. Keep the responsive container and tooltip styling already in place.
3. **Stage-by-stage table** — one row per stage showing Count, Conv. from prev, Drop-off, % of Visitors. Replaces the loose "Conversion Rates" card grid so the story reads top-to-bottom.
4. **Sales summary card** — total Sales count and overall Visitor→Sales rate. A revenue tile is rendered as "Not tracked yet" placeholder text (see technical notes) so the layout is ready when revenue lands.
5. **Recent Events** table is kept as-is at the bottom.

Existing date range buttons (7d / 30d / 90d / all) and host filter stay above the funnel and continue to drive `fetchFunnelData`. Period-over-period comparison is out of scope for this pass — the current queries don't fetch a comparison window, and the request marks it "if existing analytics support it."

## UX and responsiveness

- One-column stack on mobile; two-column KPI grid on `md`; four-column on `lg` — matches the existing card grids on this page.
- Stage table uses the same `overflow-x-auto` wrapper used by Recent Events so it scrolls cleanly on narrow screens.
- Typography, spacing, and card styling reuse the existing `Card` / `CardHeader` / `CardContent` primitives already used in this file.
- Sales row/bar/KPI uses a single accent (e.g. `hsl(var(--primary))`) consistently across chart, table, and KPI.

## Technical notes

- File touched: `src/pages/AdminDashboard.tsx` only. `SeoFunnelTab.tsx` (separate SEO funnel) is untouched.
- `fetchFunnelData` keeps its current query shape; only the derived `FUNNEL_ORDER` array and the downstream rendering change.
- Conversion math is computed in-component from `funnelData` (no new DB calls). Guard against divide-by-zero when a prior stage has 0 events.
- Sales stage TODO: add a `purchase_completed` event fired from a Stripe webhook or the checkout success page in a follow-up; swap the `event_type` constant in one place when ready.
- Revenue metrics are intentionally placeholder — there is no revenue field on `funnel_events` today and no `sales` / `orders` table. Adding one is a separate backend change and out of scope here.

## Deliverables

- Reordered funnel stages ending in Sales in `AdminDashboard.tsx`
- KPI strip, reordered bar chart, stage-by-stage conversion + drop-off table, Sales summary card
- Responsive layout across mobile, tablet, desktop
- Existing date range and host filters continue to drive all new visuals
- Manual QA: verify counts match raw `funnel_events` rows for a known date range and that conversion rates never exceed 100% or divide by zero
