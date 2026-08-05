# Make "Anything else about your goals?" Roll Into Dashboard Goals

## The gap you spotted

Today the intake collects goals in three places, and only some of them survive into the dashboard as trackable goals:

| Intake field | Sent to plan generator | Becomes a dashboard goal |
|---|---|---|
| Primary Goals (up to 3 checkboxes) | Yes | Yes — first = primary, rest = secondary |
| "Other" goal free text (`primary_goals_other`) | No — not in the prompt | No |
| "Anything else about your goals?" (`goals_notes`) | Yes, as raw text | Only by accident, if the AI decides to |
| "Other" pain free text (`financial_pains_other`) | No | No |

So a Realtor who types a real fourth goal into the notes box has no guarantee it shows up. Sometimes the model folds it into the narrative, sometimes it creates a secondary goal, sometimes it drops it. That inconsistency is the actual problem.

## What I suggest

Treat manually entered goal text as real secondary goals — not just coach context — but make it explicit in both directions so nothing happens silently:

1. **Feed the missing fields to the plan generator.** Add `primary_goals_other` and `financial_pains_other` to the prompt so the "Other" text is never lost.
2. **Instruct the generator to split notes into goals.** Update the `goals` array description: any distinct, goal-shaped statement found in the Other text or the notes must become its own entry with `priority: "secondary"`; anything that is context (numbers, background, questions for the coach) stays in the narrative only.
3. **Add a deterministic safety net.** After the AI responds, reconcile in code: for each item in `primary_goals`, confirm a matching goal entry exists (case-insensitive label match); if not, append it — first checked item as `primary`, the rest `secondary`. If `primary_goals_other` has text and no goal entry references it, append that too. This guarantees checkbox selections always appear even if the model misbehaves.
4. **Say so in the UI.** Relabel the intake textarea and add helper copy so the expectation is set before they type.

## Intake UI changes (Step 2 — Goals)

Keep the two boxes but give them clearly different jobs:

- **"Other goal" box** (conditional on checking "Other"): unchanged, stays goal-oriented.
- **"Anything else about your goals?"** — relabel to **"Additional goals or context (optional)"** with helper text:
  > Goals you describe here are added to your dashboard as secondary goals. Background, numbers, and questions for your coach stay in your plan summary.

New placeholder: "e.g. Build a 6-month operating reserve. Or share numbers and context you'd like your coach to know."

Mirror the same helper copy in the admin coach view so Jessie knows what will be converted into goals.

## Dashboard changes

- Surface the **primary / secondary** distinction in `GoalsSection`: the primary goal pinned at the top with a small "Top priority" badge, secondary goals below under a subtle "Also working toward" divider. The `priority` field already exists on generated goals; it just is not shown.
- Update the section blurb: "These came from your Needs Analysis — including any goals you typed in yourself. Add more any time."
- Goals added by the safety net render identically to AI goals; users can still edit, remove, and add their own with the existing add-item form.

## Regeneration behavior

Existing plans do not change automatically. Users pick up the new behavior the next time a plan is regenerated through the existing regenerate path. No migration is needed since goals live inside `plan_data`.

## Technical notes

- `supabase/functions/generate-plan/index.ts` — add the two `_other` fields to the prompt context, tighten the `goals` array description, and add a post-response reconcile step before writing `plan_data.sections.goals_snapshot.goals`.
- `src/pages/IntakeSurveyPage.tsx` — relabel and re-copy the `goals_notes` textarea in Step B.
- `src/pages/AdminIntakeCoachView.tsx` — matching label and helper copy.
- `src/pages/dashboard/GoalsSection.tsx` — group by `priority`, add the badge and secondary divider.
- No database or schema changes; every field already exists on `intake_surveys`.

## Testing checklist

- [ ] Submit intake with 3 checkbox goals and no notes -> 3 dashboard goals, first marked primary.
- [ ] Check "Other" and type a goal -> that goal appears as a secondary dashboard goal.
- [ ] Type two distinct goals in the notes box -> both appear as secondary goals.
- [ ] Type pure context ("closed 14 sides last year, want to talk timing") -> no phantom goal created; text lands in the narrative.
- [ ] Duplicate wording between a checkbox goal and the notes -> one goal entry, no duplicate.
- [ ] Regenerating an existing plan picks up the new behavior.
- [ ] Goals section renders correctly with 1 goal, with 5 goals, and with 0 AI goals.
- [ ] Auto-save, validation, and step navigation on Step 2 unchanged.

## Phases

1. Generator: prompt fields, goals instruction, deterministic reconcile.
2. Intake and coach-view copy.
3. Dashboard primary/secondary grouping.
4. End-to-end test with a fresh intake, then a regeneration of an existing plan.