export interface TOCItem {
  id: string;
  label: string;
  isChapter: boolean;
}

export const tocItems: TOCItem[] = [
  { id: "introduction", label: "Welcome from Jessie", isChapter: true },
  { id: "chapter-1", label: "1. Why we depend on personal credit", isChapter: true },
  { id: "chapter-2", label: "2. What financial separation means", isChapter: true },
  { id: "chapter-3", label: "3. Licensed + admin structure", isChapter: true },
  { id: "chapter-4", label: "4. Personal credit is the bridge", isChapter: true },
  { id: "chapter-5", label: "5. Five stages of business credit", isChapter: true },
  { id: "chapter-6", label: "6. What lenders need to see", isChapter: true },
  { id: "chapter-7", label: "7. The NAICS code question", isChapter: true },
  { id: "chapter-8", label: "8. Build reserves early", isChapter: true },
  { id: "chapter-9", label: "9. Use capital for capacity", isChapter: true },
  { id: "chapter-10", label: "10. Your financial command center", isChapter: true },
  { id: "chapter-11", label: "11. Mistakes to avoid", isChapter: true },
  { id: "chapter-12", label: "12. Create your customized plan", isChapter: true },
  { id: "chapter-13", label: "13. Implementation paths", isChapter: true },
  { id: "conclusion", label: "Closing message", isChapter: true },
  { id: "resources", label: "Resources", isChapter: true },
];

export const chapterItems = tocItems
  .filter((i) => /^chapter-\d+$/.test(i.id))
  .map((i) => ({ ...i, number: Number(i.id.replace("chapter-", "")) }));
