import { PlanCTAButton } from "./GuideComponents";

/**
 * Inline "Create My Customized Plan" CTA rendered after each guide chapter.
 * Freemium funnel: guide → plan → dashboard.
 */
const ChapterPlanCTA = () => (
  <div className="container mx-auto max-w-3xl px-4 pb-8 md:pb-10">
    <div className="flex flex-col items-center gap-2 text-center">
      <PlanCTAButton />
      <p className="text-xs text-muted-foreground italic">
        Free guide. Free plan. Free dashboard.
      </p>
    </div>
  </div>
);

export default ChapterPlanCTA;