import heroImg from "@/assets/guide/hero-agent.jpg";
import { AFFILIATE_DISCLOSURE_SHORT } from "@/config/partner";
import { PlanCTAButton } from "@/components/guide/GuideComponents";

const CardGuideCover = () => (
  <section className="bg-hero-grad pt-24 md:pt-28 pb-12 md:pb-16">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-xs md:text-sm uppercase tracking-widest text-primary font-bold mb-3">
          RE Pro Business Credit · Free Guide
        </p>
        <h1 className="text-[clamp(1.75rem,6vw,3.25rem)] font-bold text-secondary leading-tight mb-4">
          The RE Pro Business Credit Card Guide:{" "}
          <span className="text-primary">the How &amp; Why of Credit Card Stacking</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-foreground/80 leading-relaxed mb-3">
          How real estate professionals use a planned sequence of business credit cards as working capital — the
          strategy, the tradeoffs, the fees, and the order of operations that gives you the best shot.
        </p>
        <p className="text-sm text-muted-foreground italic">A specialized program of My Better Business Credit.</p>
        <div className="mt-5 text-sm text-muted-foreground">
          <p>
            <strong className="text-secondary">by Jessie Hunter</strong> · Real Estate Broker · California &amp;
            Georgia
          </p>
        </div>

        <div className="mt-8 rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(11,31,59,.15)] border border-border mx-auto w-full max-w-2xl">
          <img
            src={heroImg}
            alt="Real estate professional reviewing business credit card options"
            width={1536}
            height={1024}
            loading="eager"
            className="w-full h-auto block"
          />
        </div>

        <div className="mt-8 flex flex-col items-center gap-2">
          <PlanCTAButton label="Create My Free Customized Plan" />
          <p className="text-xs text-muted-foreground italic">
            Free guide. Free plan. Free dashboard. No credit card required.
          </p>
        </div>

        <p className="mt-6 mx-auto max-w-2xl rounded-xl border border-border bg-card/80 px-4 py-3 text-xs text-foreground/75 leading-relaxed">
          {AFFILIATE_DISCLOSURE_SHORT}
        </p>
      </div>
    </div>
  </section>
);

export default CardGuideCover;