## Hero Section Edits (`src/components/landing/HeroSectionBright.tsx`)

**Copy changes:**
- Remove the "Realtor Business Credit · My Plan. My Progress." badge pill (and the Sparkles icon import if unused).
- Headline becomes: **"Money when you need it"** (keep the closing-context personalized variant similarly shortened: `Congrats[, FirstName] — money when you need it.`).
- New first subhead (sized between headline and body, e.g. `text-2xl md:text-3xl font-semibold text-secondary/90`): **"— between closings, before your next client, and when opportunity knocks."**
- Existing paragraph ("Build the business structure, financial foundation…") stays as the smaller supporting body copy below the video.

**Layout changes (applies at all breakpoints, desktop included):**
Switch from the current two-column grid to a single centered column with this vertical order:

```text
1. Headline:  "Money when you need it"
2. Subhead:   "— between closings, before your next client, and when opportunity knocks."
3. Video:     aspect-video, max-w ~640px, centered
4. Body:      "Build the business structure, financial foundation..."
5. CTAs:      Book Free 1:1 Session  /  Read the Free Guide
6. Trust bullets grid (4 items)
7. Trust line: "14+ years brokering · Licensed CA & GA · Certified Credit Suite Partner"
```

- Replace `grid lg:grid-cols-[1.15fr_1fr]` with a single `max-w-3xl mx-auto text-center` container.
- Video wrapper keeps `aspect-video w-full rounded-3xl` styling with its glow blur; widen `max-w-[520px]` → `max-w-[640px]` so it reads well on desktop while still being subordinate to the headline.
- CTAs and trust bullets center-aligned (drop the `lg:text-left` / `lg:justify-start` variants).

**No other files changed.** Header, downstream sections, and `HeroVideo` component remain as-is.