import { ChapterHeader, SectionHeading, Paragraph, KeyTakeaway } from "../GuideComponents";
import { GuideChecklist, StatusItem } from "../GuideMedia";

const items = [
  "Business legal name matches entity documents",
  "EIN issued (if applicable to your structure)",
  "Business address (physical, virtual, or home — not a PO box)",
  "Business phone listed and discoverable",
  "Domain-based email (not Gmail / Yahoo / Outlook)",
  "Business website present (a one-pager is fine)",
  "Business bank account established and used consistently",
  "Business licensing and profile listings consistent across directories",
  "Professional online presence: LinkedIn, Google Business Profile (where appropriate)",
];

const Ch08 = () => (
  <section id="chapter-8" className="scroll-mt-20 bg-muted/30 py-16">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <ChapterHeader number="CHAPTER 8" title="Fundability signals: the business identity checklist" />

        <Paragraph>Underwriters and bureaus pattern-match. They look for the same business across many surfaces — your bank, your applications, your website, public directories — and the moment those signals contradict, your file slows down or stops.</Paragraph>

        <GuideChecklist title="Your fundability signal checklist" items={items} />

        <SectionHeading>A sample "where do I stand?" snapshot</SectionHeading>
        <Paragraph>During your free 1:1 we generate this for you. It looks like:</Paragraph>

        <div className="my-6 rounded-2xl bg-card border border-border p-6 shadow-[0_8px_18px_rgba(11,31,59,.06)]">
          <StatusItem status="strong" label="Business bank account opened and active" />
          <StatusItem status="strong" label="EIN issued" />
          <StatusItem status="watch" label="Business email — Gmail address still in use" />
          <StatusItem status="watch" label="Business phone — not yet listed in directories" />
          <StatusItem status="missing" label="Business website on owned domain" />
          <StatusItem status="missing" label="D-U-N-S number registered" />
        </div>

        <KeyTakeaway>
          <h4 className="font-bold text-secondary mt-0 mb-3">Chapter 8 takeaways</h4>
          <ul className="list-disc pl-6 space-y-1 text-base text-foreground/90">
            <li>Fundability is a pattern, not a single score.</li>
            <li>Consistency across surfaces matters more than perfection on any one.</li>
            <li>The free 1:1 produces your personalized Strong / Watch / Missing snapshot.</li>
          </ul>
        </KeyTakeaway>
      </div>
    </div>
  </section>
);

export default Ch08;