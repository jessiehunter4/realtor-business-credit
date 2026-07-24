# Fix downloaded PDF — bring it fully in sync with the web guide

## What the uploaded PDF shows

Your file `Realtor-Business-Credit-Guide_7-24-26.pdf` is from an earlier build:
- Cover still says "custom plan built with you in your free 1:1"
- Footer still says `© 2026 RealtorBusinessCredit.com`
- No embedded headshot / structure diagrams
- Filename still uses the old "Realtor Business Credit" name

The cover code has since been rebranded, but two issues remain that will still bite the next download:

1. **Body copy across ~8 chapters still says "free 1:1"** (Ch 3, 4, 6, 8, 12, 13, Resources). The web guide replaced these with "Create My Plan / Guide → Plan → Implement" during the freemium rebrand. The PDF was never updated to match.
2. **Images still don't render** — headshot (Ch 1 sidebar + About the Author), structure diagram (Ch 4), and "How it works" (Ch 5) all point to `/__l5e/assets-v1/…` URLs. `@react-pdf/renderer` fetches those at render time; in dev they return HTML, and even in prod they can fail silently — leaving empty teal circles / blank caption blocks (confirmed in the last QA).
3. **Stale download**: because the file is named `Realtor-Business-Credit-Guide.pdf`, browsers and the CDN may serve a cached copy.

## Changes

### 1. Rewrite every "free 1:1" reference in `src/components/GuidePDF.tsx`
Replace with the freemium / Create-My-Plan language already used on the web guide:

| Location | Old | New |
|---|---|---|
| Intro bullets | "Hands off to the free 1:1…" | "Hands off to your free custom Plan — generated from your Needs Analysis." |
| Ch 3 / 4 takeaways | "The free 1:1 maps the right starting structure…" | "Your custom Plan maps the right starting structure for your situation." |
| Ch 6 | "During your free 1:1 we generate this for you." | "Your free custom Plan generates this for you. It looks like:" |
| Ch 8 takeaway | "The free 1:1 produces your Strong / Watch / Missing snapshot." | "Your custom Plan produces your Strong / Watch / Missing snapshot." |
| Ch 12 | "Your specific actions get customized in your free 1:1." | "Your specific actions get customized in your free Plan." |
| Ch 13 | "The free 1:1 gives you the route." + "What happens in your free 1:1" + "The 1:1 is free…" | "The Plan gives you the route." + "What happens when you Create Your Plan" + "The guide is free. The Plan is free…" |
| Resources | (any remaining 1:1 mentions) | Match the web `GuideResources` copy exactly (Read → Create Plan → Implement). |

### 2. Fix image embedding
Convert CDN-hosted images to base64 data URIs before rendering, so `react-pdf` never has to fetch across origins.

- In `src/pages/GuidePage.tsx#handleDownload`, before `pdf(<GuidePDF …/>).toBlob()`:
  - `fetch(url)` → `blob()` → `FileReader.readAsDataURL()` for `jessieHeadshot.url`, `structureDiagram.url`, `structureHowItWorks.url`.
  - `Promise.all` the three so they run in parallel.
- Pass results as props: `<GuidePDF headshotSrc={…} structureSrc={…} howItWorksSrc={…} />`.
- Update `GuidePDF` signature to accept those props (fallback to the CDN URL if a prop isn't supplied, so the standalone component still works).
- Keep the bundled `heroImg` cover image as-is (already same-origin via Vite).

### 3. Cache-bust the download
Rename the output file so cached copies can't win:
- `a.download = "RE-Pro-Business-Credit-Guide.pdf"` in `GuidePage.handleDownload`.

### 4. QA
- Trigger the download via Playwright against localhost, save the PDF, and:
  - `pdftotext` — confirm zero remaining "1:1" strings and footer says `REProBusinessCredit.com`.
  - `pdfimages -list` — confirm 4 embedded images (hero + headshot + 2 diagrams) with non-zero sizes.
  - `pdftoppm` a few pages and visually inspect the headshot circles and diagram blocks are no longer empty.

## Files touched
- `src/components/GuidePDF.tsx` — copy rewrite + optional image-src props
- `src/pages/GuidePage.tsx` — prefetch images as data URIs, pass as props, new filename

## Out of scope
- No changes to the web guide, database, or CDN pointers. Assets themselves are already correct — only the PDF renderer's fetch path is being changed.
