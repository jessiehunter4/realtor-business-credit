import { Wallet, Hourglass, Rocket } from "lucide-react";
import heroImage from "@/assets/landing/hero-money-flow.jpg";

const items = [
  {
    icon: Hourglass,
    title: "Between closings",
    desc: "Your overhead doesn't pause when commissions do. Marketing, tech, gas, MLS, CRM — they all keep firing.",
  },
  {
    icon: Wallet,
    title: "Before the next client",
    desc: "Lead-gen and presentation expenses come weeks before the income shows up. That gap is where personal cards get hammered.",
  },
  {
    icon: Rocket,
    title: "When opportunity knocks",
    desc: "A listing presentation, a TC hire, a coach, a new vertical. The money has to be there before the moment passes.",
  },
];

const MoneyWhenYouNeedItStrip = () => (
  <section className="container mx-auto px-4 py-12">
    <div className="bg-accent-grad border border-accent/30 rounded-3xl p-6 md:p-10 shadow-card">
      <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
        <div>
          <span className="inline-flex items-center gap-2 bg-white/70 backdrop-blur rounded-full px-3 py-1 text-xs font-semibold text-secondary border border-accent/30">
            💵 The #1 thing Realtors actually ask for
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-secondary">
            "Money when we need it."
          </h2>
          <p className="mt-3 text-muted-foreground">
            That's the real ask. Not theory, not buzzwords — capital that's available
            the moment your business needs it, separate from your personal credit.
          </p>
        </div>
        <div className="rounded-2xl overflow-hidden border border-border shadow-card">
          <img
            src={heroImage}
            alt="Realtor reviewing cash-flow chart at her desk"
            loading="lazy"
            width={1408}
            height={896}
            className="w-full h-auto block"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {items.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-card border border-border rounded-2xl p-5 shadow-card">
            <div className="inline-flex w-10 h-10 rounded-xl items-center justify-center bg-accent/20 text-accent-foreground">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-3 font-bold text-secondary">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      <p className="mt-6 text-center text-sm font-semibold text-secondary italic">
        Fail to plan — plan to fail.
      </p>
    </div>
  </section>
);

export default MoneyWhenYouNeedItStrip;