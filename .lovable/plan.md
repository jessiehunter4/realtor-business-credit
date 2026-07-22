# Rebrand Audit — Realtor Business Credit → RE Pro Business Credit

**New brand hierarchy to apply everywhere:**

- Parent: **My Better Business Credit** (unchanged)
- Vertical: **RE Pro Business Credit** (replaces "Realtor Business Credit")
- Descriptor: *Business Credit & Finance for Real Estate Professionals*
- Endorsement line: *A specialized program of My Better Business Credit*

No code will change in this plan — this is scope only. 53 source files reference the old brand.

---

## 1. Brand tokens & terminology map


| Old                                                                                                        | New                                                                                     | Notes                                                             |
| ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Realtor Business Credit                                                                                    | RE Pro Business Credit                                                                  | Product/vertical name                                             |
| RBC (short)                                                                                                | REP or RE Pro                                                                           | Used in headers, tags, code IDs                                   |
| RBC Guide                                                                                                  | RE Pro Guide                                                                            | Mobile header label                                               |
| Realtor Business Financial Needs Analysis                                                                  | RE Pro Business Financial Needs Analysis                                                | Intake form title                                                 |
| Realtor Business Structure, Finance & Credit Guide                                                         | RE Pro Business Structure, Finance & Credit Guide                                       | Guide title                                                       |
| Realtor Business Credit Plan                                                                               | RE Pro Business Credit Plan                                                             | Deliverable                                                       |
| realtorbusinesscredit.com                                                                                  | (TBD — see Open Questions)                                                              | Custom domain                                                     |
| LandingPageRealtorBusinessCredit (source string)                                                           | LandingPageREProBusinessCredit                                                          | GHL source field                                                  |
| Tags: `l-visited-rbc-site`, `c-clicked-rbc-guide`, `a-rbc-optin`, `RealtorBusinessCredit`, `FromMLSImport` | `l-visited-repro-site`, `c-clicked-repro-guide`, `a-repro-optin`, `REProBusinessCredit` | GHL tag strings — coordinate with GHL workflows before flipping   |
| Trademark/legal name: "Realtor"                                                                            | "RE Pro"                                                                                | Also removes NAR® trademark risk of "Realtor" in the product name |


---

## 2. File-by-file inventory (Priority · Reason)

### 2a. SEO / metadata / discoverability — **HIGH**

- `index.html` — `<title>`, description, `og:title`, `og:description`, canonical, `og:image` (placeholder Lovable URL still present), favicon URL is generic RBC asset. Also `twitter:site="@Lovable"` is stale.
- `public/sitemap.xml` — 6 absolute URLs on `realtorbusinesscredit.com`.
- `public/robots.txt` — Sitemap absolute URL.
- `src/components/shared/Seo.tsx` — likely bakes canonical/OG base.
- Per-page `<Seo>` titles/descriptions: `LandingPage`, `GuidePage`, `PricingPage`, `SamplePlanPage`, `CheckoutPage`, `MockDashboardPage`, `MockLoginPage`, `PrivacyPage`, `TermsPage`, `IntakeSurveyPage`, `AuthPage`, `OneOnOnePage`, `AboutPage`.
- JSON-LD Organization block in `LandingPage.tsx` and Product schema in `PricingPage.tsx`.

### 2b. Logos, favicon, brand images — **HIGH**

- `src/assets/brand/` — 5 pointer files: `rbc-favicon`, `rbc-logo-color`, `rbc-logo-mono`, `rbc-logo-narrow`, `rbc-logo-white-bg`. All referenced in `SiteHeader.tsx` and `index.html`. Need new "RE Pro" versions uploaded via `lovable-assets`; keep filenames or rename to `repro-*`.
- Any `<img alt="Realtor Business Credit">` (SiteHeader has 2, MockLoginPage, PlanPDF/PlanDocument likely).

### 2c. Navigation, header, footer — **HIGH**

- `src/components/shared/SiteHeader.tsx` — logo alt text, aria-label.
- `src/components/shared/SiteFooter.tsx` — legal footer says "Realtor Business Credit and My Better Business Credit do not provide…".
- `src/pages/GuidePage.tsx` — sticky bar mobile label "RBC Guide" and desktop "Realtor Business Credit".

### 2d. Homepage & marketing components — **HIGH**

- `src/components/landing/`: `HeroSection.tsx`, `FinalCTABright.tsx`, `SamplePlanPreview.tsx`, `GuideContentsSection.tsx`, `ProgramCurriculum.tsx`, `OneOnOneStepsBlock.tsx`, `LeadForm.tsx`.
- `src/components/oneonone/PlanMockupCard.tsx`.

### 2e. Guide (13 chapters + wrappers) — **HIGH**

- `GuideCover.tsx`, `GuideIntroduction.tsx`, `GuideConclusion.tsx`, `GuideTOC.tsx`, `GuideResources.tsx`, `GuideComponents.tsx`, `GuideOptInGate.tsx`.
- Chapters with hits: `Ch02.tsx`, `Ch04.tsx`, `Ch13.tsx` (recommend re-reading all 13 for stray mentions).
- `src/components/GuidePDF.tsx` — PDF cover, headers, footers.

### 2f. Plan deliverable — **HIGH**

- `src/components/plan/PlanDocument.tsx` (web) — plan title, footer branding.
- `src/components/plan/PlanPDF.tsx` — PDF title, footer, endorsement line.
- `src/pages/SamplePlanPage.tsx` — sample plan title + SEO.
- `src/data/samplePlan.ts` — verify any hardcoded brand strings inside sample content.

### 2g. Dashboards, forms, portal — **MEDIUM**

- `src/pages/MockDashboardPage.tsx` — SEO + hero copy + activity feed strings ("You downloaded the Realtor Business Credit Guide").
- `src/pages/MockLoginPage.tsx` — hero + SEO.
- `src/pages/IntakeSurveyPage.tsx` — form title, success message.
- `src/pages/AdminDashboard.tsx`.
- `src/data/mockDashboard.ts` — seed strings.

### 2h. Auth & OAuth — **HIGH (user-facing trust)**

- `src/pages/AuthPage.tsx` — "Sign in to access the Realtor Business Credit admin dashboard".
- `src/pages/OAuthConsentPage.tsx` — consent copy "…is requesting access to Realtor Business Credit on your behalf." Consent screens are legally sensitive; align brand + parent brand disclosure here.

### 2i. Legal pages — **HIGH**

- `src/pages/PrivacyPage.tsx` — brand definitions, contact email `support@mybetterbusinesscredit.com` (unchanged — parent brand), several mentions.
- `src/pages/TermsPage.tsx` — same pattern; entity name in "you agree to indemnify…".
- Confirm with counsel: the operating entity remains My Better Business Credit; RE Pro Business Credit is the DBA/program brand.

### 2j. Payments / commerce — **MEDIUM**

- `src/pages/PricingPage.tsx` — Product schema, SEO, page copy, Stripe Payment Link product names (external — update in Stripe dashboard).
- `src/pages/CheckoutPage.tsx` — SEO, headline, line-item name "Personalized Realtor Business Credit Plan".

### 2k. Backend edge functions & CRM integration — **HIGH (data lineage)**

- `supabase/functions/submit-lead/index.ts` — `source: 'LandingPageRealtorBusinessCredit'` (2 places), tags `['a-rbc-optin']` (2 places).
- `supabase/functions/sync-to-ghl/index.ts` — `source: 'RealtorBusinessCredit'`, tags `['JustClosed','RealtorBusinessCredit','FromMLSImport']`.
- `supabase/functions/generate-plan/index.ts` — brand strings inside AI prompt; retitle output.
- `supabase/functions/mcp/index.ts` and `src/lib/mcp/index.ts`, `src/lib/mcp/tools/list-agents.ts` — MCP server display name/description.
- `src/lib/logFunnelEvent.ts` — any brand strings in event metadata.
- `src/pages/LandingPage.tsx` and `src/pages/GuidePage.tsx` — client-side tag calls `l-visited-rbc-site`, `c-clicked-rbc-guide`.

### 2l. Database seed/migration — **MEDIUM**

- `supabase/migrations/20251121190517_*.sql` — contains brand references (likely seed data or enum defaults). Handle with a **new** additive migration; do not edit existing migrations.
- Existing DB rows (leads, contact_syncs, funnel_events, custom_plans) with old source/tag values — decide: leave historical, or backfill.

### 2m. Config / env / misc — **LOW–MEDIUM**

- `src/index.css` — a comment/token references the brand (verify no CSS class name coupling).
- `README.md` — project description.
- `.env` — no user-owned brand keys expected, but check `VITE_*` public strings.
- `.lovable/plan.md`, `.lovable/mcp/manifest.json` — informational; MCP manifest display name is user-visible in agent clients.
- `mem://` memory files reference "Realtor Business Credit" and `realtorbusinesscredit.com` in Core and multiple detail files — update after rebrand.

### 2n. Email templates & automation — **HIGH, but mostly external**

- No transactional email templates found in-repo (Supabase Auth uses defaults; GHL owns marketing email/SMS).
- Action: audit inside GoHighLevel/EveryCatch for every template, workflow name, trigger tag, and merge-field copy that says "Realtor Business Credit". Coordinate tag renames (§1) with workflow trigger conditions to avoid orphaning automations.

### 2o. Domain, DNS, published URLs — **HIGH, external**

- Current: `realtorbusinesscredit.com`, `www.realtorbusinesscredit.com`, `realtor-business-credit.lovable.app`.
- Decision needed (see Open Questions) — new domain purchase, DNS, SSL, 301 redirect map, canonical/OG/sitemap updates, robots.txt sitemap URL, JSON-LD `url` field.

---

## 3. Risks & dependencies

1. **SEO regression.** Domain change + title/description rewrite will drop rankings temporarily. Requires 301 map + Search Console change-of-address + sitemap resubmit.
2. **GHL tag rename breaks live automations.** Every workflow triggered by `RealtorBusinessCredit` / `a-rbc-optin` / `l-visited-rbc-site` / `c-clicked-rbc-guide` must be updated in GHL **before** flipping strings in edge functions, or leads stop routing. Safer path: dual-tag (old + new) for 2 weeks, then remove old.
3. **Historical data lineage.** Rows already stamped with `source='LandingPageRealtorBusinessCredit'` should stay for accurate historical funnel analytics — do not backfill unless the admin funnel dashboard groups by source.
4. **"Realtor®" trademark.** NAR restricts commercial use of "Realtor" in product names. The rebrand actually **reduces** legal risk — highlight this benefit to the founder.
5. **OAuth / MCP consent screen** — changing the client display name after users have consented may re-prompt. Acceptable but note it.
6. **PDF/plan caching.** Users who downloaded PDFs keep the old branding. Not fixable retroactively.
7. **Asset URLs are immutable.** New logos will get new `/__l5e/assets-v1/<uuid>/…` URLs. Old logo assets should be deleted only after all references are moved.
8. **Legal review.** Privacy & Terms name changes require the operating entity (My Better Business Credit) to be preserved; only the program brand changes. Consider a "d/b/a" clarification line.
9. **Voice consistency.** "Realtor" also appears in *body copy* meaning the profession, not the brand — those references should stay. Only brand-name uses change. This requires careful line-by-line review, not global find/replace.
10. `**RBC` acronym collisions.** `RBC` also means "Royal Bank of Canada" — moving off it is a positive side effect. Also appears in asset filenames (`rbc-logo-*`) — rename or leave in place (URLs are opaque to end users).

---

## 4. Phased implementation plan

### Phase 0 — Decisions & prep (blocking)

- Confirm final brand name spelling & capitalization ("RE Pro Business Credit" vs "REPro" vs "RE-Pro").
- Confirm domain strategy (see Open Questions).
- Provide new logo files (favicon, color, mono, narrow, white-bg variants) or approve AI-generated versions.
- Draft new endorsement line + descriptor for legal review.
- Inventory GHL workflows dependent on old tags.

### Phase 1 — Brand assets & tokens (1 PR)

- Upload new logo/favicon variants via `lovable-assets`; add new pointer files under `src/assets/brand/`.
- Keep old pointers in place until Phase 2 lands (avoids broken images).

### Phase 2 — Sitewide user-facing copy (1 PR)

- Update all React components in §2b–2j: header, footer, landing components, guide chapters + PDF, plan document + PDF, sample plan page, dashboards, forms, auth pages, OAuth consent, legal pages, pricing, checkout.
- Update all `<Seo>` titles/descriptions and JSON-LD.
- Update `index.html` head (title, description, og:*, favicon, twitter, remove `@Lovable`).
- Add the endorsement line to footer + legal + plan cover.

### Phase 3 — SEO & discovery infrastructure (1 PR + external)

- Rewrite `public/sitemap.xml` and `public/robots.txt` for new domain.
- Set up 301 redirects at Lovable custom domain layer (old → new).
- Submit change-of-address in Google Search Console; resubmit sitemap.

### Phase 4 — Backend integration & tags (staged)

- **Step A (dual-tag):** edge functions apply both old and new tags/source strings for 2 weeks. In GHL, clone workflows to trigger off either.
- **Step B (cutover):** GHL workflows switched to new-only triggers.
- **Step C (cleanup):** edge functions emit new-only strings; remove old tag emissions.
- Files: `submit-lead`, `sync-to-ghl`, `generate-plan`, `mcp`, `LandingPage.tsx`, `GuidePage.tsx`, `logFunnelEvent.ts`.

### Phase 5 — Data, mocks, MCP metadata (1 PR)

- Update `src/data/mockDashboard.ts`, `src/data/samplePlan.ts` (verify), MCP tool descriptions and server display name, `.lovable/mcp/manifest.json`, `README.md`.
- Add optional additive migration if any enum/default in DB uses the brand string; leave historical rows.

### Phase 6 — External systems (owner: founder, tracked)

- Stripe: rename products / update Payment Link descriptions.
- GHL/EveryCatch: rename email + SMS templates, workflow names, calendar name, pipeline names, form names.
- Fundability Scan white-label branding (if applicable).
- Social profiles, business cards, email signatures.

### Phase 7 — Cleanup

- Delete old brand asset pointers (`lovable-assets delete`) only after verifying no code references remain.
- Update memory files (`mem://index.md` and detail files).
- Final `rg` sweep to confirm zero unintended `Realtor Business Credit` / `RBC` occurrences.

---

## 5. Open questions (please answer before Phase 1)

1. **Exact brand name spelling** — "RE Pro Business Credit", "REPro Business Credit", or "RE-Pro Business Credit"?
2. **Domain** — buy `reprobusinesscredit.com` (or similar)? Or keep `realtorbusinesscredit.com` and rebrand copy only for now? This decision drives ~30% of the work.
3. **Should we run the dual-tag/dual-source overlap in GHL**, or hard-cutover on a specific date?
4. **Rename backend/asset identifiers** (`rbc-logo-*.png`, event names like `l-visited-rbc-site`) to `repro-*`, or leave the internal strings and change only user-facing copy? Renaming is cleaner but touches more files and analytics history.
5. **Historical data**: leave old `source`/tag values on existing rows, or backfill to new values?

---

## 6. Technical notes (for implementers)

- Do NOT edit prior Supabase migrations — add a new one if any DB default changes.
- Do NOT do a naive project-wide find/replace of "Realtor" — the word appears in body copy referring to the profession and must stay.
- Safe replacements: `Realtor Business Credit` → `RE Pro Business Credit`; `realtorbusinesscredit.com` → new domain; `\bRBC\b` (case-sensitive, word-boundary) → new short form.
- Use `lovable-assets create` for new logo/favicon uploads; new UUID-based URLs will not conflict with old ones.
- Old brand asset pointer files should be removed with `lovable-assets delete` only after Phase 7 verification.