import { AFFILIATE_DISCLOSURE_SHORT, FULL_DISCLOSURES } from "@/config/partner";

const CardGuideDisclosures = () => (
  <section id="cg-resources" className="scroll-mt-24 bg-muted/40 border-t border-border">
    <div className="container mx-auto px-4 py-14 md:py-16 max-w-4xl">
      <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-3">Resources &amp; full disclosures</h2>
      <p className="text-sm text-foreground/80 leading-relaxed mb-8">{AFFILIATE_DISCLOSURE_SHORT}</p>
      <div className="space-y-4">
        {FULL_DISCLOSURES.map((d) => (
          <div key={d.title} className="rounded-2xl border border-border bg-card p-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-2">{d.title}</h3>
            <p className="text-sm text-foreground/80 leading-relaxed m-0">{d.body}</p>
          </div>
        ))}
      </div>
      <p className="mt-8 text-xs text-muted-foreground leading-relaxed">
        This guide is educational. It is not legal, tax, accounting, or investment advice, and it is not an offer of
        credit. Confirm entity selection, commission handling, and funding decisions with your broker, CPA, attorney,
        and state licensing board.
      </p>
    </div>
  </section>
);

export default CardGuideDisclosures;