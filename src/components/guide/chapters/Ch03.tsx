import { Building2, Briefcase, ShieldCheck, Landmark } from "lucide-react";
import { ChapterHeader, SectionHeading, Paragraph, KeyTakeaway, BrokerCPADisclaimer } from "../GuideComponents";

const options = [
  {
    Icon: Briefcase,
    title: "Sole Proprietor",
    best: "Early-stage, low complexity, limited liability concerns.",
    pros: "Simple, cheap, fast to set up.",
    cons: "Weaker separation, more liability exposure, less fundability polish.",
    tint: "hsl(var(--sky))",
  },
  {
    Icon: Building2,
    title: "LLC",
    best: "Many service businesses and asset separation (state-dependent for Realtors).",
    pros: "Flexible, liability separation, good structure for certain operations.",
    cons: "May not align with licensing rules in some states. Tax election decisions matter.",
    tint: "hsl(var(--primary))",
  },
  {
    Icon: ShieldCheck,
    title: "S-Corp (tax election)",
    best: "Higher-income agents wanting tax efficiency and clean structure.",
    pros: "Clean business identity, payroll and owner pay structure, strong fundability story.",
    cons: "Compliance and payroll requirements; must be set up and run correctly.",
    tint: "hsl(var(--accent))",
  },
  {
    Icon: Landmark,
    title: "C-Corporation",
    best: "Scaling companies with teams, benefits, and long-term corporate strategy.",
    pros: "Strong corporate identity; scalable structure for benefits and equity.",
    cons: "More complexity. Often not needed for solo agents initially.",
    tint: "hsl(var(--coral))",
  },
];

const Ch03 = () => (
  <section id="chapter-3" className="scroll-mt-20 container mx-auto px-4 py-16">
    <div className="max-w-4xl mx-auto">
      <ChapterHeader number="CHAPTER 3" title="Business structure options for Realtors" />

      <Paragraph>Structure is a <strong>tool</strong>, not a religion. The right entity depends on your state's licensing rules, your brokerage policies, your income level, your liability profile, and your growth plans (solo, team, multiple agents, expansion).</Paragraph>
      <Paragraph>Here's how the four most common Realtor structures generally compare. Your specific path should be confirmed with your CPA and attorney.</Paragraph>

      <div className="grid md:grid-cols-2 gap-5 my-8">
        {options.map(({ Icon, title, best, pros, cons, tint }) => (
          <div key={title} className="rounded-2xl bg-card border border-border p-6 shadow-[0_8px_18px_rgba(11,31,59,.06)]">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-10 h-10 rounded-2xl flex items-center justify-center text-white" style={{ background: tint }}>
                <Icon className="w-5 h-5" />
              </span>
              <h3 className="font-bold text-secondary text-lg m-0">{title}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3"><strong className="text-secondary">Best for:</strong> {best}</p>
            <p className="text-sm text-foreground/90 mb-1"><strong className="text-primary">Pros — </strong>{pros}</p>
            <p className="text-sm text-foreground/90"><strong className="text-[hsl(var(--coral))]">Watch — </strong>{cons}</p>
          </div>
        ))}
      </div>

      <SectionHeading>How to think about it</SectionHeading>
      <Paragraph>The cleaner your structure, the easier every downstream step becomes — banking, bookkeeping, applications, asset protection, and eventually selling or transitioning the business. The wrong structure costs you twice: once to set up, once to dissolve and re-create.</Paragraph>

      <BrokerCPADisclaimer />

      <KeyTakeaway>
        <h4 className="font-bold text-secondary mt-0 mb-3">Chapter 3 takeaways</h4>
        <ul className="list-disc pl-6 space-y-1 text-base text-foreground/90">
          <li>Sole prop / LLC / S-Corp / C-Corp each serve different stages — none is universally "best."</li>
          <li>Your state's licensing rules and your brokerage policies constrain the menu.</li>
          <li>Structure is the lever that makes finance and credit simpler downstream.</li>
        </ul>
      </KeyTakeaway>
    </div>
  </section>
);

export default Ch03;