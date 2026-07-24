import { ChapterHeader, SectionHeading, Paragraph, ChapterTakeaway, JessieNote, GoodNugget } from "../GuideComponents";
import { ArrowRight } from "lucide-react";

const bridgeSteps = [
  { label: "Personal-credit dependence", tint: "hsl(var(--coral))" },
  { label: "Owner-supported business accounts", tint: "hsl(var(--accent))" },
  { label: "Blended owner + business underwriting", tint: "hsl(var(--sky))" },
  { label: "Business credit supported by revenue", tint: "hsl(var(--primary))" },
  { label: "Standalone business financing where qualified", tint: "hsl(var(--primary))" },
];

const Ch04 = () => (
  <section id="chapter-4" className="scroll-mt-20 bg-muted/30 py-16">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <ChapterHeader number="CHAPTER 4" title="Personal credit is often the bridge — not the final destination" />

        <Paragraph>Here's something important, and I wish someone had said it to me clearly early on: <strong>you may need your personal credit at the beginning.</strong> That does not mean you're doing anything wrong.</Paragraph>

        <Paragraph>When a business has limited operating history, lenders often look to the owner for extra support. That's normal. In the early stage, the owner may provide:</Paragraph>
        <ul className="list-disc pl-6 space-y-1 text-base md:text-lg text-foreground/90 my-4">
          <li>A personal guarantee</li>
          <li>Personal credit history</li>
          <li>Personal liquidity or startup capital</li>
          <li>Proof of financial responsibility</li>
        </ul>

        <SectionHeading>What has to shift over time</SectionHeading>
        <Paragraph>The important distinction is what happens after that first step. The business should increasingly become the <strong>borrower, account holder, user of the funds, and source of repayment.</strong></Paragraph>

        <Paragraph>A business card guaranteed by the owner can still be part of a business-credit strategy when it is issued to the business, used for business expenses, paid from business funds, and reported to business bureaus. That's very different from permanently charging all business expenses to a personal consumer card.</Paragraph>

        <SectionHeading>The natural progression</SectionHeading>
        <div className="my-8 rounded-2xl bg-card border border-border p-5 md:p-6 shadow-[0_8px_18px_rgba(11,31,59,.06)]">
          <div className="flex flex-col gap-3">
            {bridgeSteps.map((s, i) => (
              <div key={s.label} className="flex items-start gap-3">
                <span
                  className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ background: s.tint }}
                >
                  {i + 1}
                </span>
                <div className="flex-1">
                  <span className="text-base md:text-lg text-foreground font-medium">{s.label}</span>
                </div>
                {i < bridgeSteps.length - 1 && (
                  <ArrowRight className="mt-1 h-4 w-4 text-muted-foreground/60 rotate-90 md:rotate-0" aria-hidden />
                )}
              </div>
            ))}
          </div>
        </div>

        <JessieNote>
          <p>Personal guarantees aren't a sign of failure — they're a starting point. Some products may eventually offer reduced or no-PG requirements. Others will continue to require one under lender policy. Both can coexist inside a healthy business.</p>
        </JessieNote>

        <GoodNugget>
          Personal credit is often the bridge. It doesn't have to be the destination.
        </GoodNugget>

        <ChapterTakeaway>
          Personal credit may launch your business-credit profile. The long-term goal is a business that qualifies increasingly on its own strength.
        </ChapterTakeaway>
      </div>
    </div>
  </section>
);

export default Ch04;