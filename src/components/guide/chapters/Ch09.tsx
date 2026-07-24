import { Megaphone, Cpu, ClipboardList, Users, Car, GraduationCap, Building, TrendingUp } from "lucide-react";
import { ChapterHeader, SectionHeading, Paragraph, ChapterTakeaway, JessieNote, GoodNugget, NextMove } from "../GuideComponents";

const capitalUses = [
  { Icon: Megaphone, label: "Marketing & lead generation" },
  { Icon: Cpu, label: "Technology & CRM systems" },
  { Icon: ClipboardList, label: "Transaction coordination" },
  { Icon: Users, label: "Assistants & staff" },
  { Icon: Building, label: "Office & operations" },
  { Icon: Car, label: "Equipment & vehicles" },
  { Icon: GraduationCap, label: "Education & training" },
  { Icon: TrendingUp, label: "Team growth & acquisitions" },
];

const Ch09 = () => (
  <section id="chapter-9" className="scroll-mt-20 container mx-auto px-4 py-16">
    <div className="max-w-4xl mx-auto">
      <ChapterHeader number="CHAPTER 9" title="Use capital to create capacity" />

      <Paragraph>The purpose of business credit is not simply to say you have it. The purpose is to help your business <strong>operate and grow.</strong></Paragraph>

      <SectionHeading>Common productive uses of capital</SectionHeading>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 my-6">
        {capitalUses.map(({ Icon, label }) => (
          <div key={label} className="rounded-2xl bg-card border border-border p-4 text-center shadow-[0_4px_14px_rgba(11,31,59,.05)]">
            <span className="mx-auto mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </span>
            <p className="m-0 text-sm text-foreground/85 font-medium">{label}</p>
          </div>
        ))}
      </div>

      <SectionHeading>Ask five questions before you borrow</SectionHeading>
      <ol className="list-decimal pl-6 space-y-2 text-base md:text-lg text-foreground/90 my-4">
        <li>What will the money be used for?</li>
        <li>How will it produce or protect revenue?</li>
        <li>What is the repayment source?</li>
        <li>Can the business manage the payment during a slow period?</li>
        <li>Does the financing term match the purpose?</li>
      </ol>

      <JessieNote>
        <p>Short-term financing for long-term problems is where most business-credit mistakes happen. Match the tool to the job — a card is not a substitute for savings, and a line of credit is not a substitute for a plan.</p>
      </JessieNote>

      <GoodNugget>
        Good capital improves capacity, stability, or profitability — not merely postpones an operating problem.
      </GoodNugget>

      <NextMove>
        <p>Before your next application, write the five questions above at the top of a page and answer them. If you can't, your business isn't ready to use that capital yet — and that's valuable information too.</p>
      </NextMove>

      <ChapterTakeaway>
        Capital is a tool. Use it to build capacity you can measure, not to patch problems you haven't diagnosed.
      </ChapterTakeaway>
    </div>
  </section>
);

export default Ch09;