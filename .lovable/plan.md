# Plan: Reorder Business Credit Cards Hero CTA

## Goal
On `/business-credit-cards-for-realtors`, make the "Read the Free Guide" button feel like it sits directly on top of / leads into the "Updated for 2026 • 5-Min Read" trust badge in the hero header.

## Current State
- `src/pages/BusinessCreditCardsForRealtorsPage.tsx` hero section (lines ~260-298) renders:
  1. Eyebrow label
  2. H1 headline
  3. Subheadline paragraph
  4. "Read the Free Guide" button
  5. "Updated for 2026 • 5-Min Read" badge
- The button and badge are already in that vertical order, but the subheadline creates visual separation and the badge uses `justify-center` while the button is left-aligned.

## Changes
1. **Group the CTA and badge** into a single flex column container directly after the subheadline.
2. **Move the button immediately above the badge** with consistent horizontal alignment (center on all viewports to match the badge).
3. **Reduce vertical spacing** between the button and badge (`mt-2` on badge instead of `mt-4`) so they read as one action block.
4. **Preserve all existing styles, copy, and icons**; no changes to the rest of the page.
5. **Verify responsive behavior** (desktop, tablet, mobile) in the preview.

## Files to Edit
- `src/pages/BusinessCreditCardsForRealtorsPage.tsx`

## Acceptance Criteria
- "Read the Free Guide" button appears directly above the "Updated for 2026 • 5-Min Read" badge.
- Both elements are horizontally aligned (centered).
- Spacing between them is tight and cohesive.
- No other hero content or page behavior changes.
