# Increase spacing inside the `/dashboard/program` card

## Current state

`src/pages/dashboard/ProgramSection.tsx` wraps the card body with `CardContent className="p-5 space-y-5"` (line 45). Inside, the title row, description paragraph, and CTA button are separated by the `space-y-5` gap (20px). The user wants 16–24px of breathing room between these elements, so the current 20px is at the bottom of that range and still feels tight.

## Plan

1. Open `src/pages/dashboard/ProgramSection.tsx`.
2. Change the `CardContent` on line 45 from `p-5 space-y-5` to `p-6 space-y-6`.
   - This adds more internal padding and increases the gap between the title, description, and CTA to 24px, squarely in the requested 16–24px range.
3. Run `tsgo` to confirm the change does not break types.
4. Capture an authenticated screenshot of `/dashboard/program` using the session-injected helper so the change is visible without redirecting to `/login`.

## Files changed

- `src/pages/dashboard/ProgramSection.tsx`

## Notes

- The change is purely presentational; no data or auth logic is affected.
- The spacing will apply to both the enrolled (platform launch) and non-enrolled ("See cohort options") states because they share the same `CardContent` wrapper.
