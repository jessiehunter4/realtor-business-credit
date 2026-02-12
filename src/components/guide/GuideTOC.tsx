const tocEntries = [
  {
    id: "introduction",
    label: "Introduction: Congratulations on Your Recent Closing",
    sections: [],
  },
  {
    id: "chapter-1",
    label: "Chapter 1: My Story—The $8,000 Mistake",
    sections: ["The Wake-Up Call", "The Mistakes I Made", "What I Wish I'd Known"],
  },
  {
    id: "chapter-2",
    label: "Chapter 2: What Business Credit Actually Is",
    sections: ["The Missing Piece in Real Estate Education", "Why Nobody Told You", "What It Means for YOUR Business"],
  },
  {
    id: "chapter-3",
    label: "Chapter 3: The True Cost of Using Personal Credit",
    sections: ["Real Numbers from Real Situations", "What Waiting Another Year Will Cost", "The Commission Check Reality"],
  },
  {
    id: "chapter-4",
    label: "Chapter 4: Common Questions & Objections",
    sections: ['"But I\'m Just an Agent, Not a Business"', '"My Broker Handles Everything"', '"I\'ll Do This When I\'m More Established"', "And More..."],
  },
  {
    id: "chapter-5",
    label: "Chapter 5: The Seven-Step Process",
    sections: ["Understanding What's Involved", "Why This Isn't a DIY Project", "The Real Estate Transaction Analogy"],
  },
  {
    id: "chapter-6",
    label: "Chapter 6: The Emotional Journey",
    sections: ["Month 1: The Relief Phase", "Months 2–3: The Waiting Game", "Months 4–5: The Momentum Shift", "Month 6+: The Freedom Feeling"],
  },
  {
    id: "chapter-7",
    label: "Chapter 7: Why You Need Professional Guidance",
    sections: ["The Realtor-Client Analogy", "The Dual Coach System", "Customization Matters"],
  },
  {
    id: "chapter-8",
    label: "Chapter 8: Success Stories from Fellow Realtors",
    sections: [],
  },
  {
    id: "chapter-9",
    label: "Chapter 9: What's Next—Advanced Strategies",
    sections: [],
  },
  {
    id: "conclusion",
    label: "Conclusion: Your Next Steps",
    sections: [],
  },
  {
    id: "resources",
    label: "Resources & Additional Information",
    sections: [],
  },
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
