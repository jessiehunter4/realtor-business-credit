import { Callout, StoryBox, KeyTakeaway, ChapterHeader, SectionHeading, Paragraph, BookSessionCTA } from "./GuideComponents";

const GuideChapter3 = () => (
  <section id="chapter-3" className="scroll-mt-20 bg-muted/30 py-16">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <ChapterHeader number="CHAPTER 3" title="The True Cost of Using Personal Credit" />

        <Paragraph>Let's look at what it actually costs when you use personal credit for business:</Paragraph>

        <StoryBox>
          <h3 className="font-bold text-lg text-primary mt-0 mb-3">The $15,000 Commission Example</h3>
          <Paragraph>If you charge $3,000/month in business expenses to personal credit:</Paragraph>
          <ul className="list-disc pl-6 space-y-1 text-base text-foreground/90 mt-2">
            <li>Credit card interest (18% APR on average balance): $2,700/year</li>
            <li>Credit score damage (higher utilization): Drops 20-50 points</li>
            <li>Higher mortgage interest (because of lower score): $2,400-4,800/year extra</li>
            <li>Lost refinancing opportunity: $200-400/month</li>
          </ul>
          <Paragraph className="mt-3"><strong>Total Direct Cost: $4,950/year</strong></Paragraph>
          <Paragraph><strong>Total with Opportunity Cost: $11,450-26,450/year</strong></Paragraph>
        </StoryBox>

        <Paragraph>Let that sink in.</Paragraph>
        <Paragraph>You're potentially losing <strong>$11,000-26,000 per year</strong> by not having business credit.</Paragraph>
        <Paragraph>Multiply that over a 10-year real estate career: <strong>$110,000-260,000</strong>.</Paragraph>
        <Paragraph>That's not an exaggeration. That's math.</Paragraph>

        <BookSessionCTA />

        <SectionHeading>The Compound Effect</SectionHeading>
        <Paragraph>The cost of using personal credit doesn't just add up—it compounds.</Paragraph>

        {[
          { title: "Year 1: The Beginning", text: 'You start using personal credit for business. Everything seems fine. You pay off most of it each month. Your credit score only drops a little.', cost: "$5,000-8,000" },
          { title: "Year 2: The Creep", text: "Your business grows. Your expenses increase. You're carrying balances more often. Your credit score has dropped 40 points. You can't get that investment property loan.", cost: "$8,000-15,000" },
          { title: "Year 3: The Crisis", text: "You max out your personal cards. You need capital for a big opportunity, but you can't get approved. You tap your home equity. Your family's security is now at risk.", cost: "$12,000-25,000+ (plus immeasurable stress)" },
          { title: "Year 4+: The Long-Term Damage", text: "Your personal credit is wrecked. You're paying higher rates on everything. You can't qualify for good financing. You're stuck.", cost: "Ongoing, increasing every year" },
        ].map((y, i) => (
          <StoryBox key={i}>
            <h3 className="font-bold text-lg text-primary mt-0 mb-3">{y.title}</h3>
            <Paragraph>{y.text}</Paragraph>
            <Paragraph><strong>Cost: {y.cost}</strong></Paragraph>
          </StoryBox>
        ))}

        <SectionHeading>Real Examples from Real Realtors</SectionHeading>

        <Callout variant="important">
          <h3 className="font-bold text-lg text-destructive mt-0 mb-3">Sarah, Residential Agent, 5 Years Experience</h3>
          <Paragraph><strong>Situation:</strong> Used personal Amex for all business expenses. Carried $8,000-12,000 monthly balance.</Paragraph>
          <ul className="list-disc pl-6 space-y-1 text-base text-foreground/90 mt-2">
            <li>Credit score dropped from 780 to 650</li>
            <li>Couldn't refinance her home (lost $400/month in potential savings)</li>
            <li>Paid $2,400/year in interest on business expenses</li>
            <li>Lost investment property opportunity (couldn't qualify)</li>
          </ul>
          <Paragraph><strong>Total Cost: $9,600/year + lost investment opportunity</strong></Paragraph>
          <Paragraph><em>"I had no idea my business expenses were destroying my personal credit. I thought I was just being a responsible business owner."</em></Paragraph>
        </Callout>

        <Callout variant="important">
          <h3 className="font-bold text-lg text-destructive mt-0 mb-3">Marcus, Broker, 8 Years Experience</h3>
          <Paragraph><strong>Situation:</strong> Maxed out three personal credit cards financing team growth. Total balance: $45,000.</Paragraph>
          <ul className="list-disc pl-6 space-y-1 text-base text-foreground/90 mt-2">
            <li>Credit score dropped from 740 to 590</li>
            <li>Couldn't get car loan (had to pay cash, depleting emergency fund)</li>
            <li>Paid $8,100/year in credit card interest</li>
            <li>His wife almost divorced him over the financial stress</li>
          </ul>
          <Paragraph><strong>Total Cost: $8,100/year + marriage counseling + stress</strong></Paragraph>
          <Paragraph><em>"I thought this was just how you build a real estate business. Nobody told me there was another way."</em></Paragraph>
        </Callout>

        <SectionHeading>What One More Year Will Cost You</SectionHeading>
        <StoryBox>
          <h3 className="font-bold text-lg text-primary mt-0 mb-3">Conservative Estimate (12 Months of Waiting)</h3>
          <ul className="list-disc pl-6 space-y-1 text-base text-foreground/90">
            <li>Interest on business expenses carried on personal cards: $2,000-3,500</li>
            <li>Higher interest rates on personal loans due to higher utilization: $1,000-2,000</li>
            <li>Lost refinancing opportunity: $2,400-4,800 (12 months × $200-400/month savings)</li>
            <li>Stress, worry, family tension: Priceless (but very real)</li>
          </ul>
          <Paragraph><strong>Total Direct Cost of Waiting: $5,400-10,300</strong></Paragraph>
          <Paragraph>And that's just ONE year. Multiply by 5, 10, 15 years in real estate...</Paragraph>
        </StoryBox>

        <SectionHeading>The Alternative: What Having Business Credit Would Cost</SectionHeading>
        <Callout>
          <h3 className="font-bold text-lg text-primary mt-0 mb-3">The Investment in Building Business Credit</h3>
          <ul className="list-disc pl-6 space-y-1 text-base text-foreground/90">
            <li>Professional guidance and coaching: $1,500-3,000 (one-time)</li>
            <li>Time investment: 9-12 months of following a strategic plan</li>
            <li>Initial vendor accounts: Minimal (you're already buying these things for your business)</li>
          </ul>
          <Paragraph><strong>Total Investment: $1,500-3,000</strong></Paragraph>
          <Paragraph><strong>Payoff Time:</strong> 3-6 months (after which you're saving $5,000-10,000/year)</Paragraph>
          <Paragraph><strong>10-Year Return:</strong> $50,000-100,000+ in saved costs and increased opportunities</Paragraph>
        </Callout>

        <Paragraph>From a pure ROI perspective, this might be the best business decision you make in your entire real estate career.</Paragraph>

        <KeyTakeaway>
          <h4 className="font-bold text-accent-foreground mt-0 mb-3">Key Takeaways from Chapter 3:</h4>
          <ul className="list-disc pl-6 space-y-1 text-base text-foreground/90">
            <li>Using personal credit for business costs $5,000-26,000/year in direct and opportunity costs</li>
            <li>Over a 10-year career, this can total $50,000-260,000+</li>
            <li>The costs compound over time—they don't just add up, they get WORSE</li>
            <li>Building business credit is a one-time investment with massive long-term ROI</li>
            <li>Every month you wait costs you money</li>
            <li>The question isn't whether you can afford to build business credit—it's whether you can afford NOT to</li>
          </ul>
        </KeyTakeaway>
      </div>
    </div>
  </section>
);

export default GuideChapter3;
