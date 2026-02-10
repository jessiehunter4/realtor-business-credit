import jessieHeadshot from "@/assets/jessie-hunter-headshot.png";

const FounderQuoteSection = () => {
  return (
    <section className="bg-secondary py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
          {/* Headshot */}
          <div className="flex-shrink-0">
            <img
              src={jessieHeadshot}
              alt="Jessie Hunter, Real Estate Broker licensed in California and Georgia"
              className="w-40 h-40 md:w-52 md:h-52 rounded-full object-cover border-4 border-primary shadow-xl"
            />
          </div>

          {/* Quote */}
          <div className="text-white text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Don't Wait Another 15 Years Like I Did</h2>
            <p className="text-lg md:text-xl italic mb-4 text-white/90">
              "I wish someone had told me about business credit when I got my license in 2010. It would have saved me tens of thousands of dollars and protected my family's financial security. That's why I created this guide—so you don't have to learn the hard way."
            </p>
            <p className="font-bold text-lg text-primary">
              — Jessie Hunter, Broker | California & Georgia
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderQuoteSection;
