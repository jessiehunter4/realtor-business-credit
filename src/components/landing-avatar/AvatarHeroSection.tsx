import { Link } from "react-router-dom";
import { BookOpen, ChevronRight, Clock } from "lucide-react";
import HeroVideoPlaceholder from "./HeroVideoPlaceholder";

interface Props {
  firstName?: string;
  heygenEmbedUrl?: string;
}

const AvatarHeroSection = ({ firstName, heygenEmbedUrl }: Props) => {
  return (
    <section className="relative overflow-hidden bg-hero-grad">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-20 -right-12 w-80 h-80 rounded-full bg-sky/15 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-5 sm:py-8 md:py-10 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {firstName && (
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.14em] text-primary">
              Made for you, {firstName}
            </p>
          )}
          <h1 className="mt-2 text-[clamp(1.5rem,5vw,2.75rem)] font-bold text-secondary leading-[1.08] tracking-tight text-balance">
            Money when your business needs it.
          </h1>
          <p className="mt-2 sm:mt-3 text-[clamp(0.95rem,2.4vw,1.25rem)] font-medium text-secondary/90 leading-snug max-w-2xl mx-auto text-pretty">
            Commissions arrive in lumps; your overhead doesn't. Here's the simple three-step path to a
            business structure and separate business credit that covers you between closings.
          </p>

          <div className="relative mt-4 sm:mt-5 w-full max-w-[min(640px,100%)] mx-auto">
            <div className="absolute -inset-2 sm:-inset-4 bg-accent-grad rounded-3xl blur-2xl opacity-50 pointer-events-none" />
            <div className="relative">
              <HeroVideoPlaceholder
                heygenEmbedUrl={heygenEmbedUrl}
                alt="Your personalized welcome video"
              />
            </div>
          </div>

          <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row sm:items-center gap-3 justify-center">
            <Link
              to="/guide"
              data-analytics-id="avatar-cta-guide-hero"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-8 py-3.5 text-base font-semibold shadow-card hover:shadow-card-hover hover:bg-primary/90 transition-all"
            >
              <BookOpen className="h-5 w-5" />
              Read the Free Guide
            </Link>
            <a
              href="#step-1"
              className="inline-flex items-center justify-center gap-1 text-sm font-semibold text-secondary underline-offset-4 hover:underline transition-colors"
            >
              See the 3-step path
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>

          <p className="mt-3 text-xs text-muted-foreground flex flex-wrap items-center justify-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            Free to read · about 5–10 minutes · no signup required
          </p>

          <p className="mt-4 text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Built by a REALTOR® who ran a decade of business expenses on personal credit — so you don't
            have to.{" "}
            <Link to="/about" className="font-semibold text-primary underline underline-offset-4">
              Read the story
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default AvatarHeroSection;