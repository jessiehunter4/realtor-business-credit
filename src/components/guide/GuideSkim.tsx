import { Zap } from "lucide-react";

const takeaways = [
  { id: "chapter-1",  text: "Real estate education skips business architecture — credit is downstream of structure." },
  { id: "chapter-2",  text: "Lumpy income + steady expenses = fundability matters more than production." },
  { id: "chapter-3",  text: "Sole Prop / LLC / S-Corp / C-Corp each serve a stage — your state and broker constrain the menu." },
  { id: "chapter-6",  text: "The 3-account system (Operating · Tax Reserve · Opportunity) automates everything." },
  { id: "chapter-8",  text: "Fundability is a pattern of consistent identity signals, not a single score." },
  { id: "chapter-10", text: "The Realtor Credit Ladder: Foundation → Bureaus → Tradelines → Cards → Growth funding." },
  { id: "chapter-13", text: "Next step: free 1:1, live Needs Analysis, free custom plan, optional program." },
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