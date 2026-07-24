
# Plan Generation UX — Public & Admin

## Goals
- Let visitors generate their own personalized plan at the end of the Intake Survey.
- Deliver a polished success moment (confetti + message) and hand off to Visitor Portal (login/signup) to view the plan.
- Keep admin generation fast: same underlying pipeline, lighter success UI, jump straight to the plan.

## Current state (verified)
- `IntakeSurveyPage.handleSubmit` (src/pages/IntakeSurveyPage.tsx:280) submits the intake and shows a static "Thank You" card. No plan is generated.
- `generate-plan` edge function (supabase/functions/generate-plan/index.ts) requires an authenticated admin (Bearer + `has_role admin`). Only caller today is `AdminIntakeCoachView.tsx:213`.
- `custom_plans` rows are created with `status: draft`, keyed by `intake_survey_id`, and viewable via `PortalPlanView` / `AdminPlanView`.
- Auth for visitors doesn't yet exist (prior plan pending); this plan assumes we integrate with whatever visitor auth ships (Supabase email/password) and, until then, gate portal access by intake token/email.

## Public Flow (end-to-end)

```text
Step 5 (Program Fit) → [Submit intake]
   ↓ intake saved (status=submitted)
Plan Preview screen  ── "Here's what you'll get" (5 bullets + sample thumbnail)
   ↓ [Generate My Personalized Plan] (centered, primary)
Loading state (progress copy, ~15–30s, cancel disabled)
   ↓ plan_id returned
Success screen: confetti + headline + summary + auto-redirect timer
   ↓ (3s or click)
/portal/login?next=/portal/plan/:id  (or /portal/signup if new)
   ↓ auth success
/portal/plan/:id  (personalized plan view)
```

Key UX details:
- **Button placement:** centered, full-width on mobile, max-w-md on desktop, bottom of the final step *after* submit succeeds — not a second click on Step 5. Submit + Generate are collapsed conceptually but sequenced: submit first (saves data), then reveal the Preview + Generate CTA in-place (no navigation).
- **Preview card** (before click): title "Your Personalized RE Pro Business Credit Plan", 5 bullets — Goals Snapshot, Fundability Assessment, 90-Day Action Plan, 6–12 Month Roadmap, Funding Opportunities & Program Recommendation. Small sample thumbnail linking to `/sample-plan`.
- **Loading:** replace CTA with animated stepper ("Analyzing your answers… Building your roadmap… Finalizing recommendations…") on ~5s intervals; disable back nav; use `AbortController` + idempotency (see Technical).
- **Success:** `canvas-confetti` burst (2s), "🎉 Your Plan Is Ready" headline, 2-line explanation, primary CTA "View My Plan" → auth gate, secondary "Email me the link". Auto-advance after 4s if user is idle.
- **Handoff to portal:** if visitor session exists → `/portal/plan/:id`; else `/auth?mode=signup&next=/portal/plan/:id&email=<prefill>`. Until visitor auth ships, use a signed magic link emailed via existing tag/GHL workflow and land on a token-gated `/portal/plan/:id?token=…`.

## Admin Flow
- `AdminIntakeCoachView` "Generate Plan" button unchanged in placement.
- Replace current inline toast-only feedback with a small success toast (`sonner`) — no confetti — plus auto-navigation to `/admin/plan/:id` in the same tab (current behavior kept, made explicit).
- Show the same 3-step loading stepper for parity/consistency, but no preview screen (admin already knows what's generated).
- Add "Regenerate" affordance already exists via supersede logic — surface it clearly with a confirm dialog.

## Impact Analysis
| Area | Change |
|---|---|
| `src/pages/IntakeSurveyPage.tsx` | New post-submit states: `preview`, `generating`, `success`, `error`. Replace static Thank You card. |
| New `src/components/intake/PlanPreviewCard.tsx` | Preview + CTA |
| New `src/components/intake/PlanGenerationLoader.tsx` | Rotating step copy + spinner |
| New `src/components/intake/PlanSuccessCelebration.tsx` | Confetti + CTAs (shared with admin sans confetti via prop) |
| `supabase/functions/generate-plan/index.ts` | Allow public invocation via intake token or direct-mode identity; keep admin path. Add idempotency: if a `draft` plan for the intake already exists AND was generated <60s ago, return it instead of regenerating. |
| `supabase/config.toml` | `generate-plan` stays `verify_jwt = false`; auth checks moved inside the function (admin JWT OR valid intake token OR direct-mode email match). |
| `AdminIntakeCoachView.tsx` | Reuse loader + success components; toast success. |
| `PortalPlanView` / auth | Accept `?token=` fallback until Supabase visitor auth lands; then honor session. |
| Analytics (`logFunnelEvent`) | New events: `plan_generation_started`, `plan_generation_succeeded`, `plan_generation_failed`, `plan_viewed`. GHL tags: `f-plan-generated`, `f-plan-viewed`. |
| Package | Add `canvas-confetti` (+ types). |
| DB | No schema changes required. Optional: add `generation_source` (`user` | `admin`) enum to `custom_plans` for reporting. |

## Technical / UX Recommendations
- **Duplicate-submit guard:** disable button on click; server-side idempotency key = `intake_survey_id` + 60s window; return existing draft.
- **Timeout:** client `AbortController` at 60s → friendly retry error; server-side already surfaces 429/402/403.
- **Loader:** rotating copy every 5s so 20–30s AI latency feels intentional; never show raw spinner alone.
- **Accessibility:** confetti wrapped in `prefers-reduced-motion` guard (fallback: simple check-mark scale-in); success screen uses `role="status" aria-live="polite"`; button min 44px tap target; focus moved to success heading.
- **Mobile:** single-column stacked layout; sticky bottom CTA in preview state; confetti origin y=0.3 to stay visible.
- **Error handling:** distinct copy for 429 (rate limit → retry countdown), 402/403 (credits/limit → contact support), network (retry now).
- **Extensibility:** extract a `usePlanGeneration({ source, intakeId, token })` hook so future plan variants (e.g., "Refresh my plan", "Cohort readiness plan") reuse the same state machine.
- **Analytics:** capture time-to-generate, retry count, path to first plan view.

## Phased Implementation

**Phase 1 — Backend enablement (foundation)**
- Extend `generate-plan` to accept intake-token or direct-mode identity; add idempotency; add `generation_source` field.
- Update `AdminIntakeCoachView` to send explicit `source: "admin"`.
- *Risk:* auth logic bug could allow cross-intake plan generation → mitigate with strict `intake_survey_id` match to token/email.

**Phase 2 — Shared UI primitives**
- Build `PlanPreviewCard`, `PlanGenerationLoader`, `PlanSuccessCelebration` with `variant="user"|"admin"` prop.
- Add `usePlanGeneration` hook. Install `canvas-confetti`.

**Phase 3 — Public intake integration**
- Rework post-submit state machine in `IntakeSurveyPage`. Wire funnel events.
- Add reduced-motion + mobile polish.

**Phase 4 — Admin integration**
- Swap admin generate button to use shared hook + loader. Toast-only success. Auto-nav to `/admin/plan/:id`.

**Phase 5 — Portal handoff**
- If visitor auth exists: post-success routes through `/auth?next=…`.
- Interim: token-gated `/portal/plan/:id?token=…` + emailed magic link via GHL.

**Phase 6 — QA & analytics**
- Cross-browser + mobile pass. Verify event stream and GHL tags. Load-test concurrent generations (rate-limit behavior).

## Dependencies & Risks
- Depends on visitor auth plan for the final handoff; interim token link is acceptable and reversible.
- AI latency variance — mitigated by loader messaging + timeout.
- Cost/credits — idempotency prevents accidental double-spend; admin regenerate requires confirm.

## Testing
- Unit: `usePlanGeneration` state transitions incl. abort/timeout/error branches.
- Integration: public direct-mode intake → generate → success → portal token link.
- E2E (Playwright): full happy path desktop + mobile; reduced-motion; 429 error path (mock).
- Manual: admin regenerate supersede path; verify `custom_plans` row states.
