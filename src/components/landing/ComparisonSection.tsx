import comparisonImage from "@/assets/credit-comparison.jpg";

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
        <div className="max-w-5xl mx-auto rounded-xl overflow-hidden shadow-2xl">
          <img
            src={comparisonImage}
            alt="Comparison: Personal Credit Only with 80% utilization and stress versus Separate Business Credit with 20% utilization and confidence"
            className="w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
