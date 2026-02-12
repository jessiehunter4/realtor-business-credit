import { Callout, KeyTakeaway, ChapterHeader, SectionHeading, Paragraph, BookSessionCTA } from "./GuideComponents";

const GuideChapter4 = () => (
  <section id="chapter-4" className="scroll-mt-20 container mx-auto px-4 py-16">
    <div className="max-w-4xl mx-auto">
      <ChapterHeader number="CHAPTER 4" title="Common Questions & Objections" />

      <Paragraph>By now, you're probably thinking of reasons why this might not apply to you, or why it might not be the right time.</Paragraph>
      <Paragraph>I know, because I had the exact same thoughts.</Paragraph>
      <Paragraph>Let me address the most common questions and objections I hear from realtors:</Paragraph>

      <SectionHeading>"But I'm Just an Agent, Not a Real Business"</SectionHeading>
      <Callout>
        <Paragraph><strong>The Reality:</strong></Paragraph>
        <Paragraph>If YOU have business expenses—marketing, gas, technology, staging—YOU ARE a business owner.</Paragraph>
        <Paragraph>The IRS certainly treats you like a business when it comes to self-employment tax (15.3%), right?</Paragraph>
        <Paragraph>If you're a business for tax purposes, you deserve business credit protection.</Paragraph>
      </Callout>

      <SectionHeading>"My Broker Handles Everything"</SectionHeading>
      <Callout>
        <Paragraph><strong>The Reality:</strong></Paragraph>
        <Paragraph>Your broker doesn't pay YOUR Zillow bill.</Paragraph>
        <Paragraph>Your broker doesn't pay YOUR CRM subscription.</Paragraph>
        <Paragraph>Your broker doesn't pay YOUR gas.</Paragraph>
        <Paragraph>Those are YOUR business expenses. And mixing them with personal spending is hurting YOUR credit score, not theirs.</Paragraph>
      </Callout>

      <SectionHeading>"I Don't Make Enough to Worry About This"</SectionHeading>
      <Callout>
        <Paragraph><strong>The Reality:</strong></Paragraph>
        <Paragraph>That's exactly WHY you need it.</Paragraph>
        <Paragraph>If you're struggling financially, the last thing you need is business expenses damaging your personal credit and making everything worse.</Paragraph>
        <Paragraph>Protect what you have NOW. Build credit NOW so it's ready when you need it—not 6-12 months AFTER you needed it.</Paragraph>
      </Callout>

      <SectionHeading>"This Sounds Complicated and Expensive"</SectionHeading>
      <Callout>
        <Paragraph><strong>The Reality:</strong></Paragraph>
        <Paragraph>Setup costs: $50-300 total</Paragraph>
        <ul className="list-disc pl-6 space-y-1 text-base text-foreground/90 mt-2">
          <li>EIN from IRS: Free</li>
          <li>LLC filing: $100-300 (depending on your state)</li>
        </ul>
        <Paragraph>That's less than one month of Zillow.</Paragraph>
        <Paragraph>And it's WAY less expensive than the $15,000-25,000 per year you're losing by NOT doing this.</Paragraph>
      </Callout>

      <SectionHeading>"My Broker Won't Let Me Set Up a Separate Business"</SectionHeading>
      <Callout>
        <Paragraph><strong>The Reality:</strong></Paragraph>
        <Paragraph>Your real estate license and your business credit structure are two different things.</Paragraph>
        <Paragraph>For example, in California (where I practice), you can have your license under your personal name or a corporation, AND run business finances through a separate entity.</Paragraph>
        <Paragraph>Most agents can set this up without broker involvement. But every situation is different—this is one reason why consultation with professionals who understand real estate licensing is important.</Paragraph>
      </Callout>

      <SectionHeading>"I'll Do This When I'm More Established"</SectionHeading>
      <Callout>
        <Paragraph><strong>The Reality:</strong></Paragraph>
        <Paragraph>Building credit takes 6-12 months.</Paragraph>
        <Paragraph>Every month you wait is another month of damage to your personal credit.</Paragraph>
        <Paragraph>Start NOW so you have business credit when you need it—not 6-12 months AFTER you needed it.</Paragraph>
        <Paragraph>I waited 10+ years. Don't make my mistake.</Paragraph>
      </Callout>

      <SectionHeading>"I Need Perfect Personal Credit to Get Business Credit"</SectionHeading>
      <Callout>
        <Paragraph><strong>The Reality:</strong></Paragraph>
        <Paragraph>Business credit is separate from personal credit.</Paragraph>
        <Paragraph>Yes, some initial vendors may check your personal credit. But once you have 3-5 trade lines established, your business credit stands on its own.</Paragraph>
        <Paragraph>The process works even if your personal credit has taken hits from business expenses (typically 550+ personal score is sufficient to start).</Paragraph>
      </Callout>

      <KeyTakeaway>
        <h4 className="font-bold text-accent-foreground mt-0 mb-3">Key Takeaways from Chapter 4:</h4>
        <ul className="list-disc pl-6 space-y-1 text-base text-foreground/90">
          <li>Most objections come from lack of information, not reality</li>
          <li>If you have business expenses, you need business credit—regardless of your situation</li>
          <li>Setup is less expensive and complicated than you think</li>
          <li>Waiting doesn't make it easier—it just costs you more</li>
        </ul>
      </KeyTakeaway>

      <BookSessionCTA />
    </div>
  </section>
);

export default GuideChapter4;
