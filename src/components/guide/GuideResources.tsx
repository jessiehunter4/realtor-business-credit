import { Link } from "react-router-dom";
import { Callout, StoryBox, ChapterHeader, SectionHeading, Paragraph } from "./GuideComponents";

const GuideResources = () => (
  <>
    <section id="resources" className="scroll-mt-20 bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <ChapterHeader title="Resources & Additional Information" />

          <SectionHeading>Take Your Next Step</SectionHeading>
          <Callout>
            <h3 className="font-bold text-lg text-primary mt-0 mb-3">Realtor Business Credit</h3>
            <Paragraph><strong>Main Website:</strong> mybetterbusinesscredit.com</Paragraph>
            <Paragraph><strong>Realtor-Specific Resources:</strong> realtorbusinesscredit.com</Paragraph>
            <Paragraph>
              <strong>Free Needs Analysis & Session Booking:</strong>{" "}
              <Link to="/one-on-one" className="text-primary hover:underline font-bold">
                Book Here →
              </Link>
            </Paragraph>
          </Callout>

          <SectionHeading>About the Author</SectionHeading>
          <StoryBox>
            <h3 className="font-bold text-lg text-primary mt-0 mb-3">Jessie Hunter</h3>
            <Paragraph>Jessie Hunter is a licensed real estate broker in California and Georgia with over 15 years of experience in residential and commercial real estate.</Paragraph>
            <Paragraph>After discovering business credit late in his career—and calculating what it cost him not to know earlier—Jessie became a certified partner with Credit Suite to help fellow real estate professionals avoid the same mistakes.</Paragraph>
            <Paragraph>He founded Realtor Business Credit specifically to address the gap in real estate education around business finance fundamentals.</Paragraph>
            <Paragraph>Jessie's mission is simple: Ensure that no realtor waits 10+ years to discover business credit like he did.</Paragraph>
          </StoryBox>

          <SectionHeading>Share This Guide</SectionHeading>
          <Paragraph>If you found this guide valuable, please share it with fellow real estate professionals.</Paragraph>
          <Paragraph>Every agent and broker deserves to know that business credit exists and that there's a better way than mixing personal and business finances.</Paragraph>
        </div>
      </div>
    </section>

    {/* Back Cover */}
    <section className="bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground py-20 md:py-28 text-center">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Don't Wait Another 10 Years</h2>
        <p className="text-lg md:text-xl text-secondary-foreground/80 max-w-xl mx-auto leading-relaxed">
          Business credit exists. It's accessible. It can protect your financial future.
        </p>
        <p className="text-lg md:text-xl text-secondary-foreground/80 max-w-xl mx-auto leading-relaxed mt-4">
          The only question is: Will you take action now, or will you wait—and pay the hidden costs for years to come?
        </p>

        <div className="mt-10 inline-block bg-primary/10 border-2 border-primary rounded-xl p-8">
          <p className="text-xl font-bold text-primary mb-2">Book Your One-on-One Session</p>
          <Link to="/one-on-one" className="text-secondary-foreground hover:text-primary transition-colors font-semibold">
            RealtorBusinessCredit.com/one-on-one
          </Link>
          <p className="text-sm text-secondary-foreground/60 mt-2">Limited availability. Complete clarity. No pressure.</p>
        </div>

        <div className="mt-10 text-secondary-foreground/70 text-sm">
          <p><strong className="text-secondary-foreground">Realtor Business Credit</strong></p>
          <p>Helping Real Estate Professionals Build Better Business Credit</p>
          <p className="mt-4 text-secondary-foreground/40">© 2026 RealtorBusinessCredit.com | All Rights Reserved</p>
        </div>
      </div>
    </section>
  </>
);

export default GuideResources;
