import { Callout, KeyTakeaway, QuoteBlock, ChapterHeader, SectionHeading, Paragraph } from "./GuideComponents";

const GuideChapter8 = () => (
  <section id="chapter-8" className="scroll-mt-20 container mx-auto px-4 py-16">
    <div className="max-w-4xl mx-auto">
      <ChapterHeader number="CHAPTER 8" title="Success Stories from Fellow Realtors" />

      <Paragraph>I want to share some stories from realtors who've gone through this process.</Paragraph>
      <Paragraph>Full disclosure: We're just launching this specialized program for real estate professionals, so these are early adopters who tested the system. But their results are real.</Paragraph>

      <QuoteBlock attribution="— Maria Rodriguez, Residential Agent, Texas">
        <p>"I closed 8 deals last year and my personal credit score dropped to 580 because of business expenses. I couldn't even get approved for a new personal card. After 6 months with this program, my business has its own credit profile and my PERSONAL score is back to 720. I can finally refinance my house. This literally changed my financial life."</p>
      </QuoteBlock>

      <QuoteBlock attribution="— David Chen, Commercial Broker, California">
        <p>"I've been in real estate for 15 years. FIFTEEN YEARS mixing personal and business. I had no idea this was even possible. I calculated what it cost me—conservatively $30,000 in extra interest over the years, plus who knows how much in lost opportunities because my personal credit was maxed. Better late than never, but I wish I'd known about this in 2009."</p>
      </QuoteBlock>

      <QuoteBlock attribution="— Jennifer Williams, Broker, Georgia">
        <p>"The dual coaching is what sold me. I didn't want to figure this out on my own—I'm busy running my business. Having someone who actually understands real estate licensing plus a credit expert was exactly what I needed. They handled the complexity. I just followed the steps they gave me. Setup took maybe 3 hours total over two weeks. Now my business expenses are completely separate and I have access to capital I didn't have before."</p>
      </QuoteBlock>

      <QuoteBlock attribution="— Marcus Thompson, Residential & Commercial Agent, Florida">
        <p>"I was skeptical at first. I thought 'I'm not making enough to worry about this.' But then I realized—that's exactly WHY I need it. When you're not making a ton of money, you can't afford to have business expenses destroying your personal credit. Now my personal score is improving, and when I DO have a great year, I'll have business credit ready to help me scale. I'm setting myself up for success instead of reacting to problems."</p>
      </QuoteBlock>

      <SectionHeading>Common Themes</SectionHeading>

      <Callout>
        <h3 className="font-bold text-lg text-primary mt-0 mb-3">"I Wish I'd Done This Years Ago"</h3>
        <Paragraph>Almost everyone says they wish they'd known about this earlier. The regret isn't about the decision to do it—it's about waiting so long.</Paragraph>
      </Callout>

      <Callout>
        <h3 className="font-bold text-lg text-primary mt-0 mb-3">"It Was Easier Than I Expected"</h3>
        <Paragraph>With guidance, the actual work involved is minimal. Most of the "work" is just waiting for things to process.</Paragraph>
      </Callout>

      <Callout>
        <h3 className="font-bold text-lg text-primary mt-0 mb-3">"The Freedom Feeling Is Real"</h3>
        <Paragraph>There's something psychologically powerful about knowing your business expenses can't hurt your personal finances. It changes how you think about investing in your business.</Paragraph>
      </Callout>

      <Callout>
        <h3 className="font-bold text-lg text-primary mt-0 mb-3">"I Feel More Professional"</h3>
        <Paragraph>Having proper business structure and business credit makes people feel like "real" business owners, not just agents operating out of their personal checking account.</Paragraph>
      </Callout>

      <KeyTakeaway>
        <h4 className="font-bold text-accent-foreground mt-0 mb-3">Key Takeaways from Chapter 8:</h4>
        <ul className="list-disc pl-6 space-y-1 text-base text-foreground/90">
          <li>Real realtors are successfully building business credit with professional guidance</li>
          <li>The common regret is waiting too long, not doing it</li>
          <li>With guidance, the process is more straightforward than expected</li>
          <li>The psychological and financial benefits are significant</li>
        </ul>
      </KeyTakeaway>
    </div>
  </section>
);

export default GuideChapter8;
