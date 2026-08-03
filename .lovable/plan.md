# Personalized Guide URLs: `/guide/:slug`

Give every visitor a personal entry point to the free guide, e.g. `reprobusinesscredit.com/guide/jp-eltanal`. The slug is the only personalization source for now — no database or CRM lookup. The existing `/guide` page keeps working exactly as it does today.

## What the visitor experiences

- Landing on `/guide/john-paul` shows the same guide, with the name woven into the top of the page: a short greeting above the title ("Welcome, John Paul — this guide was put together for real estate pros like you") and a personalized line on the opt-in gate and the closing CTA.
- If the slug looks like a real name, we use it. If it looks like junk (numbers, gibberish, too long, encoded tracking ids), the page silently falls back to the normal non-personalized guide — never an error page, never a broken greeting.
- Everything downstream is unchanged: Guide -> Start Here -> Lead Form -> Intake -> Plan -> Account -> Dashboard. Existing `?contactId=` / `rbc_contact` identity handling continues to take priority over the slug when present.

## Technical plan

### 1. Routing

- In `src/App.tsx`, add `<Route path="/guide/:slug" element={<GuidePage />} />` directly after the existing `/guide` route. React Router v6 ranks the static `/guide` above the dynamic child, so there is no conflict; `/guide` alone still renders the unpersonalized page.
- No other route uses a `/guide/*` prefix, so there is no collision with `/sample-plan`, `/landing-page/:slug`, or the catch-all `*`.

### 2. Slug parsing helper

- New `src/lib/visitorSlug.ts` exporting `parseVisitorSlug(slug?: string): { raw: string; displayName: string; isValid: boolean }`.
- Validation: decode URI, trim; accept only letters, spaces, hyphens, underscores, plus signs and apostrophes; reject empty, length over 60, more than 4 words, or anything containing digits.
- `displayName`: replace `-`/`_`/`+` with spaces, collapse whitespace, title-case each word.
- This centralizes logic currently inlined in `LandingWithAvatarPage.tsx`; that page is refactored to import the same helper so both personalized entry points behave identically.

### 3. Guide page personalization

- `src/pages/GuidePage.tsx` reads `useParams<{ slug?: string }>()` and calls `parseVisitorSlug`.
- Name precedence: `firstName` from `useContactIdentity()` (URL param or stored identity) first, then the slug's `displayName`, then nothing.
- Pass the resulting `visitorName` into:
  - `GuideCover` — optional greeting line above the H1, rendered only when a name exists so the default layout is untouched.
  - `GuideOptInGate` — personalized heading, and the first-name field pre-filled from the slug (still editable, still required).
  - `FloatingPlanCTA` / final CTA copy — optional name interpolation.
  - Reserved for HeyGen: the same `visitorName` is what a future avatar greeting variable consumes, so no extra plumbing is needed later.
- SEO: keep `Seo` `path` as `/guide`, emit a canonical to `/guide`, and add `noindex` on slug variants so personalized URLs do not fragment search indexing.

### 4. Analytics and identity continuity

- When a valid slug is present, merge `{ slug }` into stored identity via `mergeContactIdentity` so later steps can reference where the visitor came from.
- Include `slug` in the metadata of the existing `guide_view` funnel event. No new event types, no edge-function changes.

### 5. Fallback behavior

| Case | Behavior |
| --- | --- |
| `/guide` (no slug) | Current page, no greeting |
| Malformed / numeric / overlong slug | Guide renders normally, greeting suppressed |
| Unsupported characters | Same as malformed — suppressed, no error |
| Slug present but visitor already identified | Stored `firstName` wins |

No redirects and no 404s — a bad slug degrades to the standard guide.

### 6. Future EveryCatch readiness

No URL change will be needed. When EveryCatch is wired up, a slug is generated per MLS lead, stored in a custom field, and sent via email/SMS as `/guide/{{contact.rbc_slug}}`. At that point the only addition is an optional lookup that resolves the slug to a contact record; the parsing helper, the `visitorName` prop chain, and the fallback path stay as-is. Links can also keep carrying `?contactId=` alongside the slug, which the existing identity hook already handles.

## Phases

1. Add `src/lib/visitorSlug.ts` with parser sanity checks.
2. Add the route in `App.tsx`; verify `/guide` and `/guide/x` both render.
3. Thread `visitorName` through `GuidePage`, `GuideCover`, and `GuideOptInGate`.
4. Refactor `LandingWithAvatarPage` onto the shared helper.
5. Add canonical/noindex handling and slug metadata on `guide_view`.
6. Manual pass: valid slug, malformed slug, no slug, slug + existing `contactId`, and the full flow through to intake.