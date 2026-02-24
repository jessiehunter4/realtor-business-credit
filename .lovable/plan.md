

# Custom Plan Generation

## Overview

Add a "Generate Plan" capability to the Coach View that reads the intake survey data, sends it to an AI model via an edge function, and produces a personalized Realtor Business Credit Plan. The coach can review, edit, and publish the plan.

## What Gets Built

### 1. Edge Function: `generate-plan`

A new backend function that:
- Accepts an intake survey ID (admin-only, JWT verified)
- Reads the full survey data and coach notes from the database
- Builds a structured prompt with all 6 plan sections from the knowledge file
- Calls Lovable AI (google/gemini-3-flash-preview) to generate personalized narrative sections
- Auto-populates status indicators based on survey answers (entity, address, phone, email, website, bank account, tradelines, credit bureaus)
- Saves the result to the `custom_plans` table as both `plan_data` (structured JSON) and `plan_html` (rendered HTML)

### 2. Plan Viewer Page: `/admin/plan/:id`

A read/edit page for coaches to:
- View the generated plan in a polished document layout (matching the PlanMockupCard design language)
- Edit narrative sections inline before publishing
- Publish the plan (sets `published_at` and `status = 'published'`)

### 3. "Generate Plan" Button on Coach View

A button added to the `/admin/intake/:id` header that:
- Calls the edge function
- Shows a loading state during AI generation
- Redirects to the plan viewer once complete

### 4. Public Plan View: `/portal/plan/:id`

A public-facing page where the agent can view their published plan (read-only, matching the polished document style).

---

## Technical Details

### Edge Function (`supabase/functions/generate-plan/index.ts`)

- **Auth**: Requires admin role (same pattern as intake-survey POST)
- **AI Model**: `google/gemini-3-flash-preview` via Lovable AI gateway
- **Prompt Strategy**: Uses tool calling to extract structured JSON with these sections:
  1. Goals and Snapshot (narrative paragraph)
  2. Business Structure and Fundability (auto-populated checklist + narrative)
  3. 90-Day Action Plan (8-12 prioritized action items)
  4. 6-12 Month Roadmap (milestone timeline)
  5. Credit and Funding Opportunities (based on survey answers)
  6. Program Options and Next Steps (standard template + personalized recommendation)
- **Status Logic** for fundability checklist:
  - "strong" if entity is Corporation/LLC, has bank account fully separate, has business phone/email/website, has 3+ tradelines, reports to bureaus
  - "warning" if partially present (e.g., home address, partially mixed banking)
  - "missing" if not present or "Not sure"
- Saves to `custom_plans` with `status: 'draft'`

### Plan Data Shape (`plan_data` JSONB)

```text
{
  contact_name, contact_email, city, state, license_type,
  sections: {
    goals_snapshot: { narrative: string },
    fundability: { items: [{label, status, detail}], narrative: string },
    action_plan_90day: { items: [{step, text, effort}] },
    roadmap: { milestones: [{month, description}] },
    funding_opportunities: { items: [{type, description}] },
    next_steps: { narrative: string, program_options: [{name, description}] }
  }
}
```

### New Files

| File | Purpose |
|------|---------|
| `supabase/functions/generate-plan/index.ts` | AI plan generation edge function |
| `src/pages/AdminPlanView.tsx` | Coach plan review/edit/publish page |
| `src/pages/PortalPlanView.tsx` | Public agent-facing plan view |
| `src/components/plan/PlanDocument.tsx` | Shared plan rendering component |

### Modified Files

| File | Change |
|------|--------|
| `src/pages/AdminIntakeCoachView.tsx` | Add "Generate Plan" button in header |
| `src/App.tsx` | Add routes for `/admin/plan/:id` and `/portal/plan/:id` |
| `supabase/config.toml` | Register `generate-plan` function with `verify_jwt = false` (auth checked in code) |

### Plan Document Design

The rendered plan follows the PlanMockupCard aesthetic:
- Dark navy header with green accent branding and agent name/location
- 6 numbered sections with green-bordered headings
- Fundability checklist with color-coded status icons (green check, amber warning, red X)
- Numbered action steps with green circle badges
- Dark navy footer with copyright and page info
- Responsive layout, printable

### Coach Workflow

1. Coach reviews completed intake in Coach View
2. Clicks "Generate Plan" button
3. Edge function reads survey + coach notes, calls AI, saves draft plan
4. Coach is redirected to Plan View page
5. Coach reviews the AI-generated content, can edit narrative sections
6. Coach clicks "Publish" to make it available to the agent
7. Agent receives a link to `/portal/plan/:id` to view their plan

