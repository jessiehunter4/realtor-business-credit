import { ChapterHeader, SectionHeading, Paragraph, ChapterTakeaway, JessieNote, GoodNugget } from "../GuideComponents";

const phases = [
  {
    label: "Days 1–30",
    title: "Foundation",
    color: "hsl(var(--primary))",
    items: [
      "Confirm or complete business structure",
      "Open or clean up business banking",
      "Set up business identity — address, phone, email, website",
      "Begin bookkeeping",
      "Start managing personal credit utilization",
    ],
  },
  {
    label: "Days 31–60",
    title: "Fundability",
    color: "hsl(var(--accent))",
    items: [
      "Establish business credit reporting",
      "Open initial vendor / trade accounts",
      "Begin structured cash-reserve building",
      "Improve documentation and financial records",
    ],
  },
  {
    label: "Days 61–90",
    title: "Expansion",
    color: "hsl(var(--secondary))",
    items: [
      "Position for the first business credit account",
      "Identify appropriate lender relationships",
      "Continue reducing personal-credit reliance",
      "Establish repayment discipline",
      "Set 12-month financial goals",
    ],
  },
];

const Ch12 = () => (
  <section id="chapter-12" className="scroll-mt-20 bg-muted/30 py-16">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <ChapterHeader number="CHAPTER 12" title="Your 90-day RE Pro action plan (sample)" />

        <Paragraph>Here is a general framework of what a customized RE Pro plan may look like. Your actual plan is generated based on your answers in the interactive plan builder — but this gives you the shape of the journey.</Paragraph>

        <div className="grid md:grid-cols-3 gap-5 my-8">
          {phases.map((p) => (
            <div key={p.label} className="rounded-2xl bg-card border border-border p-6 shadow-[0_8px_20px_rgba(11,31,59,.07)] flex flex-col">
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-primary">{p.label}</span>
                <span className="h-2 w-16 rounded-full" style={{ background: p.color }} />
              </div>
              <h4 className="mt-0 mb-3 text-secondary font-extrabold text-lg">{p.title}</h4>
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-foreground/85 m-0">
                {p.items.map((i) => <li key={i}>{i}</li>)}
              </ul>
            </div>
          ))}
        </div>

        <SectionHeading>What "done" looks like by day 90</SectionHeading>
        <ul className="list-disc pl-6 space-y-2 text-base md:text-lg text-foreground/90 my-4">
          <li>Business identity clean and consistent across every surface.</li>
          <li>Business banking and bookkeeping running with a rhythm.</li>
          <li>Bureau presence established with initial reporting tradelines.</li>
          <li>Personal credit utilization dropping — because business expenses are moving off personal cards.</li>
          <li>First business credit account conversation or in hand.</li>
        </ul>

        <JessieNote>
          <p>The point isn't to finish every task in 90 days. The point is to <em>begin the right ones in the right order.</em> Momentum compounds. Ninety focused days can change the shape of your business's financial future for the next ten years.</p>
        </JessieNote>

        <GoodNugget>
          Consistent action across ninety days changes what your business qualifies for in the next twelve months.
        </GoodNugget>

        <ChapterTakeaway>
          Your plan is customized — no two RE pros have the same starting point. The interactive plan builder translates this framework into your specific next 90 days.
        </ChapterTakeaway>
      </div>
    </div>
  </section>
);

export default Ch12;