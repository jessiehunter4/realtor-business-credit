import { Building2, Landmark, FileText, ScrollText, Wallet, CreditCard, Activity, Package } from "lucide-react";
import { ChapterHeader, SectionHeading, Paragraph, ChapterTakeaway, JessieNote, GoodNugget } from "../GuideComponents";

const components = [
  { Icon: Building2, label: "Business identity", body: "Consistently identifiable across every surface." },
  { Icon: Landmark, label: "Banking", body: "Monthly deposits, average balances, consistency, no overdrafts." },
  { Icon: FileText, label: "Accounting", body: "P&L, balance sheet, cash-flow reports, debt schedules." },
  { Icon: ScrollText, label: "Statements", body: "Revenue, expenses, and payment history that match your story." },
  { Icon: CreditCard, label: "Credit accounts", body: "Vendor accounts, cards, loans, and lines that report cleanly." },
  { Icon: Activity, label: "Cash flow", body: "Not just revenue — money moving predictably between closings." },
  { Icon: Wallet, label: "Reserves", body: "Cash on hand for taxes, slow months, and opportunities." },
  { Icon: Package, label: "Assets", body: "Equipment, vehicles, receivables, real estate, or business property." },
];

const Ch06 = () => (
  <section id="chapter-6" className="scroll-mt-20 bg-muted/30 py-16">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <ChapterHeader number="CHAPTER 6" title="The business-credit components lenders need to see" />

        <Paragraph>Lenders don't evaluate one factor in isolation. They look at the <strong>full financial picture.</strong> The stronger and more consistent each piece, the more capital your business can access.</Paragraph>

        <div className="grid sm:grid-cols-2 gap-4 my-8">
          {components.map(({ Icon, label, body }) => (
            <div key={label} className="rounded-2xl bg-card border border-border p-5 shadow-[0_8px_18px_rgba(11,31,59,.06)]">
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <h4 className="m-0 font-bold text-secondary text-base">{label}</h4>
              </div>
              <p className="m-0 text-sm text-foreground/85 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        <SectionHeading>Revenue vs. cash flow — they're not the same</SectionHeading>
        <Paragraph>A real estate professional may earn strong annual income and still struggle between closings if cash is not managed. Lenders and card issuers know this — which is why cash flow and payment behavior often matter more than headline revenue.</Paragraph>

        <JessieNote>
          <p>On-time payments are one of the fastest, cheapest ways to build financial credibility. Nothing exotic, nothing clever — just consistency. And it's the one lever that costs you nothing to pull.</p>
        </JessieNote>

        <GoodNugget>
          A credit score may open a door — but cash flow, records, and repayment ability decide how far the business can go through it.
        </GoodNugget>

        <ChapterTakeaway>
          Lenders read the full picture. Every clean component you build makes every future application easier.
        </ChapterTakeaway>
      </div>
    </div>
  </section>
);

export default Ch06;