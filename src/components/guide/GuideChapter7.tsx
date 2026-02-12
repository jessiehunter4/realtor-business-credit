import { Callout, StoryBox, KeyTakeaway, ChapterHeader, SectionHeading, Paragraph, BookSessionCTA } from "./GuideComponents";

const GuideChapter7 = () => (
  <section id="chapter-7" className="scroll-mt-20 bg-muted/30 py-16">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <ChapterHeader number="CHAPTER 7" title="Why You Need Professional Guidance" />

        <Paragraph>By now, you understand what business credit is, why it matters, and what the process looks like.</Paragraph>
        <Paragraph>The natural question is: Can I do this myself?</Paragraph>
        <Paragraph>The answer is yes—technically you can.</Paragraph>
        <Paragraph>But let me ask you a different question:</Paragraph>

        <SectionHeading>The Question That Changes Everything</SectionHeading>
        <Paragraph>Think about your clients. They COULD buy a house without you, right?</Paragraph>
        <Paragraph>They could:</Paragraph>
        <ul className="list-disc pl-6 space-y-1 text-base md:text-lg text-foreground/90 my-4">
          <li>Search for homes online themselves</li>
          <li>Call listing agents directly</li>
          <li>Write their own offers</li>
          <li>Negotiate directly with sellers</li>
          <li>Navigate inspections and appraisals</li>
          <li>Hire a real estate attorney to close</li>
        </ul>
        <Paragraph>But they don't do this. Why not?</Paragraph>

        <Callout>
          <h3 className="font-bold text-lg text-primary mt-0 mb-3">Because:</h3>
          <ul className="list-disc pl-6 space-y-1 text-base text-foreground/90">
            <li>The process is complex with many moving parts</li>
            <li>Mistakes are expensive and stressful</li>
            <li>You navigate this process every day—they don't</li>
            <li>Your expertise saves them time, money, and headaches</li>
            <li>You know which forms to use when</li>
            <li>You know which vendors and service providers to trust</li>
            <li>You know how to avoid common pitfalls</li>
            <li>You know when something isn't right and how to fix it</li>
            <li>The cost of professional guidance is tiny compared to the mistakes they could make</li>
          </ul>
        </Callout>

        <Paragraph><strong>Building business credit is the exact same situation.</strong></Paragraph>

        <SectionHeading>What Professional Guidance Actually Means</SectionHeading>
        <Paragraph>When I talk about professional guidance for building business credit, here's what that actually looks like:</Paragraph>

        <h3 className="text-xl font-bold text-secondary mb-3 mt-6">You Get Two Dedicated Coaches</h3>

        <StoryBox>
          <h3 className="font-bold text-lg text-primary mt-0 mb-3">Coach #1: Realtor Business Credit Coach</h3>
          <Paragraph>Someone who understands:</Paragraph>
          <ul className="list-disc pl-6 space-y-1 text-base text-foreground/90">
            <li>Real estate licensing requirements by state</li>
            <li>Broker relationships and restrictions</li>
            <li>Commission structures and cash flow challenges</li>
            <li>The unique financial situation realtors face</li>
          </ul>
          <Paragraph>They've worked with hundreds of agents and brokers. They know the questions YOU'LL have because they've heard them all before.</Paragraph>
        </StoryBox>

        <StoryBox>
          <h3 className="font-bold text-lg text-primary mt-0 mb-3">Coach #2: Credit Suite Coach</h3>
          <Paragraph>A specialist in business credit who knows:</Paragraph>
          <ul className="list-disc pl-6 space-y-1 text-base text-foreground/90">
            <li>Exactly which vendors to use (and which to avoid)</li>
            <li>Which credit cards to apply for and when</li>
            <li>How to troubleshoot reporting issues</li>
            <li>How to optimize your credit building strategy</li>
          </ul>
          <Paragraph>They do this every day. They know what works and what doesn't. They can spot problems before they become issues.</Paragraph>
        </StoryBox>

        <h3 className="text-xl font-bold text-secondary mb-3 mt-6">You Get a Customized Plan</h3>
        <Paragraph>Not generic advice from a course or ebook. A plan built specifically for:</Paragraph>
        <ul className="list-disc pl-6 space-y-2 text-base md:text-lg text-foreground/90 my-4">
          <li>YOUR state regulations</li>
          <li>YOUR broker requirements</li>
          <li>YOUR income level and tax situation</li>
          <li>YOUR goals (growth, stability, eventual exit)</li>
          <li>YOUR timeline</li>
        </ul>
        <Paragraph>What works in California doesn't work in Texas. What works for a solo agent doesn't work for a team broker. Customization matters.</Paragraph>

        <h3 className="text-xl font-bold text-secondary mb-3 mt-6">You Get Ongoing Support</h3>
        <Paragraph>This isn't "here's a course, good luck."</Paragraph>
        <Paragraph>You have coaches available throughout the 6-12 month process.</Paragraph>
        <Paragraph>Questions come up. ("This vendor is asking for something weird—is this normal?")</Paragraph>
        <Paragraph>Situations change. ("I just switched brokers—how does this affect my business structure?")</Paragraph>
        <Paragraph>You have support when you need it.</Paragraph>

        <SectionHeading>The Real Value</SectionHeading>
        <Paragraph><strong>You focus on closing deals. Professionals handle the complexity of building your business credit.</strong></Paragraph>
        <Paragraph>Your time is valuable. Every hour you spend researching vendors or troubleshooting credit bureau issues is an hour you're NOT:</Paragraph>
        <ul className="list-disc pl-6 space-y-1 text-base md:text-lg text-foreground/90 my-4">
          <li>Following up with leads</li>
          <li>Showing properties</li>
          <li>Negotiating offers</li>
          <li>Closing deals</li>
        </ul>
        <Paragraph>What's YOUR hourly rate when you're working in your business? Now compare that to the cost of professional guidance. The math isn't even close.</Paragraph>

        <KeyTakeaway>
          <h4 className="font-bold text-accent-foreground mt-0 mb-3">Key Takeaways from Chapter 7:</h4>
          <ul className="list-disc pl-6 space-y-1 text-base text-foreground/90">
            <li>You guide your clients because expertise matters—the same applies to building business credit</li>
            <li>Professional guidance means two dedicated coaches plus a customized plan</li>
            <li>The real value is focusing your time on what you do best (closing deals)</li>
            <li>DIY is possible but rarely optimal when your time has significant value</li>
          </ul>
        </KeyTakeaway>

        <BookSessionCTA />
      </div>
    </div>
  </section>
);

export default GuideChapter7;
