import { Link } from "react-router-dom";
import { FileText, CheckCircle2 } from "lucide-react";
import PlanMockupCard from "@/components/oneonone/PlanMockupCard";

const SamplePlanPreview = () => (
  <section className="container mx-auto px-4 py-16 md:py-20">
    <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
      <div>
        <span className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-semibold">
          📄 See a real example
        </span>
        <h2 className="mt-3 text-3xl md:text-4xl font-bold text-secondary">
          See what your custom plan looks like — before you start.
        </h2>
        <p className="mt-3 text-muted-foreground text-lg">
          Every Needs Analysis ends with a personalized RE Pro Business Structure, Finance
          &amp; Credit Plan. Here's a full sample for a fictional Sacramento broker so you
          know exactly what you're getting.
        </p>

        <ul className="mt-6 space-y-2.5">
          {[
            "Your goals & money-when-you-need-it snapshot",
            "Structure & fundability — Strong / Watch / Missing flags",
            "90-day action plan + 6–12 month roadmap",
            "Funding opportunities sized for your production",
            "Program options — only if you want help executing",
          ].map((b) => (
            <li key={b} className="flex gap-2 text-secondary">
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            to="/sample-plan"
            data-analytics-id="cta-view-sample-plan"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-3.5 text-base font-semibold shadow-card hover:shadow-card-hover hover:bg-success-green-hover active:bg-success-green-hover transition-all"
          >
            <FileText className="h-5 w-5" />
            View the Full Sample Plan
          </Link>
        </div>
      </div>

      <div className="relative">
        <div className="absolute -inset-4 bg-hero-grad rounded-3xl blur-2xl opacity-60 pointer-events-none" />
        <div className="relative rounded-2xl overflow-hidden shadow-card-hover">
          <PlanMockupCard />
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground italic">
          Sample only — yours will be built from your Needs Analysis.
        </p>
      </div>
    </div>
  </section>
);

export default SamplePlanPreview;