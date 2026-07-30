## Goal

Give you everything the toll-free verification form asks for: a publicly accessible opt-in proof URL, plus approved use-case and message-content copy.

## 1. Public opt-in proof page (`/sms-opt-in`)

A no-index, publicly reachable page at `https://reprobusinesscredit.com/sms-opt-in` that documents the full opt-in workflow. Carriers accept this as the "Opt-In Workflow Image URL."

Contents:
- Brand header (RE Pro Business Credit), business name, address, support email/phone.
- Step-by-step opt-in flow: (1) visitor submits the guide/lead form, (2) creates an account, (3) checks the separate, unchecked-by-default SMS box, (4) confirmation.
- Screenshots of each real opt-in surface, captured from the live app and stored in `public/opt-in/`:
  - `/mock-login` → Create account tab (phone + SMS checkbox + Terms checkbox)
  - `/intake` post-plan account card
  - Landing page lead form
  - Dashboard message preferences (opt-out control)
- Verbatim consent language displayed as text (so carriers can read it without zooming):
  > "Yes, text me at this number. I agree to receive recurring marketing and service text messages from RE Pro Business Credit. Msg & data rates may apply. Msg frequency varies. Reply STOP to opt out, HELP for help. Consent is not a condition of purchase."
- Links to `/terms` and `/privacy`.
- Note that consent is never a condition of purchase, is stored with timestamp + exact text, and MLS-imported contacts are email-only until they opt in.

Also add each screenshot as its own direct image URL (e.g. `https://reprobusinesscredit.com/opt-in/create-account.png`) so you can paste an image link if the form rejects a page URL.

## 2. Form field copy (paste-ready)

**Opt-In Type:** Web Form

**Use Case Categories:** Account Notifications, Customer Care, Delivery Notifications (drop "Events" / "Security Alert" — they don't match this business).

**Use Case Description (under 500 chars):**
> This number is used to send appointment confirmations, reminders, and coaching program updates to real estate agents and brokers who requested our business credit guide, created an account, or booked a one-on-one session on reprobusinesscredit.com and checked a separate, unchecked-by-default SMS opt-in box. Messages include session reminders, plan-ready notifications, and program follow-ups. Consent is not a condition of purchase. Reply STOP to opt out, HELP for help.

**Message Content (under 1000 chars) — 3 samples:**
> Hi John! This is Jessie from RE Pro Business Credit. Your one-on-one business credit session on July 20 at 11:00 AM is confirmed. Reply STOP to unsubscribe, HELP for help.
>
> Hi John, Jessie from RE Pro Business Credit. Your custom 90-day business structure and credit plan is ready in your portal: https://reprobusinesscredit.com/dashboard Reply STOP to unsubscribe.
>
> Hi John, this is Jessie with RE Pro Business Credit following up on your session. Want to grab a time this week? https://reprobusinesscredit.com/one-on-one Reply STOP to cancel, HELP for help.

## 3. Technical notes

- New route `src/pages/SmsOptInProofPage.tsx` registered in `App.tsx`; `noindex` via the existing `Seo` component.
- Screenshots captured headlessly against the running app at desktop width and written to `public/opt-in/`.
- Copy pulled from `src/lib/messagingConsent.ts` so the page never drifts from the live checkbox text.
- Page must be published before submitting the form so the URL resolves for carrier review.
