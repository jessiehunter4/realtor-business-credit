# Fix Business Credit Cards Menu Link Visibility

## Current state
The **Business Credit Cards** link lives in `secondaryLinks` in `SiteHeader.tsx`. It is rendered inside the mobile Sheet menu but is missing from the desktop top navigation bar. This makes it visible only on mobile/small screens.

## Goal
Make the Business Credit Cards navigation item visible on all screen sizes while preserving the existing responsive layout.

## Plan
1. Update `src/components/shared/SiteHeader.tsx`:
   - Move `{ to: "/business-credit-cards-for-realtors", label: "Business Credit Cards" }` from `secondaryLinks` into `navLinks` (the primary navigation array).
   - Keep the link in `secondaryLinks` if it is also needed for mobile ordering, or remove duplication and ensure the mobile menu still renders it.
   - Ensure styling remains consistent with other primary nav items.

2. Verify the result across viewports:
   - Desktop: the link appears between the other primary nav items.
   - Mobile: the link continues to appear in the Sheet menu.

## Files to change
- `src/components/shared/SiteHeader.tsx`

## Risk / note
This is a presentation-only change. No routing, auth, or business logic is affected.
