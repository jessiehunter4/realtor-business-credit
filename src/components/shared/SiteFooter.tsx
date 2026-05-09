import { Link } from "react-router-dom";
import { postFunnelEvent } from "@/lib/logFunnelEvent";
import { useContactIdentity } from "@/hooks/useContactIdentity";

const SiteFooter = () => {
  const { contactId } = useContactIdentity();

  const handleComparisonClick = () => {
    void postFunnelEvent({
      contactId: contactId || undefined,
      eventType: "comparison_page_click",
      metadata: { source: "footer" },
    }).catch(() => {});
  };

  return (
    <footer className="border-t border-border bg-secondary text-secondary-foreground/80 py-8 mt-0">
      <div className="container mx-auto px-4 max-w-5xl space-y-3 text-center md:text-left">
        <p className="text-xs md:text-sm leading-relaxed">
          <strong className="text-secondary-foreground">Educational content only.</strong>{" "}
          Realtor Business Credit and My Better Business Credit do not provide legal,
          tax, or investment advice. Always consult your broker, attorney, and tax
          professional about your specific situation. Outcomes vary and depend on
          each Realtor&apos;s actions and circumstances.
        </p>
        <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1 text-xs text-secondary-foreground/60">
          <span>© {new Date().getFullYear()} RealtorBusinessCredit.com</span>
          <Link to="/" className="hover:text-primary">Home</Link>
          <Link to="/guide" className="hover:text-primary">Free Guide</Link>
          <Link to="/one-on-one" className="hover:text-primary">Book a Session</Link>
          <Link to="/business-credit-cards-for-realtors" className="hover:text-primary" onClick={handleComparisonClick}>
            Business Credit Cards for Realtors
          </Link>
          <a href="https://mybetterbusinesscredit.fundabilityscan.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
            Fundability Scan
          </a>
          <Link to="/privacy" className="hover:text-primary">Privacy</Link>
          <Link to="/terms" className="hover:text-primary">Terms</Link>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;