import { Link } from "react-router-dom";
import { User, Users, Sparkles, ArrowRight } from "lucide-react";

const cards = [
  {
    icon: User,
    title: "Solo Agent",
    tone: "bg-primary/10 text-primary",
    bullets: [
      "Floating business overhead on personal cards",
      "Need a cushion that survives a slow month",
      "Tired of FICO swings from utilization spikes",
    ],
  },
  {
    icon: Users,
    title: "Team Lead / Broker",
    tone: "bg-sky/15 text-sky",
    bullets: [
      "Funding ads, payroll, and TC support",
      "Higher limits without more personal-guarantee risk",
      "Scaling without burning personal credit",
    ],
  },
  {
    icon: Sparkles,
    title: "Newer Agent",
    tone: "bg-accent/20 text-accent-foreground",
    bullets: [
      "Wants money available before the first big closing",
      "Building structure from day one — the right way",
      "Skipping the $8,000 mistake most agents make",
    ],
  },
];

const IsThisForMe = () => (
  <section id="is-this-for-me" className="container mx-auto px-4 py-16 md:py-20 scroll-mt-16">
    <div className="max-w-3xl mx-auto text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-secondary">Is this for me?</h2>
      <p className="mt-3 text-muted-foreground text-lg">
        If any of these sound like you, the answer is yes.
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {cards.map(({ icon: Icon, title, tone, bullets }) => (
        <div
          key={title}
          className="bg-card border border-border rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow flex flex-col"
        >
          <div className={`inline-flex w-12 h-12 rounded-2xl items-center justify-center ${tone}`}>
            <Icon className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-xl font-bold text-secondary">{title}</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground flex-1">
            {bullets.map((b) => (
              <li key={b} className="flex gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <Link
            to="/guide"
            className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80"
          >
            Start Here <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ))}
    </div>
  </section>
);

export default IsThisForMe;