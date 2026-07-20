// UI-only mock visitor dashboard.
// TODO(auth): gate this behind a real session (Supabase getUser) and
// replace mock data with fetches for profile, plan, task progress,
// and next appointment.
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Circle,
  Download,
  FileText,
  LogOut,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import SiteHeader from "@/components/shared/SiteHeader";
import SiteFooter from "@/components/shared/SiteFooter";
import Seo from "@/components/shared/Seo";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface LocationState {
  firstName?: string;
  email?: string;
}

const INITIAL_TASKS = [
  { id: "t1", label: "Confirm your business entity with an attorney/CPA", done: true },
  { id: "t2", label: "Obtain your EIN from the IRS", done: true },
  { id: "t3", label: "Open a dedicated business bank account", done: true },
  { id: "t4", label: "Set up business phone + address + email on custom domain", done: true },
  { id: "t5", label: "Register D-U-N-S, Experian Business, Equifax Small Business", done: false },
  { id: "t6", label: "Establish 3 vendor tradelines that report", done: false },
  { id: "t7", label: "Apply for first EIN-only business card", done: false },
];

const ACTIVITY = [
  { icon: FileText, text: "You downloaded the Realtor Business Credit Guide", when: "2 days ago" },
  { icon: Calendar, text: "One-on-One session booked for Thursday 2:00 PM PT", when: "3 days ago" },
  { icon: Sparkles, text: "Custom plan generated from your intake survey", when: "3 days ago" },
];

const MockDashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as LocationState;
  const firstName = state.firstName || "Realtor";

  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const doneCount = tasks.filter((t) => t.done).length;

  const toggleTask = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const handleLogout = () => {
    // Mock logout: nothing to clear. Real impl will call supabase.auth.signOut().
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-hero-grad">
      <Seo
        title="Your Portal — Realtor Business Credit"
        description="Your custom Realtor Business Credit plan, progress, and next steps."
        noindex
      />
      <SiteHeader />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              <Sparkles className="h-3.5 w-3.5" />
              Your portal
            </span>
            <h1
              className="mt-3 font-semibold text-secondary"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", lineHeight: 1.15 }}
            >
              Welcome back, {firstName}
            </h1>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Here's your current fundability snapshot, plan progress, and next session.
            </p>
          </div>
          <Button
            variant="outline"
            className="rounded-full self-start"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Log out
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <StatCard
            icon={<TrendingUp className="h-5 w-5 text-primary" />}
            label="Fundability Score"
            value="62"
            suffix=" / 100"
            hint="Up 8 pts since intake"
            progress={62}
          />
          <StatCard
            icon={<CheckCircle2 className="h-5 w-5 text-primary" />}
            label="90-Day Plan Progress"
            value={`${doneCount}`}
            suffix={` of ${tasks.length} steps`}
            hint="Keep the momentum"
            progress={(doneCount / tasks.length) * 100}
          />
          <StatCard
            icon={<Calendar className="h-5 w-5 text-primary" />}
            label="Next Session"
            value="Thu"
            suffix=" · 2:00 PM PT"
            hint="One-on-One with Jessie"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="lg:col-span-2 rounded-3xl bg-white shadow-card border border-border/60 p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-secondary">
                  Your Custom Plan
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Tailored to your intake — check tasks off as you complete them.
                </p>
              </div>
              <Button variant="outline" size="sm" className="rounded-full">
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>

            <ul className="space-y-2">
              {tasks.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => toggleTask(t.id)}
                    className="w-full flex items-start gap-3 text-left rounded-2xl border border-border/60 bg-background hover:bg-accent/40 transition-colors px-4 py-3"
                  >
                    {t.done ? (
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    )}
                    <span
                      className={
                        t.done
                          ? "text-sm text-muted-foreground line-through"
                          : "text-sm text-secondary font-medium"
                      }
                    >
                      {t.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <Link to="/sample-plan">
                <Button variant="ghost" className="rounded-full">
                  View full plan
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </section>

          <aside className="space-y-4">
            <QuickCard
              title="Book your next 1:1"
              body="Reserve time with Jessie to review progress and unblock the next steps."
              cta="Book a session"
              to="/one-on-one"
            />
            <QuickCard
              title="Continue the guide"
              body="Pick up right where you left off in the Realtor Business Credit Guide."
              cta="Open the guide"
              to="/guide"
            />
            <QuickCard
              title="Sample plan"
              body="See what a fully built plan looks like for a working Realtor."
              cta="See sample plan"
              to="/sample-plan"
            />
          </aside>
        </div>

        <section className="mt-8 rounded-3xl bg-white shadow-card border border-border/60 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-secondary mb-4">Recent activity</h2>
          <ul className="divide-y divide-border/60">
            {ACTIVITY.map(({ icon: Icon, text, when }, i) => (
              <li key={i} className="flex items-start gap-3 py-3">
                <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="flex-1">
                  <p className="text-sm text-secondary">{text}</p>
                  <p className="text-xs text-muted-foreground">{when}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  suffix?: string;
  hint?: string;
  progress?: number;
}

const StatCard = ({ icon, label, value, suffix, hint, progress }: StatCardProps) => (
  <div className="rounded-3xl bg-white shadow-card border border-border/60 p-5">
    <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground font-semibold">
      {icon}
      {label}
    </div>
    <div className="mt-3 flex items-baseline gap-1">
      <span className="text-3xl font-bold text-secondary">{value}</span>
      {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
    </div>
    {typeof progress === "number" && (
      <Progress value={progress} className="mt-3 h-2" />
    )}
    {hint && <p className="mt-2 text-xs text-muted-foreground">{hint}</p>}
  </div>
);

interface QuickCardProps {
  title: string;
  body: string;
  cta: string;
  to: string;
}

const QuickCard = ({ title, body, cta, to }: QuickCardProps) => (
  <div className="rounded-3xl bg-white shadow-card border border-border/60 p-5">
    <h3 className="font-semibold text-secondary">{title}</h3>
    <p className="text-sm text-muted-foreground mt-1 mb-4">{body}</p>
    <Link to={to}>
      <Button size="sm" className="rounded-full">
        {cta}
        <ArrowRight className="h-4 w-4 ml-1" />
      </Button>
    </Link>
  </div>
);

export default MockDashboardPage;