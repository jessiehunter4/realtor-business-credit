The section directly above the footer on `/guide` is `GuideResources.tsx` (the “Resources & Additional Information” section plus the back-cover CTA). It still carries old branding and CTAs from the previous version. This plan updates it to match the current Guide → Plan → Implement Freemium model and RE Pro Business Credit identity.

## What we will change

### 1. Update the Resources callout
- Replace “Realtor-Specific Resources: realtorbusinesscredit.com” with **“RE Pro Business Credit: REProBusinessCredit.com”**.
- Change the “Free Needs Analysis & Session Booking: Book Here → /one-on-one” line to **“Create Your Free Customized Plan: Start Here → /intake”**.

### 2. Update the About the Author block
- Keep Jessie Hunter’s bio but align the language with the current guide voice (fellow real-estate pro, learned the hard way, building a clear path for others).
- Ensure the mission statement matches the new vision: thousands of properly structured real estate businesses with access to capital.

### 3. Rewrite the back-cover CTA
- Replace “Book Your One-on-One Session” and “RealtorBusinessCredit.com/one-on-one” with the **Create My Free Customized Plan** CTA pointing to `/intake`.
- Keep the urgency copy (“Don’t Wait Another 10 Years”) but frame it around the free plan, not a paid session.
- Add a brief note that the plan lands in their no-cost RE Pro dashboard.

### 4. Update copyright and footer-adjacent branding
- Change “© 2026 RealtorBusinessCredit.com” to **“© 2026 REProBusinessCredit.com”**.
- Ensure no “Realtor Business Credit” or old URLs remain in the section.

### 5. Verify placement
- Confirm `GuideResources` is rendered immediately before the spacer and `SiteFooter` in `GuidePage.tsx` so the updated content is the last content block above the footer.

## Files affected
- `src/components/guide/GuideResources.tsx`
- `src/pages/GuidePage.tsx` (verification only, no content changes expected)

## Outcome
The guide’s final content section will consistently send readers to Step 2 of the new funnel: creating their free customized plan at `/intake`, with correct RE Pro Business Credit branding.