import { Link } from "react-router-dom";
import { BookOpen, CheckCircle2, FileText, ClipboardCheck, Clock, Lightbulb, Layers, Users } from "lucide-react";

interface Props {
  guideLink?: string;
}

const items = [
  { icon: Lightbulb, bold: "Why most Realtors never build a real business foundation", rest: " — and the $8,000 mistake almost everyone repeats." },
  { icon: Layers, bold: "Business entity options for Realtors", rest: " — Sole Prop / LLC / S-Corp / C-Corp, with state-by-state caveats." },
  { icon: FileText, bold: "Commission-to-entity compliance", rest: " — how to legally route commission income to your business." },
  { icon: ClipboardCheck, bold: "The 3-Account Financial Foundation", rest: " — the flagship system that smooths lumpy commission income." },
  { icon: Clock, bold: "Fundability signals checklist", rest: " — Strong / Watch / Missing across every signal lenders check." },
  { icon: BookOpen, bold: "The Realtor Credit Ladder (5 stages)", rest: " — from vendor tradelines to LOCs and high-limit business cards." },
  { icon: CheckCircle2, bold: "30 / 60 / 90-day action plan", rest: " — exactly what to do, in what order, this quarter." },
  { icon: Users, bold: "Your Custom Plan + Program path", rest: " — what your 1:1 produces and how implementation works after." },
];

const GuideContentsBright = ({ guideLink = "/guide" }: Props) => (
  <section id="guide-contents" className="container mx-auto px-4 py-16 md:py-20 scroll-mt-16">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-semibold">
          📖 Free 13-chapter guide
        </span>
        <h2 className="mt-3 text-3xl md:text-4xl font-bold text-secondary">
          What's inside the free guide
        </h2>
        <p className="mt-3 text-muted-foreground text-lg">
          Click-and-read or download the PDF — no signup required.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {items.map(({ icon: Icon, bold, rest }) => (
          <div
            key={bold}
            className="bg-card border border-border rounded-2xl p-5 shadow-card flex gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-sm md:text-base text-secondary leading-relaxed">
              <strong>{bold}</strong>
              <span className="text-muted-foreground">{rest}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          to={guideLink}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-sky text-sky-foreground px-7 py-3.5 text-base font-semibold shadow-card hover:shadow-card-hover hover:bg-sky/90 transition-all"
        >
          <BookOpen className="h-5 w-5" />
          Read the Free Guide
        </Link>
      </div>
    </div>
  </section>
);

export default GuideContentsBright;