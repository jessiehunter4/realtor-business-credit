

# Move Calendar Embed to /one-on-one and Update Booking Links

## Overview
Move the EveryCatch calendar widget from `/booking-confirmed` to `/one-on-one` (just below the hero), update all "Book" CTAs to scroll/link to the embedded calendar on `/one-on-one`, and strip the calendar from `/booking-confirmed` without deleting the page.

## Changes

### 1. `src/pages/OneOnOnePage.tsx` -- Add calendar embed + post-booking content

- Add the `useEffect` hook to load the EveryCatch `form_embed.js` script (moved from BookingConfirmedPage)
- Add `useSearchParams` to capture `email`/`token` query params for the intake link
- Insert a new **Calendar Embed section** immediately after the hero, containing the iframe in a Card (same markup as BookingConfirmedPage currently has)
- Add the **"What Happens Next"** steps section (from BookingConfirmedPage) below the calendar
- Add the **"Why Complete the Intake First?"** section (from BookingConfirmedPage) after the steps
- Change the two existing CTA buttons (hero + bottom) from `<a href={BOOKING_URL} target="_blank">` to anchor-scroll links (e.g., `<a href="#book">`) that smooth-scroll to the calendar embed section, keeping users on-page
- Add `id="book"` to the calendar section so anchor links work

### 2. `src/pages/BookingConfirmedPage.tsx` -- Remove calendar, keep the rest

- Remove the `useEffect` script loader
- Remove the Calendar Embed section (the iframe Card)
- Remove the `EMBED_SCRIPT_URL` and `IFRAME_SRC` constants
- Keep the hero, "What Happens Next" steps, "Why Complete the Intake" section, and footer CTAs intact so the page still functions as a post-booking reference if needed
- Update the hero headline/subheadline to reflect it's now a confirmation/next-steps page (e.g., "Your Session Is Booked -- Here's What to Do Next")
- Update step 1 text from "Pick a Time" to "Session Booked" (or similar confirmation language)

### 3. `src/components/landing/CTASection.tsx` -- Already links to `/one-on-one`, no change needed

### 4. `src/components/landing/HeroSection.tsx` -- Already links to `/one-on-one`, no change needed

### 5. `src/components/guide/GuideConclusion.tsx` -- Fix stale link
- Change `Link to="/get_started"` to `Link to="/one-on-one"` (line 118)

### 6. No route changes -- both `/one-on-one` and `/booking-confirmed` remain in `App.tsx`

## Technical Notes
- The EveryCatch script loader `useEffect` is idempotent (checks if script already exists before appending), so it works safely on the new page.
- The calendar iframe ID stays the same (`Xt32XcNcmKgm7vaJaR9o_booking`).
- Smooth-scroll to `#book` uses standard browser anchor behavior; no extra library needed.
- Query params (`email`, `token`) on `/one-on-one` will be forwarded to the intake survey link, same as BookingConfirmedPage does today.

