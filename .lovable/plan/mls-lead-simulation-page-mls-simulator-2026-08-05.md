# MLS Lead Simulation Page (`/mls-simulator`)

A local, test-only page that mimics how an MLS lead would receive a personalized guide link before EveryCatch/GHL are wired up.

## What you'll be able to do

1. Open `/mls-simulator` (not linked in any nav or sitemap).
2. Enter First Name, Last Name, Email and click **Generate**.
3. See the generated slug (`JP.Eltanal`), the full URL (`https://<current domain>/guide/JP.Eltanal`), and a copy button.
4. Click **Simulate Send** to get a "Email successfully simulated!" confirmation plus a rendered email preview (recipient, subject, body with the link).
5. Click **Open Guide** to navigate to `/guide/JP.Eltanal` and see the personalized greeting on the real guide.
6. Submit again with different names — each run replaces the result, no refresh needed. A short session history list of prior simulated sends is kept on the page.

## Slug rules

Initials of every first-name word + `.` + last name, spaces stripped, capitalization preserved:

```text
John Paul Eltanal  -> JP.Eltanal
Jessie Hunter      -> J.Hunter
Mary Anne Cruz     -> MA.Cruz
Robert James Smith -> RJ.Smith
```

## Technical plan

### 1. `src/lib/mlsLeadSlug.ts` (new)
- `buildLeadSlug(firstName, lastName): string` — trim, collapse whitespace, take the first character of each first-name token (uppercased), join, add `.`, append last name with internal spaces/punctuation removed. Returns `""` if either name is empty.
- `buildGuideUrl(slug): string` — `${window.location.origin}/guide/${slug}`.
- `buildSimulatedEmail({ firstName, lastName, email, url })` — returns `{ to, subject, body }` with subject "Your Personalized Business Credit Guide" and the body copy from the spec. Keeping this pure and separate is what makes the later swap to a real sender a one-line change.

### 2. `src/lib/visitorSlug.ts` (update — required for the greeting to look right)
Today `parseVisitorSlug` converts `.` to a space and title-cases each word, so `JP.Eltanal` would render as "Jp Eltanal". Add handling for the initials format:
- Detect a leading all-caps initials token (1-4 letters) followed by `.` and a name; when matched, preserve the initials verbatim and title-case only the surname -> display name `JP Eltanal`, first-name token `JP`.
- All existing behavior (`john-paul`, `jessie hunter`, invalid/numeric/overlong slugs falling back silently) is unchanged; `/guide` with no slug and `/landing-page/:slug` keep working exactly as now.

### 3. `src/pages/MlsSimulatorPage.tsx` (new)
- Card layout using existing shadcn `Card` / `Input` / `Label` / `Button`, brand tokens only.
- Local state: form fields, current result, session history array.
- Generate -> compute slug + URL. Simulate Send -> push into history and show the success alert + email preview panel (subject/body in a monospace-ish preview block). Open Guide -> `navigate(/guide/${slug})`.
- Includes a visible "Testing tool — not part of the public funnel" notice and a short diagram of the future MLS -> EveryCatch -> slug -> email -> `/guide/:slug` flow, so the replacement path is obvious.
- No network calls, no Supabase writes, no analytics events.

### 4. `src/App.tsx` (update)
Add `<Route path="/mls-simulator" element={<MlsSimulatorPage />} />` above the catch-all. No header/footer nav entry. Page renders `<Seo noindex />` so it never gets indexed.

## Out of scope
No database records, no GHL/EveryCatch calls, no real email provider, no changes to the guide's downstream funnel.
