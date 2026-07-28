## Goal

Make `/landing-page/:slug` load a real HeyGen Interactive Avatar that says: "Congratulations on your recent closing, JP!" — using the slug as the name.

## Why it's broken today

The current `HEYGEN_API_KEY` returns a 404 HTML page from `https://api.heygen.com/v1/streaming.create_token`. HeyGen only issues streaming tokens for API keys on a plan that has **Interactive Avatar / Streaming API** enabled. Free and basic Video-API-only keys get 404 on this endpoint — which is exactly the symptom we see. No amount of code changes fixes a key that isn't entitled.

## What you need to do (once)

1. Sign in at https://app.heygen.com → **Space Settings → Subscriptions**.
2. Confirm the plan includes **Interactive Avatar / Streaming Avatar API** (Creator, Team, or a Streaming add-on). If not, upgrade or add the Streaming API entitlement.
3. Go to **Space Settings → API** and copy the API key from a space that has Streaming enabled. (Keys are per-space; a key from a space without Streaming will keep failing.)
4. Paste it into the secure prompt I'll open for `HEYGEN_API_KEY` after you approve this plan.

## What I'll do

1. **Verify the new key** by calling `POST https://api.heygen.com/v1/streaming.create_token` from the edge function and logging the status/plan info. If it still 404s, I'll surface the exact HeyGen error in the UI so we know it's an account entitlement issue, not code.
2. **Harden `heygen-token`** to also try the newer `/v1/streaming.new` token-issuing path as a fallback, and pass the requested `avatar_id` through so it can be swapped later.
3. **Rewrite `HeyGenAvatar.tsx`** for a real interactive session:
   - Request token → `new StreamingAvatar({ token })` → `createStartAvatar({ quality: Low, avatarName: Wayne_20240711, voice: { rate: 1 } })`.
   - On `STREAM_READY`, attach `MediaStream` to a `<video>` and call `avatar.speak({ text, taskType: REPEAT })` with the personalized greeting derived from the slug (`"jp"` → `"JP"`, `"john-smith"` → `"John Smith"`).
   - Show a loading state; if autoplay is blocked, show the existing "Play greeting" button which calls `video.play()`.
   - On any HeyGen error (still 404, quota exhausted, session limit), fall back to the current Jessie video + text card so the page never breaks.
4. **Keep the slug-to-name logic** already in `LandingWithAvatarPage.tsx` (`"jp"` → `"JP"`, uppercasing 1–2 letter tokens, title-casing longer ones). The greeting sent to HeyGen becomes:
   > "Congratulations on your recent closing, JP! Welcome to RE Pro Business Credit…"
5. **Verify in-browser** with Playwright on `/landing-page/jp` and `/landing-page/john-smith`: confirm the video element gets a `MediaStream`, the avatar speaks, and the fallback triggers cleanly if HeyGen is still blocking.

## Technical notes

- HeyGen streaming sessions cost concurrent-session credits; each page load starts one. We'll close the session on unmount (already wired via `stopAvatar`).
- Session length is capped (typically 3–5 min for Interactive Avatar); the greeting is ~15s, so no risk.
- The slug-derived name is sent as plain text to `speak()`. No sanitization needed beyond stripping punctuation, which the existing `cleanVisitorName` already does.
- Nothing changes on the DB or RLS side.

## Deliverable

- `/landing-page/jp` loads, the avatar appears within a few seconds, and speaks the greeting including "JP".
- If HeyGen still refuses (wrong plan, quota), the page shows Jessie's video + a text greeting instead of a broken/blank state.
