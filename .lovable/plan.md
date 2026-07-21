# About Us Page

## New route
- Add `/about` route in `src/App.tsx` → `src/pages/AboutPage.tsx`.
- Add "About" link to `SiteHeader` (desktop nav array + mobile Sheet) between "Sample Plan" and "1:1 Session".
- Add "About" link to `SiteFooter` link row.

## Page structure (`src/pages/AboutPage.tsx`)
Reuses `SiteHeader`, `SiteFooter`, `StickyMobileCTABar`, `Seo`, and existing tokens (`bg-hero-grad`, `shadow-card`, `rounded-3xl`, pill buttons, fluid `clamp()` type). Sections built as small components under `src/components/about/`:

1. **AboutHero** — eyebrow "About Realtor Business Credit", H1 "Built by a Realtor, for Realtors", subhead tying to "Money when you need it", primary CTA "Book a 1:1 Session", secondary "Read the Free Guide". `bg-hero-grad`.
2. **OurStory** — Jessie's 14+ years / hundreds of transactions / no one taught business credit story from the knowledge file. Two-column on desktop with a supporting image/quote card.
3. **MissionVision** — two cards side-by-side: Mission (help Realtors build separate business credit + funding capacity) and Vision (a real estate business with its own financial footprint).
4. **CoreValues** — 4–6 icon cards (Education over hype, Realtor-specific, Protection first, Transparent guidance, Long-term partnership, Compliance-aware). Lucide icons in tinted chips matching landing style.
5. **WhatMakesUsDifferent** — comparison-style bullets: Realtor-specific vs generic credit programs, dual-coach model (RBC coach + Credit Suite), custom 90-day plan, cohort option.
6. **HowWeHelp** — 4-step process: Free guide → 1:1 session → Fundability Scan + Intake → Custom plan & program. Uses card grid consistent with `ProgramCurriculum`.
7. **TrustCredibility** — stat tiles ("14+ years", "Hundreds of transactions", "Licensed CA & GA", "Certified Credit Suite Partner") + existing `TestimonialsBright` reused (or inline variant) for social proof.
8. **MeetTheTeam** — Jessie Hunter card (Founder & Broker) with placeholder cards for "Realtor Business Credit Coach" and "Credit Suite Coach" (per dual-coach model). Uses initials avatars where no photo exists.
9. **FinalCTA** — reuse pattern from `FinalCTABright`: "Ready to turn your closings into capacity?" with "Book a 1:1 Session" primary + "Read the Free Guide" secondary.

## Copy guardrails (from project knowledge)
- Educational only; no legal/tax/investment advice.
- No guaranteed approvals/limits/timeframes.
- Credit Suite referenced generically as "certified partner", no proprietary language.
- Use approved phrasing: "You don't have to do this alone", "My Plan. My Progress. My Better Business Credit."

## SEO
- `Seo` component: title "About Realtor Business Credit — Our Story & Mission", meta description, canonical `/about`.
- JSON-LD `AboutPage` + `Person` (Jessie Hunter, founder) + link to parent Organization.
- Semantic `<main>`, single `<h1>`, `<section>` per block, alt text on all imagery.

## Responsive & a11y
- Fluid type via `clamp()`; grids collapse to single column < md.
- Subtle `animate-in fade-in / slide-in-from-bottom` on section reveal (Tailwind utilities already in use).
- Focus-visible rings on all CTAs; sufficient contrast against `bg-hero-grad`; icons `aria-hidden`.

## Files touched
- Add: `src/pages/AboutPage.tsx`, `src/components/about/{AboutHero,OurStory,MissionVision,CoreValues,WhatMakesUsDifferent,HowWeHelp,TrustCredibility,MeetTheTeam,AboutFinalCTA}.tsx`.
- Edit: `src/App.tsx` (route), `src/components/shared/SiteHeader.tsx` (nav arrays), `src/components/shared/SiteFooter.tsx` (link row).

## Out of scope
- No new imagery generation unless needed; will use existing brand assets + Lucide icons. Can add AI-generated portrait placeholders in a follow-up if desired.
- No backend/DB changes.
