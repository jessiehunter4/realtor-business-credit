import heroImg from "@/assets/guide/hero-agent.jpg";

const GuideCover = () => (
  <section className="bg-hero-grad pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 md:pb-20">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-center max-w-6xl mx-auto">
        <div className="order-2 md:order-1">
          <p className="text-xs md:text-sm uppercase tracking-widest text-primary font-bold mb-3">
            RE Pro Business Credit · Free Guide
          </p>
          <h1 className="text-[clamp(1.75rem,6vw,3.5rem)] lg:text-6xl font-bold text-secondary leading-tight mb-4 md:mb-5">
            Realtor Business <span className="text-primary">Structure,</span> Finance &amp; Credit Guide
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-foreground/80 leading-relaxed mb-3">
            Build a fundable real estate business with a clean entity structure, a strong financial foundation, and separate business credit capacity.
          </p>
          <p className="text-sm text-muted-foreground italic">
            Works for every Realtor — and is especially powerful right after a closing.
          </p>
          <div className="mt-5 md:mt-6 text-sm text-muted-foreground">
            <p><strong className="text-secondary">by Jessie Hunter</strong> · Real Estate Broker · California &amp; Georgia</p>
          </div>
        </div>
        <div className="order-1 md:order-2 rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(11,31,59,.15)] border border-border max-w-md md:max-w-none mx-auto w-full">
          <img src={heroImg} alt="Confident real estate agent reviewing her business plan at a bright desk" width={1536} height={1024} loading="eager" className="w-full h-auto block" />
        </div>
      </div>
    </div>
  </section>
);

export default GuideCover;
