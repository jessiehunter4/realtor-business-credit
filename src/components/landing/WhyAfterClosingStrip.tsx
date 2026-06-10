import { Wallet, Receipt, Rocket } from "lucide-react";

const items = [
  {
    icon: Wallet,
    title: "Cash + confidence",
    desc: "You just got paid. The clearest moment to invest in your business — not just your lifestyle.",
  },
  {
    icon: Receipt,
    title: "Expense reality",
    desc: "Marketing, tech, gas, staging — every dollar on personal cards is dragging your personal credit.",
  },
  {
    icon: Rocket,
    title: "Build runway before the gap",
    desc: "Set up structure now so the next closing gap doesn't force you back onto personal credit.",
  },
];

const WhyAfterClosingStrip = () => (
  <section className="container mx-auto px-4 py-12">
    <div className="bg-accent-grad border border-accent/30 rounded-3xl p-6 md:p-10 shadow-card">
      <div className="max-w-3xl mb-8">
        <span className="inline-flex items-center gap-2 bg-white/70 backdrop-blur rounded-full px-3 py-1 text-xs font-semibold text-secondary border border-accent/30">
          ⏱ Right after a closing
        </span>
        <h2 className="mt-3 text-3xl md:text-4xl font-bold text-secondary">
          The best moment to start is right now.
        </h2>
        <p className="mt-3 text-muted-foreground">
          You just earned a commission. Use that momentum to build a business that funds itself.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {items.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="bg-card border border-border rounded-2xl p-5 shadow-card"
          >
            <div className="inline-flex w-10 h-10 rounded-xl items-center justify-center bg-accent/20 text-accent-foreground">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-3 font-bold text-secondary">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyAfterClosingStrip;