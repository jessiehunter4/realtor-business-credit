import { ChapterHeader, SectionHeading, Paragraph, ChapterTakeaway, JessieNote, GoodNugget } from "../GuideComponents";
import { BrokerCPADisclaimer } from "../GuideMedia";

const Ch03 = () => (
  <section id="chapter-3" className="scroll-mt-20 container mx-auto px-4 py-16">
    <div className="max-w-4xl mx-auto">
      <ChapterHeader number="CHAPTER 3" title="The licensed real estate business and the administrative structure" />

      <Paragraph>Here's a distinction most real estate professionals never hear made cleanly. There are two very different operations inside your business, and confusing them is where fundability gets tangled.</Paragraph>

      <SectionHeading>1. The licensed operation</SectionHeading>
      <Paragraph>Licensed real estate activity has to stay with the licensed person or the properly licensed entity. That's the operation that:</Paragraph>
      <ul className="list-disc pl-6 space-y-1 text-base md:text-lg text-foreground/90 my-4">
        <li>Represents buyers, sellers, landlords, and tenants.</li>
        <li>Performs licensed real estate services.</li>
        <li>Maintains brokerage and regulatory compliance.</li>
        <li>Generates commissions and fees.</li>
        <li>Receives real estate income as permitted by law and brokerage policy.</li>
      </ul>

      <SectionHeading>2. The administrative &amp; financial operations structure</SectionHeading>
      <Paragraph>A separate administrative entity may also be used when it performs legitimate, documented services for the licensed side. Those services can include:</Paragraph>
      <ul className="list-disc pl-6 space-y-1 text-base md:text-lg text-foreground/90 my-4">
        <li>Bookkeeping, expense administration, and financial reporting.</li>
        <li>Cash-flow, reserve, and business-credit management.</li>
        <li>Vendor, technology, and marketing administration.</li>
        <li>Lender relationship management.</li>
      </ul>

      <Paragraph>The two entities must have a legitimate and transparent relationship — written service agreements, documented reimbursements, appropriate management or administrative fees, properly recorded transfers, separate bank accounts, separate books, and accurate reporting.</Paragraph>

      <JessieNote>
        <p>The purpose isn't to disguise real estate activity. The purpose is to create a structure your CPA, attorney, and future financial partners can look at and understand instantly — which is exactly what lenders reward.</p>
      </JessieNote>

      <GoodNugget>
        The licensed business earns the revenue. The administrative structure organizes the finances, records, and credit-building activity.
      </GoodNugget>

      <BrokerCPADisclaimer />

      <ChapterTakeaway>
        Real estate income belongs to the licensed operation. Financial infrastructure belongs to a properly designed administrative structure — and the relationship between them has to be documented.
      </ChapterTakeaway>
    </div>
  </section>
);

export default Ch03;