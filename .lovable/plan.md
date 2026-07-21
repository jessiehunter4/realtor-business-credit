## Add Original Draft Date & Last Modified Date to the Customized Plan

### Data source
Use existing `custom_plans` columns — no schema changes needed:
- **Original Draft Date** → `created_at` (set once at row creation, never changes)
- **Last Modified Date** → `updated_at` (already auto-bumped on every save/publish via existing triggers/update calls)

Both fields are already returned by the current `select("*")` in `AdminPlanView` and will be added to the `select` in `PortalPlanView`.

### UI changes

**1. `src/components/plan/PlanDocument.tsx`**
- Extend props to accept optional `createdAt?: string` and `updatedAt?: string`.
- In the header's right-side "Prepared for" block, add two small metadata lines under the location/license line:
  - `Drafted: Mon DD, YYYY`
  - `Last updated: Mon DD, YYYY` (only rendered when it differs from the draft date by more than a minute, to avoid redundant "same day" noise on brand-new plans)
- Use existing header typography (`text-white/50 text-[10px] font-sans`) so it blends with the current design.
- Guard against missing values — render nothing if a date is absent or invalid.

**2. `src/components/plan/PlanPDF.tsx`**
- Mirror the same two lines in the PDF cover header block using the existing small-caption style so the printed/downloaded PDF stays in parity with the web view.

**3. `src/pages/AdminPlanView.tsx`**
- Pass `plan.created_at` and `plan.updated_at` into `<PlanDocument />`.
- No other changes — the existing `.update({ plan_data })` call already bumps `updated_at`.

**4. `src/pages/PortalPlanView.tsx`**
- Expand the select to `select("plan_data, status, created_at, updated_at")`.
- Store the two timestamps in state and pass them into both `<PlanDocument />` and `<PlanPDF />` (so the client's downloaded PDF also shows them).

**5. `src/pages/SamplePlanPage.tsx`** (small consistency touch)
- Pass hardcoded illustrative dates (e.g. drafted a week ago, updated yesterday) so the sample preview visually matches the real plan layout.

### Formatting
Single shared helper (inline or in `src/lib/utils.ts`) that returns `"Mon DD, YYYY"` via `Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" })`. Used by both the web component and the PDF for consistency.

### Out of scope
- No migration, no new columns, no trigger changes — `updated_at` bumping already works via existing update paths.
- No changes to intake, generation edge function, or checklist.

### QA checklist
- Draft a new plan → header shows "Drafted: <today>", no "Last updated" line (same-day new draft).
- Edit + save in `AdminPlanView` → "Last updated" appears with new timestamp; "Drafted" unchanged.
- Publish → dates carry into the portal view and the downloaded PDF.
- Sample plan page renders the two lines with illustrative dates.
- Mobile: header remains readable; long dates don't wrap awkwardly.
