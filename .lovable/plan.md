
# RE Pro Business Finance & Credit Guide — v2

Rewrites the online guide and its PDF twin around the new draft you supplied. The existing scaffolding (13 chapter files, floating TOC, progress bar, opt-in gate, `GuidePDF.tsx`) stays; the content, callouts, CTAs, and visuals change.

## 1. Scope of changes

**Content — all 13 chapters + intro + conclusion**
Replace copy in `src/components/guide/chapters/Ch01.tsx` … `Ch13.tsx`, `GuideIntroduction.tsx`, `GuideCover.tsx`, `GuideConclusion.tsx` with the new draft. Expand the outline into short narrative paragraphs in Jessie's first-person voice (not bullet dumps), keeping each chapter to a 2–4 minute read. Every chapter ends with a **Chapter Takeaway** and, where the draft calls for them, a **Jessie's Real-World Note**, **Good Nugget**, and **Your Next Move** callout — new variants added to `GuideComponents.tsx`.

**Funnel / CTAs**
- Retire the "Book a One-on-One Session" model inside the guide. Replace `ChapterBookCTA` at the end of each chapter with a new `ChapterPlanCTA` ("Create My Free Customized Plan" → `/intake`).
- Replace `FloatingBookCTA` with `FloatingPlanCTA` (same behavior, new label + link).
- Chapter 12 becomes the "Now create your plan" chapter with the primary CTA; Chapter 13 introduces DIY / Cohort / Cohort+ implementation tiers.
- `GuideConclusion.tsx` closes with the three-step recap (Guide ✓ → Plan → Implementation) and the primary "Create My Plan" button.

**Framing pages**
- `GuideCover.tsx`: new title "Real Estate Professional Business Finance & Credit Guide", subtitle "Build the financial structure behind your real estate career…", presented by RE Pro Business Credit / My Better Business Credit.
- `GuideIntroduction.tsx`: "Welcome from Jessie Hunter" + "Your Three-Step RE Pro Path" section (Read → Plan → Implement) with the freemium promise block.
- `GuideTOC.tsx` / `GuideFloatingTOC.tsx` / `GuideSkim.tsx`: retitle chapters to match new outline.

**Visuals (AI-generated where noted in the draft)**
Generated into `src/assets/guide/` and referenced from both web and PDF:
- Ch1: split visual — personal cards/savings vs business banking/reserves
- Ch2: business-identity wheel (EIN, banking, website, email, address, accounting, credit, licensing)
- Ch3: reuse the RE Pro Business Credit Structure graphic you attached (drop into `src/assets/guide/structure-diagram.*`)
- Ch4: "bridge" illustration — Personal Credit Support → Business-Supported Capital
- Ch5: reuse the five-stage progression graphic you attached
- Ch6: lender-readiness component row
- Ch7: NAICS decision tree (brokerage / property mgmt / ownership / admin ops)
- Ch8: 0–6 month financial runway gauge
- Ch9: capital-use icon row
- Ch10: dashboard mockup (green / navy / teal / amber with Strong / In Progress / Needs Attention / Not Started status chips)
- Cover / hero: new RE Pro Business Credit logo (from your attachment)

If any of the two attached graphics or the new logo aren't already in the project when I start building, I'll pause and ask you to re-upload before generating replacements.

**PDF parity (`src/components/GuidePDF.tsx`)**
Same chapter order, copy, callouts, and images as the web version. Explicit `break` on every `<ChapterStart>` so each chapter starts on a new page; `wrap={false}` on takeaway/nugget/CTA boxes so they don't split across pages. New cover and closing page mirror the web framing. Manual TOC page-number array updated after a full render pass (per project memory).

## 2. Technical details

- **New components in `src/components/guide/`**: `ChapterPlanCTA.tsx`, `FloatingPlanCTA.tsx`, plus `JessieNote`, `GoodNugget`, `NextMove` exports added to `GuideComponents.tsx` (web) with matching styled blocks in `GuidePDF.tsx`.
- **Routing/data**: no schema or edge-function changes. `/intake` remains the plan-generation entry point; guide-completion → dashboard access is already handled by `GuideOptInGate` + existing localStorage flag.
- **Removals**: `ChapterBookCTA.tsx` and `FloatingBookCTA.tsx` deleted after references are swapped; any remaining "Book a 1:1" / EveryCatch booking links inside the guide surface only are removed. Booking flows elsewhere on the site are untouched in this task.
- **QA**: after edits I run `bun run build`, then render the PDF and visually inspect every page for overflow, orphaned takeaway boxes, missing images, and correct chapter breaks; sync the TOC page-number array; re-render until clean.

## 3. Out of scope for this task

Homepage, pricing page, intake survey, admin, and the rest of the site keep their current copy. If you want the "1-on-1" language scrubbed elsewhere or the pricing page reframed around DIY / Cohort / Cohort+, that's a follow-up plan.
