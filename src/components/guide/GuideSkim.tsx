import { Zap } from "lucide-react";

const takeaways = [
  { id: "chapter-2", text: "Business credit is a separate financial profile for your real estate business — built on EIN, not SSN." },
  { id: "chapter-3", text: "Every business expense on personal cards raises personal utilization and quietly damages your scores." },
  { id: "chapter-4", text: "Yes, this applies to solo agents — even if your license is held under your name." },
  { id: "chapter-5", text: "There's a 7-step process: entity, EIN, address/phone, bank, D-U-N-S, tradelines, then cards & lines." },
  { id: "chapter-6", text: "Realistic timeline: foundation in 30 days, vendor tradelines reporting by month 3, business cards 6–12 months." },
  { id: "chapter-7", text: "Doing this without guidance is the #1 way Realtors waste 6+ months on the wrong steps." },
  { id: "conclusion", text: "Your next step: book a free 1:1 to map your specific gaps and 90-day plan." },
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