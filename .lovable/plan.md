# Add Structure Infographics to the Guide

Two uploaded diagrams need to live inside the on-site guide at the chapters where they best reinforce the narrative.

## Assets
Register both uploads as Lovable Assets (kept out of the repo binary tree):
- `user-uploads://ChatGPT_Image_Jul_23_2026_10_11_46_PM_1.png` → `src/assets/guide-structure-diagram.png.asset.json` — "RE Pro Business Credit Structure" (4-panel flow: Licensed Entity → Admin/Finance Entity → Personal Credit Bridge → Business Credit Growth Path).
- `user-uploads://ChatGPT_Image_Jul_23_2026_10_11_47_PM_2.png` → `src/assets/guide-structure-how-it-works.png.asset.json` — "How the RE Pro Business Credit Structure Works" (Objectives + 5 Progressive Steps).

## Placement

**Chapter 5 — "The five stages of building business credit"**
Insert the *"How the RE Pro Business Credit Structure Works"* image near the top of the chapter (right after the intro paragraph, before the 5-stage list). It visually previews the same progression the chapter walks through, giving skimmers the objective + steps at a glance.

**Chapter 4 — "Personal credit is often the bridge — not the final destination"**
Insert the *"RE Pro Business Credit Structure"* 4-panel diagram after the opening paragraphs. The middle "Personal Credit Bridge" panel directly matches the chapter's core message, and the growth-path panel reinforces that the bridge is temporary.

Both images will be rendered inside a bordered, rounded figure container consistent with the guide's existing visual components (full-width on mobile, centered with `max-w-3xl` on desktop) with concise italic captions and proper alt text. No new component file needed — reuse standard `<figure>`/`<img>` styled with Tailwind matching the guide's card look.

## Out of scope
- PDF guide (`GuidePDF.tsx`) parity — not touched this pass.
- No copy rewrites; only image insertions + short captions.
