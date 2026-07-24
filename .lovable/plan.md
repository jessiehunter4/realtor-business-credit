## Add Jessie Hunter Headshot to the Guide

### Asset prep
- Run `imagegen--edit_image` on `user-uploads://JH_Headshot_Pic1.png` with `transparent_background: true` to produce a clean PNG cutout.
- Upload the transparent PNG through `lovable-assets` and save the pointer at `src/assets/jessie-hunter-headshot.png.asset.json`.

### Placements in the guide
1. **About the Author (`src/components/guide/GuideResources.tsx`)** — Replace the current text-only author block with a two-column layout: circular/rounded headshot on the left, existing bio text on the right. Stack vertically on mobile.
2. **Chapter 1 / Founder Story opener (`src/components/guide/GuideChapters.tsx` or equivalent chapter file)** — Add a smaller float-right headshot (rounded, ~180px) next to Jessie's opening "why I built this" narrative so readers see him where his voice is first introduced.

### Styling
- Use existing brand tokens (navy border/ring, subtle shadow). No hardcoded colors.
- `alt="Jessie Hunter, Founder of RE Pro Business Credit"`.
- Lazy-load both images.

No copy changes, no other files touched.