const ProblemsSection = () => {
  const problems = [
    { emoji: "⚠️", title: "Risk Your Personal Assets", description: "Every business expense on your personal credit puts your home, car, and family finances at risk." },
    { emoji: "📉", title: "Damage Personal Credit", description: "High utilization from business expenses tanks your personal credit score—affecting everything you buy personally." },
    { emoji: "🚫", title: "Limited Growth Capital", description: "Personal credit limits restrict how much you can invest in marketing, tools, and team—capping your income potential." },
    { emoji: "💸", title: "Tax Nightmares", description: "Mixed personal and business expenses make accounting complicated, expensive, and audit-prone." },
  ];

  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-secondary text-center mb-12">
          The Problem: You're Leaving Money on the Table
        </h2>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {problems.map((problem) => (
            <div key={problem.title} className="bg-card p-8 rounded-xl shadow-sm border border-border">
              <div className="text-4xl mb-4">{problem.emoji}</div>
              <h3 className="text-xl font-bold text-secondary mb-3">{problem.title}</h3>
              <p className="text-foreground/80">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemsSection;
