# Editable Goals & Milestones + Plan Regeneration

Right now the dashboard can only check items off. Your plan's goals, 90-day actions, milestones and funding items are read-only text pulled from the generated plan, and a signed-in user has no way to re-run plan generation from the dashboard.

## What gets added

### 1. Edit any plan item
- Each goal, 90-day action, milestone and funding item gets an "Edit" control that turns the title (and detail/meta such as horizon or target month) into an inline editable field.
- Edits are personal overrides layered on top of the generated plan — the original text is kept, and each edited item shows a small "edited" marker with a "Revert to original" option.

### 2. Add your own goals and milestones
- "Add a goal" on My Goals, "Add a step" on the 90-Day Plan (with a 30/60/90 window picker), and "Add a milestone" on the 6–12 Month roadmap (with a target-month field).
- Custom items behave exactly like generated ones: status tracking, notes, progress counts, help bubbles.
- Custom items can be deleted; generated items can be dismissed (hidden) rather than deleted, so a regeneration can bring them back.

### 3. Regenerate the plan
- A "Regenerate plan" action in the dashboard (Overview header, and a link on the empty-plan notice) re-runs plan generation from the latest Needs Analysis answers.
- Confirmation dialog explains what happens: generated wording is refreshed; your custom items, edits and completion status are preserved and re-attached where the item still exists.
- Also surfaces "last generated" and "last modified" dates so it's clear when a refresh is worthwhile.
- Items that disappear from the new generated plan are kept in an "Archived from a previous plan" collapsible group rather than silently vanishing.

## Technical notes

- **Storage, no schema change.** `plan_task_progress` already stores arbitrary `task_key` / `phase` / `source` values. Extend `src/lib/planItems.ts` with two new key shapes alongside the existing `plan:{group}:{i}` and `plan:{group}note:{i}`:
  - `plan:{group}edit:{i}` — `task_label` holds the JSON override (`title`, `detail`, `meta`, `hidden`) for a generated item.
  - `plan:{group}custom:{uuid}` — `task_label` holds the JSON for a user-created item.
  `derivePlanItems` merges generated items + overrides + custom items into one ordered list, so every existing section page and progress calculation picks them up unchanged.
- **Hook work.** `usePlanItems` gains `updateItem`, `addItem`, `removeItem`, `revertItem` with optimistic state and the same toast/rollback pattern as `setStatus`.
- **UI.** `PlanItemRow` gains an optional edit mode (title + optional meta fields) and an overflow menu (Edit / Revert / Delete). New small `AddPlanItemForm` component reused by the goals, 90-day and milestone sections.
- **Regeneration backend.** `supabase/functions/generate-plan/index.ts` currently rejects a signed-in non-admin without an `intake_token` (401). Add an owner path: if the JWT's user matches `intake_surveys.user_id` (or `custom_plans.user_id`) for that survey, allow generation. Add a `force: true` flag from the dashboard that bypasses the 60-second idempotency short-circuit, and keep the existing supersede/archive behaviour.
- **Progress carry-over.** Because keys are index-based, regeneration is followed by a client-side reconciliation pass that matches old and new generated items by normalized title and rewrites `task_key` for changed indexes; unmatched old rows are flagged `phase: "{group}archived"` and rendered in the archived group. Custom and edit rows are untouched.
- **Frontend regenerate flow.** Reuse `usePlanGeneration` from the dashboard (`source: "user"`, no token, `force`), show the existing loader, then refetch dashboard data.

## 4. Print / download the updated plan

- A "Download PDF" and "Print" action lives next to "Regenerate plan" in the dashboard, and on each plan section, so the current plan — including your edits, custom goals and milestones, and completion status — can be printed after a regeneration.
- The export always reflects the live plan, not the originally generated wording: edited titles, added items, hidden items, and checked-off status are all included, with a "Last generated" / "Last modified" line on the cover.

### Technical notes

- Reuse the existing `src/components/plan/PlanPDF.tsx` (`@react-pdf/renderer`, `size="LETTER"` = 8.5 x 11) rather than browser print-to-PDF, so pagination is deterministic.
- Feed it a merged plan object built from `derivePlanItems` output (generated + overrides + custom items) instead of raw `plan_data`, so the PDF and dashboard never disagree.
- Formatting rules applied in the PDF styles:
  - 0.75in margins on all `Page` elements; cover page stays its own page.
  - Each major section (Goals, 90-Day Plan, Roadmap, Funding, Program Options) starts on a new page via a dedicated `<Page>`, with the 90-day plan sub-grouped by 30/60/90 window headers that use `wrap={false}` blocks so a window's header never orphans from its first item.
  - Item rows are `wrap={false}` so a single goal/action never splits across a page break; long notes wrap normally.
  - Repeating footer with page number (`render={({ pageNumber, totalPages })}`) and a fixed header band after the cover.
  - Status shown as a printable marker (Done / In progress / Not started) rather than color alone.
- Table of contents page numbers stay a manually synced array, per the existing PDF convention in this project.
- QA: render the PDF for a sample plan with custom items, convert pages to images, and check for clipped text, orphaned headers, and correct section breaks before shipping.
