import { ChapterHeader, SectionHeading, Paragraph, KeyTakeaway, Callout } from "../GuideComponents";
import { GuideImage, GuideChartUtilization, GuideChartCashFlow } from "../GuideMedia";
import splitImg from "@/assets/guide/personal-vs-business.jpg";

const Ch02 = () => (
  <section id="chapter-2" className="scroll-mt-20 bg-muted/30 py-16">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <ChapterHeader number="CHAPTER 2" title="The Realtor business model: lumpy income, steady expenses, and what fundability really means" />

        <Paragraph>Realtors don't get a salary. You get <strong>chunks</strong> — large, irregular, taxable. And in between those chunks, the meter never stops: CRM, ads, signs, staging, photography, mileage, subscriptions, dues.</Paragraph>

        <GuideChartCashFlow />

        <SectionHeading>Why this shape matters for fundability</SectionHeading>
        <Paragraph>Lenders, card issuers and business credit bureaus aren't grading your production. They're grading the <strong>shape and signal of your business identity</strong>:</Paragraph>
        <ul className="list-disc pl-6 space-y-1 text-base md:text-lg text-foreground/90 my-4">
          <li>A stable business identity (name, address, phone, email, website, EIN).</li>
          <li>Consistent business banking behavior across months.</li>
          <li>Documentation that matches your applications.</li>
          <li>Low "chaos" in statements — no random co-mingled spending.</li>
        </ul>

        <Callout variant="info">
          <Paragraph className="m-0">Your goal isn't just "get a card." It's to build a business that looks fundable from ten different angles. That's what unlocks higher limits and lower scrutiny.</Paragraph>
        </Callout>

        <SectionHeading>The hidden tax of using personal credit</SectionHeading>
        <Paragraph>Charge $3,000 of business expenses to a personal card and you don't just pay 18–24% interest. You quietly raise your personal utilization, which often costs you 20+ FICO points and shows up months later as a worse mortgage refi rate, a worse car loan, or a declined personal application.</Paragraph>

        <GuideChartUtilization />

        <GuideImage src={splitImg} alt="Stressed agent with personal credit card statements next to a relaxed agent with a business credit card and tidy ledger" caption="Same Realtor. Same expenses. Two very different financial lives." />

        <KeyTakeaway>
          <h4 className="font-bold text-secondary mt-0 mb-3">Chapter 2 takeaways</h4>
          <ul className="list-disc pl-6 space-y-1 text-base text-foreground/90">
            <li>Realtor income is lumpy; expenses are flat — fundability is what closes that gap.</li>
            <li>Lenders evaluate identity, behavior, and consistency — not just production.</li>
            <li>Business expenses on personal cards quietly damage your personal credit and pricing.</li>
          </ul>
        </KeyTakeaway>
      </div>
    </div>
  </section>
);

export default Ch02;