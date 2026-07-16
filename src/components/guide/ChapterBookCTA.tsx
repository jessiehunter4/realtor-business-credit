import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContactIdentity } from "@/hooks/useContactIdentity";
import { saveGuideScroll } from "@/lib/guideScrollMemory";

/**
 * Inline "Book a One-on-One Session" CTA rendered after each guide chapter.
 * Matches the navbar CTA styling and destination.
 */
const ChapterBookCTA = () => {
  const { buildForwardParams } = useContactIdentity();
  const params = buildForwardParams();
  const href = `/one-on-one${params ? `?${params}` : ""}`;

  return (
    <div className="container mx-auto max-w-3xl px-4 pb-10">
      <div className="flex justify-center">
        <Button asChild size="lg" className="text-base">
          <Link to={href} onClick={saveGuideScroll}>
            <Calendar className="mr-2 h-5 w-5" />
            Book a One-on-One Session
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ChapterBookCTA;