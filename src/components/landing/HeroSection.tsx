import heroImage from "@/assets/hero-closing.jpg";

interface HeroSectionProps {
  firstName?: string;
  guideLink?: string;
  /** True when visitor arrived from MLS just-closed flow (contactId or ?closing=1). */
  closingContext?: boolean;
}

const HeroSection = ({ firstName, guideLink = "/guide", closingContext = false }: HeroSectionProps) => {
  const heading = closingContext ? (
    <>
      Congratulations{firstName ? ` ${firstName}` : ""} on Your Recent Closing!<br />
      <span className="text-primary">Now Is the Perfect Time to Build Your Business Credit</span>
    </>
  ) : (
    <>
      Stop Floating Your Real Estate Business{" "}
      <span className="text-primary">on Personal Credit</span>
    </>
  );

  const subhead = closingContext
    ? "You just earned a commission. Don't let it all go to expenses on your personal credit. Discover how to separate your business finances and unlock growth capital."
    : "Build a separate business credit profile for your real estate practice — protect your personal scores and unlock the capital you need between closings.";
  return (
    <section className="relative overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Real estate professionals shaking hands at a closing table"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/85 to-secondary/60" />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-28 relative z-10">
        <div className="max-w-3xl">
          <div className="mb-6">
            <span className="text-2xl md:text-3xl font-bold text-white/90">Realtor</span>
            <span className="text-2xl md:text-3xl font-bold text-primary"> Business Credit</span>
          </div>
          <p className="text-sm md:text-base text-white/80 mb-8">
            My Plan. My Progress. My Better Business Credit.
          </p>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {heading}
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-10">
            {subhead}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a href={guideLink} className="inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground text-lg px-8 py-4 font-medium hover:bg-success-green-hover active:bg-success-green-hover transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              Read the Free Guide
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
