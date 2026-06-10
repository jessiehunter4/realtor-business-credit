
# RealtorBusinessCredit.com — Bright Redesign Plan

## 1. New brand theme (tokens)

Add the user-provided brand CSS verbatim to `src/index.css` (raw hex `--rbc-*` variables, gradients, radius, shadows), and map the existing shadcn HSL tokens onto the same palette so every shadcn component (buttons, cards, inputs, dialogs) automatically picks up the new colors.

```css
:root{
  /* Brand (verbatim from spec) */
  --rbc-navy: #0B1F3B;
  --rbc-teal: #12B886;
  --rbc-sky:  #3AA9FF;
  --rbc-coral:#FF6B6B;
  --rbc-amber:#FFB020;

  /* Neutrals */
  --rbc-bg:   #F7FAFC;
  --rbc-card: #FFFFFF;
  --rbc-border:#E6EEF5;
  --rbc-text: #233044;

  /* Gradients */
  --rbc-hero-grad: linear-gradient(135deg, rgba(18,184,134,.14) 0%, rgba(58,169,255,.14) 55%, rgba(255,176,32,.10) 100%);
  --rbc-accent-grad: linear-gradient(135deg, rgba(255,107,107,.18) 0%, rgba(255,176,32,.16) 100%);

  /* UI */
  --rbc-radius: 20px;
  --rbc-shadow: 0 10px 30px rgba(11,31,59,.10);
  --rbc-shadow-soft: 0 8px 18px rgba(11,31,59,.08);
}

body { background: var(--rbc-bg); color: var(--rbc-text); }
.site-header, .site-footer { background: var(--rbc-navy); color:#fff; }
.btn-primary   { background: var(--rbc-teal); color:#fff; border-radius:999px; box-shadow: var(--rbc-shadow-soft); }
.btn-secondary { background: var(--rbc-sky);  color:#fff; border-radius:999px; box-shadow: var(--rbc-shadow-soft); }
.card          { background: var(--rbc-card); border:1px solid var(--rbc-border); border-radius: var(--rbc-radius); box-shadow: var(--rbc-shadow-soft); }
```

HSL mirror so `bg-primary`, `bg-secondary`, `border-border`, etc. resolve to the same palette:
- `--background` → F7FAFC, `--foreground` → #233044
- `--card` → #FFFFFF, `--border` / `--input` → #E6EEF5
- `--primary` → #12B886 teal, `--secondary` → #0B1F3B navy, `--accent` → #FFB020 amber
- Add `--sky` #3AA9FF and `--coral` #FF6B6B; `--ring` → teal; `--radius` → 1.25rem
- Shadow tokens: `--shadow-card` and `--shadow-card-hover` mirroring the `--rbc-shadow*` values

`tailwind.config.ts`: extend `colors` with `sky` and `coral`, extend `boxShadow` with `card` / `card-hover`, extend `backgroundImage` with `hero-grad` / `accent-grad`. Keep legacy `navy`, `success-green`, `amber` aliases pointing at the new HSL values so existing pages don't break.

**Usage rules enforced:** Navy reserved for headings + footer (no full-section navy backgrounds elsewhere). Primary buttons teal, "Read Guide" CTAs sky, "right after a closing" strip amber, coral only for badges/hover.

## 2. Homepage rebuild — `src/pages/LandingPage.tsx`

Replace current section list with 9 blocks in this order. Old components stay in the repo (still used elsewhere) but are removed from home composition.

1. **HeroSectionBright** — `--rbc-hero-grad` background, navy headline "Turn Your Closings Into Business Credit Capacity.", subhead, teal Book CTA + sky Guide CTA, 4 trust bullets row.
2. **IsThisForMe** — 3 white rounded-2xl cards (Solo Agent, Team Lead/Broker, Newer Agent), each with 2–3 bullets + "Start Here →" anchor.
3. **WhyAfterClosingStrip** — `--rbc-accent-grad` callout strip with 3 bullets (cash + confidence / expense reality / build runway).
4. **ComparisonBright** — two bright white cards side-by-side, coral/teal accent icons; no dark backdrop.
5. **CashFlowCalculator** (restyle existing) — dashboard card look, teal/sky stat tiles, amber warning tile when utilization ≥30%.
6. **GuideContentsBright** — drop "Free Fundability Scan" bullet; add "Business Structure + Financial Foundation + Credit Capacity roadmap" and "What happens in your free 1:1: we complete the Realtor Business Financial Needs Analysis and generate your custom plan."
7. **OneOnOneStepsBlock** — 3 numbered step cards: Book free 1:1 → Complete Needs Analysis → Receive custom plan (online + PDF). Teal CTA.
8. **TestimonialsBright** — 3 quote-card placeholders, neutral copy, no stock-photo faces.
9. **FinalCTABright** — light gradient bg, "Don't wait another 10 years.", sub "Get clarity and a plan—free.", both CTAs.

`TrustStrip` retires from the homepage (bullets move into hero). `FounderQuoteSection` and `ProblemsSection` removed from the home flow.

## 3. Sitewide content scrub — remove "Fundability Scan"

Search-and-replace across:
- `src/components/landing/GuideContentsSection.tsx`
- `src/components/shared/SiteFooter.tsx` (remove Fundability Scan footer link; footer keeps navy bg)
- `src/pages/OneOnOnePage.tsx`, `src/pages/GuidePage.tsx`, `src/components/guide/*`, `src/components/landing/*`

Replacement language: **"Realtor Business Financial Needs Analysis (completed during your free 1:1)"** and **"Custom plan generated from your Needs Analysis."** Both the guide and the 1:1 are explicitly described as **free**.

## 4. CTAs, tracking, sticky mobile bar

- `data-analytics-id` on hero ("cta-book-hero", "cta-guide-hero"), mid 1:1 block ("cta-book-mid"), final CTA ("cta-book-bottom").
- New `StickyMobileCTABar`, fixed bottom on `<md` screens: left "Read Guide" (sky) → `/guide`, right "Book Free 1:1" (teal) → `/one-on-one`. Hidden on desktop. Page gets bottom padding so content isn't covered.
- All "Book Free 1:1" CTAs link to `/one-on-one` (preserves existing EveryCatch booking + intake handoff).

## 5. Out of scope (this pass)

- `/guide`, `/one-on-one`, `/checkout`, intake survey pages **inherit the new theme automatically** via shadcn tokens but their layouts are not restructured here.
- No new images generated — design is type + color + lucide-icon driven.
- No DB / edge-function changes.

## Technical notes

```text
Files added:
  src/components/landing/HeroSectionBright.tsx
  src/components/landing/IsThisForMe.tsx
  src/components/landing/WhyAfterClosingStrip.tsx
  src/components/landing/ComparisonBright.tsx
  src/components/landing/GuideContentsBright.tsx
  src/components/landing/OneOnOneStepsBlock.tsx
  src/components/landing/TestimonialsBright.tsx
  src/components/landing/FinalCTABright.tsx
  src/components/shared/StickyMobileCTABar.tsx

Files edited:
  src/index.css                              (rbc tokens + HSL mirror + gradients + shadows)
  tailwind.config.ts                         (sky, coral, shadow, backgroundImage)
  src/pages/LandingPage.tsx                  (new section composition + sticky bar)
  src/components/shared/SiteFooter.tsx       (drop Fundability Scan link)
  src/components/landing/CashFlowCalculator.tsx  (dashboard restyle)
  any file mentioning "Fundability Scan"     (content scrub)
```

No backend or schema changes. Tracking continues through the existing `postFunnelEvent` pipeline.
