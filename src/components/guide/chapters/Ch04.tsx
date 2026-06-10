import { ChapterHeader, SectionHeading, Paragraph, KeyTakeaway, Callout } from "../GuideComponents";
import { BrokerCPADisclaimer } from "../GuideMedia";

const Ch04 = () => (
  <section id="chapter-4" className="scroll-mt-20 bg-muted/30 py-16">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <ChapterHeader number="CHAPTER 4" title="Compliance reality: commission-to-entity pathways" />

        <Paragraph>This is where Realtors get tripped up — and where you protect yourself and your fundability.</Paragraph>

        <Callout variant="warning">
          <h3 className="font-bold text-secondary text-lg mt-0 mb-2">Compliance notice</h3>
          <Paragraph className="m-0">Commission handling — whether paid to the individual licensee or to an authorized corporation / entity — must comply with your state's real estate licensing laws, your brokerage's supervision policies, and CPA / attorney guidance. RBC does not provide legal advice; we provide education and a planning framework, and the right pathway must be confirmed with your professionals.</Paragraph>
        </Callout>

        <SectionHeading>Why this matters for funding</SectionHeading>
        <Paragraph>Business credit and funding readiness depend on <strong>consistent</strong> business banking. That means income routed through your business accounts, business expenses paid from business accounts, and documentation that matches your applications.</Paragraph>
        <Paragraph>When commissions are paid in a way that <em>blocks</em> consistent business banking — for example, deposited entirely to a personal account and then transferred sporadically — fundability drops. Statements look chaotic, deposits don't tie to your entity, and underwriters can't tell what's the business and what's you.</Paragraph>

        <SectionHeading>What good looks like</SectionHeading>
        <ul className="list-disc pl-6 space-y-2 text-base md:text-lg text-foreground/90 my-4">
          <li>A compliant pathway your broker and CPA both sign off on.</li>
          <li>Income deposited (where allowed) into a clearly named business account.</li>
          <li>All business expenses paid from that account or a linked business card.</li>
          <li>A monthly rhythm a stranger could read and understand in 60 seconds.</li>
        </ul>

        <BrokerCPADisclaimer />

        <KeyTakeaway>
          <h4 className="font-bold text-secondary mt-0 mb-3">Chapter 4 takeaways</h4>
          <ul className="list-disc pl-6 space-y-1 text-base text-foreground/90">
            <li>Commission handling must respect state law, brokerage policy, and CPA guidance.</li>
            <li>Fundability rewards clean, consistent business banking month after month.</li>
            <li>The free 1:1 maps your specific pathway before you make any structural moves.</li>
          </ul>
        </KeyTakeaway>
      </div>
    </div>
  </section>
);

export default Ch04;