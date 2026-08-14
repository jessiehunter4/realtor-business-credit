import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContactIdentity } from "@/hooks/useContactIdentity";
import { useOnboardingStatus } from "@/hooks/useOnboardingStatus";

/**
 * Floating "Create My Plan" button fixed to the bottom-left of the viewport.
 * Persistent while scrolling the guide (freemium funnel: guide → plan → dashboard).
 */
const FloatingPlanCTA = () => {
  const { buildForwardParams } = useContactIdentity();
  const { hasPlan } = useOnboardingStatus();
  const params = buildForwardParams();
  const href = hasPlan ? "/dashboard" : `/intake${params ? `?${params}` : ""}`;

  return (
    <div
      className="hidden sm:block fixed bottom-6 left-6 z-40"
      style={{ bottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
    >
      <Button
        asChild
        className="h-12 md:h-14 gap-2 rounded-full bg-primary px-5 md:px-6 text-primary-foreground shadow-xl hover:bg-success-green-hover active:bg-success-green-hover"
      >
        <Link to={href} data-analytics-id="cta-plan-guide-floating">
          <Sparkles className="h-5 w-5" />
          <span className="text-sm font-semibold">{hasPlan ? "View My Plan" : "Create My Plan"}</span>
        </Link>
      </Button>
    </div>
  );
};

export default FloatingPlanCTA;