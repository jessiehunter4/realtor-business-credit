# Reduce shadow on hero trust cards

## Goal
Make the three hero trust cards below the "Read the Free Guide" button feel less heavy by giving them a slightly reduced shadow while keeping them visually prominent.

## Scope
- Only the three trust cards in `src/components/landing/HeroSectionBright.tsx`.
- No global shadow-token changes.

## Implementation
1. Add a new, lighter card-shadow token in `tailwind.config.ts`:
   - `shadow-card-soft: "0 4px 12px rgba(11,31,59,0.06)"`
2. Optionally add a matching CSS custom property in `src/index.css` for consistency.
3. Update the `<li>` elements in `HeroSectionBright.tsx`:
   - Replace `shadow-card` with `shadow-card-soft`.
   - Replace `hover:shadow-card-hover` with `hover:shadow-card-soft` so the hover state stays in the same reduced range.

## Verification
- Open the homepage preview.
- Confirm the three cards below the hero CTA still have a subtle shadow but appear less elevated than before.
- Confirm no other cards on the page are affected.
