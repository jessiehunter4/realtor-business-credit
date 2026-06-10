import { AlertTriangle, CheckCircle2 } from "lucide-react";

const left = [
  "80%+ personal credit utilization",
  "Personal assets and FICO on the line",
  "Mixed expenses = messy bookkeeping",
  "Limited growth capital between closings",
  "Every business hiccup hits your personal score",
];

const right = [
  "20% personal utilization (typical)",
  "Personal credit and assets protected",
  "Clean separation for taxes and bookkeeping",
  "Dedicated business credit for growth",
  "Business builds its own financial reputation",
];

const ComparisonBright = () => (
  <section className="container mx-auto px-4 py-16 md:py-20">
    <div className="max-w-3xl mx-auto text-center mb-10">
      <h2 className="text-3xl md:text-4xl font-bold text-secondary">
        See the difference business credit makes
      </h2>
      <p className="mt-3 text-muted-foreground text-lg">
        Most Realtors stay on the left. Our program moves you to the right.
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
      <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-card">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-destructive/15 text-destructive flex items-center justify-center">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <h3 className="text-xl font-bold text-secondary">Personal-credit-funded business</h3>
        </div>
        <ul className="mt-5 space-y-3">
          {left.map((t) => (
            <li key={t} className="flex gap-2 text-muted-foreground">
              <span className="text-destructive mt-0.5">✗</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-card border-2 border-primary/30 rounded-2xl p-6 md:p-8 shadow-card-hover relative">
        <span className="absolute -top-3 left-6 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-card">
          The goal
        </span>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-primary/15 text-primary flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <h3 className="text-xl font-bold text-secondary">Separate business foundation + business credit</h3>
        </div>
        <ul className="mt-5 space-y-3">
          {right.map((t) => (
            <li key={t} className="flex gap-2 text-secondary">
              <span className="text-primary mt-0.5">✓</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

export default ComparisonBright;