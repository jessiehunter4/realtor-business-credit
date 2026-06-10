import { ChapterHeader, SectionHeading, Paragraph, KeyTakeaway, StoryBox, Callout } from "../GuideComponents";

const Ch01 = () => (
  <section id="chapter-1" className="scroll-mt-20 container mx-auto px-4 py-16">
    <div className="max-w-4xl mx-auto">
      <ChapterHeader number="CHAPTER 1" title="Why most Realtors never build a real business foundation" />

      <Paragraph>You've been trained on contracts, scripts, negotiations and market trends. You've passed exams. You've sat through countless designation classes.</Paragraph>
      <Paragraph>And yet almost nobody has trained you on the part that actually decides whether your business survives the slow months and scales the good ones: <strong>the business architecture underneath your production.</strong></Paragraph>

      <SectionHeading>What you were trained on</SectionHeading>
      <ul className="list-disc pl-6 space-y-1 text-base md:text-lg text-foreground/90 my-4">
        <li>Lead generation and conversion</li>
        <li>Contracts and negotiation</li>
        <li>Scripts and objection handling</li>
        <li>Market and product knowledge</li>
      </ul>

      <SectionHeading>What you were never trained on</SectionHeading>
      <ul className="list-disc pl-6 space-y-1 text-base md:text-lg text-foreground/90 my-4">
        <li>Entity structure that supports growth</li>
        <li>Clean banking and money flow between closings</li>
        <li>Business credit profiles and funding readiness</li>
        <li>How lenders actually evaluate a Realtor's business</li>
      </ul>

      <Paragraph>So Realtors do what "works" in the short term: personal credit cards for business spend, mixed accounts, irregular bookkeeping, commission advances to survive slow months. It keeps you in motion — and it caps how far you can scale, while quietly eroding your personal financial life.</Paragraph>

      <Callout variant="warning">
        <Paragraph className="m-0"><strong>The core insight:</strong> business credit is a downstream outcome of business <em>structure</em> and <em>finance</em>. Skip the foundation and the credit never shows up the way you need it.</Paragraph>
      </Callout>

      <StoryBox>
        <h3 className="font-bold text-lg text-secondary mt-0 mb-3">Founder sidebar — "I waited 15 years to find this out"</h3>
        <Paragraph>I'm Jessie Hunter, a real estate broker licensed in California and Georgia since 2010. Hundreds of closings, dozens of trainings, multiple designations — and not one of them taught me that my real estate business could have its own credit profile, its own cards, its own funding.</Paragraph>
        <Paragraph>When I needed capital to grow, I did what most Realtors do: maxed out personal cards at 18–24% APR, took a personal loan, then tapped home equity. The concept I was funding wasn't the mistake. <strong>How I funded it was.</strong></Paragraph>
        <Paragraph>I built this guide and the custom program because I don't want you to wait 10 more years to discover what I did.</Paragraph>
      </StoryBox>

      <KeyTakeaway>
        <h4 className="font-bold text-secondary mt-0 mb-3">Chapter 1 takeaways</h4>
        <ul className="list-disc pl-6 space-y-1 text-base text-foreground/90">
          <li>Real estate education skips business architecture almost entirely.</li>
          <li>Personal-credit-funded businesses cap their own growth and risk personal finances.</li>
          <li>Credit is a downstream outcome of structure and finance — fix the foundation first.</li>
        </ul>
      </KeyTakeaway>
    </div>
  </section>
);

export default Ch01;