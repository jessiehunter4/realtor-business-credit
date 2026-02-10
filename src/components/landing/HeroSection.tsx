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
          <p className="text-lg md:text-xl text-white/80 max-w-2xl">
            You just earned a commission. Don't let it all go to expenses on your personal credit. Discover how to separate your business finances and unlock growth capital.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
