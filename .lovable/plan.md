## Pricing Page Plan

### New route
- Add `src/pages/PricingPage.tsx` at route `/pricing` in `src/App.tsx`.
- Reuse `SiteHeader`, `SiteFooter`, `FloatingBookCTA`, `ScrollMemory`, `ChapterBookCTA` styling patterns.
- Match homepage bright design system: soft gradient background, pill buttons, shadow cards, brand navy/green/amber palette.

### Sections (top → bottom)

1. **Hero**
   - Eyebrow badge: "Coaching + Implementation"
   - H1: "Simple pricing. Real support. Money when you need it."
   - Sub: One-line explainer that every path starts with a free 1:1 session.
   - Two CTAs: "Book Free 1:1 Session" (primary → `/one-on-one`), "Read the Guide" (secondary → `/guide`).

2. **How pricing works** (overview strip)
   - 3 short bullets: (1) Free 1:1 to build your custom plan, (2) Pick the support level that fits, (3) Cancel or upgrade anytime.

3. **Three pricing cards** (recommended = middle "Cohort")
   - **Self-Paced Blueprint** — $497 one-time
     - Custom Business, Finance & Credit Plan (PDF + portal)
     - Guide + 7-step action checklist
     - Fundability Scan
     - Credit Suite vendor & tradeline directory access
     - Email support
   - **Realtor Credit Cohort** — $1,997 (90 days) *[Most Popular badge]*
     - Everything in Self-Paced
     - 90-day small-group cohort (5–10 Realtors)
     - Weekly live coaching calls
     - Private cohort community
     - Credit Suite client portal + coach
   - **1:1 Private Coaching** — $4,997 / quarter
     - Everything in Cohort
     - Private 1:1 coaching with Jessie
     - Dedicated Credit Suite specialist
     - Priority response + funding strategy sessions
     - Quarterly plan reviews
   - Each card: title, price, "who it's for" line, feature list with green check icons, CTA button "Book Free 1:1 Session" → `/one-on-one` (all cards route to the free session first, matching the funnel model in project knowledge).

4. **Feature comparison table**
   - Rows: Custom Plan, Fundability Scan, Vendor Directory, Live Coaching, Cohort Community, 1:1 with Jessie, Credit Suite Coach, Priority Support, Plan Reviews.
   - Columns: Self-Paced / Cohort / 1:1 with check/dash marks.
   - Fully responsive: table on md+, stacked cards on mobile.

5. **Trust strip** — reuse "16 years, hundreds of transactions, Credit Suite Certified Partner, CA + GA licensed" indicators (same style as homepage `TrustStrip`).

6. **FAQ** (accordion via shadcn `Accordion`)
   - Do I have to pay upfront? Is there a payment plan?
   - What's actually included in the free 1:1 session?
   - How is this different from generic business credit programs?
   - Do you guarantee approval amounts or credit limits? (compliance-safe answer)
   - Can I switch between plans?
   - What if I'm brand new / haven't closed many deals yet?
   - Do you provide legal or tax advice? (No — educational + coaching)

7. **Final CTA band**
   - Headline: "Not sure which plan fits? Start with the free 1:1."
   - Buttons: "Book Free 1:1 Session" + "Read the Free Guide".

### Navigation updates
- `src/components/shared/SiteHeader.tsx`: add "Pricing" to desktop nav (between Guide and About) and to mobile hamburger menu; active state via `NavLink` styling already in place.
- `src/pages/GuidePage.tsx`: add "Pricing" to the centered sticky-bar nav and mobile menu, matching the existing About pattern.
- `src/components/shared/SiteFooter.tsx`: add Pricing link in footer nav.

### SEO & accessibility
- `<Helmet>` with title "Pricing — Realtor Business Credit" (<60 chars) and meta description (<160 chars) focused on "coaching + business credit pricing for Realtors".
- Canonical + og:title/og:url/og:type/twitter:card self-referencing `/pricing`.
- JSON-LD `Product`/`Offer` array for the three tiers (Organization already sitewide).
- Single H1, semantic `<section>` with `aria-labelledby`, accessible accordion (shadcn already a11y-compliant), keyboard-focusable pricing cards.

### Technical notes
- No backend/schema changes — pricing values live in a typed array in `PricingPage.tsx`.
- Reuse shadcn `Card`, `Button`, `Badge`, `Accordion`, `Table` — no new deps.
- All CTAs link to existing `/one-on-one` and `/guide` routes; no new checkout wiring (`/checkout` already exists but pricing funnel starts with the free session per project knowledge).
- Fully responsive: 1-col mobile, 2-col md, 3-col lg for pricing cards; overflow-x scroll fallback on comparison table.

### QA checklist after build
- Route renders at `/pricing`, header/footer/floating CTA present.
- Nav link appears and highlights on active route across `SiteHeader`, `GuidePage` bar, and footer.
- Mobile hamburger includes Pricing.
- Cards, table, and FAQ scale cleanly at 375 / 768 / 1280.
- Lighthouse: meta tags present, single H1, no console errors.
