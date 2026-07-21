import { Link } from "react-router-dom";
import { BookOpen, Calendar, ShieldCheck, FileText, GraduationCap } from "lucide-react";
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
    "Build the business structure, financial foundation, and separate business credit that funds your real estate practice the way commission income actually flows.";

  const trustBullets = [
    { icon: BookOpen, label: "Free guide" },
    { icon: Calendar, label: "Free 1:1 session" },
    { icon: FileText, label: "Custom plan from your Needs Analysis" },
    { icon: GraduationCap, label: "Educational — not legal/tax advice" },
  ];

  return (
    <section className="relative overflow-hidden bg-hero-grad">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-32 -right-16 w-[28rem] h-[28rem] rounded-full bg-sky/15 blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-56 h-56 rounded-full bg-accent/15 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16 lg:py-20 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full bg-primary/10 border border-primary/20">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
            </span>
            <span className="text-primary text-xs font-semibold tracking-wide uppercase">
              Coaching Program for Realtors
            </span>
          </div>
          <h1 className="text-[clamp(2rem,7vw,3.75rem)] font-bold text-secondary leading-[1.1] tracking-tight text-balance">
            {headline}
          </h1>
          <p className="mt-3 sm:mt-4 text-[clamp(1.125rem,3.4vw,1.875rem)] font-semibold text-secondary/90 leading-snug text-balance max-w-2xl mx-auto">
            {tagline}
          </p>

          <div className="relative mt-6 sm:mt-8 w-full max-w-[min(640px,100%)] mx-auto">
            <div className="absolute -inset-4 sm:-inset-6 bg-accent-grad rounded-3xl blur-2xl opacity-50 pointer-events-none" />
            <div className="relative aspect-video w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-card-hover border border-border bg-secondary">
              <HeroVideo
                alt="Jessie Hunter explains why Realtors need separate business credit"
                className="rounded-2xl sm:rounded-3xl"
              />
            </div>
          </div>

          <p className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty max-w-2xl mx-auto">
            {subhead}
          </p>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/one-on-one"
                data-analytics-id="cta-book-hero"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-4 text-base font-semibold shadow-card hover:shadow-card-hover hover:bg-primary/90 transition-all"
              >
                <Calendar className="h-5 w-5" />
                Book Free 1:1 Session
              </Link>
              <Link
                to={guideLink}
                data-analytics-id="cta-guide-hero"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-sky text-sky-foreground px-7 py-4 text-base font-semibold shadow-card hover:shadow-card-hover hover:bg-sky/90 transition-all"
              >
                <BookOpen className="h-5 w-5" />
                Read the Free Guide
              </Link>
          </div>

          <ul className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 max-w-xl mx-auto">
              {trustBullets.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2 bg-white/70 backdrop-blur border border-border rounded-2xl px-3 py-2.5 text-sm text-secondary shadow-card"
                >
                  <Icon className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="font-medium leading-tight text-left">{label}</span>
                </li>
              ))}
          </ul>

          <p className="mt-5 text-xs text-muted-foreground flex flex-wrap items-center justify-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            16+ years brokering · Licensed CA &amp; GA · Certified Credit Suite Partner
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionBright;