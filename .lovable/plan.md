# Add Forgot Password Flow to Admin Login

## Goal
Add a "Forgot password?" link below the Sign In button on `/login` and implement the full password reset flow.

## Current State
- `/login` (`src/pages/AuthPage.tsx`) is an admin-only authentication page with Sign In / Sign Up tabs.
- There is no forgot-password UI or `/reset-password` route.
- Supabase Auth is already configured for email/password.

## Proposed Changes

### 1. Add "Forgot password?" link on `/login`
- Place a text link directly below the Sign In button in `src/pages/AuthPage.tsx`.
- Clicking it switches the tab/card content to a forgot-password form (or opens a modal).

### 2. Create Forgot Password form
- Add an email input and a "Send reset link" button.
- On submit, call:
  ```ts
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  });
  ```
- Show a success message: "Check your email for a password reset link."
- Handle rate-limit and unknown-email errors gracefully.

### 3. Create `/reset-password` page
- Create `src/pages/ResetPasswordPage.tsx` and add the route in `src/App.tsx`.
- On mount, parse the URL hash for `type=recovery` and extract the access token.
- If `type=recovery` is missing/invalid, show an error and a link back to `/login`.
- Show a form with:
  - New password input
  - Confirm password input
  - Submit button
- On submit, validate that passwords match and meet the 6-character minimum.
- Call `await supabase.auth.updateUser({ password })`.
- On success, sign the user out, show a success toast, and redirect to `/login`.

### 4. Admin-only routing after reset
- After password update, the user will be signed in by Supabase.
- Use the existing `checkAdminAndRoute` logic (or reuse `useAuthRole`) to verify the user has the `admin` role before redirecting to `/admin`.
- Non-admin users should be signed out and shown an error, consistent with current `/login` behavior.

### 5. Styling
- Match the existing card/form styling on `/login`.
- Use semantic design tokens; no hardcoded colors.

## Acceptance Criteria
- "Forgot password?" link appears below the Sign In button.
- Submitting an email sends a Supabase reset email with `redirectTo` pointing to `/reset-password`.
- `/reset-password` accepts the recovery link, lets the user set a new password, and redirects appropriately.
- Build passes and no auth security rules are weakened.
