import { Callout, KeyTakeaway, ChapterHeader, SectionHeading, Paragraph } from "./GuideComponents";

const GuideChapter9 = () => (
  <section id="chapter-9" className="scroll-mt-20 bg-muted/30 py-16">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <ChapterHeader number="CHAPTER 9" title="What's Next: Advanced Strategies" />

        <Paragraph>This guide has focused on the foundation—establishing business credit and separating your business and personal finances.</Paragraph>
        <Paragraph>But there's a "Level 2" that most realtors never discover.</Paragraph>
        <Paragraph>Once you have established business credit, a whole world of financial strategies opens up:</Paragraph>

        <SectionHeading>Using Business Credit for Investment Properties</SectionHeading>
        <Paragraph>Many realtors eventually want to invest in real estate themselves. With established business credit, you can:</Paragraph>
        <ul className="list-disc pl-6 space-y-2 text-base md:text-lg text-foreground/90 my-4">
          <li>Fund down payments without touching personal savings</li>
          <li>Finance renovations on business credit</li>
          <li>Keep investment activities completely separate from your personal finances</li>
          <li>Build a portfolio without impacting your personal debt-to-income ratio</li>
        </ul>

        <SectionHeading>Strategic 0% APR Business Card Usage</SectionHeading>
        <Paragraph>Once you have multiple business credit cards, you can:</Paragraph>
        <ul className="list-disc pl-6 space-y-2 text-base md:text-lg text-foreground/90 my-4">
          <li>Use promotional 0% APR offers for short-term capital</li>
          <li>Fund marketing campaigns with essentially free money (if paid off during promo period)</li>
          <li>Smooth cash flow between commissions</li>
          <li>Never pay interest if managed strategically</li>
        </ul>

        <SectionHeading>Building Multiple Business Credit Profiles</SectionHeading>
        <Paragraph>For agents with multiple business entities or team brokers:</Paragraph>
        <ul className="list-disc pl-6 space-y-2 text-base md:text-lg text-foreground/90 my-4">
          <li>Each entity can have its own credit profile</li>
          <li>Multiply your available capital</li>
          <li>Separate different business activities</li>
          <li>Create saleable assets (businesses with their own credit)</li>
        </ul>

        <SectionHeading>Funding Your Transition Out of Real Estate</SectionHeading>
        <Paragraph>Eventually, many agents want to transition to something else—investing full-time, coaching, different business ventures, or retirement.</Paragraph>
        <Paragraph>Established business credit becomes an asset you can:</Paragraph>
        <ul className="list-disc pl-6 space-y-2 text-base md:text-lg text-foreground/90 my-4">
          <li>Use to fund your next venture</li>
          <li>Sell as part of your real estate business</li>
          <li>Leverage for investment opportunities</li>
          <li>Keep active even as you wind down real estate activities</li>
        </ul>

        <SectionHeading>Tax Optimization Strategies</SectionHeading>
        <Paragraph>With proper business structure and business credit, you can work with your CPA on:</Paragraph>
        <ul className="list-disc pl-6 space-y-2 text-base md:text-lg text-foreground/90 my-4">
          <li>Maximizing business expense deductions</li>
          <li>Optimal entity structure for tax purposes</li>
          <li>Clean books that make tax preparation easier and cheaper</li>
          <li>Audit protection (clean separation prevents issues)</li>
        </ul>

        <SectionHeading>Why These Strategies Come Later</SectionHeading>
        <Paragraph>All of these advanced strategies require one thing: <strong>established business credit.</strong></Paragraph>
        <Paragraph>You can't do Level 2 until you've completed Level 1.</Paragraph>
        <Paragraph>That's why starting now—even if you're not ready for advanced strategies—is so important.</Paragraph>
        <Paragraph>Build the foundation now. The advanced strategies will be available when you're ready for them.</Paragraph>

        <Callout>
          <h3 className="font-bold text-lg text-primary mt-0 mb-3">What Your Coaches Will Cover:</h3>
          <Paragraph>Your Realtor Business Credit Coach and Credit Suite Coach will introduce these advanced strategies once you've established your foundation.</Paragraph>
          <Paragraph>But first, you need that foundation. That's what the program builds.</Paragraph>
        </Callout>

        <KeyTakeaway>
          <h4 className="font-bold text-accent-foreground mt-0 mb-3">Key Takeaways from Chapter 9:</h4>
          <ul className="list-disc pl-6 space-y-1 text-base text-foreground/90">
            <li>Established business credit opens up advanced financial strategies</li>
            <li>These strategies can help you invest, grow, and eventually transition</li>
            <li>All advanced strategies require the foundation first</li>
            <li>Starting now means you'll be ready when opportunities arise</li>
          </ul>
        </KeyTakeaway>
      </div>
    </div>
  </section>
);

export default GuideChapter9;
