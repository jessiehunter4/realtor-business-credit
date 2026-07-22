import { Link } from "react-router-dom";
import { CalendarCheck, ClipboardList, FileBadge, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: CalendarCheck,
    n: "1",
    title: "Book your free 1:1",
    desc: "Grab a time on Jessie's calendar — no card, no obligation, no sales pitch.",
  },
  {
    icon: ClipboardList,
    n: "2",
    title: "Complete the Needs Analysis",
    desc: "On the call we complete the RE Pro Business Financial Needs Analysis together.",
  },
  {
    icon: FileBadge,
    n: "3",
    title: "Get your custom plan",
    desc: "Walk away with a personalized RE Pro Business Structure, Finance & Credit Plan — read online or download the PDF.",
  },
];

const OneOnOneStepsBlock = () => (
  <section id="one-on-one" className="container mx-auto px-4 py-16 md:py-20 scroll-mt-16">
    <div className="bg-hero-grad border border-border rounded-3xl p-6 md:p-12 shadow-card">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <span className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-3 py-1 text-xs font-semibold text-primary shadow-card">
          Free · No card · No pressure
        </span>
        <h2 className="mt-3 text-3xl md:text-4xl font-bold text-secondary">
          Get your custom RE Pro Business Credit plan — free
        </h2>
        <p className="mt-3 text-muted-foreground text-lg">
          Three simple steps. We do the heavy lifting on the call.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {steps.map(({ icon: Icon, n, title, desc }) => (
          <div
            key={n}
            className="relative bg-card border border-border rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow"
          >
            <div className="absolute -top-3 -left-3 w-10 h-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-card">
              {n}
            </div>
            <div className="w-12 h-12 rounded-2xl bg-sky/15 text-sky flex items-center justify-center">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-secondary">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          to="/one-on-one"
          data-analytics-id="cta-book-mid"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-8 py-4 text-base font-semibold shadow-card hover:shadow-card-hover hover:bg-primary/90 transition-all"
        >
          Book Free 1:1 Session
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  </section>
);

export default OneOnOneStepsBlock;