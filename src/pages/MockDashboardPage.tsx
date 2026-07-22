// UI-only mock visitor dashboard.
// TODO(auth): gate this behind a real session (Supabase getUser) and
// replace mock data with real fetches for profile, plan, tasks, purchases.
import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Circle,
  CreditCard,
  Download,
  FileText,
  Flag,
  LogOut,
  Receipt,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip as ReTooltip,
  XAxis,
  YAxis,
} from "recharts";
import SiteHeader from "@/components/shared/SiteHeader";
import SiteFooter from "@/components/shared/SiteFooter";
import Seo from "@/components/shared/Seo";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DASHBOARD_TASKS,
  DASHBOARD_GUIDES,
  DASHBOARD_GOALS,
  ROADMAP,
  RECOMMENDATIONS,
  FINANCING_ROADMAP,
  PURCHASES,
  RECENT_ACTIVITY,
  TASKS_OVER_TIME,
  CREDIT_BUILDING,
  FUNDING_READINESS,
  type DashboardTask,
  type TaskCadence,
  type GuideEntry,
  type Goal,
} from "@/data/mockDashboard";

interface LocationState {
  firstName?: string;
  email?: string;
}

const MockDashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as LocationState;
  const firstName = state.firstName || "Realtor";
  const initials = firstName.slice(0, 2).toUpperCase();

  const [tasks, setTasks] = useState<DashboardTask[]>(DASHBOARD_TASKS);
  const doneCount = tasks.filter((t) => t.done).length;
  const overallPct = Math.round((doneCount / tasks.length) * 100);

  const toggleTask = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const handleLogout = () => navigate("/");

  const nextAction = useMemo(
    () => tasks.find((t) => !t.done) ?? tasks[0],
    [tasks],
  );

  return (
    <div className="min-h-screen flex flex-col bg-hero-grad">
      <Seo
        title="Your Portal — RE Pro Business Credit"
        description="Your custom RE Pro Business Credit plan, progress, and next steps."
        noindex
      />
      <SiteHeader />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex h-14 w-14 rounded-full bg-primary/15 text-primary items-center justify-center font-bold text-lg shrink-0">
              {initials}
            </div>
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                <Sparkles className="h-3.5 w-3.5" />
                Your success dashboard
              </span>
              <h1
                className="mt-2 font-semibold text-secondary"
                style={{ fontSize: "clamp(1.6rem, 3.4vw, 2.25rem)", lineHeight: 1.15 }}
              >
                Welcome back, {firstName}
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Here's where you are on the road to funding readiness.
              </p>
            </div>
          </div>
          <Button variant="outline" className="rounded-full self-start" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Log out
          </Button>
        </div>

        {/* KPI row */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            icon={<TrendingUp className="h-4 w-4" />}
            label="Fundability"
            value="62"
            suffix="/100"
            hint="+8 since intake"
            progress={62}
          />
          <StatCard
            icon={<CreditCard className="h-4 w-4" />}
            label="Business Credit"
            value="Building"
            hint="Score seeds in ~30 days"
          />
          <StatCard
            icon={<CheckCircle2 className="h-4 w-4" />}
            label="90-Day Plan"
            value={`${doneCount}`}
            suffix={`/${tasks.length}`}
            hint={`${overallPct}% complete`}
            progress={overallPct}
          />
          <StatCard
            icon={<Calendar className="h-4 w-4" />}
            label="Next Session"
            value="Thu"
            suffix=" · 2 PM PT"
            hint="1:1 with Jessie"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <div className="sticky top-[64px] z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-2 mb-6 bg-background/80 backdrop-blur border-b border-border/60">
            <TabsList className="w-full h-auto flex overflow-x-auto justify-start lg:justify-center gap-1 bg-transparent p-0">
              {[
                { v: "overview", label: "Overview" },
                { v: "guides", label: "Guides" },
                { v: "plan", label: "My Plan" },
                { v: "checklist", label: "90-Day Plan" },
                { v: "goals", label: "Goals" },
                { v: "purchases", label: "Purchases" },
              ].map((t) => (
                <TabsTrigger
                  key={t.v}
                  value={t.v}
                  className="rounded-full px-4 py-2 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow whitespace-nowrap"
                >
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* OVERVIEW */}
          <TabsContent value="overview" className="space-y-6 mt-0">
            <NextActionCard task={nextAction} onComplete={() => toggleTask(nextAction.id)} />

            <SectionCard title="Your roadmap" subtitle="Where you are on the funding journey">
              <RoadmapStepper />
            </SectionCard>

            <div className="grid gap-6 lg:grid-cols-2">
              <SectionCard title="Upcoming tasks" subtitle="Top of your action plan">
                <ul className="space-y-2">
                  {tasks.filter((t) => !t.done).slice(0, 4).map((t) => (
                    <TaskRow key={t.id} task={t} onToggle={() => toggleTask(t.id)} />
                  ))}
                </ul>
              </SectionCard>

              <SectionCard title="Funding readiness" subtitle="Composite of the 5 pillars">
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      innerRadius="70%"
                      outerRadius="100%"
                      data={[{ name: "score", value: FUNDING_READINESS, fill: "hsl(var(--primary))" }]}
                      startAngle={90}
                      endAngle={-270}
                    >
                      <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                      <RadialBar background dataKey="value" cornerRadius={12} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center -mt-32 mb-8 pointer-events-none">
                  <div className="text-4xl font-bold text-secondary">{FUNDING_READINESS}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">of 100</div>
                </div>
              </SectionCard>
            </div>

            <SectionCard title="Recent activity">
              <ul className="divide-y divide-border/60">
                {RECENT_ACTIVITY.map((a, i) => {
                  const Icon =
                    a.icon === "file" ? FileText :
                    a.icon === "calendar" ? Calendar :
                    a.icon === "check" ? CheckCircle2 : Sparkles;
                  return (
                    <li key={i} className="flex items-start gap-3 py-3">
                      <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="flex-1">
                        <p className="text-sm text-secondary">{a.text}</p>
                        <p className="text-xs text-muted-foreground">{a.when}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </SectionCard>
          </TabsContent>

          {/* GUIDES */}
          <TabsContent value="guides" className="mt-0">
            <SectionCard
              title="Guides library"
              subtitle="Everything you need to build your RE Pro Business Credit foundation"
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {DASHBOARD_GUIDES.map((g) => <GuideCard key={g.id} guide={g} />)}
              </div>
            </SectionCard>
          </TabsContent>

          {/* MY PLAN */}
          <TabsContent value="plan" className="mt-0 space-y-6">
            <SectionCard
              title="Your custom plan"
              subtitle="Generated from your intake — updated after each 1:1"
              action={
                <Button variant="outline" size="sm" className="rounded-full">
                  <Download className="h-4 w-4 mr-2" /> PDF
                </Button>
              }
            >
              <div className="grid gap-3 sm:grid-cols-3 mb-6">
                <MiniStat label="Priority goal" value="Business Credit" />
                <MiniStat label="Timeline" value="12 months" />
                <MiniStat label="Target capacity" value="$50k" />
              </div>
              <h3 className="font-semibold text-secondary mb-2">Top recommendations</h3>
              <ul className="space-y-3">
                {RECOMMENDATIONS.map((r) => (
                  <li key={r.id} className="rounded-2xl border border-border/60 bg-background p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-secondary">{r.title}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">{r.detail}</p>
                      </div>
                      <PriorityBadge priority={r.priority} />
                    </div>
                  </li>
                ))}
              </ul>
            </SectionCard>

            <SectionCard title="Financing roadmap" subtitle="Milestones from foundation to funding">
              <ol className="relative border-l-2 border-primary/20 ml-2 space-y-6">
                {FINANCING_ROADMAP.map((m, i) => (
                  <li key={i} className="pl-6">
                    <span className="absolute -left-[9px] mt-1 h-4 w-4 rounded-full bg-primary ring-4 ring-primary/15" />
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">{m.window}</p>
                    <p className="font-semibold text-secondary mt-1">{m.title}</p>
                    <p className="text-sm text-muted-foreground">{m.detail}</p>
                  </li>
                ))}
              </ol>
              <div className="mt-6">
                <Link to="/sample-plan">
                  <Button variant="ghost" className="rounded-full">
                    View full plan <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </SectionCard>
          </TabsContent>

          {/* 90-DAY */}
          <TabsContent value="checklist" className="mt-0 space-y-6">
            <SectionCard
              title="90-day action plan"
              subtitle="Check tasks off as you complete them"
            >
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium text-secondary">Overall progress</span>
                  <span className="text-muted-foreground">{doneCount}/{tasks.length} · {overallPct}%</span>
                </div>
                <Progress value={overallPct} className="h-2" />
              </div>
              <div className="space-y-6">
                <ChecklistGroup title="This week" cadence="week" tasks={tasks} onToggle={toggleTask} />
                <ChecklistGroup title="This month" cadence="month" tasks={tasks} onToggle={toggleTask} />
                <ChecklistGroup title="Milestones" cadence="milestone" tasks={tasks} onToggle={toggleTask} />
              </div>
            </SectionCard>

            <SectionCard title="Tasks completed over time">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={TASKS_OVER_TIME}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                    <ReTooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }} />
                    <Line type="monotone" dataKey="completed" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
          </TabsContent>

          {/* GOALS */}
          <TabsContent value="goals" className="mt-0 space-y-6">
            <SectionCard title="Business goals" subtitle="Progress across the pillars that matter">
              <div className="grid gap-4 sm:grid-cols-2">
                {DASHBOARD_GOALS.map((g) => <GoalTile key={g.id} goal={g} />)}
              </div>
            </SectionCard>

            <SectionCard title="Credit-building progress by category">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={CREDIT_BUILDING}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} />
                    <ReTooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }} />
                    <Bar dataKey="score" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
          </TabsContent>

          {/* PURCHASES */}
          <TabsContent value="purchases" className="mt-0 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <SectionCard title="Active service">
                <p className="font-semibold text-secondary">One-on-One Coaching</p>
                <p className="text-sm text-muted-foreground mb-4">Quarterly plan · renews May 12, 2026</p>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-muted-foreground">Access remaining</span>
                  <span className="font-medium text-secondary">62 of 90 days</span>
                </div>
                <Progress value={69} className="h-2" />
              </SectionCard>
              <SectionCard title="Upgrade options" subtitle="Move faster with cohort or private coaching">
                <p className="text-sm text-muted-foreground mb-4">
                  Compare tiers and choose the level of support that fits your goals.
                </p>
                <Link to="/pricing">
                  <Button className="rounded-full">
                    See pricing <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </SectionCard>
            </div>

            <SectionCard title="Purchase history">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Invoice</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {PURCHASES.map((p) => (
                      <TableRow key={p.invoice}>
                        <TableCell className="text-muted-foreground text-sm">{p.date}</TableCell>
                        <TableCell className="font-medium text-secondary">{p.product}</TableCell>
                        <TableCell>{p.amount}</TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={
                              p.status === "active"
                                ? "bg-primary/15 text-primary"
                                : p.status === "refunded"
                                ? "bg-destructive/15 text-destructive"
                                : "bg-muted text-muted-foreground"
                            }
                          >
                            {p.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <button className="text-primary text-sm inline-flex items-center gap-1 hover:underline">
                            <Receipt className="h-3.5 w-3.5" />
                            {p.invoice}
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </SectionCard>
          </TabsContent>
        </Tabs>
      </main>

      <SiteFooter />
    </div>
  );
};

/* ------------------------------------------------------------- */
/* Building blocks                                                */
/* ------------------------------------------------------------- */

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  suffix?: string;
  hint?: string;
  progress?: number;
}

const StatCard = ({ icon, label, value, suffix, hint, progress }: StatCardProps) => (
  <div className="rounded-3xl bg-white shadow-card border border-border/60 p-4 sm:p-5">
    <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">
      <span className="text-primary">{icon}</span>
      {label}
    </div>
    <div className="mt-2 flex items-baseline gap-1">
      <span className="text-2xl sm:text-3xl font-bold text-secondary">{value}</span>
      {suffix && <span className="text-xs sm:text-sm text-muted-foreground">{suffix}</span>}
    </div>
    {typeof progress === "number" && <Progress value={progress} className="mt-3 h-1.5" />}
    {hint && <p className="mt-2 text-xs text-muted-foreground">{hint}</p>}
  </div>
);

interface SectionCardProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

const SectionCard = ({ title, subtitle, action, children }: SectionCardProps) => (
  <section className="rounded-3xl bg-white shadow-card border border-border/60 p-5 sm:p-7">
    <div className="flex items-start justify-between gap-4 mb-5">
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-secondary">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
    {children}
  </section>
);

const MiniStat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl bg-background border border-border/60 p-3">
    <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">{label}</div>
    <div className="mt-1 font-semibold text-secondary text-sm">{value}</div>
  </div>
);

const NextActionCard = ({ task, onComplete }: { task: DashboardTask; onComplete: () => void }) => (
  <section className="rounded-3xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border border-primary/20 shadow-card p-5 sm:p-7">
    <span className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold uppercase tracking-wide">
      <Target className="h-3.5 w-3.5" />
      Next recommended action
    </span>
    <h2 className="mt-3 text-xl sm:text-2xl font-bold text-secondary">{task.label}</h2>
    <p className="text-sm text-muted-foreground mt-1">{task.dueLabel}</p>
    <div className="mt-5 flex flex-col sm:flex-row gap-3">
      <Button className="rounded-full" onClick={onComplete}>
        <CheckCircle2 className="h-4 w-4 mr-1.5" />
        Mark complete
      </Button>
      <Link to="/one-on-one">
        <Button variant="outline" className="rounded-full w-full sm:w-auto">
          Get help on a 1:1 <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </Link>
    </div>
  </section>
);

const RoadmapStepper = () => (
  <ol className="grid grid-cols-5 gap-2">
    {ROADMAP.map((step, i) => {
      const done = step.state === "done";
      const current = step.state === "current";
      return (
        <li key={step.id} className="flex flex-col items-center text-center">
          <div
            className={
              "h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold border-2 " +
              (done
                ? "bg-primary text-primary-foreground border-primary"
                : current
                ? "bg-accent text-accent-foreground border-accent"
                : "bg-background text-muted-foreground border-border")
            }
          >
            {done ? <CheckCircle2 className="h-5 w-5" /> : i + 1}
          </div>
          <span
            className={
              "mt-2 text-[11px] sm:text-xs font-medium " +
              (current ? "text-secondary" : done ? "text-primary" : "text-muted-foreground")
            }
          >
            {step.label}
          </span>
        </li>
      );
    })}
  </ol>
);

const TaskRow = ({ task, onToggle }: { task: DashboardTask; onToggle: () => void }) => (
  <li>
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-start gap-3 text-left rounded-2xl border border-border/60 bg-background hover:border-primary/40 hover:bg-primary/5 transition-colors px-4 py-3"
    >
      {task.done ? (
        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
      ) : (
        <Circle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
      )}
      <div className="flex-1 min-w-0">
        <p className={"text-sm " + (task.done ? "text-muted-foreground line-through" : "text-secondary font-medium")}>
          {task.label}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{task.dueLabel}</p>
      </div>
    </button>
  </li>
);

const ChecklistGroup = ({
  title,
  cadence,
  tasks,
  onToggle,
}: {
  title: string;
  cadence: TaskCadence;
  tasks: DashboardTask[];
  onToggle: (id: string) => void;
}) => {
  const group = tasks.filter((t) => t.cadence === cadence);
  if (!group.length) return null;
  const done = group.filter((t) => t.done).length;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-secondary text-sm uppercase tracking-wide">{title}</h3>
        <span className="text-xs text-muted-foreground">{done}/{group.length}</span>
      </div>
      <ul className="space-y-2">
        {group.map((t) => <TaskRow key={t.id} task={t} onToggle={() => onToggle(t.id)} />)}
      </ul>
    </div>
  );
};

const GuideCard = ({ guide }: { guide: GuideEntry }) => {
  const grad =
    guide.accent === "sky"
      ? "from-sky/30 to-sky/5"
      : guide.accent === "amber"
      ? "from-accent/30 to-accent/5"
      : "from-primary/30 to-primary/5";
  return (
    <div className="rounded-3xl bg-white border border-border/60 shadow-card overflow-hidden flex flex-col">
      <div className={`h-24 bg-gradient-to-br ${grad} flex items-center justify-center`}>
        <BookOpen className="h-10 w-10 text-secondary/60" />
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-secondary">{guide.title}</h3>
          <Badge
            variant="secondary"
            className={
              guide.status === "complete"
                ? "bg-primary/15 text-primary"
                : guide.status === "in-progress"
                ? "bg-accent/20 text-accent-foreground"
                : "bg-muted text-muted-foreground"
            }
          >
            {guide.status === "in-progress" ? "In progress" : guide.status === "complete" ? "Complete" : "New"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-4 flex-1">{guide.description}</p>
        {guide.progress > 0 && guide.progress < 100 && (
          <Progress value={guide.progress} className="h-1.5 mb-4" />
        )}
        <div className="flex items-center gap-2">
          <Link to={guide.to} className="flex-1">
            <Button size="sm" className="rounded-full w-full">
              {guide.status === "in-progress" ? "Continue" : guide.status === "complete" ? "Review" : "Start"}
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
          {guide.downloadable && (
            <Button size="sm" variant="outline" className="rounded-full" aria-label="Download PDF">
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const GoalTile = ({ goal }: { goal: Goal }) => {
  const statusMap = {
    "not-started": { label: "Not started", cls: "bg-muted text-muted-foreground" },
    "in-progress": { label: "In progress", cls: "bg-accent/20 text-accent-foreground" },
    "on-track": { label: "On track", cls: "bg-primary/15 text-primary" },
    complete: { label: "Complete", cls: "bg-primary text-primary-foreground" },
  } as const;
  const s = statusMap[goal.status];
  return (
    <div className="rounded-2xl border border-border/60 bg-background p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 rounded-full bg-primary/10 text-primary items-center justify-center">
            {goal.status === "complete" ? <Trophy className="h-4 w-4" /> : <Flag className="h-4 w-4" />}
          </span>
          <h3 className="font-semibold text-secondary text-sm sm:text-base">{goal.title}</h3>
        </div>
        <Badge variant="secondary" className={s.cls}>{s.label}</Badge>
      </div>
      <Progress value={goal.progress} className="h-2 mb-2" />
      <p className="text-xs text-muted-foreground mb-3">{goal.progress}% complete</p>
      <p className="text-sm text-secondary">
        <span className="font-medium">Next: </span>
        {goal.nextStep}
      </p>
    </div>
  );
};

const PriorityBadge = ({ priority }: { priority: "high" | "medium" | "low" }) => {
  const map = {
    high: "bg-destructive/15 text-destructive",
    medium: "bg-accent/20 text-accent-foreground",
    low: "bg-muted text-muted-foreground",
  } as const;
  return (
    <Badge variant="secondary" className={map[priority] + " capitalize shrink-0"}>
      {priority} priority
    </Badge>
  );
};

export default MockDashboardPage;