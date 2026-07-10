## Modernize homepage as a coaching program

Keep the existing hero video and both headlines exactly as they are. Add coaching-program framing and a new curriculum section based on the "Curriculum experience" direction you picked.

### 1. Hero: add coaching-program eyebrow badge only
In `HeroSectionBright.tsx`, add a small pulsing badge above the headline: **"Coaching Program for Realtors"** (teal dot + teal text on teal-tinted pill). Headline, tagline, video, subhead, CTAs, and trust bullets stay untouched.

### 2. New `ProgramCurriculum.tsx` section (placed right after the hero)
Curriculum-style block matching the picked direction:

- Centered header:
  - H2: **"Program Curriculum"**
  - Sub: "The structured coaching path from credit-uncertainty to funded real estate business."
- 5 module cards in a responsive grid (md:grid-cols-5, stacks on mobile):

  ```text
  01 Watch Intro       — video icon (teal)   — "Meet Jessie and see why Realtors need separate business credit."
  02 Book Free 1:1     — calendar (sky)      — "Grab a no-pressure strategy session with your coach."
  03 Needs Analysis    — chart (amber)       — "Complete the Realtor Business Financial Needs Analysis together."
  04 Custom Plan       — check-circle (teal) — "Get a personalized Structure, Finance & Credit Plan."
  05 Implementation    — users (teal on navy)— "Execute with 1:1 coaching or the Realtor Credit Cohort."
  ```

- Each card: white `bg-card`, `rounded-3xl`, subtle border, hover lift + accent border tint. Card 5 uses navy `bg-secondary` with white text as the "outcome" emphasis.
- Small chip on each card ("Video · 3 min", "Live · 30 min", "Assignment", "Deliverable", "Cohort or 1:1") for coaching-program feel.
- Below cards, two CTAs: primary "Book Free 1:1" → `/one-on-one`, secondary "Read the Free Guide" → guide link.
- All colors come from existing tokens (`primary`, `sky`, `accent`, `secondary`, `card`, `border`) — no hardcoded hex.

### 3. Wire into `LandingPage.tsx`
Insert `<ProgramCurriculum />` immediately after `<HeroSectionBright />` and before `<IsThisForMe />`. Remove the now-redundant `<OneOnOneStepsBlock />` further down (it duplicates steps 2–4 of the new curriculum) — or keep it? **Recommendation: remove it** to avoid repetition. Confirm if you'd rather keep both.

### Out of scope
- No video, hero copy, guide, or plan-generation changes.
- No new fonts, no palette changes.
- No CTA URL changes.

### Files touched
- `src/components/landing/HeroSectionBright.tsx` (add eyebrow badge)
- `src/components/landing/ProgramCurriculum.tsx` (new)
- `src/pages/LandingPage.tsx` (insert new section; optionally remove `OneOnOneStepsBlock`)
