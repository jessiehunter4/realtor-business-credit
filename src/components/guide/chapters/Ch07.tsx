import { ChapterHeader, SectionHeading, Paragraph, KeyTakeaway, Callout } from "../GuideComponents";

const Ch07 = () => (
  <section id="chapter-7" className="scroll-mt-20 container mx-auto px-4 py-16">
    <div className="max-w-4xl mx-auto">
      <ChapterHeader number="CHAPTER 7" title="Bookkeeping &amp; documentation lenders actually look for" />

      <Paragraph>Fundability isn't only credit scores. It's <strong>paperwork confidence</strong> — the speed at which an underwriter can answer: "Is this a real business that pays on time?"</Paragraph>

      <SectionHeading>The minimum bar</SectionHeading>
      <ul className="list-disc pl-6 space-y-2 text-base md:text-lg text-foreground/90 my-4">
        <li>Business bank statements that match your story.</li>
        <li>Basic P&amp;L tracking — even a simple monthly summary.</li>
        <li>Consistent business name, address, phone and email on every application, invoice, website, and directory.</li>
      </ul>

      <SectionHeading>The "serious funding" bar</SectionHeading>
      <ul className="list-disc pl-6 space-y-2 text-base md:text-lg text-foreground/90 my-4">
        <li>Separate merchant processing where applicable.</li>
        <li>Clean accounting categories (marketing, technology, transportation, dues, etc.).</li>
        <li>Consistent monthly deposits routed through business accounts.</li>
        <li>A bookkeeping rhythm you can hand to a CPA in under an hour.</li>
      </ul>

      <Callout variant="info">
        <Paragraph className="m-0">You don't need enterprise accounting. You need <strong>predictable</strong> accounting. A shoebox of receipts with no system is more dangerous than admitting you need a bookkeeper.</Paragraph>
      </Callout>

      <KeyTakeaway>
        <h4 className="font-bold text-secondary mt-0 mb-3">Chapter 7 takeaways</h4>
        <ul className="list-disc pl-6 space-y-1 text-base text-foreground/90">
          <li>Lenders reward clarity, not complexity.</li>
          <li>Match your business identity exactly across every document and listing.</li>
          <li>Predictable monthly close beats fancy software with no rhythm.</li>
        </ul>
      </KeyTakeaway>
    </div>
  </section>
);

export default Ch07;