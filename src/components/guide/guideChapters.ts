export interface TOCItem {
  id: string;
  label: string;
  isChapter: boolean;
  /** Short display title used in the floating navigation panel */
  short?: string;
  /** One-line description shown under the title in the floating navigation */
  sub?: string;
}

export const tocItems: TOCItem[] = [
  { id: "introduction", label: "Welcome from Jessie", short: "Introduction", sub: "Start here", isChapter: true },
  { id: "chapter-1", label: "1. Why we depend on personal credit", short: "Why we depend on personal credit", sub: "The hidden cost of mixing", isChapter: true },
  { id: "chapter-2", label: "2. What financial separation means", short: "What financial separation means", sub: "The freedom it creates", isChapter: true },
  { id: "chapter-3", label: "3. Licensed + admin structure", short: "Licensed + admin structure", sub: "Set up for success", isChapter: true },
  { id: "chapter-4", label: "4. Personal credit is the bridge", short: "Personal credit is the bridge", sub: "Protect your foundation", isChapter: true },
  { id: "chapter-5", label: "5. Five stages of business credit", short: "Five stages of business credit", sub: "Step-by-step system", isChapter: true },
  { id: "chapter-6", label: "6. What lenders need to see", short: "What lenders need to see", sub: "Get approval ready", isChapter: true },
  { id: "chapter-7", label: "7. The NAICS code question", short: "The NAICS code question", sub: "How you're classified", isChapter: true },
  { id: "chapter-8", label: "8. Build reserves early", short: "Build reserves early", sub: "Cash between closings", isChapter: true },
  { id: "chapter-9", label: "9. Use capital for capacity", short: "Use capital for capacity", sub: "Grow with leverage", isChapter: true },
  { id: "chapter-10", label: "10. Your financial command center", short: "Your financial command center", sub: "Track what matters", isChapter: true },
  { id: "chapter-11", label: "11. Mistakes to avoid", short: "Mistakes to avoid", sub: "Protect your future", isChapter: true },
  { id: "chapter-12", label: "12. Create your customized plan", short: "Create your customized plan", sub: "Your personalized roadmap", isChapter: true },
  { id: "chapter-13", label: "13. Implementation paths", short: "Implementation paths", sub: "Put your plan into action", isChapter: true },
  { id: "conclusion", label: "Closing message", short: "Closing message", sub: "A note to finish on", isChapter: true },
  { id: "resources", label: "Resources", short: "Resources", sub: "Tools and next steps", isChapter: true },
];

export const chapterItems = tocItems
  .filter((i) => /^chapter-\d+$/.test(i.id))
  .map((i) => ({ ...i, number: Number(i.id.replace("chapter-", "")) }));
