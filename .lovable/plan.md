# Landing Page Redesign — Jessie's 3-Step Rule

Restructure `/` around a hero video + three clearly numbered steps, each with its own HeyGen video slot, ending in a single decisive CTA. All video slots are the same reusable component so a real HeyGen embed can drop in later without layout work.

## 1. Target page structure

Replaces the current dense homepage stack (Hero → GuideIntro → ProgramCurriculum → CustomPlanPreview → IsThisForMe → MoneyStrip → ThreePillars → Comparison → Calculator → GuideContents → SamplePlan → Testimonials → FinalCTA) with a tighter narrative:

```text
SiteHeader
HeroSection                (video slot #1 — Jessie's welcome)
ThreeStepSection           (steps 1–3, each with its own video slot)
  Step 1 — Read the Guide
  Step 2 — Book Your Free 1:1 + Complete Intake
  Step 3 — Get Your Custom Plan & Start the Program
SocialProofStrip           (compressed: testimonials + trust bullets)
FinalCTASection            (single decisive CTA block)
SiteFooter
StickyMobileCTABar
```

Sections currently on the page (ProgramCurriculum, CustomPlanPreview, IsThisForMe, MoneyStrip, ThreePillars, Comparison, CashFlowCalculator, GuideContents, SamplePlan) are not deleted — they move to secondary pages (Guide, Sample Plan, About) or are kept as opt-in deep-scroll below the FinalCTA on desktop only. Decision on which to retain vs. remove is called out in Phase 1.

## 2. Jessie's 3-Step Rule (proposed copy — confirm before build)

1. **Read the Free Guide** — Understand the business structure, financial foundation, and credit system in ~20 minutes.
2. **Book Your Free 1:1 + Complete the Needs Analysis** — Jessie reviews your current setup and gaps live with you.
3. **Get Your Custom Plan & Start the Program** — Walk away with a personalized 90-day plan and choose your path (self-paced, cohort, or 1:1).

Each step: number chip, title, 1–2 sentence explanation, icon (lucide), video placeholder, per-step CTA.

## 3. Component architecture

New / refactored components under `src/components/landing/`:

- **`VideoPlaceholder.tsx`** (new, shared) — the single reusable video slot. Props: `slotId` (e.g. `hero`, `step-1`), `title`, `caption?`, `aspectRatio?` (default `16/9`), `heygenVideoId?` (future), `fallbackStoragePath?` (Supabase `site-videos` bucket), `className?`. Behavior today: if `fallbackStoragePath` resolves in the bucket, render `HeroVideo` with that path; otherwise render a branded "Video coming soon" placeholder styled like `StepVideoPlaceholder`. Behavior later: if `heygenVideoId` is set, render the HeyGen embed instead. This is the only file that changes when HeyGen goes live.
- **`HeroSectionV2.tsx`** (new; replaces `HeroSectionBright` usage on `/`) — headline, subhead, `VideoPlaceholder slot="hero"`, primary CTA (Read the Guide), secondary CTA (Book 1:1), trust bullets.
- **`ThreeStepSection.tsx`** (new) — semantic `<ol>` wrapper, renders three `StepCard`s.
- **`StepCard.tsx`** (new) — number, icon, title, description, `VideoPlaceholder slot={"step-"+n}`, per-step CTA. Alternating image/video side on desktop (zigzag) for visual rhythm; stacked on mobile.
- **`FinalCTASectionV2.tsx`** (new; can reuse `FinalCTABright` structure) — single primary CTA + secondary link.
- **`StepVideoPlaceholder.tsx`** (existing) — kept for `/intake`; `VideoPlaceholder` is a generalization, they can share internals in Phase 2 refactor.

`HeroVideo` and `HeyGenAvatar` are unchanged.

## 4. CTA strategy

- **Hero**: primary "Read the Free Guide" (highest-intent early action), secondary "Book Free 1:1 Session".
- **Step 1** card CTA: "Open the Guide" → `/guide`.
- **Step 2** card CTA: "Book Your Free 1:1" → `/one-on-one`.
- **Step 3** card CTA: "See a Sample Plan" → `/sample-plan` (soft CTA — plan is the payoff, not gated here).
- **Final CTA**: one dominant "Book Your Free 1:1 Session" + text link "Prefer to read first? Start with the Guide."
- **Sticky mobile bar**: keep existing `StickyMobileCTABar`, pointing to `/one-on-one` and `/guide`.

Rule: at most one primary (filled `bg-primary`) button visible per viewport height; everything else is secondary/link style.

## 5. Responsive design

- **Desktop (≥1024px)**: Hero is 2-column (text left, video right, ~55/45) with video capped at 640px wide. Step cards zigzag (video left / text right, then swap) with `gap-12`.
- **Tablet (640–1023px)**: Hero stacks (video first, then headline/CTAs). Step cards stack video-above-text, 1 column, full width, `max-w-2xl mx-auto`.
- **Mobile (<640px)**: Same stacked flow. Fluid typography via existing `clamp()` pattern from `HeroSectionBright`. Sticky mobile CTA bar unchanged. Video placeholders always `aspect-video` so no letterboxing.
- Use existing tokens (`bg-hero-grad`, `shadow-card`, `rounded-2xl`, `text-secondary`, `text-muted-foreground`) — no new colors.

## 6. UX review highlights

- **Hierarchy**: one H1 (hero), one H2 per step, single H2 in final CTA. Number chips ("01/02/03") make the sequence unmistakable.
- **Engagement**: each step has its own video, so a visitor can watch just the step they care about instead of one long hero video.
- **Video placement**: hero video above the fold on desktop only when it doesn't push the CTA below the fold; on mobile the video sits directly under the H1 (current pattern, working well).
- **Scroll**: page shrinks from ~13 sections to ~5. Estimated scroll depth to Final CTA drops roughly by half.
- **Performance**: `VideoPlaceholder` renders a static branded div until a real video source exists — no autoplay, no network calls in the placeholder state. When wired to `HeroVideo`, it already uses `preload="metadata"` and signed URLs. HeyGen embeds will be lazy-mounted on `IntersectionObserver` when added.
- **Accessibility**: each `VideoPlaceholder` gets an `aria-label` describing the intended content; step list uses `<ol>`; CTAs are real `<Link>`s with descriptive text (no "click here"); focus rings inherit shadcn defaults.
- **Mobile-first**: Tailwind classes authored mobile-first; sticky CTA preserved; tap targets ≥44px.

## 7. Technical impact

- **Files added**: `src/components/landing/VideoPlaceholder.tsx`, `HeroSectionV2.tsx`, `ThreeStepSection.tsx`, `StepCard.tsx`, `FinalCTASectionV2.tsx`.
- **Files changed**: `src/pages/LandingPage.tsx` (swap section imports, drop deprecated sections from `/` only).
- **Files unchanged**: `HeroVideo.tsx`, `HeyGenAvatar.tsx`, `StepVideoPlaceholder.tsx`, guide/intake/plan flows, edge functions, DB schema, analytics events.
- **Analytics**: add `data-analytics-id` on each step CTA (`cta-step-1-guide`, `cta-step-2-book`, `cta-step-3-sample`) — same pattern as existing hero CTAs; no funnel-event schema change.
- **Dependencies**: none added.
- **Risks**: (a) SEO — homepage copy changes, so `Seo` title/description should be reviewed but structure stays. (b) removed sections still linked from nav/footer/other pages — audit before deleting; safer to keep components in-repo and just stop rendering them on `/`. (c) HeyGen slot IDs need to match what the HeyGen wiring in Phase 3 expects.
- **Testing**: visual QA at 375 / 768 / 1280 / 1536 widths; Playwright screenshot of `/` at each breakpoint; click-through on all four CTAs; verify sticky mobile bar still appears; Lighthouse pass (LCP should improve — hero image/video is smaller and lazy sections removed).

## 8. Phased implementation

**Phase 1 — Confirm scope (no code)**
Confirm the 3-step copy in section 2, and confirm which of the current homepage sections (Curriculum, Pillars, Comparison, Calculator, GuideContents, SamplePlan preview, Testimonials) stay on `/` vs. move off. Default proposal: keep only Testimonials (compressed) on `/`; move everything else to `/guide` or `/about`.

**Phase 2 — Build reusable primitives**
Add `VideoPlaceholder.tsx` with the fallback-to-`HeroVideo` behavior and the "coming soon" branded state. Unit-verify by dropping one instance on a scratch route.

**Phase 3 — Build new sections**
Add `HeroSectionV2`, `StepCard`, `ThreeStepSection`, `FinalCTASectionV2`. Wire copy and CTAs. Do not touch `LandingPage.tsx` yet.

**Phase 4 — Swap the page**
Update `src/pages/LandingPage.tsx` to render: `SiteHeader → HeroSectionV2 → ThreeStepSection → TestimonialsBright → FinalCTASectionV2 → SiteFooter → StickyMobileCTABar`. Keep old section components in the repo (unused) for one release cycle.

**Phase 5 — QA & polish**
Responsive pass at all breakpoints, analytics IDs verified, Lighthouse check, sticky bar check, Seo copy refresh.

**Phase 6 — HeyGen wiring (future)**
When HeyGen credits are live, update `VideoPlaceholder` to accept a real `heygenVideoId` and mount the embed — no changes required in `HeroSectionV2` / `StepCard`.
