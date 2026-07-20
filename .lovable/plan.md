# Visitor Flow Prototype (UI-only)

Goal: after the Guide opt-in form is submitted, send the visitor through a mock login screen and into a mock visitor dashboard. No auth, no backend, no DB changes.

## Flow

```text
/guide (opt-in form)
   └─ submit ──▶ /mock-login (email + password UI)
                    └─ "Log in" ──▶ /mock-dashboard (placeholder data)
```

## Changes

### 1. `GuideOptInGate` submission handoff
- Keep existing form + validation as-is.
- On successful submit, instead of unlocking the guide inline, navigate to `/mock-login` and pass the entered `firstName` + `email` via `navigate(..., { state })` so the mock pages can personalize.
- Keep the existing `localStorage` completion flag so returning users still bypass the gate on `/guide`.

### 2. New page: `src/pages/MockLoginPage.tsx` (route `/mock-login`)
- `SiteHeader` + bright brand shell (bg-hero-grad, shadow-card, rounded-3xl card, pill buttons — matches homepage).
- Centered auth card:
  - Eyebrow: "Welcome back"
  - H1: "Log in to your Realtor Business Credit portal"
  - Email input (prefilled from nav state if present)
  - Password input with show/hide toggle
  - "Remember me" checkbox + "Forgot password?" link (visual only, `#`)
  - Primary pill button: "Log in" → `navigate('/mock-dashboard', { state })`
  - Divider + secondary "Create an account" link (visual only)
- Trust strip below card: "Secure · Private · Realtor-only"
- No validation beyond `required`; no API calls. Comment block at top marks it as UI mock and lists the integration points for later (Supabase auth swap-in).

### 3. New page: `src/pages/MockDashboardPage.tsx` (route `/mock-dashboard`)
- `SiteHeader` + bright shell, matching homepage tokens.
- Greeting: "Welcome back, {firstName || 'Realtor'}"
- Top row of 3 stat cards (mock numbers):
  - Fundability Score — 62 / 100 (progress ring)
  - 90-Day Plan Progress — 4 of 12 steps
  - Next Session — "Thu 2:00 PM PT"
- Main grid:
  - Left (2/3): "Your Custom Plan" preview card (reuse look of `CustomPlanPreview` at smaller scale) with a mock 5-item task checklist (checkboxes, non-persistent local state).
  - Right (1/3): Stack of small cards — "Book a 1:1", "Continue the Guide", "Sample Plan", each a pill CTA to existing routes.
- Bottom row: "Recent Activity" list (3 static rows) and "Resources" links.
- Log-out button in top right → `navigate('/')` and clears any local state used by this mock.

### 4. Router
- Register `/mock-login` and `/mock-dashboard` in `src/App.tsx` alongside existing routes. Public routes, no guards.
- Add `ScrollMemory` behavior automatically via existing global component (no change).

## Non-goals / explicitly out of scope
- No Supabase auth wiring, no profiles table, no RLS.
- No changes to `AuthPage`, admin routes, or MLS/GHL logic.
- No changes to lead submission POST or CRM sync — the opt-in still records the lead exactly as today; only the post-submit UI destination changes.

## Design tokens
Bright shell (`bg-hero-grad`), `shadow-card`, `rounded-3xl` cards, pill buttons (Teal primary / Sky secondary), fluid `clamp()` type sizes — consistent with homepage and modernized interior pages.

## Extensibility hooks (comments only, no code yet)
- `MockLoginPage`: TODO markers for `supabase.auth.signInWithPassword` and redirect target.
- `MockDashboardPage`: TODO markers for fetching profile, plan, tasks, and next appointment.
