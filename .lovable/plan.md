# Prevent Existing Users from Recreating Their Plan

Logged-in users who already have a generated plan should be routed to their dashboard instead of re-entering the guide/intake/plan-generation flow. New visitors keep the current public funnel untouched.

## Current state (verified)

- Public routes `/guide`, `/guide/:slug`, and `/intake` render without any auth or completion check.
- `custom_plans` and `intake_surveys` both carry a nullable `user_id`; the dashboard already loads the newest `published` plan for the signed-in user.
- The database already contains duplicates: 7 surveys and 7 plans across only 6 distinct users — so re-entry today really does create second records.
- There is no uniqueness constraint tying one active survey / one active plan to a user.

## What gets built

### 1. A shared "onboarding status" hook

A small hook (e.g. `useOnboardingStatus`) resolves, for the current session:
- signed in or not
- whether a survey row exists for the user
- whether a published plan exists for the user
- a `loading` flag so nothing flashes or redirects before the session resolves

Anonymous visitors resolve immediately to "not complete" and never see a redirect.

### 2. Guard on the plan-creation entry points

`/intake` (and any plan-generation surface) mounts the hook first:
- loading → lightweight spinner, no form render, no draft creation, no autosave request
- signed in with a published plan → redirect to `/dashboard` with a toast: "You've already created your customized plan. We've redirected you to your dashboard where you can view it and continue your progress."
- everyone else → the current flow, unchanged

The guard must run before the existing draft-restore/autosave effects so no new `intake_surveys` row is written for a returning user.

### 3. Guide behavior

`/guide` and `/guide/:slug` get the same check. Recommended default: keep the guide **readable** for returning users (it is educational content and also a public SEO page) but swap every "Create My Plan" CTA — sticky bar, per-chapter `ChapterPlanCTA`, `FloatingPlanCTA` — for "Go to My Dashboard" / "View My Plan", plus a dismissible banner at the top. If you prefer a hard redirect as originally described, it is a one-line switch in the same guard; say the word and it ships that way. Redirects will never apply to signed-out visitors or crawlers, so SEO is unaffected either way.

### 4. Dashboard side

Confirm the dashboard's "View Your Plan" action is the landing target and that the redirect carries a reason flag so the toast shows once and is not repeated on refresh.

### 5. Data integrity

- Backfill: reconcile the existing duplicate survey/plan rows so each user keeps one active record (older ones archived, not deleted).
- Add partial unique indexes: one active `intake_surveys` per `user_id`, one `published` `custom_plans` per `user_id`.
- The plan-generation function keeps its existing "regenerate in place" path, so a future regeneration feature updates the active plan rather than inserting a new one. The new indexes are written to permit that.

### 6. Testing scenarios

- Anonymous visitor: full funnel still works end to end.
- Signed-in user with no survey: intake opens normally.
- Signed-in user with a draft survey but no published plan: intake resumes the draft, no redirect.
- Signed-in user with a published plan: `/intake` redirects to `/dashboard`, toast shows once, no new rows created (verified by row counts before/after).
- Guide with a personalized slug while signed in with a plan: CTAs point to the dashboard.
- Admin account: unaffected, still reaches admin views.
- Hard refresh on `/dashboard`: no redirect loop.

## Phases

1. Hook + intake guard + toast (stops duplicate creation immediately)
2. Guide CTA swap / banner
3. Data backfill + unique indexes
4. Test pass across the scenarios above
