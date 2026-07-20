import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContactIdentity } from "@/hooks/useContactIdentity";

/**
 * Floating "Book a One-on-One Session" button fixed to the bottom of the viewport.
 * Persistent while scrolling the guide.
 */
const FloatingBookCTA = () => {
  const { buildForwardParams } = useContactIdentity();
  const params = buildForwardParams();
  const href = `/one-on-one${params ? `?${params}` : ""}`;

  return (
    <div
      className="hidden sm:block fixed bottom-6 left-6 z-40"
      style={{ bottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
    >
      <Button
        asChild
        className="h-12 md:h-14 gap-2 rounded-full bg-secondary px-5 md:px-6 text-secondary-foreground shadow-xl hover:bg-secondary/90"
      >
        <Link to={href}>
          <Calendar className="h-5 w-5" />
          <span className="text-sm font-semibold">Book a Session</span>
        </Link>
      </Button>
    </div>
  );
};

export default FloatingBookCTA;