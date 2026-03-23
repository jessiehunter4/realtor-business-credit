

## Problem

The intake survey page (`/intake`) **only works with a pre-generated admin token**. When a visitor clicks "Start the Intake Survey" from the one-on-one page without a token, they hit the "Survey Not Found" dead end. This breaks the self-service funnel.

## Solution

Add a **direct-access mode** to the intake survey so it works both ways:
- **With token**: existing behavior (loads pre-created survey)
- **Without token**: shows a blank form with name/email fields at the top, creates a new survey record on submit

### Changes

**1. Edge function (`supabase/functions/intake-survey/index.ts`)**

Add a new `POST` path that does NOT require admin auth -- a "public submit" endpoint. When called without a token:
- Accepts the full form payload plus `contact_name` and `contact_email`
- Inserts a new `intake_surveys` row with `filled_by: 'self'` and `status: 'submitted'`
- Returns the new record ID
- Protected from abuse by requiring at minimum a non-empty `contact_email`

This is a separate route from the existing admin POST (which creates blank surveys with tokens). The distinction: admin POST requires auth header; public POST uses a different path indicator (e.g., query param `?mode=direct` or a distinct request body shape).

**2. Intake survey page (`src/pages/IntakeSurveyPage.tsx`)**

- When no `token` is present, instead of showing "Survey Not Found", show the full survey form in "direct mode"
- Add `contact_name` and `contact_email` input fields to Step 1 (required)
- On submit, POST to the edge function's public endpoint instead of PUT-by-token
- Save Draft is disabled in direct mode (no token to reference)
- Pre-populate `contact_email` from the `useContactIdentity` hook if available

**3. One-on-one page link (`src/pages/OneOnOnePage.tsx`)**

- The intake link already falls back to `/intake` without params when no token/email exists -- no change needed here, it will just work once the intake page supports direct mode.

### What stays the same
- Token-based flow remains fully intact
- Admin can still generate tokens and send personalized links
- All tracking (funnel events, GHL tagging) continues to fire
- RLS policies unchanged -- edge function uses service role for inserts

