import { ChapterHeader, SectionHeading, Paragraph, ChapterTakeaway, JessieNote, GoodNugget } from "../GuideComponents";
import personalVsBusiness from "@/assets/guide/personal-vs-business.jpg";
import { GuideImage } from "../GuideMedia";

const Ch01 = () => (
  <section id="chapter-1" className="scroll-mt-20 container mx-auto px-4 py-16">
    <div className="max-w-4xl mx-auto">
      <ChapterHeader number="CHAPTER 1" title="Why so many real estate professionals depend on personal credit" />

      <Paragraph>When most of us entered real estate, we focused on producing income. Finding clients. Getting listings. Closing transactions. Paying brokerage and association fees. Generating leads. Covering marketing.</Paragraph>

      <Paragraph>What we didn't stop to ask is a much quieter question: <em>who is actually financing my business?</em></Paragraph>

      <Paragraph>For a lot of us, the honest answer is: <strong>me.</strong> My personal credit cards. My personal savings. My home equity. My personal loans. My personal assets.</Paragraph>

      <JessieNote>
        <p>That arrangement worked when my closings were consistent. It became dangerous the first time transactions slowed down and my business expenses didn't. Marketing bills don't stop because a closing is delayed. Your CRM doesn't pause during a market correction. Dues, insurance, software, assistants, vehicle costs, and licensing fees keep coming — whether you close five transactions this month or none.</p>
      </JessieNote>

      <SectionHeading>The quiet cost</SectionHeading>
      <Paragraph>When business expenses live on personal credit cards, three things happen at once — and none of them are visible on your income statement:</Paragraph>
      <ul className="list-disc pl-6 space-y-1 text-base md:text-lg text-foreground/90 my-4">
        <li>Your personal utilization goes up, which drops your personal credit scores.</li>
        <li>Your future mortgage, refi, and auto loan pricing quietly gets worse.</li>
        <li>Your business never builds a financial identity a lender can evaluate on its own.</li>
      </ul>

      <GuideImage src={personalVsBusiness} alt="Same real estate professional funding expenses two ways — personal credit versus a business account with reserves" caption="Same professional. Same expenses. Two very different financial lives." />

      <GoodNugget>
        Personal credit is not the villain. Depending on personal credit forever is.
      </GoodNugget>

      <ChapterTakeaway>
        If your business cannot operate without your personal credit, you do not yet have true financial separation.
      </ChapterTakeaway>
    </div>
  </section>
);

export default Ch01;