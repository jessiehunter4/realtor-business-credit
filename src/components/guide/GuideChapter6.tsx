import { Callout, KeyTakeaway, ChapterHeader, SectionHeading, SubHeading, Paragraph } from "./GuideComponents";

const GuideChapter6 = () => (
  <section id="chapter-6" className="scroll-mt-20 container mx-auto px-4 py-16">
    <div className="max-w-4xl mx-auto">
      <ChapterHeader number="CHAPTER 6" title="The Emotional Journey" />

      <Paragraph>I want to be honest with you about what this process actually FEELS like, because the emotional journey is just as important as the practical steps.</Paragraph>

      <SectionHeading>Month 1: "The Relief Phase"</SectionHeading>
      <SubHeading>What You're Doing:</SubHeading>
      <Paragraph>Setting up your business structure, getting your EIN, opening your business bank account</Paragraph>
      <SubHeading>How You Feel:</SubHeading>
      <Paragraph>Excited. Relieved. Like you're finally doing something proactive about your financial future instead of just reacting to problems.</Paragraph>
      <SubHeading>The Moment That Matters:</SubHeading>
      <Paragraph>When you open your business bank account, you look at it and think: "This is MY business. Separate from me. Professional."</Paragraph>
      <Paragraph>It's a small thing, but it feels significant. You're treating your real estate practice like the real business it is.</Paragraph>

      <SectionHeading>Months 2-3: "The Waiting Game"</SectionHeading>
      <SubHeading>What You're Doing:</SubHeading>
      <Paragraph>Establishing vendor accounts, making first purchases, waiting for reporting</Paragraph>
      <SubHeading>How You Feel:</SubHeading>
      <Paragraph>Impatient. "Is this working? Did I do it right? When will I see results?"</Paragraph>
      <SubHeading>The Moment That Matters:</SubHeading>
      <Paragraph>Your first vendor account gets approved without requiring a personal guarantee.</Paragraph>
      <Paragraph>You think: "Wait, they're giving me business credit based on my BUSINESS, not me personally?"</Paragraph>
      <Paragraph>That's when you realize this is real. Your business has financial credibility separate from you.</Paragraph>
      <SubHeading>What Professional Guidance Provides:</SubHeading>
      <Paragraph>Monitoring to ensure vendors are actually reporting. Troubleshooting any delays. Keeping you on track even when it feels like nothing is happening. Reassurance that this is normal and you're making progress.</Paragraph>

      <SectionHeading>Months 4-5: "The Momentum Shift"</SectionHeading>
      <SubHeading>What You're Doing:</SubHeading>
      <Paragraph>Adding more trade lines, watching your business credit score appear and grow</Paragraph>
      <SubHeading>How You Feel:</SubHeading>
      <Paragraph>Confident. You're seeing real progress. Your business now has a credit score separate from yours. The system is working exactly as promised.</Paragraph>
      <SubHeading>The Moment That Matters:</SubHeading>
      <Paragraph>You check your personal credit score and realize it's IMPROVING.</Paragraph>
      <Paragraph>Why? Because business expenses are no longer hitting it.</Paragraph>
      <Paragraph>You feel smarter than everyone else still mixing everything together. (Because you are.)</Paragraph>

      <SectionHeading>Month 6+: "The Freedom Feeling"</SectionHeading>
      <SubHeading>What You're Doing:</SubHeading>
      <Paragraph>Using your first business credit card for business expenses</Paragraph>
      <SubHeading>How You Feel:</SubHeading>
      <Paragraph>Like you're playing a different game than everyone else.</Paragraph>
      <Paragraph>FREE. Protected. Professional.</Paragraph>
      <SubHeading>The Moment That Matters:</SubHeading>
      <Paragraph>You buy a $2,000 marketing package on your business credit card—knowing it won't touch your personal credit at all.</Paragraph>
      <Paragraph>Then you think: "Why did I wait so long to do this?"</Paragraph>

      <Callout variant="warning">
        <h3 className="font-bold text-lg text-accent-foreground mt-0 mb-3">Your Timeline May Vary:</h3>
        <Paragraph>This is a typical timeline. Your journey might be faster or slower depending on:</Paragraph>
        <ul className="list-disc pl-6 space-y-1 text-base text-foreground/90">
          <li>How quickly you complete each step</li>
          <li>Your current credit situation</li>
          <li>Your business type and age</li>
          <li>Your state regulations</li>
          <li>How diligent you are with payments</li>
        </ul>
        <Paragraph>Some people have business credit cards in 4 months. Some take 9 months. Both are normal.</Paragraph>
      </Callout>

      <KeyTakeaway>
        <h4 className="font-bold text-accent-foreground mt-0 mb-3">Key Takeaways from Chapter 6:</h4>
        <ul className="list-disc pl-6 space-y-1 text-base text-foreground/90">
          <li>Building business credit has emotional phases—knowing what to expect helps</li>
          <li>The waiting periods are normal and necessary</li>
          <li>Having professional guidance helps you stay on track through the slow periods</li>
          <li>The "freedom feeling" at the end makes the entire journey worthwhile</li>
        </ul>
      </KeyTakeaway>
    </div>
  </section>
);

export default GuideChapter6;
