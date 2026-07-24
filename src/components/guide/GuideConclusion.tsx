import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { ChapterHeader, Paragraph, JessieNote, PlanCTAButton } from "./GuideComponents";

const GuideConclusion = () => (
  <section id="conclusion" className="scroll-mt-20 bg-hero-grad py-16">
    <div className="container mx-auto px-4">
      <div className="max-w-3xl mx-auto">
        <ChapterHeader number="CLOSING MESSAGE" title="From Jessie" />

        <Paragraph>Real estate has given many of us a path to independence. But independence should include more than the ability to earn a commission.</Paragraph>
        <Paragraph>It should include the ability to operate a financially organized business, protect personal credit, survive slow periods, and access capital when a real opportunity appears.</Paragraph>
        <Paragraph>I created RE Pro Business Credit because I believe we deserve a clearer path. You don't need to learn everything at once. Start with the guide. Then create your plan. Then implement it at the level of support that works for you.</Paragraph>

        <JessieNote title="My vision">
          <p>My vision is that thousands of licensed real estate professionals across the country will build properly structured businesses with strong financial records and access to capital based increasingly on the success of those businesses.</p>
          <p><strong>I hope you'll be one of them.</strong></p>
          <p className="text-sm text-muted-foreground m-0">— Jessie Hunter, Founder, RE Pro Business Credit</p>
        </JessieNote>

        <div className="mt-10 rounded-2xl bg-card border border-border p-6 md:p-8 shadow-[0_10px_30px_rgba(11,31,59,.08)]">
          <p className="text-xs uppercase tracking-widest text-primary font-bold mb-4 text-center">
            Your real estate business deserves its own financial future
          </p>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="rounded-xl bg-primary/8 border border-primary/25 p-4">
              <p className="text-xs uppercase tracking-widest text-primary font-bold mb-1">Step 1</p>
              <p className="font-bold text-secondary flex items-center gap-2 m-0">
                <CheckCircle2 className="h-4 w-4 text-primary" /> Read the Guide — Complete
              </p>
            </div>
            <div className="rounded-xl bg-[hsl(var(--sky)/0.1)] border border-[hsl(var(--sky)/0.3)] p-4">
              <p className="text-xs uppercase tracking-widest text-[hsl(var(--sky))] font-bold mb-1">Step 2</p>
              <p className="font-bold text-secondary m-0">Create Your Free Customized Plan</p>
            </div>
            <div className="rounded-xl bg-[hsl(var(--accent)/0.12)] border border-[hsl(var(--accent)/0.35)] p-4">
              <p className="text-xs uppercase tracking-widest text-[hsl(var(--accent))] font-bold mb-1">Step 3</p>
              <p className="font-bold text-secondary m-0">Choose Your Implementation Path</p>
            </div>
          </div>
          <div className="text-center">
            <PlanCTAButton label="Create My Plan" />
            <p className="mt-3 text-sm text-muted-foreground italic">
              Build today. Fund tomorrow. Grow your real estate business.
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              Curious what the output looks like?{" "}
              <Link to="/sample-plan" className="font-semibold text-primary hover:underline">
                See a sample plan →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default GuideConclusion;
