import { ChapterHeader, SectionHeading, Paragraph, KeyTakeaway, Callout } from "../GuideComponents";
import { GuideCreditLadder } from "../GuideMedia";

const Ch10 = () => (
  <section id="chapter-10" className="scroll-mt-20 bg-muted/30 py-16">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <ChapterHeader number="CHAPTER 10" title="The Realtor Credit Ladder" />

        <Paragraph>Think of credit as a ladder, not a button. Each rung exists for a reason and each one unlocks the next.</Paragraph>

        <GuideCreditLadder />

        <SectionHeading>What each month tends to feel like</SectionHeading>
        <div className="grid md:grid-cols-2 gap-4 my-6">
          <Callout variant="info">
            <h4 className="font-bold text-secondary mt-0 mb-2">Month 1 — Relief</h4>
            <Paragraph className="m-0">Your business identity exists on paper and online. You stop charging business spend to personal cards.</Paragraph>
          </Callout>
          <Callout variant="default">
            <h4 className="font-bold text-secondary mt-0 mb-2">Months 2–3 — Patience</h4>
            <Paragraph className="m-0">Quiet months. Tradelines reporting. Bureau profiles forming. Easy to feel like nothing's happening — it is.</Paragraph>
          </Callout>
          <Callout variant="default">
            <h4 className="font-bold text-secondary mt-0 mb-2">Months 4–5 — Momentum</h4>
            <Paragraph className="m-0">First scores appear. Vendor approvals come through. Your personal score starts recovering.</Paragraph>
          </Callout>
          <Callout variant="warning">
            <h4 className="font-bold text-secondary mt-0 mb-2">Month 6+ — Freedom</h4>
            <Paragraph className="m-0">First real revolving business card. A line of credit conversation becomes realistic. The system is now compounding.</Paragraph>
          </Callout>
        </div>

        <KeyTakeaway>
          <h4 className="font-bold text-secondary mt-0 mb-3">Chapter 10 takeaways</h4>
          <ul className="list-disc pl-6 space-y-1 text-base text-foreground/90">
            <li>Foundation → Bureaus → Tradelines → Revolving → Growth funding.</li>
            <li>You cannot skip rungs — but you can climb them faster with guidance.</li>
            <li>The quiet months are where the work happens; don't quit the system there.</li>
          </ul>
        </KeyTakeaway>
      </div>
    </div>
  </section>
);

export default Ch10;