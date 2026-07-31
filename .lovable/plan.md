## Goal

Remove the admin access code from `/auth` sign-up so creating an account there makes an admin directly.

## Why the code exists (context, then removing it)

The code was the server-side proof that the person signing up is authorized to be an admin. Without it, `/auth` is a public URL, so anyone who guesses it can create a full admin account with access to all leads, intake surveys, and plans. `/auth` is unlinked from navigation, but that is obscurity, not protection.

Removing it as requested, with an optional safety net below.

## Changes

1. **`src/pages/AuthPage.tsx`**
   - Delete the "Admin access code" input, its state, the `KeyRound` icon, and the `adminSignupSchema` extension — back to validating just email and password.
   - Keep the post-signup call that elevates the account, but send it without a code.

2. **`supabase/functions/assign-admin-role/index.ts`**
   - Drop the `ADMIN_SIGNUP_CODE` check. The function still requires a valid signed-in session (it verifies the bearer token), then upserts the `admin` role for that user.
   - Keep the constant-time helper removal tidy and keep all logging.
   - Redeploy the function.

3. **`src/pages/AdminSignupPage.tsx`**
   - This page exists only as the code-gated admin signup. With the code gone it's a duplicate of `/auth`, so remove the code field there too (or leave the page as-is if you'd rather keep it — say the word). Plan assumes: strip the code field so both pages behave the same.

## Optional safety net (recommended, easy to add later)

Instead of a typed code, the edge function can compare the signing-up email against a small allowlist stored in a secret (e.g. `ADMIN_EMAILS=jessie@...,you@...`). No code to type, but a random visitor still can't mint an admin. Tell me if you want this and I'll fold it in.

## Technical notes

- The database trigger still inserts the `user` role for every new account; the `admin` row is added on top, and role resolution prefers `admin`, so routing lands on `/admin`.
- The `ADMIN_SIGNUP_CODE` secret becomes unused; it can stay stored harmlessly or be deleted.
