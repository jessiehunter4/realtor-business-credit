import { ChapterHeader, SectionHeading, Paragraph, ChapterTakeaway, JessieNote, GoodNugget } from "../GuideComponents";

const mistakes = [
  { title: "Waiting until you urgently need money", body: "Lenders prefer prepared businesses, not desperate applications." },
  { title: "Applying everywhere", body: "Too many poorly timed applications create inquiries, denials, and confusion." },
  { title: "Mixing personal and business money", body: "Commingling weakens your financial records and your credibility." },
  { title: "Assuming an EIN creates business credit", body: "It doesn't. The business has to build history." },
  { title: "Opening accounts without a strategy", body: "Not every vendor or card helps your plan." },
  { title: "Carrying high balances", body: "High utilization can weaken both personal and business credit." },
  { title: "Ignoring bookkeeping", body: "Lenders can't evaluate what the business can't document." },
  { title: "Expecting immediate no-guarantee financing", body: "Business-supported credit usually develops progressively." },
  { title: "Choosing the wrong lender", body: "A good business may still be declined by a lender that doesn't understand the industry or structure." },
];

const Ch11 = () => (
  <section id="chapter-11" className="scroll-mt-20 container mx-auto px-4 py-16">
    <div className="max-w-4xl mx-auto">
      <ChapterHeader number="CHAPTER 11" title="Common mistakes I want to help you avoid" />

      <Paragraph>I want to make your path easier by helping you skip mistakes many of us have made. Read this list slowly — most of these are quiet, and quiet mistakes are usually the most expensive.</Paragraph>

      <div className="grid md:grid-cols-2 gap-4 my-8">
        {mistakes.map((m) => (
          <div key={m.title} className="rounded-2xl bg-card border border-border p-5 shadow-[0_4px_14px_rgba(11,31,59,.05)]">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[hsl(var(--coral)/0.15)] text-[hsl(var(--coral))] text-sm font-bold">
                ✕
              </span>
              <div className="min-w-0">
                <h4 className="m-0 mb-1 font-bold text-secondary text-sm md:text-base">{m.title}</h4>
                <p className="m-0 text-sm text-foreground/80 leading-relaxed">{m.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <JessieNote>
        <p>Almost every declined application I see traces back to one or two items on this list — not to a bad business. Fix the timing, the identity, and the documentation, and most doors open on their own.</p>
      </JessieNote>

      <GoodNugget>
        Proper timing, documentation, and lender matching matter as much as the application itself.
      </GoodNugget>

      <ChapterTakeaway>
        Most declines aren't credit problems — they're identity, timing, and consistency problems. Fix those and everything downstream gets easier.
      </ChapterTakeaway>
    </div>
  </section>
);

export default Ch11;