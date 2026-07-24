const tocEntries = [
  { id: "introduction", label: "Welcome from Jessie · Your Three-Step RE Pro Path", sections: [] },
  { id: "chapter-1",  label: "1. Why so many real estate pros depend on personal credit", sections: [] },
  { id: "chapter-2",  label: "2. What business financial separation really means", sections: [] },
  { id: "chapter-3",  label: "3. The licensed business and the administrative structure", sections: [] },
  { id: "chapter-4",  label: "4. Personal credit is often the bridge, not the destination", sections: [] },
  { id: "chapter-5",  label: "5. The five stages of building business credit", sections: [] },
  { id: "chapter-6",  label: "6. The business-credit components lenders need to see", sections: [] },
  { id: "chapter-7",  label: "7. The NAICS code question", sections: [] },
  { id: "chapter-8",  label: "8. Build reserves before you desperately need credit", sections: [] },
  { id: "chapter-9",  label: "9. Use capital to create capacity", sections: [] },
  { id: "chapter-10", label: "10. Your business financial command center", sections: [] },
  { id: "chapter-11", label: "11. Common mistakes I want to help you avoid", sections: [] },
  { id: "chapter-12", label: "12. Now create your customized plan", sections: [] },
  { id: "chapter-13", label: "13. Implementation is where the transformation happens", sections: [] },
  { id: "conclusion",  label: "Closing message from Jessie", sections: [] },
  { id: "resources",   label: "Resources & Additional Information", sections: [] },
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
