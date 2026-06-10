import heroImg from "@/assets/guide/hero-agent.jpg";

const GuideCover = () => (
  <section className="bg-hero-grad pt-24 pb-16 md:pt-28 md:pb-20">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
        <div>
          <p className="text-xs md:text-sm uppercase tracking-widest text-primary font-bold mb-3">
            Realtor Business Credit · Free Guide
          </p>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-secondary leading-tight mb-5">
            Realtor Business <span className="text-primary">Structure,</span> Finance &amp; Credit Guide
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 leading-relaxed mb-3">
            Build a fundable real estate business with a clean entity structure, a strong financial foundation, and separate business credit capacity.
          </p>
          <p className="text-sm text-muted-foreground italic">
            Works for every Realtor — and is especially powerful right after a closing.
          </p>
          <div className="mt-6 text-sm text-muted-foreground">
            <p><strong className="text-secondary">by Jessie Hunter</strong> · Real Estate Broker · California &amp; Georgia</p>
          </div>
        </div>
        <div className="rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(11,31,59,.15)] border border-border">
          <img src={heroImg} alt="Confident real estate agent reviewing her business plan at a bright desk" width={1536} height={1024} className="w-full h-auto block" />
        </div>
      </div>
    </div>
  </section>
);

export default GuideCover;
