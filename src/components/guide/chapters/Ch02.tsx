import { ChapterHeader, SectionHeading, Paragraph, ChapterTakeaway, GoodNugget, JessieNote } from "../GuideComponents";
import { CheckCircle2 } from "lucide-react";

const identityItems = [
  { label: "Legal business name", body: "Registered and used consistently." },
  { label: "EIN", body: "Federal identifier for the business — not your SSN." },
  { label: "Accurate NAICS code", body: "Reflects what the business actually does." },
  { label: "Business address", body: "Real, verifiable, not a P.O. box where avoidable." },
  { label: "Business phone", body: "Discoverable in directories, not your personal cell." },
  { label: "Domain + business email", body: "you@yourbusiness.com — not gmail." },
  { label: "Business bank accounts", body: "All money in and out flows through here." },
  { label: "Accounting records", body: "A monthly rhythm someone else can read." },
  { label: "Financial statements", body: "P&L, balance sheet, cash flow when needed." },
  { label: "Vendor & credit accounts", body: "Reporting activity in the business's name." },
  { label: "Documented cash flow", body: "Deposits and outflows that tell a story." },
];

const Ch02 = () => (
  <section id="chapter-2" className="scroll-mt-20 bg-muted/30 py-16">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <ChapterHeader number="CHAPTER 2" title="What business financial separation really means" />

        <Paragraph>Financial separation is more than forming an LLC or grabbing an EIN. Those are starting points, not finish lines.</Paragraph>
        <Paragraph>A separate business becomes recognizable as its own <strong>financial operation</strong> — an operation that banks, lenders, vendors, and business credit bureaus can look at and understand without asking you to explain it.</Paragraph>

        <SectionHeading>What "recognizable" looks like</SectionHeading>
        <Paragraph>As appropriate for your stage and structure, the business should have most of these in place:</Paragraph>

        <div className="my-6 rounded-2xl border border-border bg-card p-5 md:p-6 shadow-[0_8px_18px_rgba(11,31,59,.06)]">
          <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
            {identityItems.map((i) => (
              <li key={i.label} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-primary" />
                <div className="text-sm md:text-base">
                  <span className="font-semibold text-secondary">{i.label}.</span>{" "}
                  <span className="text-foreground/80">{i.body}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <JessieNote>
          <p>The objective is not a shell company. The objective is a real operating business with financial activity that can be documented and evaluated. If a bank pulled your file tomorrow, would they see a business — or a person with a nickname on their checking account?</p>
        </JessieNote>

        <GoodNugget>
          An EIN creates an identity. Consistent banking, accounting, revenue, and payment history create <em>credibility</em>.
        </GoodNugget>

        <ChapterTakeaway>
          Separation isn't a form you file — it's a pattern of behavior a lender can recognize.
        </ChapterTakeaway>
      </div>
    </div>
  </section>
);

export default Ch02;