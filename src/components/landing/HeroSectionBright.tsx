import { Link } from "react-router-dom";
import { BookOpen, Clock, Compass, ClipboardList, Rocket } from "lucide-react";
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

  const subhead =
    "Commission income arrives in lumps. Your bills don't. Build the business structure and separate business credit that covers your overhead between closings — without leaning on your personal cards.";

  const trustBullets = [
    { icon: Compass, label: "Know where you stand" },
    { icon: ClipboardList, label: "Get a 90-day plan" },
    { icon: Rocket, label: "Choose how to implement" },
  ];

  return (
    <section className="relative overflow-hidden bg-hero-grad">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-32 -right-16 w-[28rem] h-[28rem] rounded-full bg-sky/15 blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-56 h-56 rounded-full bg-accent/15 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-5 sm:py-7 md:py-9 lg:py-10 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-[clamp(1.75rem,6vw,3.25rem)] font-bold text-secondary leading-[1.08] tracking-tight text-balance">
            {headline}
          </h1>
          <p className="mt-2 sm:mt-3 text-[clamp(1rem,2.8vw,1.5rem)] font-semibold text-secondary/90 leading-snug text-balance max-w-2xl mx-auto">
            {tagline}
          </p>

          <div className="relative mt-4 sm:mt-5 w-full max-w-[min(720px,100%)] mx-auto">
            <div className="absolute -inset-3 sm:-inset-5 bg-accent-grad rounded-3xl blur-2xl opacity-50 pointer-events-none" />
            <div className="relative aspect-video w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-card-hover border border-border bg-secondary">
              <HeroVideo
                alt="Jessie Hunter explains why Realtors need separate business credit"
                className="rounded-2xl sm:rounded-3xl"
              />
            </div>
          </div>

          <p className="mt-5 sm:mt-6 text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed text-pretty max-w-2xl mx-auto">
            {subhead}
          </p>

          <div className="mt-8 sm:mt-10 flex justify-center">
            <Link
              to={guideLink}
              data-analytics-id="cta-guide-hero"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-sky text-sky-foreground px-6 py-3 text-sm sm:text-base font-semibold shadow-card hover:shadow-card-hover hover:bg-sky/90 transition-all"
            >
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
              Read the Free Guide
            </Link>
          </div>

          <ul className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-2 max-w-3xl mx-auto items-stretch">
              {trustBullets.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="h-full flex items-center gap-2 bg-white/70 backdrop-blur border border-border rounded-2xl px-3 py-2 text-sm text-secondary shadow-card"
                >
                  <Icon className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="font-medium leading-tight text-left">{label}</span>
                </li>
              ))}
          </ul>

          <p className="mt-4 sm:mt-5 text-xs text-muted-foreground flex flex-wrap items-center justify-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-primary" />
            Free to read · about 5–10 minutes · no signup required
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionBright;