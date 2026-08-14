import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

interface Props {
  guideLink?: string;
}

const FinalCTABright = ({ guideLink = "/guide" }: Props) => (
  <section className="container mx-auto px-4 py-16 md:py-24">
    <div className="relative overflow-hidden bg-hero-grad border border-border rounded-3xl shadow-card text-center px-6 py-14 md:py-20">
      <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-sky/15 blur-3xl pointer-events-none" />
      <div className="relative">
        <h2 className="text-3xl md:text-5xl font-bold text-secondary tracking-tight">
          Money when you need it isn't luck — it's a plan.
        </h2>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Start with the free guide. It takes about 5–10 minutes, and it's the first step toward your own 90-day plan.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to={guideLink}
            data-analytics-id="cta-guide-final"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-8 py-4 text-base font-semibold shadow-card hover:shadow-card-hover hover:bg-success-green-hover active:bg-success-green-hover transition-all"
          >
            <BookOpen className="h-5 w-5" />
            Start with the Free Guide
          </Link>
        </div>
        <p className="mt-6 text-sm text-secondary italic font-semibold">
          Fail to plan — plan to fail.
        </p>
      </div>
    </div>
  </section>
);

export default FinalCTABright;