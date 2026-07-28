## Plan: Fix HeyGen Avatar + Personalized Congratulations Greeting

### Goal
Make `/landing-page/:slug` reliably attempt to generate a HeyGen live avatar greeting, and when HeyGen cannot create a session, show a polished fallback instead of breaking or silently failing.

### What I’ll change
1. **Update the HeyGen token backend function**
   - Switch the token request to HeyGen’s current documented session-token endpoint if needed.
   - Keep the API key private in the backend.
   - Return clean JSON for every outcome: success, missing key, invalid key, unavailable HeyGen endpoint, or non-JSON provider response.
   - Avoid any 500/HTML parse crash from HeyGen returning an HTML error page.

2. **Harden the frontend avatar component**
   - Treat `token: null` as a normal fallback state instead of throwing a runtime error.
   - Start the avatar only when a real token is present.
   - Keep the autoplay attempt plus “Play greeting” button fallback.
   - Add safer cleanup so duplicate sessions do not start under React StrictMode.

3. **Improve the congratulations message**
   - Decode and clean the URL slug so `/landing-page/jpeltanal` becomes a friendly display name instead of raw URL text where possible.
   - Use a clearer greeting such as: “Congratulations on your recent closing, [Name]. Welcome to RE Pro Business Credit…”
   - Keep the message focused on business structure, financial foundation, and credit-building support.

4. **Improve the visual fallback**
   - If HeyGen is unavailable, show a professional “personal welcome” card with the same congratulations message.
   - Keep the rest of the landing page usable.

5. **Verify**
   - Test the edge function response path.
   - Test `/landing-page/jpeltanal` in the preview.
   - Confirm no blank screen and no client-side runtime error when HeyGen is unavailable.

### Technical notes
- Current code calls `https://api.heygen.com/v1/streaming.create_token` and already handles non-JSON responses, but the current SDK/token flow still needs to be made fully tolerant of HeyGen endpoint failures.
- The existing package is `@heygen/streaming-avatar@2.0.17`; I’ll keep it unless the codebase requires a package update after verifying the current HeyGen API shape.
- The app will still need a valid HeyGen API key with streaming/avatar access for the live avatar to render. Without that, the fallback greeting will display cleanly.