import { ChapterHeader, SectionHeading, Paragraph, KeyTakeaway, Callout, BrokerCPADisclaimer } from "../GuideComponents";

const Ch05 = () => (
  <section id="chapter-5" className="scroll-mt-20 container mx-auto px-4 py-16">
    <div className="max-w-4xl mx-auto">
      <ChapterHeader number="CHAPTER 5" title="Asset protection basics — and where trusts fit" />

      <Paragraph>Most Realtors think asset protection equals "I need an LLC." Real asset protection is layered.</Paragraph>

      <SectionHeading>The five layers</SectionHeading>
      <ol className="list-decimal pl-6 space-y-2 text-base md:text-lg text-foreground/90 my-4">
        <li><strong>Correct entity structure</strong> for how you actually operate.</li>
        <li><strong>Correct insurance</strong> — E&amp;O, general liability, and personal umbrella coverage.</li>
        <li><strong>Correct contracts and business practices</strong> — clean engagements, clean disclosures.</li>
        <li><strong>Correct separation</strong> of personal and business assets, accounts, and credit.</li>
        <li><strong>In some cases, trust planning</strong> for long-term family and asset continuity.</li>
      </ol>

      <SectionHeading>Where trusts fit</SectionHeading>
      <Paragraph>Trusts may belong in your plan when you have significant personal assets, want long-term planning for family, real-estate holdings, or business continuity, or want additional layers beyond basic entity separation.</Paragraph>

      <Callout variant="info">
        <Paragraph className="m-0">Your custom plan can flag where trust coordination might fit — execution is always handled by an attorney. The program does not draft trusts; it tells you where the conversation belongs.</Paragraph>
      </Callout>

      <BrokerCPADisclaimer />

      <KeyTakeaway>
        <h4 className="font-bold text-secondary mt-0 mb-3">Chapter 5 takeaways</h4>
        <ul className="list-disc pl-6 space-y-1 text-base text-foreground/90">
          <li>"An LLC" is not asset protection — it's one layer of five.</li>
          <li>Insurance, contracts, and clean separation do most of the daily work.</li>
          <li>Trusts come in when assets and family planning are large enough to justify them.</li>
        </ul>
      </KeyTakeaway>
    </div>
  </section>
);

export default Ch05;