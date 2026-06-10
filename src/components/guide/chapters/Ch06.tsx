import { ChapterHeader, SectionHeading, Paragraph, KeyTakeaway } from "../GuideComponents";
import { GuideThreeAccountDiagram } from "../GuideMedia";

const Ch06 = () => (
  <section id="chapter-6" className="scroll-mt-20 bg-muted/30 py-16">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <ChapterHeader number="CHAPTER 6" title="The 3-Account Financial Foundation for Realtors" />

        <Paragraph>Realtors love simple systems. Here's the simplest one we've found that solves the lumpy-income problem and makes your business look fundable.</Paragraph>

        <GuideThreeAccountDiagram />

        <SectionHeading>How the flow works in practice</SectionHeading>
        <ul className="list-disc pl-6 space-y-2 text-base md:text-lg text-foreground/90 my-4">
          <li>Every commission deposit lands in <strong>Operating Checking</strong>.</li>
          <li>An automatic transfer moves your tax percentage to <strong>Tax Reserve Savings</strong> the same day.</li>
          <li>A second automatic transfer routes a smaller percentage to <strong>Opportunity Reserve</strong>.</li>
          <li>What's left in Operating funds the next 30–60 days of business expenses and your owner pay.</li>
        </ul>

        <SectionHeading>Optional add-ons as you grow</SectionHeading>
        <ul className="list-disc pl-6 space-y-1 text-base md:text-lg text-foreground/90 my-4">
          <li>"Owner Pay" personal transfer on a schedule</li>
          <li>"Marketing Reserve" for campaigns and ads</li>
          <li>"Client Experience Reserve" — staging, gifts, photography</li>
          <li>"Team Payroll / Contractor Reserve"</li>
        </ul>

        <SectionHeading>Why issuers love this</SectionHeading>
        <Paragraph>Card issuers and lenders love businesses that have clean inflows and outflows, predictable reserves, and statements that don't look like personal checking with a business name taped on. The 3-account system delivers exactly that — automatically, every month.</Paragraph>

        <KeyTakeaway>
          <h4 className="font-bold text-secondary mt-0 mb-3">Chapter 6 takeaways</h4>
          <ul className="list-disc pl-6 space-y-1 text-base text-foreground/90">
            <li>Three accounts: Operating, Tax Reserve, Opportunity Reserve.</li>
            <li>Automate the transfers — willpower is not a financial system.</li>
            <li>Predictable reserves are what underwriters reward with higher limits.</li>
          </ul>
        </KeyTakeaway>
      </div>
    </div>
  </section>
);

export default Ch06;