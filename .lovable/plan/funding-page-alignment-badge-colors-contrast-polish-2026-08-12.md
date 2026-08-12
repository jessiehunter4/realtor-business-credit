# Funding Page — Alignment, Badge Colors & Contrast Polish

All changes are contained in `src/pages/dashboard/FundingSection.tsx`. No data, state, route, or layout-structure changes.

## 1. Status badge reflects the selected status
Today the badge is hard-coded to `variant="default"` so every card shows the same green pill. Replace it with a small status → style map:

- Obtained: solid success green (`bg-success-green text-success-green-foreground`)
- Exploring: primary/teal fill (`bg-primary text-primary-foreground`)
- Not yet: neutral outline (`border-border bg-muted text-muted-foreground`)

Add `aria-label={"Status: " + STATUS_LABEL[f.status]}` so screen readers announce the state.

## 2. Card grid alignment
- Keep `grid gap-3 sm:grid-cols-2`, add `items-stretch` and make each `Card` `h-full flex flex-col` so an odd last card (Business Term Loan) is the same width and top-aligned rather than shrink-wrapped.
- Push the status button row to the bottom with `mt-auto` on the button group so all cards' controls line up on the same baseline.

## 3. Text contrast
- Card description: `text-muted-foreground` → `text-secondary/80` (darker, still below the title in hierarchy).
- Bottom disclaimer: `text-muted-foreground` → `text-secondary/70`.

## 4. Badge position
Change the header row from `justify-center ... flex-wrap` to a two-column row: title + help icon on the left (`flex-1 min-w-0`, left-aligned text), badge pinned right with `shrink-0` and `self-start`. This keeps the badge top-right and vertically aligned with the first line of the title regardless of title length, with a consistent `gap-2` from the info icon.

## 5. Status button group
- Wrap the three buttons in `grid grid-cols-3 gap-2` so spacing is equal and widths are consistent.
- Active button: solid fill matching that status' badge color (green for Obtained, primary for Exploring, neutral-solid for Not yet).
- Inactive: `variant="outline"` with `hover:bg-muted` and default focus ring retained.
- Buttons get `h-9 text-xs font-medium rounded-full w-full`, and `aria-pressed={f.status === s}` for screen readers.

## 6. Verification
Typecheck, then screenshot `/dashboard/funding` at desktop, tablet, and mobile widths to confirm grid balance, badge alignment, and readable contrast.

## Acceptance
- Badge color changes per status and always matches the selected button.
- Term Loan card aligns with the grid; equal widths and spacing.
- Description and disclaimer text are darker and readable.
- Status controls evenly spaced with clear active/inactive/focus states.
- No change to how statuses are stored or updated.
