# Session-Aware Post-Plan Authentication and Redirect

Today the intake survey always shows the "Create your account" card after a plan is generated, even when the visitor is already signed in. This makes the post-plan step adapt to the session.

## Behavior

**Already signed in**
Intake → Generate plan → plan + intake saved and linked to the account → celebration screen with a single "View My Plan" button, plus an automatic redirect to the dashboard after a short pause. No account card, no password setup, no login page.

**Not signed in (unchanged)**
Intake → Generate plan → plan + intake saved → celebration + confetti → create account (email pre-filled from the survey) or sign in → plan linked → dashboard.

## Technical Details

**Session detection**
- `IntakeSurveyPage` reads the existing `useAuthRole()` context (already app-wide) for `session` and `loading`. No new subscription.
- The decision is made at render time of the post-submit screen, so a session that arrives late (sign-in in another tab, token refresh) still flips the UI correctly.
- While auth is still resolving, keep showing the celebration without the auth card rather than flashing the signup form.

**Linking for authenticated users**
- On entering the `success` state with a session present, call the existing `link-intake-to-user` edge function once (guarded by a ref so re-renders don't repeat it) with `intake_id` + `access_token`. The function is already idempotent and returns 409 only when the intake belongs to a different account.
- On success: navigate to `/dashboard?firstLogin=1` (auto after ~2.5s, or immediately via the button).
- On 409 ("linked to a different account"): don't redirect silently — show a short notice with a "Continue to my dashboard" link, since their own dashboard is still valid.
- On any other failure: show the celebration with a retry link; the plan row already exists, so nothing is lost.

**Guest path**
- Unchanged `PostPlanAuthCard`, which already pre-fills email and calls `link-intake-to-user` after sign-up/sign-in.

**Data persistence**
- No redirect happens before `planState.status === "success"`, which is only set after the plan row is written by `generate-plan`. Intake answers are already persisted incrementally during the survey.
- Redirect is triggered only after the link call resolves, so the dashboard never loads before `custom_plans.user_id` is set.

## Edge Cases

- **Authenticated, first plan** — link + auto-redirect to dashboard.
- **Guest, first plan** — existing signup card.
- **Refresh after generation** — the intake guard (existing `useOnboardingStatus`) already sends signed-in users with a published plan from `/intake` to `/dashboard`; guests refreshing land back on the intake token link with their saved answers.
- **Session expires mid-flow** — the link call returns 401; fall back to rendering `PostPlanAuthCard` in sign-in mode so nothing is stranded.
- **Already has a plan and is signed in** — the intake guard redirects before they reach generation.
- **Token/coach-initiated intakes** — behavior unchanged; those still use the token path and, when signed in, still link and redirect.

## Testing Checklist

1. Signed-in user completes intake → no account card appears → lands on `/dashboard`, plan visible.
2. Guest completes intake → confetti + account card → creates account → dashboard shows the plan.
3. Guest with an existing account → "Sign in" mode → plan links → dashboard.
4. Signed-in user refreshes `/intake` after generating → redirected to dashboard with toast.
5. Sign out mid-celebration → auth card appears instead of the redirect.
6. Verify in the database that `intake_surveys.user_id` and `custom_plans.user_id` are set in every passing case.

## Phases

1. Session-aware branching in the post-submit screen of `IntakeSurveyPage`.
2. One-time link + auto-redirect logic for authenticated users.
3. Error/expired-session fallbacks.
4. Manual test pass against the checklist.
