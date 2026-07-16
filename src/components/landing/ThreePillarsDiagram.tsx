import { Building2, Wallet, CreditCard, ArrowRight } from "lucide-react";

const pillars = [
  {
    icon: Building2,
    label: "Business Structure",
    desc: "Entity, EIN, address, phone, email, website — a business that lenders can find.",
    tone: "bg-primary/10 text-primary border-primary/30",
  },
  {
    icon: Wallet,
    label: "Financial Foundation",
    desc: "Separate bank, clean books, the 3-Account system — proof you can be funded responsibly.",
    tone: "bg-sky/15 text-sky border-sky/30",
  },
  {
    icon: CreditCard,
    label: "Credit Capacity",
    desc: "D-U-N-S, tradelines, business cards, LOCs — capital available before you need it.",
    tone: "bg-accent/20 text-accent-foreground border-accent/40",
  },
];

const ThreePillarsDiagram = () => (
  <section className="container mx-auto px-4 py-12 md:py-16">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-secondary">
          Three pillars. One result.
        </h2>
        <p className="mt-3 text-muted-foreground text-lg">
          Stack these three and "money when you need it" stops being a wish.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 md:gap-0 md:items-stretch relative">
        {pillars.map(({ icon: Icon, label, desc, tone }, i) => (
          <div key={label} className="flex items-center md:flex-1">
            <div className={`flex-1 bg-card border-2 ${tone.split(" ").pop()} rounded-2xl p-5 shadow-card text-center h-full flex flex-col`}>
              <div className={`mx-auto w-12 h-12 rounded-2xl flex items-center justify-center ${tone}`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-secondary">{label}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">{desc}</p>
            </div>
            {i < pillars.length - 1 && (
              <ArrowRight className="hidden md:block mx-2 h-6 w-6 text-muted-foreground flex-shrink-0" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 max-w-2xl mx-auto bg-card border border-border rounded-2xl px-6 py-4 text-center shadow-card">
        <p className="text-base md:text-lg font-bold text-secondary">
          = Money when you need it.
        </p>
      </div>
    </div>
  </section>
);

export default ThreePillarsDiagram;