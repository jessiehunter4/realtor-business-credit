import { Link } from "react-router-dom";
import { ArrowRight, Check, Gift } from "lucide-react";
import type { JourneyStepContent } from "@/data/homepageJourney";

interface Props extends JourneyStepContent {
  cta?: { label: string; to: string; analyticsId?: string; variant?: "primary" | "link" };
}

const JourneyStep = ({
  id,
  step,
  eyebrow,
  icon: Icon,
  title,
  whatYouDo,
  whyItMatters,
  deliverable,
  bullets,
  bulletsTitle,
  image,
  imageAlt,
  reverse,
  cta,
}: Props) => (
  <section id={id} className="container mx-auto px-4 py-12 md:py-16 scroll-mt-24">
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
      <div className={reverse ? "lg:order-2" : "lg:order-1"}>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-border shadow-card bg-muted">
          <img
            src={image}
            alt={imageAlt}
            loading="lazy"
            width={1200}
            height={900}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>

      <div className={reverse ? "lg:order-1" : "lg:order-2"}>
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-base font-bold">
            {step}
          </span>
          <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
            <Icon className="h-4 w-4" aria-hidden="true" />
            {eyebrow}
          </span>
        </div>

        <h2 className="mt-4 text-2xl md:text-3xl lg:text-4xl font-bold text-secondary tracking-tight leading-tight">
          {title}
        </h2>

        <dl className="mt-5 space-y-4">
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              What you'll do
            </dt>
            <dd className="mt-1 text-base text-secondary leading-relaxed">{whatYouDo}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Why it matters
            </dt>
            <dd className="mt-1 text-base text-muted-foreground leading-relaxed">{whyItMatters}</dd>
          </div>
        </dl>

        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3">
          <Gift className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" aria-hidden="true" />
          <p className="text-sm text-secondary leading-relaxed">
            <span className="font-bold">What you get: </span>
            {deliverable}
          </p>
        </div>

        <div className="mt-5">
          <p className="text-sm font-semibold text-secondary">{bulletsTitle}</p>
          <ul className="mt-2 space-y-2">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
                <Check className="h-4 w-4 flex-shrink-0 text-primary mt-0.5" aria-hidden="true" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {cta && (
          <div className="mt-6">
            {cta.variant === "link" ? (
              <Link
                to={cta.to}
                data-analytics-id={cta.analyticsId}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
              >
                {cta.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                to={cta.to}
                data-analytics-id={cta.analyticsId}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-sky text-sky-foreground px-7 py-3.5 text-base font-semibold shadow-card hover:shadow-card-hover hover:bg-sky/90 transition-all"
              >
                {cta.label}
                <ArrowRight className="h-5 w-5" />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  </section>
);

export default JourneyStep;