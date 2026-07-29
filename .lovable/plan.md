# Redesign `/landing-page/:slug` — Jessie's 3-Step Rule

Scope is limited to `src/pages/LandingWithAvatarPage.tsx` and new components under `src/components/landing-avatar/`. The public `/` homepage stays untouched.

## The 3 Steps
1. **Read the Guide** — Learn why most Realtors don't have separate business credit and what to build instead.
2. **Create Your Customized Plan** — Complete the Needs Analysis and get a Realtor-specific business structure, finance & credit plan.
3. **Implementation** — Execute the 90-day plan with coaching, cohort, or self-paced support.

## Page Structure (top → bottom)

```text
┌─ SiteHeader (unchanged)
├─ HeroSection
│    • Personalized headline: "Congrats, {Name} — money when you need it."
│    • Large HeyGen video placeholder (16:9, max ~720px)
│    • Subhead + Primary CTA: "Read the Guide" → /guide
├─ ThreeStepSection
│    • Section heading: "Jessie's 3-Step Rule"
│    • Step 1 card → HeyGen placeholder + copy + step CTA
│    • Step 2 card → HeyGen placeholder + copy + step CTA
│    • Step 3 card → HeyGen placeholder + copy + step CTA
├─ FinalCTASection
│    • "Start with Step 1: Read the Guide" (primary)
│    • "Or book a free 1:1" (secondary)
└─ SiteFooter (unchanged)
```

## Component Architecture

New folder `src/components/landing-avatar/`:

- **`HeroVideoPlaceholder.tsx`** — new variant of `StepVideoPlaceholder`, larger, no "Step N" chip, uses the "coming soon" badge; ready to swap for a HeyGen embed via a `heygenEmbedUrl` prop.
- **`StepCard.tsx`** — reusable card wrapping title/number, description, icon, and a `StepVideoPlaceholder` (existing component reused). Accepts `stepNumber`, `title`, `description`, `icon`, `ctaLabel`, `ctaHref`.
- **`ThreeStepSection.tsx`** — grid of three `StepCard`s. Responsive: 1 col mobile, 1 col tablet (stacked, full width for video legibility), 3 cols desktop (≥lg).
- **`AvatarHeroSection.tsx`** — hero wrapper (headline, `HeroVideoPlaceholder`, subhead, primary CTA). Accepts optional `firstName`.
- **`AvatarFinalCTA.tsx`** — closing CTA band with primary "Read the Guide" and secondary "Book Free 1:1".

Both placeholders expose an optional `heygenEmbedUrl` prop; when provided, they render an `<iframe>` (or `HeroVideo` component) instead of the placeholder — future HeyGen wiring becomes a one-line swap.

## CTA Strategy

| Location | Primary | Secondary |
|---|---|---|
| Hero | Read the Guide → `/guide` | — |
| Step 1 card | Read the Guide → `/guide` | — |
| Step 2 card | Start Needs Analysis → `/intake` | — |
| Step 3 card | See Program Options → `/pricing` | Book Free 1:1 → `/one-on-one` |
| Final CTA | Read the Guide → `/guide` | Book Free 1:1 → `/one-on-one` |

Primary funnel remains **Guide → Intake → Implementation**, matching the 3 steps.

## Responsive Strategy

- **Mobile (<768px):** single column; hero video full width; step cards stack; CTAs full-width buttons.
- **Tablet (768–1024px):** hero centered, video max 640px; step cards stack full-width so videos stay legible.
- **Desktop (≥1024px):** hero centered, video max 720px; 3-column step grid with equal-height cards.
- Fluid typography via `clamp()` matching existing hero pattern.

## UX Notes

- **Hierarchy:** headline → hero video → CTA → 3 steps → final CTA. Steps numbered visually with large numerals.
- **Engagement:** each step gets its own video slot so visitors can watch Jessie explain that specific step, mirroring the intake survey pattern.
- **Scroll experience:** section-level `scroll-mt` so anchor links land cleanly; smooth-scroll between hero CTA and step 1 via `#step-1` anchor.
- **Performance:** placeholders are pure CSS/SVG (no video weight). When HeyGen embeds are added later, use `loading="lazy"` on iframes and only auto-init the hero video.
- **Accessibility:** each placeholder has `aria-label`, play icon marked `aria-hidden`, cards are semantic `<article>`, headings follow h1→h2→h3.
- **Mobile-first:** Tailwind defaults target mobile; `sm:` / `lg:` upshift for larger viewports.

## Removed / Preserved

- **Remove** current `HeyGenAvatar` block, `HeroSectionBright`, `GuideIntroduction`, `ProgramCurriculum`, `FinalCTABright` imports on this page only (they remain in use on `/`).
- **Preserve** `SiteHeader`, `SiteFooter`, `Seo`, and the `cleanVisitorName` slug helper.

## Technical Impact

- **Files created:** 5 (`AvatarHeroSection`, `HeroVideoPlaceholder`, `ThreeStepSection`, `StepCard`, `AvatarFinalCTA`).
- **Files edited:** 1 (`src/pages/LandingWithAvatarPage.tsx`).
- **Files untouched:** `LandingPage.tsx`, existing `HeroSectionBright`, existing `StepVideoPlaceholder` (reused as-is).
- **Dependencies:** none added — uses existing shadcn/Tailwind, `lucide-react`, `react-router-dom`.
- **Risks:** low; page is a standalone route. `HeyGenAvatar` component itself stays in the repo for potential reuse.
- **Testing:** visual QA at 375 / 768 / 1280 px; confirm slug personalization still renders (`/landing-page/jp` → "Congrats, Jp"); verify all CTAs route correctly and analytics `data-analytics-id` attributes are present.

## Phases

1. **Phase 1 — Components:** build the 5 new components in `src/components/landing-avatar/` with placeholder content.
2. **Phase 2 — Page assembly:** rewrite `LandingWithAvatarPage.tsx` to compose the new sections, keep slug personalization.
3. **Phase 3 — QA & polish:** responsive check, analytics IDs, SEO title/description tweak, typecheck.
