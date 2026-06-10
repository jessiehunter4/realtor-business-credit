
Screenshots confirm the issue: at narrow widths the video sits above the headline and visually dominates; at mid widths the video column grows taller than the text. Plan unchanged.

## 1. Brand assets (CDN)

Upload the 4 uploaded logos via `lovable-assets`, writing pointer JSONs to:
- `src/assets/brand/rbc-logo-color.png.asset.json` (transparent bg — primary)
- `src/assets/brand/rbc-logo-white-bg.png.asset.json`
- `src/assets/brand/rbc-logo-mono.png.asset.json`
- `src/assets/brand/rbc-favicon.png.asset.json`

ImageMagick-trim whitespace on the wide logos before upload so the mark/wordmark fills the asset. Add `<link rel="icon" href="{favicon.url}">` in `index.html`.

## 2. Hero proportion fix (responsive)

In `HeroSectionBright.tsx`:
- Wrap video block in `aspect-video w-full max-w-[520px] mx-auto lg:mx-0 lg:self-center` so height is constrained and never exceeds text column.
- Grid: `lg:grid-cols-[1.15fr_1fr] items-center`.
- Mobile order: keep `order-first lg:order-last` but cap video width to `max-w-md` and put it BELOW the headline on mobile (`order-last`) so the headline lands first — fixes "video on top of headline" issue.

In `HeroVideo.tsx`:
- Video & fallback img both render with `w-full h-full object-cover` inside the parent aspect wrapper, so layout is identical pre/post load and never balloons.

## 3. Site header (new)

New `src/components/shared/SiteHeader.tsx`:
- Sticky `top-0 z-40 bg-white/85 backdrop-blur border-b`.
- Left: `<Link to="/">` cropped color logo (h-9 desktop / h-7 mobile).
- Desktop nav (md+): Guide, Sample Plan, 1:1 Session, Cards.
- Right: outline `Log in` → `/auth`, primary `Start Here` → `/one-on-one`.
- Mobile: lucide `Menu` opening shadcn `Sheet` with same links + CTAs.

Mount `<SiteHeader />` at top of: `LandingPage`, `OneOnOnePage`, `GuidePage`, `SamplePlanPage`, `CheckoutPage`, `BusinessCreditCardsForRealtorsPage`, `PrivacyPage`, `TermsPage`, `BookingConfirmedPage`, `IntakeSurveyPage`. Reduce `HeroSectionBright` top padding (`py-16 md:py-24` → `py-10 md:py-16`) so the header doesn't double-space.

## Files touched
- New: `src/components/shared/SiteHeader.tsx`, 4 `.asset.json` pointers under `src/assets/brand/`
- Edited: `index.html`, `src/components/landing/HeroSectionBright.tsx`, `src/components/shared/HeroVideo.tsx`, the 10 page files above.
