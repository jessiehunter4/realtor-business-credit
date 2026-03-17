

# Clear Imported Data from Database

## What will be deleted

All data from these tables (in dependency order):

1. **contact_syncs** — all rows (linked to agents/leads)
2. **transactions** — all rows (linked to agents and import_batches)
3. **import_batches** — all rows
4. **agents** — all rows
5. **leads** — all rows
6. **opt_outs** — all rows

## What will be preserved

- **auth.users** — jessie@goodtenants.com account untouched
- **user_roles** — admin role for jessie preserved
- **app_settings** — untouched
- **intake_surveys**, **intake_coach_notes**, **custom_plans** — these will also be cleared unless you want to keep them (let me know)

## How

Run DELETE statements via the data tool against each table in the correct order (child tables first to respect any implicit relationships).

