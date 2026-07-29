import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import HeroVideoPlaceholder from "./HeroVideoPlaceholder";

interface Props {
  firstName?: string;
  heygenEmbedUrl?: string;
}

const AvatarHeroSection = ({ firstName, heygenEmbedUrl }: Props) => {
  const headline = firstName
    ? `Congrats, ${firstName} — money when you need it.`
    : "Money when you need it.";

  return (
    <section className="relative overflow-hidden bg-hero-grad">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-32 -right-16 w-[28rem] h-[28rem] rounded-full bg-sky/15 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-14 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-[clamp(1.75rem,6vw,3.25rem)] font-bold text-secondary leading-[1.08] tracking-tight text-balance">
            {headline}
          </h1>
          <p className="mt-3 text-[clamp(1rem,2.8vw,1.375rem)] font-semibold text-secondary/90 leading-snug max-w-2xl mx-auto">
            A personal welcome and Jessie's 3-Step Rule for RE Pro Business Credit.
          </p>

          <div className="relative mt-6 w-full max-w-[min(720px,100%)] mx-auto">
            <div className="absolute -inset-3 sm:-inset-5 bg-accent-grad rounded-3xl blur-2xl opacity-50 pointer-events-none" />
            <div className="relative">
              <HeroVideoPlaceholder
                heygenEmbedUrl={heygenEmbedUrl}
                alt="Personalized greeting from Jessie Hunter"
              />
            </div>
          </div>

          <p className="mt-5 sm:mt-6 text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            You just closed a deal. Here's a simple 3-step path to build the business structure,
            financial foundation, and separate business credit that funds your real estate practice —
            without leaning on personal credit.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/guide"
              data-analytics-id="avatar-cta-guide-hero"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-8 py-4 text-base font-semibold shadow-card hover:shadow-card-hover hover:bg-primary/90 transition-all"
            >
              <BookOpen className="h-5 w-5" />
              Read the Guide
            </Link>
            <a
              href="#step-1"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white/70 backdrop-blur border border-border text-secondary px-8 py-4 text-base font-semibold hover:bg-white transition-all"
            >
              See the 3-Step Rule
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AvatarHeroSection;