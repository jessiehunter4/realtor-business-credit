import heroImg from "@/assets/guide/hero-agent.jpg";
import { PlanCTAButton } from "./GuideComponents";

interface GuideCoverProps {
  visitorName?: string;
}

const GuideCover = ({ visitorName }: GuideCoverProps) => (
  <section className="bg-hero-grad pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 md:pb-20">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto text-center">
        {visitorName && (
          <p className="text-sm sm:text-base text-secondary/80 mb-3">
            Welcome, <strong className="text-secondary">{visitorName}</strong> — this guide was put
            together for real estate pros like you.
          </p>
        )}
        <p className="text-xs md:text-sm uppercase tracking-widest text-primary font-bold mb-3">
          RE Pro Business Credit · Free Guide
        </p>
        <h1 className="text-[clamp(1.75rem,6vw,3.5rem)] lg:text-6xl font-bold text-secondary leading-tight mb-4 md:mb-5">
          Real Estate Professional{' '}
          <span className="text-primary">Business Finance &amp; Credit</span>{' '}
          Guide
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-foreground/80 leading-relaxed mb-3">
          Build the financial structure behind your real estate career — and create a path to capital that does not depend forever on your personal credit.
        </p>
        <p className="text-sm text-muted-foreground italic">
          A specialized program of My Better Business Credit.
        </p>
        <div className="mt-5 md:mt-6 text-sm text-muted-foreground">
          <p><strong className="text-secondary">by Jessie Hunter</strong> · Real Estate Broker · California &amp; Georgia</p>
        </div>

        <div className="mt-8 rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(11,31,59,.15)] border border-border mx-auto w-full max-w-2xl">
          <img src={heroImg} alt="Male real estate professional writing notes at a desk with a laptop" width={1536} height={1024} loading="eager" className="w-full h-auto block" />
        </div>

        <div className="mt-8 flex flex-col items-center gap-2">
          <PlanCTAButton label="Create My Free Plan After Reading" />
          <p className="text-xs text-muted-foreground italic">
            Free guide. Free plan. Free dashboard. No credit card required.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default GuideCover;
