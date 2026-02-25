
# Booking Confirmation Page

## Overview
Create a new page at `/booking-confirmed` that embeds the EveryCatch calendar widget and provides context about the intake survey and next steps after booking.

## New File

### `src/pages/BookingConfirmedPage.tsx`
A public page with these sections:

1. **Hero / Confirmation Header** -- Dark navy background with green accent, headline: "Book Your Free One-on-One Business Credit Session", subheadline explaining the 30-45 minute strategy session.

2. **Embedded Calendar Widget** -- The EveryCatch booking iframe embedded using `dangerouslySetInnerHTML` or a dedicated `useEffect` to load the external script (`https://link.everycatch.com/js/form_embed.js`) and render the iframe (`Xt32XcNcmKgm7vaJaR9o`). The iframe will be placed in a clean card container.

3. **What Happens Next** -- A numbered list explaining:
   - Step 1: Pick a time on the calendar above
   - Step 2: Complete the Realtor Business Financial Needs Analysis (with a direct link to `/intake`)
   - Step 3: Optionally take the Fundability Scan (link to `mybetterbusinesscredit.fundabilityscan.com`)
   - Step 4: Show up to your session -- Jessie will review your intake and scan results

4. **Why Complete the Intake First** -- Brief explanation that completing the intake survey before the call ensures a more productive, personalized session.

5. **Footer CTA** -- Links back to the guide (`/guide`) and one-on-one info page (`/one-on-one`).

## Modified File

### `src/App.tsx`
- Import `BookingConfirmedPage`
- Add route: `<Route path="/booking-confirmed" element={<BookingConfirmedPage />} />`

## Technical Notes

- The EveryCatch embed requires loading an external script. The component will use a `useEffect` hook to dynamically append the `form_embed.js` script tag to the document head (if not already present) so the iframe widget initializes correctly within the React SPA.
- The iframe src and script URL are hardcoded since they come directly from EveryCatch and are specific to this calendar.
- The page is public (no auth required) -- it's the destination for booking CTAs across the site.
- Query parameters like `?email=` or `?token=` from the URL will be read and passed as a pre-filled link to the intake survey (e.g., `/intake?email=...`) so the agent doesn't have to re-enter their info.
