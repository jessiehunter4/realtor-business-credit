import { ChapterHeader, SectionHeading, Paragraph, KeyTakeaway } from "../GuideComponents";
import { Guide306090Timeline, GuideQuoteCard } from "../GuideMedia";

const Ch12 = () => (
  <section id="chapter-12" className="scroll-mt-20 bg-muted/30 py-16">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <ChapterHeader number="CHAPTER 12" title="Your 30 / 60 / 90-day action plan" />

        <Paragraph>Here's the shape of the first three months. Your specific actions get customized in your free 1:1 — but every Realtor's first 90 days looks roughly like this.</Paragraph>

        <Guide306090Timeline />

        <SectionHeading>What Realtors say after the first 90 days</SectionHeading>
        <div className="grid md:grid-cols-2 gap-5 my-6">
          <GuideQuoteCard
            quote="I finally know where every dollar of every commission is going. The 3-account setup alone changed how I sleep at night."
            name="Maria R."
            role="Residential Agent · Placeholder"
            imageIndex={1}
          />
          <GuideQuoteCard
            quote="Three months in, my business has its own identity online, in the bureaus, and in my bank statements. I'm not co-mingling anything anymore."
            name="Marcus T."
            role="Broker · Placeholder"
            imageIndex={2}
          />
        </div>

        <KeyTakeaway>
          <h4 className="font-bold text-secondary mt-0 mb-3">Chapter 12 takeaways</h4>
          <ul className="list-disc pl-6 space-y-1 text-base text-foreground/90">
            <li>Days 1–30 are about structure and banking.</li>
            <li>Days 31–60 are about bureaus and starter tradelines.</li>
            <li>Days 61–90 are about expansion and your first revolving credit.</li>
          </ul>
        </KeyTakeaway>
      </div>
    </div>
  </section>
);

export default Ch12;