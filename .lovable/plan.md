# Fix "Failed to save" on Admin Intake Coach View

## What I found

On `/admin/intake/:id` the coach can edit intake answers and click **Save Changes**, which calls `handleSaveProxy` in `src/pages/AdminIntakeCoachView.tsx`:

```ts
const { id: _id, access_token, created_at, ...updateFields } = form as any;
const { error } = await supabase.from("intake_surveys").update(updateFields).eq("id", id);
if (error) toast.error("Failed to save");
```

Two problems:

1. **Silent error** — the toast just says "Failed to save"; the real Postgres/PostgREST message is swallowed, so we can't see why it's failing in either the UI or our captured network traffic.
2. **Updating non-writable / system fields** — `form` is the full row from `SELECT *`, so the PATCH currently sends back `updated_at`, `submitted_at`, `status`, `filled_by`, `agent_id`, `lead_id`, etc. Sending `updated_at` from the client (or other server-managed fields) is the most common cause of a 400 here. We only strip `id`, `access_token`, `created_at`.

The session replay confirms the note insert succeeded (201) — the failure is specifically the survey PATCH after editing fields/checkboxes.

## Plan

### 1. Surface the real error
Update `handleSaveProxy` to include the error message in the toast and `console.error` it, so any future failure is debuggable:
```ts
toast.error(`Failed to save: ${error.message}`);
console.error("intake save error", error);
```
Do the same for `handleMarkReviewed` and `handleSaveNote`.

### 2. Whitelist writable columns
Instead of spreading the entire row, build the update payload from an explicit list of editable fields (all the survey answer columns that the form actually edits — `contact_name`, `contact_email`, `brokerage_name`, `city`, `state`, `license_type`, `years_in_real_estate`, `gci_last_12_months`, `sides_closed_last_12_months`, `top_financial_goal`, `top_financial_need`, `desired_monthly_credit_capacity`, `has_business_entity`, `entity_type`, `has_business_address`, `address_type`, `has_business_phone`, `has_business_email`, `has_business_website`, `has_business_bank_account`, `uses_accounting_software`, `accounting_software_name`, `business_credit_cards`, `vendor_tradelines`, `credit_reporting_bureaus`, `funding_gap_methods`, `desired_funding_types`, `personal_guarantee_comfort`, `personal_credit_score_range`, `preferred_support_format`, `interest_in_cohort`, `preferred_cohort_days`, `investment_readiness`, `additional_notes`).

This drops `id`, `access_token`, `created_at`, `updated_at`, `submitted_at`, `status`, `filled_by`, `agent_id`, `lead_id` from the payload — only `handleMarkReviewed` should touch `status`.

### 3. Verify
After deploying, click a checkbox and Save Changes on the same intake (`6a4451d8-…`) and confirm we see "Survey updated". If it still errors, the toast will now show the exact reason and we can iterate.

## Files to change
- `src/pages/AdminIntakeCoachView.tsx` — whitelist update payload, surface error messages.

No DB / RLS changes needed (admin already has `ALL` policy on `intake_surveys`).
