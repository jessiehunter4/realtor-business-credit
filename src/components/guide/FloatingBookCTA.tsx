import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContactIdentity } from "@/hooks/useContactIdentity";

/**
 * Floating "Book a One-on-One Session" button fixed to the bottom-left of the viewport.
 * Styled as a cohesive pair with the Table of Contents button on the right.
 */
const FloatingBookCTA = () => {
  const { buildForward pattern } = useContactIdentity();
  const params = buildForwardParams();
  const href = `/one-on-one${params ? `?${params}` : ""}`;

  return (
    <Button
      asChild
      size="icon"
      aria-label="Book a One-on-One Session"
      title="Book a One-on-One Session"
      className="fixed bottom-6 left-6 z-40 h-14 w-14 rounded-full shadow-xl bg-secondary text-secondary-foreground hover:bg-secondary/90"
    >
      <Link to={href}>
        <Calendar className="h-6 w-6" />
      </Link>
    </Button>
  );
};

export default FloatingBookCTA;