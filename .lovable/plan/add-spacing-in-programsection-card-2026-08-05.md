# Add spacing in ProgramSection card

## Goal
Increase vertical breathing room between the title ("Credit Suite / Lendavo platforms"), the descriptive paragraph, and the "See cohort options" CTA button in the dashboard's Program section.

## Current state
In `src/pages/dashboard/ProgramSection.tsx`, the card content wrapper at line 45 uses:

```tsx
<CardContent className="p-5 space-y-3">
```

This applies a 0.75rem (12px) gap between the title, description, and CTA, making the elements feel compressed.

## Proposed change
Increase the shared vertical stack gap from `space-y-3` to `space-y-5` (1.25rem / 20px) on the `CardContent` element. This keeps the title, description, and CTA evenly spaced within the requested 16–24px range without altering individual element margins.

## Files to modify
- `src/pages/dashboard/ProgramSection.tsx`

## Verification
- Run the build/typecheck.
- View the `/dashboard/program` page to confirm the title, paragraph, and button have clearer vertical separation while the card remains balanced and responsive.
