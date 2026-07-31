# Homepage Rewrite: The 3-Step Customer Journey

## Current state (verified)

`src/pages/LandingPage.tsx` renders 13 sections in this order:

```text
HeroSectionBright → GuideIntroduction → ProgramCurriculum → CustomPlanPreview →
IsThisForMe → MoneyWhenYouNeedItStrip → ThreePillarsDiagram → ComparisonBright →
CashFlowCalculator → GuideContentsBright → SamplePlanPreview → TestimonialsBright →
FinalCTABright  (+ SiteHeader, SiteFooter, StickyMobileCTABar)
```

That is ~1,000 lines of section code and a lot of overlap: three separate "why business credit matters" arguments (MoneyWhenYouNeedItStrip, ThreePillarsDiagram, ComparisonBright), two plan previews (CustomPlanPreview, SamplePlanPreview), and two guide-contents blocks (ProgramCurriculum, GuideContentsBright). The hero also currently opens with credentials ("16 years brokering · Licensed CA & GA · Certified Credit Suite Partner"), which reads as About Us.

CTA audit result: the CTAs that exist already point at `/guide` (`FinalCTABright`, `GuideContentsBright`, `ProgramCurriculum`, `CashFlowCalculator`, `StickyMobileCTABar`), except `SamplePlanPreview` → `/sample-plan`. No homepage CTA currently sends visitors to `/intake`, so the flow change is mostly about reinforcement and removing the `/sample-plan` detour as a *primary* action.

---

## 1. New information architecture

Nine blocks, down from thirteen:

```text
1. Hero — visitor pain + outcome + one CTA (Read the Free Guide)
2. Outcome strip — 3 short proof points ("money when you need it")
3. How It Works — 3-step overview (Educate / Plan / Implement) as a compact rail
4. Step 1: Educate    — image LEFT, text RIGHT
5. Step 2: Plan       — text LEFT, image RIGHT
6. Step 3: Implement  — image LEFT, text RIGHT
7. What This Program Is (and is not)
8. Proof — condensed testimonials + founder one-liner
9. Final CTA — Start with the Free Guide
```

---

## 2. Hero section strategy

Rewrite `src/components/landing/HeroSectionBright.tsx` copy only (keep the video, gradient, and responsive scaffolding — those were tuned in earlier passes).

- **H1:** `Money when you need it.` (unchanged — it already tests as the visitor's own language)
- **Sub-head:** replace the current structural sentence with a pain-first line: *"Commission income arrives in lumps. Your bills don't. Build the business structure and separate business credit that covers overhead between closings — without leaning on your personal cards."*
- **Benefit line (3 chips, replacing the trust bullets):** "Know where you stand" · "Get a 90-day plan" · "Choose how to implement" — these preview the three steps rather than describing the company.
- **Credentials line** ("16 years brokering · Licensed CA & GA…") moves out of the hero into the Proof section (block 8) and the About page.
- **One primary CTA:** `Read the Free Guide → /guide`. Secondary text link: "Takes about 5–10 minutes."
- Keep `firstName` / `closingContext` personalization logic intact.

## 3. Three-step program layout

New component `src/components/landing/HowItWorksRail.tsx` — three numbered pills with icon + one-line label, anchor-linking to `#step-educate`, `#step-plan`, `#step-implement`. Purely orientation; no CTAs.

New shared component `src/components/landing/JourneyStep.tsx` with props `{ step, eyebrow, title, whatYouDo, whyItMatters, deliverable, bullets, image, imageAlt, cta, reverse }`. Renders a two-column grid (`lg:grid-cols-2`) with `lg:order-*` flipping when `reverse` is true. Each step answers the three required questions with explicit labels:

- **What you'll do**
- **Why it matters**
- **What you get** (rendered as a highlighted "deliverable" chip)

**Step 1 — Educate** (`image left`)
What you'll do: read a concise, Realtor-specific guide, ~5–10 minutes. Why: you can't fix a structure you can't see; the guide shows where your business actually stands on entity, banking, and credit. What you get: a clear picture of your current position and the vocabulary lenders use.
Include a compact guide preview: 5–6 chapter titles pulled from the existing `GuideContentsBright` data plus "13 chapters · 5–10 min skim". CTA: **Read the Free Guide → /guide**.

**Step 2 — Plan** (`image right`)
What you'll do: answer questions about your business, your goals, and your current situation. Why: generic checklists don't work — your gaps are specific. What you get: a personalized 90-day business structure, finance & credit plan with prioritized actions.
Reuse the visual language of `CustomPlanPreview`. CTA is **not** `/intake` — it is a soft "See a sample plan → /sample-plan" text link, with the primary action still "Start with the guide".

**Step 3 — Implement** (`image left`)
What you'll do: choose the support level that fits. Why: a plan only pays off when it's executed. What you get: accountability and guidance through the 90 days.
Three short cards — **Self-Paced** (work the plan on your own schedule), **Small Cohort** (a group of 5–10 Realtors moving through the plan together), **One-on-One Coaching** (direct, personalized guidance). No prices, no feature tables. Quiet text link: "See program details → /pricing".

## 4. "What This Program Is" section

New `src/components/landing/WhatThisIs.tsx` — two-column contrast card.

- **This program is:** Educational · Planning-focused · Coaching-supported (green check treatment)
- **This program is not:** Legal advice · Tax advice · Investment advice (muted, neutral treatment — informative, not alarming)
- Footer line: "Always consult your broker, attorney, and tax professional for your specific situation."

Placed after Step 3 so it reads as scope-setting rather than a warning gate.

## 5. CTA strategy

Every primary button on the homepage resolves to `guideLink` (`/guide` plus forwarded contact params from `useContactIdentity`). Rules:

| Placement | Label | Target |
|---|---|---|
| Hero | Read the Free Guide | `/guide` |
| Step 1 | Read the Free Guide | `/guide` |
| Step 2 | (text link) See a sample plan | `/sample-plan` |
| Step 3 | (text link) See program details | `/pricing` |
| Final CTA | Start with the Free Guide | `/guide` |
| Sticky mobile bar | Read the Free Guide | `/guide` |

No homepage element links to `/intake` or triggers plan generation. `SamplePlanPreview`'s standalone `/sample-plan` section is retired; that link survives only as the Step 2 text link.

## 6. Content consolidation

| Current section | Action |
|---|---|
| `GuideIntroduction` (guide component reused on homepage) | Remove from homepage — its content is absorbed into Step 1 |
| `ProgramCurriculum` | Remove — chapter list folds into Step 1's guide preview |
| `CustomPlanPreview` | Absorb into Step 2 |
| `IsThisForMe` | Remove — audience fit is carried by the new hero copy |
| `MoneyWhenYouNeedItStrip` | Keep, trimmed to 3 items, as the outcome strip (block 2) |
| `ThreePillarsDiagram` | Remove from homepage — structure/finance/credit is now explained through the steps |
| `ComparisonBright` | Remove — redundant with the guide's own comparison |
| `CashFlowCalculator` | Remove from homepage; move to `/guide` where an engaged reader will use it |
| `GuideContentsBright` | Absorb into Step 1 preview |
| `SamplePlanPreview` | Absorb into Step 2 |
| `TestimonialsBright` | Keep, condensed to 3 quotes, plus the founder credential line |
| `FinalCTABright` | Keep, copy refresh |

No component files are deleted — they're unmounted from `LandingPage.tsx` so they remain available for `/guide` and other pages.

## 7. Imagery

Three AI-generated images at `src/assets/journey-step-1.jpg`, `-2.jpg`, `-3.jpg` (4:3, ~1200×900), imported as ES6 modules with descriptive alt text:

1. Educate — a Realtor at a desk reading a printed guide, warm daylight, navy/green accents
2. Plan — a clean document/dashboard showing a 90-day roadmap with checkmarks
3. Implement — a small group of real estate professionals in a working session

Style constraints: professional, warm, matches the navy `#0d1b2a` / green `#3eaf7c` / amber palette; no stock-photo cliché handshakes, no purple gradients.

## 8. Responsive considerations

- Alternation applies at `lg` and up only; below `lg` every step stacks image-then-text in reading order (`order` classes reset).
- `HowItWorksRail` becomes a horizontal 3-up on `sm`+, vertical stack on mobile.
- Anchor targets need `scroll-mt-24` to clear the sticky `SiteHeader`.
- Images use `loading="lazy"` (hero video excluded) and fixed `aspect-[4/3]` containers to prevent layout shift.
- Sticky mobile CTA bar retained; body keeps `pb-20 md:pb-0`.
- All colors via existing semantic tokens (`primary`, `secondary`, `sky`, `accent`, `muted-foreground`) — no hardcoded color utilities.

## 9. Technical details

Files created:
- `src/components/landing/JourneyStep.tsx`
- `src/components/landing/HowItWorksRail.tsx`
- `src/components/landing/WhatThisIs.tsx`
- `src/data/homepageJourney.ts` (step content as data, so copy edits don't touch JSX)
- three image assets

Files edited:
- `src/pages/LandingPage.tsx` — new section order, imports
- `src/components/landing/HeroSectionBright.tsx` — copy + chips
- `src/components/landing/MoneyWhenYouNeedItStrip.tsx` — trim to 3
- `src/components/landing/TestimonialsBright.tsx` — condense, add credential line
- `src/components/landing/FinalCTABright.tsx` — copy refresh

Unchanged: analytics (`postFunnelEvent` `site_visit`, `tag-ghl-contact`), `useContactIdentity` param forwarding, SEO/JSON-LD block in `LandingPage.tsx` (description copy gets a light refresh only), all routes, all backend.

Analytics: keep existing `data-analytics-id` conventions — `cta-guide-hero`, plus new `cta-guide-step1`, `cta-sample-plan-step2`, `cta-pricing-step3`, `cta-guide-final`.

## 10. Phases

1. **Content layer** — `src/data/homepageJourney.ts` with all step copy, plus hero copy revision.
2. **Components** — `JourneyStep`, `HowItWorksRail`, `WhatThisIs` (renders with placeholder images).
3. **Assembly** — rewire `LandingPage.tsx` to the new nine-block order; trim the retained sections.
4. **Imagery** — generate and wire the three step images (depends on phase 2).
5. **Verification** — typecheck, screenshot at 390px / 768px / 1440px, confirm no homepage link resolves to `/intake`.
