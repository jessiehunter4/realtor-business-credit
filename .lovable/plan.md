# Rewrite the intake welcome description

The line under the "RE Pro Business Financial Needs Analysis" heading currently says:

"Welcome, JP Morgan! Please complete the sections below to help us prepare for your session."

It doesn't tell people what the sections actually are. Rewrite it so it names the four steps of the survey.

## New copy

Welcome, {First Last}! Four quick steps — Profile, Goals, Business Structure, and Credit & Funding — and we'll build your custom 90-day plan.

Without a name: "Four quick steps — Profile, Goals, Business Structure, and Credit & Funding — and we'll build your custom 90-day plan."

## Technical notes

- Single copy change in `src/pages/IntakeSurveyPage.tsx` (the paragraph at the page header).
- Build the step list from the existing `steps` array so it stays correct if the optional "Program Fit" step is enabled, rather than hardcoding four names.
- No layout, styling, or logic changes; the line stays hidden on mobile as today.
