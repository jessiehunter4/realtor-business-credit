

# Fix GHL Sync: Use Upsert Instead of Search-Then-Create

## Problem
The current `sync-to-ghl` function searches by email first, then tries to create if not found. But GHL's location blocks duplicates by **phone number**, so when a contact exists with the same phone but wasn't found by email, the create call fails with a 400 error.

## Solution
Replace the two-step search-then-create logic with GHL's built-in **upsert endpoint**: `POST /contacts/upsert` with `locationId` in the body. This endpoint automatically creates or updates based on matching email or phone, eliminating the duplicate error entirely.

## Changes

### `supabase/functions/sync-to-ghl/index.ts`

Replace the `syncContactToGHL` function's core logic (the email search + conditional create/update block) with a single upsert call:

```text
POST https://services.leadconnectorhq.com/contacts/upsert
Body: { firstName, lastName, email, phone, locationId, source, tags, customFields }
```

Key changes:
- Remove the email search call (~lines 68-92)
- Remove the separate create call (~lines 128-158)
- Remove the separate update call (~lines 94-125)
- Replace all three with one `POST /contacts/upsert` call that handles both cases
- Parse the response to determine if it was a create or update (GHL returns `new: true/false`)
- Keep the same return signature `{ success, contactId, isUpdate }` so nothing downstream changes

No database or frontend changes needed -- only the edge function file is modified.

