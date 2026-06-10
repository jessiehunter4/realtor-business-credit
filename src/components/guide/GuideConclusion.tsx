import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Callout, StoryBox, ActionStep, QuoteBlock, ChapterHeader, SectionHeading, Paragraph } from "./GuideComponents";

const GuideConclusion = () => (
  <section id="conclusion" className="scroll-mt-20 bg-hero-grad py-16">
    <div className="container mx-auto px-4">
      <div className="max-w-3xl mx-auto text-center">
        <ChapterHeader number="CONCLUSION" title="You have a map. Let's draw your route." />
        <Paragraph>You now have the framework — structure, finance, fundability, the credit ladder, and the 30/60/90 plan. The next step is making it specific to <em>you</em>.</Paragraph>
        <Paragraph>In your free 1:1 we complete the Realtor Business Financial Needs Analysis together, identify your top gaps, and generate your custom plan in one sitting.</Paragraph>
        <p className="text-sm text-muted-foreground">
          Curious what the output looks like?{" "}
          <Link to="/sample-plan" className="font-semibold text-primary hover:underline">
            See a sample plan →
          </Link>
        </p>
        <div className="mt-8">
          <Button asChild size="lg" className="text-lg px-8 py-6 rounded-full" data-analytics-id="cta-book-guide-bottom">
            <Link to="/one-on-one">
              <Calendar className="mr-2 h-5 w-5" />
              Book your free 1:1
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground mt-4 italic">
            Free guide. Free 1:1. Free custom plan.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default GuideConclusion;
