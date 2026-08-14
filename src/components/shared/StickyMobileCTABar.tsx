import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

interface Props {
  guideLink?: string;
}

const StickyMobileCTABar = ({ guideLink = "/guide" }: Props) => (
  <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur border-t border-border shadow-card-hover">
    <div className="px-3 py-2.5 flex gap-2" style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.5rem)" }}>
      <Link
        to={guideLink}
        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-primary text-primary-foreground px-3 py-2.5 text-sm font-semibold shadow-card-hover hover:bg-success-green-hover active:bg-success-green-hover transition-colors"
      >
        <BookOpen className="h-4 w-4" />
        Read the Free Guide
      </Link>
    </div>
  </div>
);

export default StickyMobileCTABar;