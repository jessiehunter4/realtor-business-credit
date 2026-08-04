# Auto-Fill Intake Survey for Authenticated Users

## Goal
When a signed-in user opens the public intake survey and has not created a plan yet, their first name, last name, and email are already filled in, editable, and the finished survey attaches to their existing account — no duplicate account setup.

## Current behavior
- `/intake` (no token) prefills only from the `rbc_contact` localStorage identity / URL params (`useContactIdentity`), so a signed-in user arriving without those params sees empty name and email fields.
- The page guard (`IntakeSurveyPage`) already redirects signed-in users who have a published plan to `/dashboard?planExists=1` via `useOnboardingStatus`.
- After plan generation, `AuthedPlanHandoff` links the intake to the signed-in user through the `link-intake-to-user` function; guests see `PostPlanAuthCard`.

## What changes

### 1. Session-aware identity source
Add a small hook (e.g. `useAuthProfilePrefill`) that, when a session exists, returns first name, last name, and email resolved in this order:
1. `profiles` row for the signed-in user (`first_name`, `last_name`, `email`)
2. auth user metadata (`first_name`, `last_name`)
3. the session's `user.email`

It returns a loading flag so the form does not render prefilled fields half-populated.

### 2. Prefill precedence in the intake form
In the direct-mode hydration effect of `src/pages/IntakeSurveyPage.tsx`, extend the merge order to:

```text
locally saved draft  >  already-typed value  >  authenticated profile  >  URL/localStorage contact identity  >  empty
```

Also derive `contact_name` and `contact_email` from whichever source wins. The prefill effect must re-run once the auth profile finishes loading, and must never overwrite a field the user already edited (guarded by the existing `hydratedFromDraft` ref plus a one-shot "auth prefill applied" ref).

### 3. Do not block the guest flow
If there is no session, nothing changes — the existing identity-based prefill and `PostPlanAuthCard` path stay exactly as they are.

### 4. Existing-survey handling
Keep the current guard as the single decision point, extended slightly:
- signed-in + published plan -> redirect to `/dashboard?planExists=1` (unchanged)
- signed-in + in-progress survey but no plan -> load that survey's draft and continue (no second survey created)
- signed-in + nothing -> new draft with auto-filled fields
- token links (coach-sent) always open the form regardless of session

### 5. Persistence / no duplicate accounts
No change to how the survey is saved: drafts still go through the `direct-draft` mode of the `intake-survey` function, and linking to the account still happens via `AuthedPlanHandoff` -> `link-intake-to-user` after plan generation. Signed-in users continue to skip the account-creation card.

## Edge cases
- Missing profile row or blank name fields: fall back to auth metadata, then email; leave blank rather than inventing a value.
- Email present but names missing: prefill email only.
- Session expires mid-survey: the local draft and server draft remain; the user finishes as a guest and is offered the account card as today.
- Conflicting URL identity (a `?email=` different from the signed-in account): the authenticated account's email wins, since the survey will be linked to that account.
- Slow profile fetch: show the existing loading spinner until the prefill resolves, with a short timeout so a failed lookup never blocks the form.

## Technical notes
- Files touched: new hook under `src/hooks/`, plus `src/pages/IntakeSurveyPage.tsx` (hydration effect and guard).
- Reuses `useAuthRole()` for the session and `useOnboardingStatus()` for the plan/survey lookup; no new database tables, columns, policies, or edge functions.

## Testing checklist
- Signed-in user, no survey: name and email prefilled and editable; edits persist across step changes and reload.
- Signed-in user, existing in-progress survey: resumes the same survey, no duplicate row.
- Signed-in user with published plan: still redirected to the dashboard.
- Guest with `?contactId=...&firstName=...`: unchanged behavior.
- Guest with no params: empty form, account card after plan generation.
- Coach token link while signed in: loads the token survey, not the account prefill.
- Submitted survey ends up linked to the signed-in `user_id`, and only one account exists.

## Phases
1. Add the profile prefill hook.
2. Wire prefill precedence into the intake hydration effect.
3. Extend the guard for the in-progress-survey case.
4. Run through the testing checklist in the preview.
