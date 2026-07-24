## Update PDF guide to match the online guide

Bring `src/components/GuidePDF.tsx` into parity with the web guide's cover, brand palette, and imagery. Copy edits only — no chapter structure changes.

### 1. Cover page — mirror `GuideCover.tsx`
- Replace navy full-bleed cover with the web hero look: light gradient background band on top, brand eyebrow "RE Pro Business Credit · Free Guide", updated title "Real Estate Professional **Business Finance & Credit** Guide" with teal middle span, subtitle "Build the financial structure behind your real estate career…", "A specialized program of My Better Business Credit." italic, author byline "by Jessie Hunter · Real Estate Broker · California & Georgia".
- Place the hero image (`src/assets/guide/hero-agent.jpg`) below the title in a rounded framed container matching the web card treatment.
- Footer strip on the cover with CTA text pointing at `reprobusinesscredit.com` / "Create My Free Plan After Reading" instead of the old 1:1 booking language.

### 2. Update stale copy & links project-wide in the PDF
- Replace `CTA_URL` and `REALTOR_URL` constants and every visible URL from `realtorbusinesscredit.com`/`/one-on-one` to `reprobusinesscredit.com` and `/intake` (Create My Plan). Update `BookCTA` heading/body from "Book your free 1:1" to "Create your free customized plan" using the same Guide → Plan → Implement language as the web `ChapterPlanCTA`.
- Update footer copyright to `© 2026 REProBusinessCredit.com`.

### 3. Embed the four images already used online
Use `@react-pdf/renderer`'s `Image` component. Because CDN pointers are same-origin relative paths (`/__l5e/assets-v1/...`), build absolute URLs at render time with `` `${window.location.origin}${asset.url}` `` (safe — PDF is rendered client-side via `PDFDownloadLink`). Add a small `pdfAssetUrl()` helper.

Placements (matching the web guide exactly):
- **Cover** → `hero-agent.jpg` (rounded card, ~380pt wide).
- **Introduction / Ch 1 sidebar** → `jessie-hunter-headshot.png.asset.json` (circular ~90pt) beside the "Founder sidebar" story box.
- **About the Author (Conclusion page)** → same headshot at ~120pt beside bio.
- **Chapter 4** → `guide-structure-diagram.png.asset.json` as a figure with caption "RE Pro Business Credit Structure — personal credit as a temporary bridge."
- **Chapter 5** → `guide-structure-how-it-works.png.asset.json` as a figure with caption "How the RE Pro Business Credit Structure Works."

Each image wrapped in a `<View wrap={false}>` figure with border/rounded look and small caption using the existing `MUTED` color.

### 4. Brand palette parity
The existing `NAVY/TEAL/SKY/CORAL/AMBER/BG/CARD/BORDER/TEXT/MUTED` constants already mirror `--rbc-*` tokens exactly — no changes needed. Verify visually by rendering; no swap required unless the audit turns up drift.

### QA
After edits, use existing `<PDFDownloadLink>` preview in the app (already wired). Manual visual check of the cover + Ch 4/5 image pages via the download button — no automated PDF QA loop needed for a copy/image update.

### Files touched
- `src/components/GuidePDF.tsx` (only file).

No web-guide changes, no backend changes, no new deps.