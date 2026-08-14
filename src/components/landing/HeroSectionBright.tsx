import { Link } from "react-router-dom";
import { BookOpen, Clock } from "lucide-react";
import HeroVideo from "@/components/shared/HeroVideo";

interface Props {
  firstName?: string;
  guideLink?: string;
  closingContext?: boolean;
}

const HeroSectionBright = ({ firstName, guideLink = "/guide", closingContext = false }: Props) => {
  const headline = closingContext
    ? `Congrats${firstName ? `, ${firstName}` : ""} — money when you need it.`
    : "Money when you need it";

  const tagline = "— between closings, before your next client, and when opportunity knocks.";

  return (
    <section className="relative overflow-hidden bg-hero-grad">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-32 -right-16 w-[28rem] h-[28rem] rounded-full bg-sky/15 blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-56 h-56 rounded-full bg-accent/15 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-4 sm:py-5 md:py-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-[clamp(1.75rem,6vw,3.25rem)] font-bold text-secondary leading-[1.08] tracking-tight text-balance mb-5 sm:mb-6 md:mb-8">
            {headline}
          </h1>

          <div className="relative mt-5 sm:mt-6 md:mt-8 w-full max-w-[min(600px,100%)] mx-auto">
            <div className="absolute -inset-3 sm:-inset-5 bg-accent-grad rounded-3xl blur-2xl opacity-50 pointer-events-none" />
            <div className="relative aspect-video w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-card-hover border border-border bg-secondary">
              <HeroVideo
                alt="Jessie Hunter explains why Realtors need separate business credit"
                className="rounded-2xl sm:rounded-3xl"
              />
            </div>
          </div>

          <p className="mt-3 sm:mt-4 text-sm sm:text-base font-medium text-secondary/80 leading-snug text-balance max-w-2xl mx-auto">
            {tagline}
          </p>

          <div className="mt-5 sm:mt-6 flex justify-center">
            <Link
              to={guideLink}
              data-analytics-id="cta-guide-hero"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-sky text-sky-foreground px-6 py-3 text-sm sm:text-base font-semibold shadow-card hover:shadow-card-hover hover:bg-sky/90 transition-all"
            >
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
              Read the Free Guide
            </Link>
          </div>

          <p className="mt-3 sm:mt-4 text-xs text-muted-foreground flex flex-wrap items-center justify-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-primary" />
            Free to read · about 5–10 minutes · no signup required
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionBright;