import { Link } from "react-router-dom";
import { BookOpen, CheckCircle2, FileText, ClipboardCheck, Clock, Lightbulb, Layers, Users } from "lucide-react";

interface Props {
  guideLink?: string;
}

const items = [
  { icon: Lightbulb, bold: "Why 90% of Realtors don't have business credit", rest: " — and what it's costing them every closing cycle." },
  { icon: ClipboardCheck, bold: "7-step checklist to build business credit", rest: " — simplified for busy real estate professionals." },
  { icon: Layers, bold: "Business Structure + Financial Foundation + Credit Capacity roadmap", rest: " — the three pillars of a fundable real estate business." },
  { icon: FileText, bold: "SSN vs. EIN explained", rest: " — structure your business properly based on your state and license type." },
  { icon: Clock, bold: "Timeline & expectations", rest: " — realistic timeframes (you can go faster or slower)." },
  { icon: BookOpen, bold: "Founder story from Jessie Hunter", rest: " — California/Georgia broker who wishes someone had told him this 10+ years ago." },
  { icon: CheckCircle2, bold: "Action plan worksheet", rest: " — tasks you can complete this week." },
  { icon: Users, bold: "What happens in your free 1:1", rest: " — we complete the Realtor Business Financial Needs Analysis together and generate your custom plan." },
];

const GuideContentsBright = ({ guideLink = "/guide" }: Props) => (
  <section id="guide-contents" className="container mx-auto px-4 py-16 md:py-20 scroll-mt-16">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-semibold">
          📖 Free Guide
        </span>
        <h2 className="mt-3 text-3xl md:text-4xl font-bold text-secondary">
          What's inside your free guide + action plan
        </h2>
        <p className="mt-3 text-muted-foreground text-lg">
          A click-and-read walkthrough — no signup required.
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