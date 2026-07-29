import { Link } from "react-router-dom";
import { BookOpen, Calendar, ShieldCheck } from "lucide-react";
import VideoPlaceholder from "./VideoPlaceholder";

interface Props {
  firstName?: string;
  guideLink?: string;
  closingContext?: boolean;
}

const HeroSectionV2 = ({ firstName, guideLink = "/guide", closingContext = false }: Props) => {
  const headline = closingContext
    ? `Congrats${firstName ? `, ${firstName}` : ""} — money when you need it.`
    : "Money when you need it";

  const subhead =
    "Between closings, before your next client, and when opportunity knocks. Build the business structure, financial foundation, and separate business credit that funds your real estate practice the way commission income actually flows.";

  return (
    <section className="relative overflow-hidden bg-hero-grad">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-32 -right-16 w-[28rem] h-[28rem] rounded-full bg-sky/15 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16 relative z-10">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
          {/* Text column */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <h1 className="text-[clamp(1.875rem,5vw,3.5rem)] font-bold text-secondary leading-[1.08] tracking-tight text-balance">
              {headline}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty max-w-xl mx-auto lg:mx-0">
              {subhead}
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                to={guideLink}
                data-analytics-id="cta-guide-hero"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-base font-semibold shadow-card hover:shadow-card-hover hover:bg-primary/90 transition-all"
              >
                <BookOpen className="h-5 w-5" />
                Read the Free Guide
              </Link>
              <Link
                to="/one-on-one"
                data-analytics-id="cta-book-hero"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-sky text-sky-foreground px-6 py-3 text-base font-semibold shadow-card hover:shadow-card-hover hover:bg-sky/90 transition-all"
              >
                <Calendar className="h-5 w-5" />
                Book Free 1:1 Session
              </Link>
            </div>

            <p className="mt-5 text-xs text-muted-foreground flex flex-wrap items-center justify-center lg:justify-start gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              16 years brokering · Licensed CA &amp; GA · Certified Credit Suite Partner
            </p>
          </div>

          {/* Video column */}
          <div className="order-1 lg:order-2 relative">
            <div className="absolute -inset-4 bg-accent-grad rounded-3xl blur-2xl opacity-40 pointer-events-none" />
            <div className="relative">
              <VideoPlaceholder
                slotId="hero"
                title="Personal welcome from Jessie"
                caption="A 60-second intro to how this works and what you'll walk away with."
                fallbackStoragePath="hero-jessie.mp4"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionV2;