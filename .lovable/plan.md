# Pricing Page Redesign

Refactor `src/pages/PricingPage.tsx` in place — same route, same three tiers, upgraded UX and conversion elements. Reuse the existing bright design system (SiteHeader/Footer, shadcn Accordion/Badge, `bg-hero-grad`, `shadow-card`, primary/secondary tokens) so it feels native to the site.

## Sections (top → bottom)

1. **Hero** — Badge "Pricing", H1 "Choose your path to money when you need it", supporting line, two secondary links (Read the Guide, See a Sample Plan).
2. **Pricing cards (3-up)** — redesigned card:
   - Plan name + one-line value prop
   - Price + cadence (with small "billed once" / "over 90 days" / "per quarter" clarifier)
   - "Best for…" line
   - **Includes** feature list (Check icons)
   - **Not included** line for the two lower tiers (Minus icon, muted) — makes limitations explicit
   - Primary CTA button → tier-specific Stripe Payment Link (new tab, `rel="noopener"`)
   - Secondary text link "Prefer to talk first? Book a free 1:1" → `/one-on-one`
   - Highlighted middle tier (Cohort) with "Most Popular" ribbon and subtle ring — already the pattern, kept
3. **Reassurance strip** — 4 icon items: Secure Stripe checkout · 30-day satisfaction guarantee · Free 1:1 first · Cancel anytime (where applicable)
4. **Comparison table** — keep existing rows, tighten styling; sticky header on scroll for mobile-friendly horizontal scroll; each column header links to its tier's Stripe link.
5. **Testimonials** — new 3-card grid with placeholder quotes clearly marked `[Sample testimonial — replace with real client quote]`. Avatar initials, name/role, star row. Uses `shadow-card` cards.
6. **Guarantee callout** — full-width panel: "30-Day Satisfaction Guarantee. If within 30 days of enrolling you feel this isn't the right fit, email us and we'll refund your enrollment — no hard feelings." (Exact wording confirmed with user before ship; placeholder for now.)
7. **FAQ** — keep existing 7 items, add two: "Is my payment secure?" and "What does the 30-day guarantee cover?"
8. **Final CTA** — keep existing gradient panel; add small "Questions before you buy? Book a free 1:1" secondary link.

## Stripe integration

User will provide three Stripe Payment Link URLs. Until provided, use placeholder constants at the top of the file:

```
const STRIPE_LINKS = {
  selfPaced: "https://buy.stripe.com/REPLACE_SELF_PACED",
  cohort:    "https://buy.stripe.com/REPLACE_COHORT",
  oneOnOne:  "https://buy.stripe.com/REPLACE_ONE_ON_ONE",
};
```

Each tier CTA:
- `<a href={STRIPE_LINKS.x} target="_blank" rel="noopener noreferrer">`
- Label: "Get Started" (self-paced), "Enroll in Cohort" (cohort, primary style), "Start 1:1 Coaching" (1:1)
- Secondary "Book Free 1:1" link stays under every card for hesitant buyers

Existing `/checkout` page and its Stripe link stay untouched (used from Portal/other flows).

## SEO / accessibility

- Keep `<Seo>` with title/description; extend JSON-LD `Product`/`Offer` `url` to point at each Stripe Payment Link once provided
- Proper `<section aria-labelledby>` on every block, single H1, `<th scope>` on comparison, `alt`/`aria-label` on decorative icons
- Focus rings preserved via existing button styles

## Files touched

- `src/pages/PricingPage.tsx` — full refactor in place
- No new routes, no header/footer/nav changes, no backend changes

## Follow-up needed from you

- Three Stripe Payment Link URLs (one per tier) to replace placeholders
- Final wording for the 30-day guarantee (I'll ship a reasonable default; you can tweak)
