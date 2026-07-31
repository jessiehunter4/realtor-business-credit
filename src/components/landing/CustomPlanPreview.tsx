import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import PlanMockupCard from "@/components/oneonone/PlanMockupCard";

const CustomPlanPreview = () => (
  <section className="container mx-auto px-4 py-16 md:py-20">
    <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      <div className="order-2 lg:order-1">
        <span className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-semibold">
          Your Personalized Deliverable
        </span>
        <h2 className="mt-3 text-3xl md:text-4xl font-bold text-secondary">
          Custom Business &amp; Finance Plan
        </h2>
        <p className="mt-3 text-muted-foreground text-lg">
          Every Realtor's situation is different. After your free Needs Analysis, you receive a written plan built from your answers — not a generic template.
        </p>

        <ul className="mt-6 space-y-3">
          {[
            "30-Day Action Plan",
            "6-Month Roadmap",
            "Funding Strategy",
            "Business Finance Recommendations",
            "Next Steps",
          ].map((b) => (
            <li key={b} className="flex gap-3 text-secondary">
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="font-medium">{b}</span>
            </li>
          ))}
        </ul>

      </div>

      <div className="order-1 lg:order-2 relative flex justify-center lg:justify-end">
        <div className="absolute -inset-4 bg-hero-grad rounded-3xl blur-2xl opacity-60 pointer-events-none" />
        <div
          className="relative w-full max-w-md lg:max-w-full rounded-2xl overflow-hidden shadow-card-hover"
          style={{
            transform: "perspective(1000px) rotateY(-8deg) rotateX(4deg)",
            transformStyle: "preserve-3d",
          }}
        >
          <PlanMockupCard />
        </div>
      </div>
    </div>
  </section>
);

export default CustomPlanPreview;
