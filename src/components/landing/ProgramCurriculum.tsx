import { Link } from "react-router-dom";
import { PlayCircle, CalendarCheck, ClipboardList, FileCheck2, Users, Calendar, BookOpen } from "lucide-react";

interface Props {
  guideLink?: string;
}

const modules = [
  {
    n: "01",
    title: "Watch Intro",
    desc: "Meet Jessie and see why Realtors need separate business credit.",
    chip: "Video · 3 min",
    icon: PlayCircle,
    accent: "primary" as const,
  },
  {
    n: "02",
    title: "Book Free 1:1",
    desc: "Grab a no-pressure strategy session with your coach.",
    chip: "Live · 30 min",
    icon: CalendarCheck,
    accent: "sky" as const,
  },
  {
    n: "03",
    title: "Needs Analysis",
    desc: "Complete the RE Pro Business Financial Needs Analysis together.",
    chip: "Assignment",
    icon: ClipboardList,
    accent: "accent" as const,
  },
  {
    n: "04",
    title: "Custom Plan",
    desc: "Get a personalized Business Structure, Finance & Credit Plan.",
    chip: "Deliverable",
    icon: FileCheck2,
    accent: "primary" as const,
  },
];

const accentMap = {
  primary: {
    text: "text-primary",
    bg: "bg-primary/10",
    border: "hover:border-primary/40",
    chip: "bg-primary/10 text-primary",
  },
  sky: {
    text: "text-sky",
    bg: "bg-sky/10",
    border: "hover:border-sky/40",
    chip: "bg-sky/10 text-sky",
  },
  accent: {
    text: "text-accent",
    bg: "bg-accent/10",
    border: "hover:border-accent/40",
    chip: "bg-accent/10 text-accent",
  },
};

const ProgramCurriculum = ({ guideLink = "/guide" }: Props) => {
  return (
    <section className="bg-background py-16 sm:py-20 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
            How It Works
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-secondary tracking-tight">
            Program Curriculum
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            The structured coaching path from credit-uncertainty to a funded real estate business.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {modules.map(({ n, title, desc, chip, icon: Icon, accent }) => {
            const c = accentMap[accent];
            return (
              <div
                key={n}
                className={`group flex flex-col bg-card p-6 rounded-3xl border border-border shadow-card transition-all hover:shadow-card-hover hover:-translate-y-1 ${c.border}`}
              >
                <div className="mb-5 flex items-center justify-between">
                  <span className={`text-xs font-bold uppercase tracking-widest ${c.text}`}>
                    Module {n}
                  </span>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.bg}`}>
                    <Icon className={`w-5 h-5 ${c.text}`} />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-secondary mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-grow">{desc}</p>
                <div className="mt-5">
                  <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${c.chip}`}>
                    {chip}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Module 5 — emphasis card */}
          <div className="group flex flex-col bg-secondary p-6 rounded-3xl border border-secondary shadow-card-hover transition-all hover:-translate-y-1">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Module 05
              </span>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Implementation</h3>
            <p className="text-sm text-white/70 leading-relaxed flex-grow">
              Execute your plan with 1:1 coaching or inside the Realtor Credit Cohort.
            </p>
            <div className="mt-5">
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-primary text-primary-foreground">
                Cohort or 1:1
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/one-on-one"
            data-analytics-id="cta-book-curriculum"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-4 text-base font-semibold shadow-card hover:shadow-card-hover hover:bg-primary/90 transition-all"
          >
            <Calendar className="h-5 w-5" />
            Book Free 1:1 Session
          </Link>
          <Link
            to={guideLink}
            data-analytics-id="cta-guide-curriculum"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-sky text-sky-foreground px-7 py-4 text-base font-semibold shadow-card hover:shadow-card-hover hover:bg-sky/90 transition-all"
          >
            <BookOpen className="h-5 w-5" />
            Read the Free Guide
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProgramCurriculum;