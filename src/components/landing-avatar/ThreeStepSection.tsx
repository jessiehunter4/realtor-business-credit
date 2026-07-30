import { BookOpen, ClipboardList, Rocket } from "lucide-react";
import StepCard from "./StepCard";

const ThreeStepSection = () => {
  return (
    <section className="container mx-auto px-4 py-14 md:py-20">
      <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Jessie's 3-Step Rule
        </p>
        <h2 className="mt-2 text-3xl md:text-4xl font-bold text-secondary tracking-tight">
          Three steps. One clear path to money when you need it.
        </h2>
        <p className="mt-3 text-base md:text-lg text-muted-foreground">
          Read. Plan. Implement. That's the whole rule — and each step has Jessie explaining exactly
          what to do next.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <StepCard
          id="step-1"
          stepNumber={1}
          title="Read the Guide"
          description="Learn why most Realtors never build separate business credit — and the structure, finance, and credit foundation you actually need."
          icon={BookOpen}
          videoTitle="Step 1 — Read the Guide"
          videoDescription="Jessie walks you through what's inside and how to use it."
          ctas={[{ label: "Read the Guide", href: "/guide" }]}
        />
        <StepCard
          id="step-2"
          stepNumber={2}
          title="Create Your Customized Plan"
          description="Complete the Needs Analysis and get a Realtor-specific 90-day business structure, finance & credit plan built around your goals."
          icon={ClipboardList}
          videoTitle="Step 2 — Create Your Customized Plan"
          videoDescription="Jessie explains the Needs Analysis and how your plan is generated."
          ctas={[{ label: "Start Needs Analysis", href: "/intake" }]}
        />
        <StepCard
          id="step-3"
          stepNumber={3}
          title="Implementation"
          description="Execute your 90-day plan with the support that fits — self-paced, cohort, or 1:1 coaching with Jessie."
          icon={Rocket}
          videoTitle="Step 3 — Implementation"
          videoDescription="Jessie walks through your program options and what to expect."
          ctas={[{ label: "See Program Options", href: "/pricing" }]}
        />
      </div>
    </section>
  );
};

export default ThreeStepSection;