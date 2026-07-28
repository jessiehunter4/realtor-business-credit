# HeyGen Interactive Avatar MVP

Add a new route `/landing-page/:slug` that spins up a HeyGen Interactive Avatar and has it greet the visitor by the URL slug. No CRM, DB, or auth — slug is the only dynamic input.

## Prerequisite
You need a HeyGen API key (from HeyGen → Settings → API). Once you're ready, I'll request it via the secure secret form as `HEYGEN_API_KEY`. Everything below can be scaffolded first; the avatar will only work after the key is saved.

## Scope

### In
- New page + route
- Slug-based greeting
- HeyGen Streaming Avatar SDK session (default avatar + voice)
- Autoplay attempt with a "Play greeting" fallback button
- Loading + error states, plain-text greeting fallback on failure

### Out
- DB, GoHighLevel, EveryCatch, auth, lead lookup
- Personalization beyond the slug
- Analytics / funnel events

## Architecture

```text
/landing-page/:slug
  └─ LandingWithAvatarPage
       ├─ useParams() → visitorName
       ├─ greeting = `Congratulations on your closing, ${visitorName}! ...`
       ├─ HeyGenAvatar component
       │    ├─ fetch access token from edge function
       │    ├─ new StreamingAvatar({ token })
       │    ├─ createStartAvatar({ avatarName: default, voice: default })
       │    ├─ speak(greeting) on STREAM_READY (with autoplay fallback)
       │    └─ <video> element bound to MediaStream
       └─ existing landing sections below
```

## Files

**New**
- `src/pages/LandingWithAvatarPage.tsx` — reads `:slug`, builds greeting, renders `HeyGenAvatar` above the existing landing sections (reuses `SiteHeader`, `HeroSectionBright` optional, etc.).
- `src/components/avatar/HeyGenAvatar.tsx` — encapsulates SDK lifecycle: fetch token → start session → speak → cleanup on unmount. Handles loading spinner, autoplay-blocked button, and error text fallback showing the greeting.
- `supabase/functions/heygen-token/index.ts` — public edge function that POSTs to `https://api.heygen.com/v1/streaming.create_token` using `HEYGEN_API_KEY` and returns `{ token }`. CORS enabled, no JWT required. Registered in `supabase/config.toml` with `verify_jwt = false`.

**Edited**
- `src/App.tsx` — add `<Route path="/landing-page/:slug" element={<LandingWithAvatarPage />} />` above the catch-all.
- `package.json` — add `@heygen/streaming-avatar` dependency (installed via `bun add`).

**Secret**
- `HEYGEN_API_KEY` (added via secure form when you're ready).

## Behavior details

- **Slug extraction:** `useParams<{ slug: string }>()`; if missing, show generic greeting `"Welcome to RE Pro Business Credit."`.
- **Greeting template:** `Congratulations on your closing, ${slug}! Welcome to RE Pro Business Credit. I'm excited to help you build your business credit and guide you through your personalized funding journey.`
- **Session guard:** `useRef` flag + effect cleanup to prevent duplicate `createStartAvatar` calls under React StrictMode.
- **Autoplay:** call `video.play()` on `STREAM_READY`; if it rejects, reveal a centered "Play greeting" button that calls `play()` on click, then `avatar.speak({ text: greeting })`.
- **Error path:** any SDK/token failure → hide the video, render greeting as plain text inside a styled card, keep the rest of the page usable.
- **Cleanup:** `avatar.stopAvatar()` on unmount.

## Future hook (not built)
`HeyGenAvatar` accepts `greeting` as a prop, so later the slug → CRM lookup can produce a richer greeting without touching the component.

## Testing
Manual: visit `/landing-page/jpeltanal`, `/landing-page/john`, `/landing-page/sarah`, `/landing-page/realtor123` — each should render the avatar and speak the matching greeting (or show the play-button fallback + plain-text greeting if autoplay/network fails).
