import { ArrowRight } from "lucide-react";
import { AFFILIATE_DISCLOSURE_SHORT, PARTNER_MASTERCLASS_URL } from "@/config/partner";

interface Props {
  label?: string;
  className?: string;
}

/** Enrollment CTA to the funding partner, always paired with the affiliate disclosure. */
const PartnerCTA = ({ label = "See how the funding partner program works", className = "" }: Props) => (
  <div className={`flex flex-col items-center gap-3 text-center ${className}`}>
    <a
      href={PARTNER_MASTERCLASS_URL}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-6 py-3.5 text-sm md:text-base font-semibold text-secondary-foreground shadow-card hover:bg-success-green hover:text-white active:bg-success-green-hover transition-colors"
    >
      {label}
      <ArrowRight className="h-4 w-4" />
    </a>
    <p className="max-w-xl text-xs text-muted-foreground leading-relaxed">{AFFILIATE_DISCLOSURE_SHORT}</p>
  </div>
);

export default PartnerCTA;