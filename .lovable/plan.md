

# Persist contactId Across Sessions

## Problem
If a visitor arrives with `contactId` in the URL but later navigates to checkout or intake without it (e.g., via a bookmark, direct link, or Stripe redirect), the app loses the ability to associate that visit with the GHL contact.

## Solution
Use `localStorage` to persist the contactId (and other identity params) when they first appear in the URL. On every tracked page, check URL params first, then fall back to stored values.

A custom hook `useContactIdentity` centralizes this logic.

## Implementation

### New file: `src/hooks/useContactIdentity.ts`
- On mount, reads `contactId`, `firstName`, `lastName`, `email`, `phone` from URL search params
- If `contactId` is present in URL, stores all params to `localStorage` under a key like `rbc_contact`
- If `contactId` is NOT in URL, reads from `localStorage` as fallback
- Returns `{ contactId, firstName, lastName, email, phone }` — always the best available values
- Also exposes a `buildForwardParams()` helper that returns a URLSearchParams string for link forwarding

### Modified files
- `LandingPage.tsx` — replace manual param reading with `useContactIdentity()`
- `GuidePage.tsx` — use `useContactIdentity()` for tagging and engagement tracking
- `CheckoutPage.tsx` — use `useContactIdentity()` so contactId is available even without URL params
- `IntakeSurveyPage.tsx` — same
- `OneOnOnePage.tsx` — same

### Why localStorage over cookies
- No server-side rendering, so cookies offer no advantage
- localStorage is simpler, doesn't expire per-session, and avoids cookie size/header concerns
- Persists across tabs and browser restarts until explicitly cleared
- If the visitor returns days later with no params, we still have their identity

### Edge case handling
- If a new `contactId` arrives via URL that differs from stored, the stored value is overwritten (latest wins)
- Pages that already have contactId in URL continue to work identically — localStorage is only a fallback

