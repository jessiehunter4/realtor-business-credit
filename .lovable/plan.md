## Goal
Make `/business-credit-cards-for-realtors` visually consistent with the landing page (`HeroSectionBright`, `IsThisForMe`, `FinalCTABright`) — same bright, navy/teal/sky/amber palette, gradient hero, rounded cards, and CTA styling. No copy/content changes, no structural reorganization beyond what's needed to apply the look.

## Changes (file: `src/pages/BusinessCreditCardsForRealtorsPage.tsx`)

**Hero section**
- Replace dark `bg-secondary` hero with a bright gradient hero matching `HeroSectionBright`: `relative overflow-hidden bg-hero-grad` with three blurred color blobs (primary, sky, accent).
- Headline: `text-secondary` with `text-[clamp(...)]` fluid scale + `text-balance`; keep the eyebrow line ("Educational round-up · Updated 2026") in primary.
- Subhead in `text-muted-foreground`.
- CTA buttons → pill-shaped (`rounded-full`) primary (teal) and sky-colored secondary, matching hero CTAs (`bg-primary`/`bg-sky`, `shadow-card`, hover states). Drop the outline variant.

**TL;DR card**
- Keep structure, but switch to the bright card pattern: `bg-card border border-border rounded-2xl shadow-card` with a subtle `bg-hero-grad` or primary-tinted accent. Checkmark icons stay `text-primary`.

**Categories grid**
- Cards use `bg-card border border-border rounded-2xl shadow-card hover:shadow-card-hover transition-shadow` (matching `IsThisForMe`).
- Icon chip: `rounded-2xl bg-primary/10 text-primary` (12x12) — rotate accent tones (`bg-sky/15 text-sky`, `bg-accent/20 text-accent-foreground`, `bg-primary/10 text-primary`) across the 5 cards for visual rhythm.
- "Best for" label uses `text-primary`; "Watch-outs" label uses `text-accent-foreground` with amber accent.

**"Why the order matters" section**
- Replace `bg-muted/30` with `bg-hero-grad` band (matching the gradient feel) wrapped in a rounded container, or keep section background but add a bright wrapper card. Buttons → same pill style (primary + sky).

**FAQs**
- Keep left-border treatment but switch border to `border-primary` and tighten typography to match landing rhythm.

**Final CTA**
- Add a `FinalCTABright`-style block at the bottom (reuse the existing component or inline equivalent) so the page closes with the same CTA card the home page uses. Pass `guideLink="/guide"`.

## Out of scope
- No copy rewrites, no new content sections, no SEO/metadata changes, no header/footer changes (already `SiteHeader`/`SiteFooter`).
- No changes to `index.css` tokens — only Tailwind utility classes already in the design system.
