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

const chapterSubtitles: Record<string, string> = {
  "chapter-1": "The hidden cost of mixing",
  "chapter-2": "What separation really means",
  "chapter-3": "Set up for success",
  "chapter-4": "From personal to business",
  "chapter-5": "The step-by-step system",
  "chapter-6": "How lenders judge you",
  "chapter-7": "Classify your business right",
  "chapter-8": "Cash for the slow months",
  "chapter-9": "Grow without overextending",
  "chapter-10": "Run the numbers weekly",
  "chapter-11": "Protect your progress",
  "chapter-12": "Your personalized roadmap",
  "chapter-13": "Put your plan into action",
};

export const chapterItems = tocItems
  .filter((i) => /^chapter-\d+$/.test(i.id))
  .map((i) => ({
    ...i,
    number: Number(i.id.replace("chapter-", "")),
    title: i.label.replace(/^\d+\.\s*/, ""),
    subtitle: chapterSubtitles[i.id] ?? "",
  }));
