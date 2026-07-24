import { ChapterHeader, SectionHeading, Paragraph, ChapterTakeaway, GoodNugget } from "../GuideComponents";

const stages = [
  {
    n: 1,
    title: "Establish the business foundation",
    body: "Entity, EIN, business banking, business email, business address, bookkeeping, accurate NAICS code, and financial records. The owner may still support the business personally at this stage.",
  },
  {
    n: 2,
    title: "Open and manage early business accounts",
    body: "Vendor accounts, business cards, trade relationships, banking history, and on-time payment history. Some accounts will still require a personal guarantee.",
  },
  {
    n: 3,
    title: "Strengthen the business profile",
    body: "Revenue consistency, cash flow, bank balances, financial statements, business credit history, higher credit limits, and reserves. The business begins carrying more of the underwriting weight.",
  },
  {
    n: 4,
    title: "Blended underwriting",
    body: "Lenders evaluate both the business and the owner. The business may qualify for larger business cards, lines of credit, equipment financing, working capital, and term loans.",
  },
  {
    n: 5,
    title: "Business-supported capital",
    body: "Qualifying lenders rely increasingly on business cash flow, revenue, payment history, financial statements, assets, and receivables. Some products may reduce or eliminate personal-guarantee requirements.",
  },
];

const Ch05 = () => (
  <section id="chapter-5" className="scroll-mt-20 container mx-auto px-4 py-16">
    <div className="max-w-4xl mx-auto">
      <ChapterHeader number="CHAPTER 5" title="The five stages of building business credit" />

      <Paragraph>Business credit is not one application or one account. It develops in stages — and every stage exists for a reason.</Paragraph>

      <SectionHeading>The five stages</SectionHeading>
      <div className="my-8 space-y-4">
        {stages.map((s) => (
          <div key={s.n} className="flex items-start gap-4 rounded-2xl bg-card border border-border p-5 md:p-6 shadow-[0_8px_18px_rgba(11,31,59,.06)]">
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary text-primary-foreground text-base font-bold">
              {s.n}
            </span>
            <div className="min-w-0">
              <h4 className="m-0 mb-1 font-bold text-secondary text-base md:text-lg">{s.title}</h4>
              <p className="m-0 text-sm md:text-base text-foreground/85 leading-relaxed">{s.body}</p>
            </div>
          </div>
        ))}
      </div>

      <GoodNugget>
        You cannot skip stages — but you can climb them faster with clear guidance and honest documentation.
      </GoodNugget>

      <ChapterTakeaway>
        Business credit grows as the business proves it can generate revenue, manage money, pay obligations, and support repayment.
      </ChapterTakeaway>
    </div>
  </section>
);

export default Ch05;