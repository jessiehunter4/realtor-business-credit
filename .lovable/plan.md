## Goal

Rework the hero on `/landing-page/:slug` so a visitor instantly sees the personalized welcome video, a benefit-led headline, a short supporting line, and one clear CTA into the guide — with Jessie present only as a brief trust signal.

Scope is limited to the hero. `ThreeStepSection` and `AvatarFinalCTA` stay as they are. The homepage (`/`) is untouched.

## 1. Hero structure (top to bottom)

```text
┌──────────────────────────────────────────┐
│  Headline (benefit-led, 1 line desktop)  │
│  Subheadline (one sentence)              │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │   Personalized welcome video       │  │
│  │   (placeholder card, 16:9)         │  │
│  └────────────────────────────────────┘  │
│                                          │
│  [ Read the Free Guide ]  See the 3 steps│
│  Free · 5–10 min · no signup             │
│  ▸ trust line: REALTOR® who's been there │
└──────────────────────────────────────────┘
```

Key changes vs. today:
- Video moves up: it sits directly under a tightened headline/subhead pair so it lands above the fold at common desktop and mobile heights. The long explanatory paragraph currently sitting between video and CTAs moves below the CTAs (or is cut to one short line) so the CTA is not pushed off screen.
- Section vertical padding reduced (roughly `py-6 sm:py-8 md:py-10`) and the headline clamp tightened so headline + video + CTA fit in ~800px of viewport height.
- Video container keeps the existing 16:9 `HeroVideoPlaceholder`, constrained to `max-w-[min(640px,100%)]` so it never dwarfs the type on wide screens.

## 2. Messaging

Replace the current "Congrats, {name} — money when you need it." greeting.

- Headline (no name, no congratulations): **"Money when your business needs it."**
- Personalized name, if a slug exists, becomes a small eyebrow line above the headline instead of the headline itself: `Made for you, {FirstName}` — keeps personalization without a generic greeting.
- Subheadline (visitor challenge → outcome → path): "Commissions arrive in lumps; your overhead doesn't. Here's the simple three-step path to a business structure and separate business credit that covers you between closings."
- Explanatory paragraph below the CTAs, shortened to one sentence about what happens next.
- Remove "Jessie's 3-Step Rule" phrasing from the hero; call it "the 3-step path."

## 3. Personal branding

- Cut the founder-forward line "A personal welcome and Jessie's 3-Step Rule…" from the hero.
- Add one compact trust row under the CTAs: a small avatar/initial chip plus "Built by a REALTOR® who ran a decade of business expenses on personal credit — so you don't have to," with a text link "Read the story" → `/about`.
- Video caption/alt copy stays neutral: "Your personalized welcome video."

## 4. CTA flow

- Primary CTA (only filled button): **Read the Free Guide** → `/guide`, `data-analytics-id="avatar-cta-guide-hero"` retained.
- Secondary CTA demoted to a plain text link with a chevron: "See the 3-step path" → `#step-1` (no competing pill button).
- No pricing, coaching, or booking CTA in the hero — those remain in `AvatarFinalCTA`.
- Micro-reassurance under the buttons: "Free to read · about 5–10 minutes · no signup required."

## 5. Responsive behavior

- Mobile (<640px): single column, eyebrow → headline (clamp min ~1.5rem) → one-line subhead → video → full-width primary CTA → text link. Padding tightened to `py-5`. Target: video top edge within the first screen, CTA reachable with one short scroll at 667px height.
- Tablet: same order, video capped at ~560px wide, CTAs side by side.
- Desktop: centered single column preserved; headline clamp reduced to `clamp(1.75rem, 5vw, 2.75rem)` so the type/video ratio stays balanced at 1500px+ (the current 3.25rem max overpowers the video).
- Background blur orbs stay but are pulled in so they don't add layout height.

## 6. Files touched

- `src/components/landing-avatar/AvatarHeroSection.tsx` — full restructure (order, copy, CTA hierarchy, trust row, spacing/clamps).
- `src/components/landing-avatar/HeroVideoPlaceholder.tsx` — minor: neutral placeholder label ("Your personalized welcome video"), optional `maxWidth` pass-through.
- `src/pages/LandingWithAvatarPage.tsx` — SEO title/description reworded away from "Jessie's 3-Step Rule"; pass `firstName` unchanged.

The personalized video stays the existing placeholder card — no HeyGen embed wiring in this phase; the `heygenEmbedUrl` prop remains so a URL can be dropped in later.

## 7. Phases

1. Copy + structure rewrite in `AvatarHeroSection` (headline, eyebrow, subhead, order).
2. CTA hierarchy and trust row.
3. Placeholder label + width constraint.
4. SEO metadata wording.
5. Responsive pass — verify above-the-fold at 390×844, 768×1024, and 1500×855.
