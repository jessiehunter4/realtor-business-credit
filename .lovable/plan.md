# Reliable authenticated previews of `/dashboard/program`

## Problem

`/dashboard/program` sits behind the visitor guard: with no session, the guard redirects to `/login?next=...`. The screenshot run that failed did so because the browser started with an empty session, not because of anything in the app.

A signed-in session for this project is already available in the sandbox (auth status is `injected`), so the fix is a repeatable screenshot helper that restores that session before navigating — no changes to app code or auth rules.

## What I'll add

A reusable script at `/tmp/browser/auth-shot/shot.py` (sandbox tooling, outside the project checkout) that:

1. Restores the injected session — both the Supabase localStorage key and the SSR cookies — against `http://localhost:8080`.
2. Navigates to any route passed as an argument, e.g. `/dashboard/program`.
3. Waits for the route guard's loading spinner to clear and asserts the final URL is not `/login` (fails loudly with the reason if the session didn't take).
4. Captures desktop (1280px) and mobile (390px) screenshots into `/tmp/browser/auth-shot/screenshots/`.
5. Prints the final URL plus any console errors.

Usage: `python3 /tmp/browser/auth-shot/shot.py /dashboard/program`

## Verification

Run it against `/dashboard/program` and show you the authenticated screenshot confirming the Program card spacing change (title / description / CTA at ~20px gaps).

## Notes

- No project source files change; no auth bypass or dev-only backdoor is added, so nothing can leak into production.
- The session is read from environment variables at runtime and never printed or written into a screenshot-adjacent file.
- If the session ever expires, the script reports it clearly and you sign in once in the Lovable preview to refresh it.
