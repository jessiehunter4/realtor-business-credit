# Dashboard Sidebar UX Refinement

Refine the dashboard sidebar navigation in `src/pages/dashboard/DashboardLayout.tsx` (and the shadcn sidebar primitives in `src/components/ui/sidebar.tsx` where needed) to improve readability, visual hierarchy, and usability without changing routes, auth, permissions, or dashboard functionality.

## What we change

1. **Enlarge sidebar labels**
   - Increase menu label font size from `text-sm` to `text-base` (16px) in expanded state.
   - Keep labels single-line; ensure the expanded sidebar width still accommodates the longest label ("Credit Roadmap") without wrapping.

2. **Resize and align icons**
   - Increase icon size from `h-4 w-4` to `h-5 w-5` (20px).
   - Maintain vertical centering with labels; keep a comfortable `gap-3` between icon and text.

3. **Add breathing room**
   - Increase vertical padding on each `SidebarMenuButton` so each item is at least `h-11` (44px) for an adequate click/tap target.
   - Increase `gap` between menu items slightly (`gap-1.5`).
   - Keep overall sidebar compact; do not widen beyond what the content requires.

4. **Improve active state**
   - Replace the subtle `bg-muted` active treatment with a stronger but calm highlight: `bg-primary/10` background, `text-primary` foreground, and a `border-l-4 border-primary` left accent.
   - Ensure active icon inherits `text-primary`.
   - Confirm active state follows the current route via `NavLink` `isActive`.
   - Keep hover state distinct (`hover:bg-sidebar-accent`) so active and hover do not clash.

5. **Clean up section headers**
   - Style the existing "Your plan" `SidebarGroupLabel` with:
     - Slightly larger text (`text-xs` → `text-sm`)
     - Uppercase tracking (`uppercase tracking-wider`)
     - More spacing above the group (`mt-2`) and below the label (`mb-2`)
     - Softer, de-emphasized color (`text-sidebar-foreground/60`)
   - Do not rename navigation items.

6. **Responsive behavior**
   - Preserve existing `collapsible="icon"` behavior on desktop.
   - Preserve mobile Sheet behavior.
   - In collapsed state, keep icon-only layout centered and tooltips readable.
   - Verify no horizontal overflow or truncation at tablet/desktop widths.

7. **Accessibility**
   - Maintain keyboard focus rings (`focus-visible:ring-2 focus-visible:ring-sidebar-ring`).
   - Keep `aria-current="page"` behavior from `NavLink`.
   - Ensure minimum 44x44px tap targets on mobile.
   - Preserve screen-reader-only toggle label and tooltip content.

## Files to modify

- `src/pages/dashboard/DashboardLayout.tsx` — NavLink className, icon sizing, group label override.
- `src/components/ui/sidebar.tsx` — adjust `SidebarMenuButton` CVA defaults (size, padding, gap) and `SidebarGroupLabel` styling if the override in DashboardLayout is insufficient.

## Verification

- Build the project and confirm no TypeScript/Tailwind errors.
- Visually inspect desktop expanded, desktop collapsed (icon rail), and mobile Sheet views.
- Tab through sidebar items to confirm focus rings and active route highlighting.
