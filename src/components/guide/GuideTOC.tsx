const tocEntries = [
  { id: "introduction", label: "Introduction: Who this guide is for", sections: [] },
  { id: "chapter-1",  label: "1. Why most Realtors never build a real business foundation", sections: [] },
  { id: "chapter-2",  label: "2. The Realtor business model: lumpy income, steady expenses, fundability", sections: [] },
  { id: "chapter-3",  label: "3. Business structure options (Sole Prop · LLC · S-Corp · C-Corp)", sections: [] },
  { id: "chapter-4",  label: "4. Compliance reality: commission-to-entity pathways", sections: [] },
  { id: "chapter-5",  label: "5. Asset protection basics — and where trusts fit", sections: [] },
  { id: "chapter-6",  label: "6. The 3-Account Financial Foundation for Realtors", sections: [] },
  { id: "chapter-7",  label: "7. Bookkeeping & documentation lenders actually look for", sections: [] },
  { id: "chapter-8",  label: "8. Fundability signals: the business identity checklist", sections: [] },
  { id: "chapter-9",  label: "9. Business credit: how it really works", sections: [] },
  { id: "chapter-10", label: "10. The Realtor Credit Ladder", sections: [] },
  { id: "chapter-11", label: "11. Common mistakes that block approvals", sections: [] },
  { id: "chapter-12", label: "12. Your 30 / 60 / 90-day action plan", sections: [] },
  { id: "chapter-13", label: "13. The next step: Custom Plan + Program", sections: [] },
  { id: "resources",  label: "Resources & Additional Information", sections: [] },
];

const GuideTOC = () => (
  <section className="container mx-auto px-4 py-16">
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold text-secondary text-center mb-10">
        Table of Contents
      </h2>
      <nav className="space-y-2">
        {tocEntries.map((entry) => (
          <div key={entry.id}>
            <a
              href={`#${entry.id}`}
              className="block font-bold text-secondary hover:text-primary transition-colors py-2 text-base md:text-lg"
            >
              {entry.label}
            </a>
            {entry.sections.length > 0 && (
              <div className="pl-6 space-y-1 mb-2">
                {entry.sections.map((sec) => (
                  <p key={sec} className="text-sm text-muted-foreground">
                    {sec}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  </section>
);

export default GuideTOC;
