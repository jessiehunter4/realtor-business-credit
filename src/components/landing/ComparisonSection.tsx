const ComparisonSection = () => {
  return (
    <section className="bg-secondary py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
          See the Difference Business Credit Makes
        </h2>
        <p className="text-center text-white/70 mb-10 max-w-2xl mx-auto text-lg">
          Most Realtors are stuck on the left. Our program moves you to the right.
        </p>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Personal Credit Only */}
          <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-8">
            <h3 className="text-xl font-bold text-red-400 mb-4">❌ Personal Credit Only</h3>
            <ul className="space-y-3 text-white/80">
              <li>• 80%+ credit utilization</li>
              <li>• Personal assets at risk</li>
              <li>• Mixed expenses = tax headaches</li>
              <li>• Limited growth capital</li>
              <li>• Lower personal credit score</li>
            </ul>
          </div>
          {/* Separate Business Credit */}
          <div className="bg-primary/20 border border-primary/40 rounded-xl p-8">
            <h3 className="text-xl font-bold text-primary mb-4">✅ Separate Business Credit</h3>
            <ul className="space-y-3 text-white/80">
              <li>• 20% personal utilization</li>
              <li>• Personal assets protected</li>
              <li>• Clean separation for taxes</li>
              <li>• Dedicated growth funding</li>
              <li>• Higher personal credit score</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
