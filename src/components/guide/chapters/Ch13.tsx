import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChapterHeader, SectionHeading, Paragraph, KeyTakeaway, Callout } from "../GuideComponents";
import { GuideImage } from "../GuideMedia";
import coachImg from "@/assets/guide/coach-session.jpg";

const Ch13 = () => (
  <section id="chapter-13" className="scroll-mt-20 container mx-auto px-4 py-16">
    <div className="max-w-4xl mx-auto">
      <ChapterHeader number="CHAPTER 13" title="The next step: Custom Plan + Program" />

      <Paragraph>This guide gives you the map. The free 1:1 gives you the route. The optional program executes it with you.</Paragraph>

      <GuideImage src={coachImg} alt="Realtor and coach reviewing the RE Pro Business Financial Needs Analysis together at a bright table" caption="The free 1:1 — your Needs Analysis becomes your custom plan in one sitting." />

      <SectionHeading>What happens in your free 1:1</SectionHeading>
      <ol className="list-decimal pl-6 space-y-2 text-base md:text-lg text-foreground/90 my-4">
        <li>We complete the <strong>RE Pro Business Financial Needs Analysis</strong> together — about 5 minutes.</li>
        <li>We identify the top 3–5 structural gaps blocking your fundability today.</li>
        <li>You receive your <strong>Custom RE Pro Business Structure, Finance &amp; Credit Plan</strong> — click-and-read page plus downloadable PDF, with prioritized 90-day action steps.</li>
      </ol>

      <Callout variant="info">
        <Paragraph className="m-0"><strong>No cost. No obligation.</strong> The guide is free. The 1:1 is free. The custom plan is free. You only invest if you decide to enter the optional implementation program.</Paragraph>
      </Callout>

      <SectionHeading>If you want help executing — the program</SectionHeading>
      <ul className="list-disc pl-6 space-y-2 text-base md:text-lg text-foreground/90 my-4">
        <li><strong>Realtor Financial Credit Coach</strong> — one-on-one support against your plan.</li>
        <li><strong>Realtor Financial Credit Cohort</strong> — small group (5–10 Realtors) for accountability and momentum.</li>
        <li><strong>Credit Suite portal access</strong> — the platform and tools behind the build.</li>
        <li><strong>Business funding directory</strong> — vendors, cards, LOCs aligned to your stage.</li>
      </ul>

      <div className="text-center mt-12 mb-4">
        <Button
          asChild
          size="lg"
          className="text-lg px-8 py-6 rounded-full"
          data-analytics-id="cta-book-guide-final"
        >
          <Link to="/one-on-one">
            <Calendar className="mr-2 h-5 w-5" />
            Book your free 1:1
          </Link>
        </Button>
        <p className="text-sm text-muted-foreground mt-4 italic">
          The guide is free. The 1:1 is free. The custom plan is free.
        </p>
      </div>

      <KeyTakeaway>
        <h4 className="font-bold text-secondary mt-0 mb-3">Chapter 13 takeaways</h4>
        <ul className="list-disc pl-6 space-y-1 text-base text-foreground/90">
          <li>The Needs Analysis is completed live in the free 1:1 — that's its only purpose.</li>
          <li>The output of the 1:1 is your custom plan, not a sales pitch.</li>
          <li>The optional program turns the plan into actual structure, finance, and credit.</li>
        </ul>
      </KeyTakeaway>
    </div>
  </section>
);

export default Ch13;