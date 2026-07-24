import { ChapterHeader, SectionHeading, Paragraph, ChapterTakeaway, JessieNote, GoodNugget } from "../GuideComponents";

const runwayMonths = [
  { m: "0 mo", pct: 5, label: "Danger zone", color: "hsl(var(--coral))" },
  { m: "1 mo", pct: 20, label: "Fragile", color: "hsl(var(--coral))" },
  { m: "3 mo", pct: 50, label: "Stable", color: "hsl(var(--accent))" },
  { m: "6 mo", pct: 100, label: "Strong", color: "hsl(var(--primary))" },
];

const Ch08 = () => (
  <section id="chapter-8" className="scroll-mt-20 bg-muted/30 py-16">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <ChapterHeader number="CHAPTER 8" title="Build reserves before you desperately need credit" />

        <Paragraph>One of the greatest lessons I learned is this: <strong>credit should be arranged before the emergency.</strong></Paragraph>

        <Paragraph>When income is strong, it's easy to believe the next closing will solve everything. But real estate can change quickly. A delayed transaction can become a canceled transaction. A market shift can slow an entire pipeline.</Paragraph>

        <SectionHeading>Where reserves belong</SectionHeading>
        <Paragraph>Your business should work toward reserves for:</Paragraph>
        <ul className="list-disc pl-6 space-y-1 text-base md:text-lg text-foreground/90 my-4">
          <li>Operating expenses and marketing</li>
          <li>Taxes and estimated payments</li>
          <li>Debt payments</li>
          <li>Slow commission periods</li>
          <li>Emergencies</li>
          <li>Growth opportunities you want to say yes to</li>
        </ul>

        <SectionHeading>Your financial runway, visualized</SectionHeading>
        <div className="my-8 rounded-2xl border border-border bg-card p-6 md:p-8 shadow-[0_8px_18px_rgba(11,31,59,.06)]">
          <p className="text-xs uppercase tracking-widest text-primary font-bold mb-4">Months of business operating reserves</p>
          <div className="space-y-4">
            {runwayMonths.map((r) => (
              <div key={r.m}>
                <div className="flex justify-between text-sm font-semibold text-foreground mb-1.5">
                  <span>{r.m} · {r.label}</span>
                  <span className="tabular-nums text-muted-foreground">{r.pct}%</span>
                </div>
                <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${r.pct}%`, background: r.color }} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs text-muted-foreground">Illustrative. Six months of business operating reserves is a widely used comfort target.</p>
        </div>

        <JessieNote>
          <p>Business credit should support good financial management — not replace it. Credit used without a repayment plan becomes another problem. Credit combined with reserves, clean records, and dependable cash flow becomes a powerful business tool.</p>
        </JessieNote>

        <GoodNugget>
          Lenders prefer prepared businesses, not desperate applications.
        </GoodNugget>

        <ChapterTakeaway>
          The best time to build access to capital is before your business urgently needs it.
        </ChapterTakeaway>
      </div>
    </div>
  </section>
);

export default Ch08;