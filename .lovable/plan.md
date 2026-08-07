# Pricing FAQ — Recommended Changes

Review of the 10 FAQ items on `/pricing`. Three are inconsistent with current pricing/product naming, a few can be tightened, and two topics are missing.

## Fixes (accuracy — these are wrong today)

1. **"Can I switch or upgrade plans later?"** — still says "Self-Paced Blueprint" and "move to 1:1 later". Tiers are now **DIY (Do it Yourself)**, **Pro Cohort**, and **Cohort Plus**. Rewrite using current names.
2. **"Do I have to pay upfront? Is there a payment plan?"** — mentions "Cohort or Cohort Plus tier" but omits DIY, and the payment-plan answer is vague ("we can walk through options"). Either state plainly that payment is one-time via Stripe and plans are handled case-by-case on a call, or drop the payment-plan half of the question.
3. **"What's included in the free custom plan?"** — thinnest answer on the page and overlaps almost entirely with "Is there a free option?". Merge the two into one Free-tier answer, or expand this one to describe the plan's actual sections (goals snapshot, fundability status, 90-day actions, 6–12 month roadmap, funding options).

## Additions (questions buyers actually ask before paying)

4. **"How much time per week does this take?"** — the biggest unspoken objection for busy agents. Answer with a realistic range plus the note that cohort calls are weekly and recorded.
5. **"What happens right after I enroll?"** — removes checkout anxiety: instant receipt, portal access, plan and task checklist unlocked, cohort start date communicated.
6. *(Optional)* **"Do I need an LLC or entity before I start?"** — very common Realtor blocker, and it reinforces the "check with your broker/attorney/CPA" disclaimer.

## Removals / consolidation

7. **"Is my payment secure?"** — already covered by the "Secure Stripe checkout" reassurance badge and the checkout page. Low value in an FAQ; safe to remove or fold into the enrollment answer.
8. Keep **"Do you guarantee approval amounts…"** and **"Do you provide legal or tax advice?"** exactly as written — both are compliance-relevant and correctly conservative.

## Ordering

Reorder so pre-purchase objections come first, compliance last:
Free option → What's in the free plan → How is this different → Time commitment → Newer agent → Switch/upgrade → Payment/enrollment → 30-day guarantee → No guarantees on limits → No legal/tax advice.

## Technical notes

- All content lives in the `faqs` array in `src/pages/PricingPage.tsx`; no component changes needed.
- `src/pages/PricingPage.tsx` currently emits only `ItemList` JSON-LD. Adding a `FAQPage` schema block built from the same `faqs` array is a cheap SEO win and lets these questions surface in search results.
- Tier names should be pulled from or kept in sync with `src/data/pricingTiers.ts` so renames don't drift again.
