import { BookOpen, Calendar, FileText } from "lucide-react";
import StepCard from "./StepCard";

const ThreeStepSection = () => {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          Jessie's 3-Step Rule
        </p>
        <h2 className="mt-2 text-3xl md:text-5xl font-bold text-secondary tracking-tight text-balance">
          A simple path from closing to capacity
        </h2>
        <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          Three steps. No guesswork. Watch a short video for each, then take the next action.
        </p>
      </div>

      <ol className="max-w-6xl mx-auto space-y-16 md:space-y-24 list-none">
        <StepCard
          number={1}
          icon={BookOpen}
          title="Read the Free Guide"
          description="Understand the business structure, financial foundation, and separate business credit system in about 20 minutes. You'll see exactly why personal credit is holding your business back — and what to do instead."
          ctaLabel="Open the Guide"
          ctaTo="/guide"
          ctaAnalyticsId="cta-step-1-guide"
          videoTitle="Step 1 — Read the Guide"
          videoCaption="Jessie walks you through what's inside and how to use it."
          videoStoragePath="step-1-guide.mp4"
        />
        <StepCard
          number={2}
          icon={Calendar}
          title="Book Your Free 1:1 + Complete the Needs Analysis"
          description="Grab a time on Jessie's calendar and complete a short Needs Analysis so he can review your current setup, income patterns, and top gaps live with you on the call."
          ctaLabel="Book Your Free 1:1"
          ctaTo="/one-on-one"
          ctaAnalyticsId="cta-step-2-book"
          videoTitle="Step 2 — Book Your Free 1:1"
          videoCaption="What to expect on the call and how to prepare."
          videoStoragePath="step-2-book.mp4"
          reversed
        />
        <StepCard
          number={3}
          icon={FileText}
          title="Get Your Custom Plan & Start the Program"
          description="Walk away with a personalized 90-day action plan tailored to your business — then choose your path: self-paced, small-group cohort, or 1:1 coaching."
          ctaLabel="See a Sample Plan"
          ctaTo="/sample-plan"
          ctaAnalyticsId="cta-step-3-sample"
          videoTitle="Step 3 — Your Custom Plan"
          videoCaption="A look at what a finished plan includes and how the program runs."
          videoStoragePath="step-3-plan.mp4"
        />
      </ol>
    </section>
  );
};

export default ThreeStepSection;