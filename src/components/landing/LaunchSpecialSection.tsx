const LaunchSpecialSection = () => {
  return (
    <section className="bg-accent/20 border-2 border-accent py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-accent-foreground mb-6">
            🎉 Launch Special - Be Among the First!
          </h2>
          <p className="text-xl mb-4">
            We're just launching this specialized program for residential and commercial real estate professionals.
          </p>
          <p className="text-lg mb-6">Early adopters who download the guide today receive:</p>

          <ul className="space-y-3 text-left max-w-2xl mx-auto text-lg">
            {["Exclusive launch pricing (not available later)", "Priority coaching sessions", "First access to our proven system", "Direct support from founder Jessie Hunter"].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="text-2xl">✓</span>
                <strong>{item}</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default LaunchSpecialSection;
