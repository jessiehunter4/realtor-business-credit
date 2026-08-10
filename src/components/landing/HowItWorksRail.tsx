import { JOURNEY_RAIL } from "@/data/homepageJourney";

interface HowItWorksRailProps {
  activeSection?: string | null;
}

const HowItWorksRail = ({ activeSection }: HowItWorksRailProps) => (
  <section className="container mx-auto px-4 py-12 md:py-16">
    <div className="max-w-3xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-secondary tracking-tight">
        How it works
      </h2>
      <p className="mt-3 text-muted-foreground text-lg">
        Three steps. Start by reading — everything else follows from there.
      </p>
    </div>

    <ol className="mt-8 grid gap-3 sm:grid-cols-3 max-w-4xl mx-auto">
      {JOURNEY_RAIL.map(({ id, step, label, blurb, icon: Icon }) => {
        const isActive = activeSection === id;
        return (
          <li key={id}>
            <a
              href={`#${id}`}
              className={`h-full flex items-center gap-3 rounded-2xl border px-4 py-4 transition-all ${
                isActive
                  ? "border-2 border-primary bg-primary/10 shadow-card"
                  : "border-border bg-card shadow-card hover:shadow-card-hover"
              }`}
            >
              <span className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-base font-bold ${
                isActive ? "bg-primary text-primary-foreground" : "bg-primary text-primary-foreground"
              }`}>
                {step}
              </span>
              <span className="min-w-0">
                <span className={`flex items-center gap-2 font-bold ${isActive ? "text-primary" : "text-secondary"}`}>
                  <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                  {label}
                </span>
                <span className={`block text-sm leading-snug ${isActive ? "text-secondary" : "text-muted-foreground"}`}>{blurb}</span>
              </span>
            </a>
          </li>
        );
      })}
    </ol>
  </section>
);

export default HowItWorksRail;