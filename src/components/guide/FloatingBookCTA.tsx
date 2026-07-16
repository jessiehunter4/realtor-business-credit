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
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 px-4 w-auto">
      <Button
        asChild
        size="lg"
        className="shadow-2xl shadow-primary/30 text-base rounded-full"
      >
        <Link to={href}>
          <Calendar className="mr-2 h-5 w-5" />
          Book a One-on-One Session
        </Link>
      </Button>
    </div>
  );
};

export default FloatingBookCTA;