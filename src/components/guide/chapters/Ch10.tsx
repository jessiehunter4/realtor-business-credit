import { CheckCircle2, AlertTriangle, XCircle, Circle } from "lucide-react";
import { ChapterHeader, SectionHeading, Paragraph, ChapterTakeaway, JessieNote, GoodNugget } from "../GuideComponents";

const dashboardRows = [
  { status: "strong", label: "Business bank account with consistent deposits" },
  { status: "strong", label: "EIN in use across all applications" },
  { status: "watch", label: "Business phone not yet listed in directories" },
  { status: "watch", label: "Website live — address inconsistent with entity docs" },
  { status: "missing", label: "D-U-N-S number" },
  { status: "missing", label: "Reporting vendor tradelines" },
  { status: "not-started", label: "First revolving business card application" },
] as const;

const iconFor = (s: string) => {
  switch (s) {
    case "strong": return { Icon: CheckCircle2, cls: "text-primary", chip: "bg-primary/15 text-primary", label: "Strong" };
    case "watch": return { Icon: AlertTriangle, cls: "text-[hsl(var(--accent))]", chip: "bg-[hsl(var(--accent)/0.15)] text-[hsl(var(--accent))]", label: "In Progress" };
    case "missing": return { Icon: XCircle, cls: "text-[hsl(var(--coral))]", chip: "bg-[hsl(var(--coral)/0.15)] text-[hsl(var(--coral))]", label: "Needs Attention" };
    default: return { Icon: Circle, cls: "text-muted-foreground", chip: "bg-muted text-muted-foreground", label: "Not Started" };
  }
};

const Ch10 = () => (
  <section id="chapter-10" className="scroll-mt-20 bg-muted/30 py-16">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <ChapterHeader number="CHAPTER 10" title="Your business financial command center" />

        <Paragraph>Once your customized plan is generated, your RE Pro dashboard becomes your <strong>business financial command center</strong>. It's the one place that answers "where do I stand today?" without hunting through spreadsheets, bank apps, and browser tabs.</Paragraph>

        <SectionHeading>What the dashboard tracks</SectionHeading>
        <ul className="list-disc pl-6 space-y-1 text-base md:text-lg text-foreground/90 my-4">
          <li>Business-structure tasks and banking setup</li>
          <li>Bookkeeping progress and financial statements</li>
          <li>Personal-credit use and utilization</li>
          <li>Business-credit accounts and payment history</li>
          <li>Cash reserves and runway</li>
          <li>Application readiness and implementation milestones</li>
        </ul>

        <SectionHeading>A sample dashboard snapshot</SectionHeading>
        <div className="my-8 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_10px_30px_rgba(11,31,59,.08)]">
          <div className="flex items-center justify-between border-b border-border bg-secondary/95 px-5 py-3 text-secondary-foreground">
            <p className="m-0 font-bold text-sm md:text-base">RE Pro Dashboard · Fundability</p>
            <p className="m-0 text-xs opacity-80">Illustrative</p>
          </div>
          <ul className="divide-y divide-border">
            {dashboardRows.map((r) => {
              const meta = iconFor(r.status);
              const Icon = meta.Icon;
              return (
                <li key={r.label} className="flex items-center gap-3 px-5 py-3">
                  <Icon className={`h-4 w-4 flex-none ${meta.cls}`} />
                  <span className="flex-1 text-sm md:text-base text-foreground/90">{r.label}</span>
                  <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-full px-2.5 py-0.5 ${meta.chip}`}>
                    {meta.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <JessieNote>
          <p>You should always know four things: what's completed, what needs attention, what comes next, and what shouldn't be done yet. If you can answer those four in under a minute, you're ahead of most business owners in any industry.</p>
        </JessieNote>

        <GoodNugget>
          A clear dashboard turns a complicated financial process into a sequence of practical next steps.
        </GoodNugget>

        <ChapterTakeaway>
          Your dashboard doesn't replace the work — it makes the work manageable, week over week.
        </ChapterTakeaway>
      </div>
    </div>
  </section>
);

export default Ch10;