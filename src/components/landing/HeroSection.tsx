import heroImage from "@/assets/hero-closing.jpg";

interface HeroSectionProps {
  firstName?: string;
}

const HeroSection = ({ firstName }: HeroSectionProps) => {
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
          <p className="text-sm md:text-base text-white/60 mb-8">
            My Plan. My Progress. My Better Business Credit.
          </p>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Congratulations{firstName ? ` ${firstName}` : ""} on Your Recent Closing!<br />
            <span className="text-primary">Now Is the Perfect Time to Build Your Business Credit</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-10">
            You just earned a commission. Don't let it all go to expenses on your personal credit. Discover how to separate your business finances and unlock growth capital.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/guide" className="inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground text-lg px-8 py-4 font-medium hover:bg-primary/90 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              Read the Free Guide
            </a>
            <a href="/one-on-one" className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-white/30 text-white text-lg px-8 py-4 font-medium hover:bg-white/10 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
              Free One-On-One Business Credit Session
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
