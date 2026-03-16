

# URL Parameter Capture, Guide Gating, and GHL Tagging — Updated Plan

## Summary of Change from Previous Plan

**Edge case #6 update**: When an unknown visitor submits the opt-in form, the `submit-lead` function (or a new code path) will upsert the contact to GHL. The GHL upsert response returns a `contactId`. We will capture this contactId and:
1. Store it on the `leads` record (`ghl_contact_id`)
2. Return it to the client
3. Use it immediately to apply the `c-clicked-rbc-guide` tag — so the visitor is tagged on the spot, not left untagged

This eliminates the gap identified in the earlier plan where opt-in visitors would not be tagged until async sync ran.

---

## Full Implementation Plan

### 1. Propagate URL Params — Landing Page to Guide

**Files**: `LandingPage.tsx`, `HeroSection.tsx`, `CTASection.tsx`

- Read `contactId`, `firstName`, `lastName`, `email`, `phone` from URL search params
- Forward all params as query string when linking to `/guide`

### 2. Guide Page Gating Logic

**File**: `GuidePage.tsx`

- Read `contactId` from URL params
- **Known visitor** (`contactId` present): Show guide immediately. On mount, call `tag-ghl-contact` with tags `l-visited-rbc-site` and `c-clicked-rbc-guide`
- **Unknown visitor** (no `contactId`): Show `GuideOptInGate` overlay requiring name, email, phone

### 3. New Component: `GuideOptInGate`

**File**: `src/components/guide/GuideOptInGate.tsx`

- Simple form: first name, last name, email, mobile phone
- On submit: call `submit-lead` edge function (which already handles GHL upsert)
- **Key change**: `submit-lead` will be updated to upsert the contact to GHL inline (not just queue a `contact_syncs` record) and return the `contactId` from the GHL response
- On success: store the returned `contactId`, reveal the guide, then immediately call `tag-ghl-contact` with `c-clicked-rbc-guide`

### 4. Update `submit-lead` Edge Function

**File**: `supabase/functions/submit-lead/index.ts`

Currently, when no `ghlContactId` is provided, it creates an async `contact_syncs` record. Change this path to:

- Upsert the contact to GHL directly (same two-step pattern: upsert fields, then apply `a-rbc-optin` tag separately)
- Extract `contactId` from the GHL upsert response (`data.contact.id`)
- Save `ghl_contact_id` on the `leads` record
- Return `contactId` in the response JSON to the client

This way both paths (known contactId via URL, and new contact via opt-in) result in the client having a usable `contactId`.

### 5. New Edge Function: `tag-ghl-contact`

**File**: `supabase/functions/tag-ghl-contact/index.ts`

- Accepts `{ contactId, tags }` 
- Calls `POST /contacts/{contactId}/tags` with additive tags
- Used by the client to fire `l-visited-rbc-site` and `c-clicked-rbc-guide`
- Register in `supabase/config.toml` with `verify_jwt = false`

### 6. Landing Page Tagging

**File**: `LandingPage.tsx`

- If `contactId` is present in URL params, call `tag-ghl-contact` on mount with tag `l-visited-rbc-site`

---

## Tagging Flow Summary

| Visitor Type | Arrives on Landing | Opens Guide |
|---|---|---|
| Known (contactId in URL) | Tag `l-visited-rbc-site` on mount | Tag `c-clicked-rbc-guide` on mount |
| Unknown (no contactId) | No tag (no identity yet) | Submits opt-in → `submit-lead` upserts to GHL → gets `contactId` back → immediately tags `c-clicked-rbc-guide` |

## Files Changed/Created

| File | Action |
|---|---|
| `src/pages/LandingPage.tsx` | Modified — read params, forward to /guide, tag on mount |
| `src/pages/GuidePage.tsx` | Modified — gating logic, tagging |
| `src/components/landing/HeroSection.tsx` | Modified — forward params |
| `src/components/landing/CTASection.tsx` | Modified — forward params |
| `src/components/guide/GuideOptInGate.tsx` | New — opt-in form |
| `supabase/functions/submit-lead/index.ts` | Modified — inline GHL upsert for no-contactId path |
| `supabase/functions/tag-ghl-contact/index.ts` | New — lightweight tagging endpoint |
| `supabase/config.toml` | Modified — register tag-ghl-contact |

## What Is NOT Changed

- Two-step GHL sync (upsert then tags) — preserved
- `sync-to-ghl` function — untouched
- Additive tag behavior — preserved
- Custom field mapping — preserved
- MLS import logic — untouched

