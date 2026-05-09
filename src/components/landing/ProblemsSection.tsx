import { ShieldAlert, TrendingDown, Ban, Receipt, LucideIcon } from "lucide-react";

interface Problem {
  icon: LucideIcon;
  title: string;
  description: string;
}

const ProblemsSection = () => {
  const problems: Problem[] = [
    { icon: ShieldAlert, title: "Risk Your Personal Assets", description: "Every business expense on your personal credit puts your home, car, and family finances at risk." },
    { icon: TrendingDown, title: "Damage Personal Credit", description: "High utilization from business expenses tanks your personal credit score—affecting everything you buy personally." },
    { icon: Ban, title: "Limited Growth Capital", description: "Personal credit limits restrict how much you can invest in marketing, tools, and team—capping your income potential." },
    { icon: Receipt, title: "Tax Nightmares", description: "Mixed personal and business expenses make accounting complicated, expensive, and audit-prone." },
  ];

  return (
    <section id="problems" className="bg-muted/30 py-16 md:py-24 scroll-mt-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-secondary text-center mb-12">
          The Problem: You're Leaving Money on the Table
        </h2>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {problems.map(({ icon: Icon, title, description }) => (
            <div key={title} className="bg-card p-8 rounded-xl shadow-sm border border-border hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-3">{title}</h3>
              <p className="text-foreground/80">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemsSection;
