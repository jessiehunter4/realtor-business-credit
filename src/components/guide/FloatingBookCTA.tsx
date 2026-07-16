import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContactIdentity } from "@/hooks/useContactIdentity";
import { saveGuideScroll } from "@/lib/guideScrollMemory";

/**
 * Floating "Book a One-on-One Session" button fixed to the bottom of the viewport.
 * Persistent while scrolling the guide.
 */
const FloatingBookCTA = () => {
  const { buildForwardParams } = useContactIdentity();
  const params = buildForwardParams();
  const href = `/one-on-one${params ? `?${params}` : ""}`;

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <Button
        asChild
        className="h-14 gap-2 rounded-full bg-secondary px-6 text-secondary-foreground shadow-xl hover:bg-secondary/90"
      >
        <Link to={href} onClick={saveGuideScroll}>
          <Calendar className="h-5 w-5" />
          <span className="text-sm font-semibold">Book a Session</span>
        </Link>
      </Button>
    </div>
  );
};

export default FloatingBookCTA;