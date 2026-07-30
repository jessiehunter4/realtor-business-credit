## Goal

Every customer-facing "create account" screen must show a required consent checkbox (Terms of Use + Privacy Policy links), plus a mobile phone field with the standard SMS opt-in checkbox — pre-filled when we already know the number. The Create Account button stays disabled until the required box is checked.

## Screens in scope

1. `/mock-login` — Create account tab (`src/pages/MockLoginPage.tsx`)
2. Post-plan account creation card (`src/components/intake/PostPlanAuthCard.tsx`) — phone is already known, so pre-fill it
3. `/auth` (`src/pages/AuthPage.tsx`) — admin bootstrap, but it exposes a Sign Up tab, so it gets the same required agreement checkbox (no phone/SMS block, since it isn't a marketing entry point)

Sign-in tabs get no checkbox — consent applies to account creation only. Lead forms that already collect consent (`GuideOptInGate`, `LeadForm`) are unchanged.

## New shared pieces

- `src/lib/messagingConsent.ts`: add `TERMS_CONSENT_TEXT` = "I agree to the Terms of Use and Privacy Policy." (stored alongside the SMS text as source of truth).
- New `src/components/shared/AccountConsentFields.tsx`: renders
  - required agreement checkbox with inline `/terms` and `/privacy` links,
  - optional mobile phone field (existing `PhoneInput`, masked `(###) ###-####`, raw digits stored),
  - the existing `SmsConsentCheckbox` (appears once 10 digits are entered, unchecked by default).
  Exposes `{ agreed, phone, smsConsent }` via props so each page controls state and button disabling.

## Behavior

- Phone pre-fill: read `rbc_contact` via `readContactIdentity()`; on `/mock-login` prefer any phone already stored; in `PostPlanAuthCard` use the `phone` prop already passed in. Field remains editable.
- Create Account button `disabled` until the agreement checkbox is checked (in addition to existing password rules).
- Consent record: on successful sign-up, store the exact strings shown, timestamps, and source page in Supabase — `profiles` gets `phone` (already exists) plus new columns `terms_accepted_at`, `terms_consent_text`, `sms_consent`, `sms_consent_at`, `sms_consent_text`, `sms_consent_source`. Values are passed through `signUp` user metadata so the existing `handle_new_user` trigger persists them (trigger updated to read the new fields).
- SMS consent is only stored as `true` when both a valid phone and a checked SMS box are present; otherwise `false`.

## Technical notes

- Migration adds the consent columns to `public.profiles` and updates `handle_new_user`; no new tables, existing RLS/grants on `profiles` continue to apply.
- Phone stored as raw 10 digits, matching the lead forms.
- Zod validation extended: phone optional, but if present must be 10 digits; agreement must be `true`.
