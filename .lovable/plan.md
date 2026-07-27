## Lead Authentication After Plan Generation

Gate the newly generated plan behind account creation. Instead of a "View My Plan" button that navigates straight to the portal, the celebration screen collects a password, provisions a Supabase auth user, links the intake + plan to `user_id`, signs the user in, then redirects to `/portal/plan/:id`.

---

### 1. UX Flow

**Happy path (new user)**
1. User finishes Step 4 → `Generate My Plan` → loader → celebration screen.
2. Celebration screen shows: 🎉 heading, plan-ready subtext, then an inline **"Create your account to view your plan"** card:
   - Email (pre-filled, read-only with a small "Edit" link to reveal an input)
   - Password (min 8 chars, show/hide toggle)
   - Confirm Password
   - Primary button: **View My Plan** (disabled until valid)
   - Fine print: "By creating an account you agree to Terms & Privacy."
3. Submit → button spinner "Creating your account…" → auto sign-in → redirect to `/portal/plan/:id`.

**Existing user detected** (email already has an auth account)
- Signup returns "User already registered" (or our pre-check flags it). The form flips into **Sign in** mode: email pre-filled + password + "Forgot password?" link. On success, we link the intake/plan to the returning `user_id` and redirect to `/portal/plan/:id`.
- If they enter the wrong password, show inline error + "Forgot password?" that calls `resetPasswordForEmail` (redirect `/reset-password`).

**Edge cases**
- Password mismatch / too short → inline field errors, button stays disabled.
- Network / Supabase error → non-blocking toast + retry; celebration card is not dismissed.
- User closes tab before creating account: plan still exists in DB (public-read policy already permits `status='published'` access via `/portal/plan/:id`), and the intake row keeps its `access_token` so they can resume. We also email them the portal link (out of scope for this plan — flagged as follow-up).
- Confetti fires once on mount; the auth card is not part of the `aria-live` region so screen readers hear celebration then focus moves to the email/password form.

**Placement & responsiveness**
- Auth form lives inside the same `Card` as the celebration, below the CTA row. Single column, `max-w-xl`. On mobile: full-width inputs, larger tap targets, sticky primary button at bottom of card.
- Accessibility: labels for every input, `aria-invalid` on errors, focus moves to first invalid field, password strength hint uses `aria-describedby`.

---

### 2. Technical Architecture

**Auth**
- Enable email/password sign-up via `supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin } })`.
- Auto-confirm: **do NOT enable** by default — but for this flow we need the user signed in immediately without an email click. Recommendation: enable `auto_confirm_email = true` for this project so signup returns a session synchronously. (Call this out for user approval; it's the standard trade-off for instant-access post-generation flows.)
- Google OAuth: add as a secondary "Continue with Google" button (project standard). Handled the same way — after sign-in, run the linking step.

**Linking intake + plan to `user_id`**
- Both `custom_plans` and `intake_surveys` already have a `user_id uuid` column with a `Users can view own …` SELECT policy.
- Add a new edge function `link-intake-to-user` (verify_jwt=true) that:
  1. Reads caller from JWT.
  2. Accepts `{ intake_id, access_token }`.
  3. Verifies `access_token` matches the intake row (proves the caller "owns" this anonymous submission).
  4. Uses service role to `UPDATE intake_surveys SET user_id = <caller>` and `UPDATE custom_plans SET user_id = <caller> WHERE intake_survey_id = <intake_id>`.
  5. Also patches `profiles` (first/last/phone from intake) via the existing `handle_new_user` trigger — no schema change needed; the trigger already inserts a profile row on signup from `raw_user_meta_data`, so we pass first/last/phone in `signUp` options.
- Client-side path used because we need to run as the signed-in user *and* atomically link — an edge function is safer than trusting client updates.

**Existing user detection**
- Simplest: attempt `signUp`; Supabase returns an error string containing "already registered" → flip UI to sign-in mode. No separate lookup (avoids user enumeration).
- After successful `signInWithPassword`, run the same linking function (it's idempotent — re-linking to the same user_id is a no-op).

**Route protection**
- `/portal/plan/:id` currently allows anonymous reads for `status='published'`. Keep as-is (accounts don't break anonymous links we already emailed). Optional follow-up: add a `requireAuth` variant later.

**State machine (celebration screen)**
- Local `authState`: `"idle" | "signup" | "signin" | "submitting" | "linking" | "done" | "error"`.
- On success → `navigate('/portal/plan/:id')` (drop token from URL since the user is now authenticated).

---

### 3. Database Impact

No schema migrations required — `user_id` columns and RLS policies already exist on `intake_surveys` and `custom_plans`. `profiles` auto-populates via `handle_new_user`.

**Auth settings change** (via `supabase--configure_auth`):
- `auto_confirm_email: true` (needs user approval)
- `password_hibp_enabled: true` (best practice)
- Leave `disable_signup: false`

---

### 4. Files to Change

**New**
- `supabase/functions/link-intake-to-user/index.ts` — links intake + plan to caller.
- `src/components/intake/PostPlanAuthCard.tsx` — email/password form with signup ↔ signin toggle, validation, submit.

**Modified**
- `src/components/intake/PlanSuccessCelebration.tsx` — replace CTA row with `<PostPlanAuthCard />`; keep confetti + heading unchanged.
- `src/pages/IntakeSurveyPage.tsx` — pass `intakeId`, `intakeToken`, `contactEmail`, and post-auth navigation into the celebration.
- `supabase/config.toml` — register new function with `verify_jwt = true`.
- One-shot `configure_auth` call to enable auto-confirm + HIBP.

**Not touched**
- Existing `/auth` page, `ProtectedRoute`, portal view, RLS policies.

---

### 5. Phased Rollout

**Phase 1 — Backend prep**
- Deploy `link-intake-to-user` edge function.
- Call `configure_auth` (auto-confirm + HIBP).

**Phase 2 — UI**
- Build `PostPlanAuthCard` (signup mode only, with inline "already have an account? Sign in" toggle).
- Wire it into `PlanSuccessCelebration`; celebration owns the confetti, card owns the form + submit.
- On success → link function → `navigate('/portal/plan/:id')`.

**Phase 3 — Polish**
- Error copy, password strength meter, "Forgot password?" link → `resetPasswordForEmail`.
- Analytics: `auth_signup_started`, `auth_signup_succeeded`, `auth_signin_from_celebration`, `plan_linked_to_user` (add to `log-funnel-event` allowlist).
- Optional Google button.

---

### 6. Open Questions

1. **Auto-confirm email**: OK to enable so the user is signed in instantly after signup? (Alternative: send a magic-link and keep the plan link accessible without account until they confirm.)
2. **Google sign-in on this screen**: include now or Phase 3?
3. **Hard gate vs soft gate**: should we keep a "Skip for now — email me the link" escape hatch, or fully require account creation before viewing? (Recommend hard gate per your spec.)
