## Goal
Remove the free 1:1 / booking session from the public site: delete the `/one-on-one` page and strip every CTA, link, and mention of booking a 1:1 session. The paid "Cohort Plus +" pricing tier stays untouched (per your answer).

## What gets removed

**Page & route**
- Delete `src/pages/OneOnOnePage.tsx` and its route + import in `src/App.tsx`.
- Delete `src/components/landing/OneOnOneStepsBlock.tsx` (whole "Book your free 1:1" 3-step block) and remove its usage from the landing page.
- Keep `/booking-confirmed` route but remove its "book another session" link (it's a GHL redirect target; removing the route could break inbound links).

**Navigation & global CTAs**
- `SiteHeader.tsx` — remove the "Book Free 1:1" desktop and mobile-menu links.
- `SiteFooter.tsx` — remove the "Book a Session" footer link.
- `StickyMobileCTABar.tsx` — remove the "Book Free 1:1" button; the "Read Guide" button expands to full width.

**Page-level CTAs** (remove the button; keep surrounding copy, re-balance layout so the remaining CTA is centered/full-width)
- `landing/CTASection.tsx`, `landing/HeroSection.tsx`, `landing/IsThisForMe.tsx`
- `pages/AboutPage.tsx` (2 CTAs), `pages/BusinessCreditCardsForRealtorsPage.tsx` (2), `pages/PricingPage.tsx` (2), `pages/SamplePlanPage.tsx`, `pages/DashboardPage.tsx` ("Schedule now →"), `pages/BookingConfirmedPage.tsx`
- `components/plan/NextStepPanel.tsx` and `components/intake/IntakePricingAndReadiness.tsx` — drop the "Book a free 1-on-1" next-step option, leaving the remaining options.

**Copy mentions**
- Scrub 1:1-session wording from `landing/FinalCTABright.tsx`, `landing/GuideContentsBright.tsx`, `landing/CustomPlanPreview.tsx`, `landing/SamplePlanPreview.tsx`, `landing/TestimonialsBright.tsx`, `landing/ProgramCurriculum.tsx`, `landing/LeadForm.tsx`, `landing-avatar/ThreeStepSection.tsx`, `guide/GuideMedia.tsx`, `guide/chapters/Ch13.tsx`, `components/GuidePDF.tsx`, `data/samplePlan.ts`, `pages/IntakeSurveyPage.tsx`, `pages/LandingPage.tsx`, `pages/PaymentSuccessPage.tsx`. Where a section's entire purpose was "book a session," it's replaced with the guide/plan CTA rather than left empty.
- `pages/SmsOptInProofPage.tsx` — update the sample SMS that links to `/one-on-one`.

## Left alone
- Pricing tier "Cohort Plus +" (`data/pricingTiers.ts`), `startCheckout.ts`, `create-checkout-session` — these are paid 1:1 coaching, not the free session.
- Admin `BookingsTab.tsx` / `AdminIntakeList.tsx` and legal pages (`Privacy`, `Terms`) — internal/legal references, no user-facing booking CTA.

## Technical notes
- After edits I'll grep for any remaining `/one-on-one` link to guarantee no dead routes, and run a typecheck.
