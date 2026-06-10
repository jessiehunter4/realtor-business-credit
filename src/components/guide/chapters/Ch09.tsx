import { ChapterHeader, SectionHeading, Paragraph, KeyTakeaway, Callout } from "../GuideComponents";

const Ch09 = () => (
  <section id="chapter-9" className="scroll-mt-20 container mx-auto px-4 py-16">
    <div className="max-w-4xl mx-auto">
      <ChapterHeader number="CHAPTER 9" title="Business credit: how it really works" />

      <Paragraph>"Business credit" gets thrown around like it's magic money. It isn't. Here's the honest version.</Paragraph>

      <SectionHeading>The mechanics</SectionHeading>
      <ul className="list-disc pl-6 space-y-2 text-base md:text-lg text-foreground/90 my-4">
        <li>Business credit profiles are built through <strong>reporting behavior</strong> and <strong>identity consistency</strong>, not just by having an EIN.</li>
        <li>The major business bureaus — <strong>Dun &amp; Bradstreet, Experian Business, Equifax Small Business</strong> — are separate from your personal bureaus and use different scoring models.</li>
        <li>What earns scores: accounts that actually <em>report</em> to those bureaus, paid on time, in matching identity.</li>
      </ul>

      <SectionHeading>What "separate" really means</SectionHeading>
      <Paragraph>Many early-stage business cards still require a personal guarantee — that's normal. The long-term objective is to build enough reporting history and revenue depth that your business can carry more capacity on its own, with less personal exposure over time.</Paragraph>

      <Callout variant="warning">
        <Paragraph className="m-0">Anyone promising "no PG, $100K in 30 days" is selling you something. Real fundability grows over months and rewards patience. The good news: months pass either way — you may as well be building.</Paragraph>
      </Callout>

      <KeyTakeaway>
        <h4 className="font-bold text-secondary mt-0 mb-3">Chapter 9 takeaways</h4>
        <ul className="list-disc pl-6 space-y-1 text-base text-foreground/90">
          <li>Business credit scores are built from reporting behavior, not just an EIN.</li>
          <li>D&amp;B, Experian Business and Equifax Small Business are the bureaus that matter.</li>
          <li>Early personal guarantees are normal — long-term we work to reduce them.</li>
        </ul>
      </KeyTakeaway>
    </div>
  </section>
);

export default Ch09;