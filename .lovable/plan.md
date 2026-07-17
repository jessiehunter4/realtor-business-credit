## Goal
Bring every remaining interior/checkout page to the same bright RBC visual system already established on the homepage. Navy stays for headings, header, and footer only — no dark page backgrounds.

## Homepage design audit (source of truth)

1. **Primary color** — Teal `--rbc-teal` / `hsl(var(--primary))` `#12B886` (primary CTA)
2. **Secondary colors** — Sky `#3AA9FF` (secondary CTA), Amber `#FFB020` (accent/callout), Coral `#FF6B6B` (destructive/highlight), Navy `#0B1F3B` (headings, header, footer only)
3. **Gradients** — `bg-hero-grad` (teal→sky→amber @ 14% opacity, 135°) for hero-like sections; `bg-accent-grad` (coral→amber @ 18/16%) for feature glow; ambient blurred blob decorations (`bg-primary/15 blur-3xl`)
4. **Typography** — System stack; fluid headline `clamp(2rem,7vw,3.75rem)` bold text-balance; tagline `clamp(1.125rem,3.4vw,1.875rem)` semibold; body `text-lg/xl text-muted-foreground leading-relaxed text-pretty`; headings use `text-secondary` (navy)
5. **Buttons** — Fully rounded pill `rounded-full`, `px-7 py-4`, `font-semibold`, `shadow-card` → `shadow-card-hover` on hover; primary = teal, secondary = sky, both white text; icon+label pattern with `gap-2`
6. **Border radius** — Cards `rounded-2xl`/`rounded-3xl` (`--radius: 1.25rem`), pills `rounded-full`, chips `rounded-2xl`
7. **Shadows** — `shadow-card` `0 8px 18px rgba(11,31,59,.08)`, `shadow-card-hover` `0 10px 30px rgba(11,31,59,.10)`
8. **Cards** — `bg-card` white, `border border-border` (#E6EEF5), `rounded-2xl/3xl`, `shadow-card`, generous `p-6/p-8` padding
9. **Inputs** — shadcn defaults on `bg-background` with `border-input`, `rounded-md`; forms sit inside white `rounded-2xl` cards
10. **Section spacing** — `py-16 md:py-24`, `container mx-auto px-4`, content `max-w-3xl/5xl mx-auto`
11. **Icons** — `lucide-react`, `h-4/5 w-4/5`, tinted `text-primary` inside `bg-primary/10` rounded chips
12. **Design language** — Bright, airy, playful; navy reserved for typography + chrome; soft gradients + blurred blobs; pill CTAs; trust chips; icon-in-tinted-circle motif; `SiteHeader` + `SiteFooter` on every marketing page; `StickyMobileCTABar` on conversion pages

## Pages to update

Dark backgrounds still present (highest priority):
- `src/pages/CheckoutPage.tsx` — full `bg-secondary` dark theme, custom header, dark cards
- `src/pages/OneOnOnePage.tsx` — 7 dark theme references
- `src/pages/BookingConfirmedPage.tsx` — dark hero/cards
- `src/pages/AdminVideoUpload.tsx` — dark card sections (admin — light touch only)
- `src/pages/GuidePage.tsx` — sticky nav still uses `bg-secondary` (intentional navy chrome, keep but audit)

Pages needing consistency polish (already partially bright):
- `src/pages/SamplePlanPage.tsx`
- `src/pages/PortalPlanView.tsx`
- `src/pages/PrivacyPage.tsx`
- `src/pages/TermsPage.tsx`
- `src/pages/IntakeSurveyPage.tsx`
- `src/pages/BusinessCreditCardsForRealtorsPage.tsx` (recently updated — verify parity)
- `src/pages/AuthPage.tsx`
- `src/pages/OAuthConsentPage.tsx`
- `src/pages/NotFound.tsx`

Admin pages (light pass — keep functional, apply tokens but no marketing polish):
- `AdminDashboard.tsx`, `AdminIntakeList.tsx`, `AdminIntakeCoachView.tsx`, `AdminPlanView.tsx`, `MLSImport.tsx`

## Component/UI changes

- Replace inline `bg-secondary text-secondary-foreground` page shells with `bg-background` + `SiteHeader`/`SiteFooter`
- Replace bespoke buttons with the pill pattern (`rounded-full bg-primary/bg-sky text-primary-foreground/text-sky-foreground px-7 py-4 shadow-card`)
- Convert dark `Card` usages to `bg-card border-border rounded-2xl shadow-card`
- Swap `text-primary-foreground` headings on dark bg → `text-secondary` on light bg
- Replace `text-muted-foreground` on dark → keep semantic but re-check contrast on light
- Add hero-grad or accent-grad decoration section to page tops that currently have flat backgrounds
- Ensure every marketing page mounts `SiteHeader` at top and `SiteFooter` at bottom (checkout/confirmation currently have custom chrome)

## Reusable tokens / helpers to add

Tokens already exist in `src/index.css` (`--rbc-*`) and `tailwind.config.ts` (`bg-hero-grad`, `bg-accent-grad`, `shadow-card`, `shadow-card-hover`, `sky`, `coral`). Proposed additions to reduce copy-paste:

1. **`PageShell` component** (new, `src/components/shared/PageShell.tsx`) — wraps `SiteHeader` + `<main>` + `SiteFooter` with optional `variant="grad" | "plain"` background
2. **`PillButton` variants** — add `sky` and `coral` variants to `src/components/ui/button.tsx` so we stop hand-rolling `rounded-full bg-sky …` classes
3. **`BrightCard` utility class** in `index.css` — `.bright-card { @apply bg-card border border-border rounded-2xl shadow-card p-6; }` (optional; may just standardize via className constant)
4. **`SectionHeader` component** — eyebrow chip + `text-secondary` headline + muted subhead, reused across interior pages

## Risks / inconsistencies

- Checkout/booking pages currently have their own header (logo + branding) — replacing with `SiteHeader` will change nav appearance while user is mid-purchase. Mitigation: keep `SiteHeader` but hide non-essential nav items on checkout (a `minimal` prop)
- Admin pages use different information density; forcing pill CTAs everywhere would look off. Mitigation: apply tokens (colors, radius, shadow) but keep tighter admin spacing
- `GuidePage` sticky bar is intentionally navy (chrome). Keep, but confirm contrast against the bright body
- Dark `Card` variants may rely on `text-muted-foreground` reading well on `bg-card/5` — re-verify on white
- Third-party embeds (EveryCatch iframe, Stripe payment link) — no styling changes; only container is restyled
- `text-sky-foreground` currently `#ffffff` — verify Tailwind picks it up (defined in `tailwind.config.ts` colors.sky.foreground)

## Step-by-step implementation approach

1. **Foundations (1 pass)** — Add `sky` + `coral` button variants to `button.tsx`; add optional `PageShell` and `SectionHeader` components; document class conventions at top of `index.css`
2. **Highest-impact conversion pages (parallel)** — Rewrite `CheckoutPage`, `OneOnOnePage`, `BookingConfirmedPage`, `SamplePlanPage` using `PageShell` + pill buttons + bright cards; add `bg-hero-grad` opener where hero exists
3. **Content/legal pages** — `PrivacyPage`, `TermsPage`, `NotFound`, `OAuthConsentPage`, `AuthPage`: convert to `PageShell`, apply typography + card styles
4. **Portal/user-facing** — `PortalPlanView`, `IntakeSurveyPage`: bright cards, pill CTAs, keep functional density
5. **Admin pass (light)** — `AdminDashboard`, `AdminVideoUpload`, `AdminIntakeList`, `AdminIntakeCoachView`, `AdminPlanView`, `MLSImport`: swap dark surfaces for `bg-card`, adopt token colors, keep dense tables/forms
6. **QA pass** — Read each updated page in preview at desktop + mobile, verify header/footer present, verify no `bg-secondary` page shells remain, verify CTAs use pill pattern, check that guide/checkout flow retains embedded widgets
7. **Grep verification** — final `rg "bg-secondary text-secondary-foreground|from-navy|to-navy|#0d1b2a"` sweep to confirm no stray legacy dark classes on page-level containers

No content, copy, routing, or backend logic will change — visual/presentation only.