import { Zap } from "lucide-react";

const takeaways = [
  { id: "chapter-1",  text: "If your business can't operate without your personal credit, you don't yet have real financial separation." },
  { id: "chapter-2",  text: "An EIN creates identity — banking, accounting, revenue and payment history create financial credibility." },
  { id: "chapter-4",  text: "Personal credit may launch your business-credit profile. The long-term goal is for the business to qualify on its own strength." },
  { id: "chapter-5",  text: "Business credit grows in five stages as the business proves it can earn, manage and repay." },
  { id: "chapter-6",  text: "A credit score opens the door — cash flow, records, and repayment ability decide how far you go." },
  { id: "chapter-8",  text: "The best time to build access to capital is before your business urgently needs it." },
  { id: "chapter-12", text: "Your plan should be based on your real situation — not a generic checklist made for every business." },
];

const GuideSkim = () => (
  <section className="container mx-auto px-4 pt-10 pb-4">
    <div className="max-w-3xl mx-auto bg-primary/5 border-2 border-primary/30 rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
          <Zap className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-primary font-bold">60-Second Skim</p>
          <h2 className="text-xl md:text-2xl font-bold text-secondary">If you only read one page, read this</h2>
        </div>
      </div>
      <ol className="space-y-2.5 list-decimal list-inside marker:text-primary marker:font-bold">
        {takeaways.map((t) => (
          <li key={t.id} className="text-base md:text-lg text-foreground/90 leading-relaxed">
            <a href={`#${t.id}`} className="hover:text-primary hover:underline">
              {t.text}
            </a>
          </li>
        ))}
      </ol>
      <p className="mt-5 text-sm text-muted-foreground italic">
        Want the full picture? Keep scrolling — each takeaway links to its chapter.
      </p>
    </div>
  </section>
);

export default GuideSkim;