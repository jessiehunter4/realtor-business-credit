import { Link } from "react-router-dom";
import {
  Award,
  BookOpen,
  Building2,
  Calendar,
  Compass,
  GraduationCap,
  HandshakeIcon,
  Handshake,
  HeartHandshake,
  MapPin,
  Quote,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SiteHeader from "@/components/shared/SiteHeader";
import SiteFooter from "@/components/shared/SiteFooter";
import StickyMobileCTABar from "@/components/shared/StickyMobileCTABar";
import Seo from "@/components/shared/Seo";

const values = [
  {
    icon: GraduationCap,
    title: "Education over hype",
    body: "Clear, realistic guidance — no guaranteed approvals or magic numbers.",
    tone: "bg-primary/10 text-primary",
  },
  {
    icon: Building2,
    title: "Realtor-specific",
    body: "Built around how agents and brokers actually earn, spend, and get licensed.",
    tone: "bg-sky/15 text-sky",
  },
  {
    icon: ShieldCheck,
    title: "Protection first",
    body: "Separate your business finances so your personal credit and family aren't on the line.",
    tone: "bg-accent/20 text-accent-foreground",
  },
  {
    icon: Compass,
    title: "Transparent guidance",
    body: "We tell you what business credit can — and can't — do for your situation.",
    tone: "bg-primary/10 text-primary",
  },
  {
    icon: HeartHandshake,
    title: "Long-term partnership",
    body: "A dual-coach model that stays with you well past the first application.",
    tone: "bg-sky/15 text-sky",
  },
  {
    icon: Sparkles,
    title: "Compliance-aware",
    body: "Educational only. We encourage you to consult your broker, attorney, and CPA.",
    tone: "bg-accent/20 text-accent-foreground",
  },
];

const differentiators = [
  {
    title: "Realtor-specific, not generic",
    body: "Most business credit programs treat every entrepreneur the same. Ours is built around commission timing, licensing rules, and real estate expenses.",
  },
  {
    title: "Dual-coach model",
    body: "You get a Realtor Business Credit coach who understands your world plus a Credit Suite specialist for fundability, tradelines, and business credit cards.",
  },
  {
    title: "Custom 90-day plan",
    body: "We evaluate your structure, financial foundation, and credit, then hand you a written plan tailored to your top gaps — not a generic checklist.",
  },
  {
    title: "Cohort option",
    body: "Prefer momentum with other Realtors? Join a small group cohort for accountability, shared wins, and steady progress.",
  },
];

const helpSteps = [
  {
    icon: BookOpen,
    title: "Read the free guide",
    body: "Understand the business structure, financial foundation, and credit steps most Realtors were never shown.",
  },
  {
    icon: Calendar,
    title: "Book a free 1:1",
    body: "A no-pressure conversation to clarify your goals, gaps, and top priorities.",
  },
  {
    icon: Target,
    title: "Intake + Fundability Scan",
    body: "A short survey plus a diagnostic scan gives us a real picture of where you stand today.",
  },
  {
    icon: Users,
    title: "Custom plan & program",
    body: "You get a personalized 90-day plan and a path — 1:1 coaching, cohort, or self-paced with check-ins.",
  },
];

const stats = [
  { value: "14+", label: "Years brokering" },
  { value: "100s", label: "Transactions closed" },
  { value: "CA & GA", label: "Licensed states" },
  { value: "Certified", label: "Credit Suite Partner" },
];

const team = [
  {
    initials: "JH",
    name: "Jessie Hunter",
    role: "Founder & Broker",
    body: "Real estate broker licensed in California and Georgia, in the business since 2010, and a certified Credit Suite partner. Jessie built Realtor Business Credit to teach agents what he wishes he'd known on day one.",
    tone: "bg-primary/10 text-primary",
  },
  {
    initials: "RC",
    name: "Realtor Business Credit Coach",
    role: "1:1 & Cohort Coaching",
    body: "Works with you on the Realtor-specific pieces: entity structure conversations with your CPA/attorney, financial foundation, and your custom 90-day plan.",
    tone: "bg-sky/15 text-sky",
  },
  {
    initials: "CS",
    name: "Credit Suite Coach",
    role: "Business Credit Specialist",
    body: "Specializes in fundability, business credit profiles (D&B, Experian, Equifax), vendor tradelines, and business credit cards through our certified partnership.",
    tone: "bg-accent/20 text-accent-foreground",
  },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Seo
        title="About Realtor Business Credit — Our Story & Mission"
        description="Realtor Business Credit is built by a broker, for brokers and agents. Learn about our mission, dual-coach model, and how we help Realtors build separate business credit and funding capacity."
        path="/about"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About Realtor Business Credit",
          url: "https://realtorbusinesscredit.com/about",
          about: {
            "@type": "Organization",
            name: "Realtor Business Credit",
            url: "https://realtorbusinesscredit.com",
            parentOrganization: {
              "@type": "Organization",
              name: "My Better Business Credit",
            },
            founder: {
              "@type": "Person",
              name: "Jessie Hunter",
              jobTitle: "Real Estate Broker & Founder",
            },
          },
        }}
      />
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="bg-hero-grad">
          <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-1.5 text-xs md:text-sm font-semibold">
              <Sparkles className="h-4 w-4" aria-hidden />
              About Realtor Business Credit
            </span>
            <h1
              className="mt-5 font-bold text-secondary leading-tight"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              Built by a Realtor, for Realtors.
            </h1>
            <p
              className="mt-4 text-muted-foreground max-w-2xl mx-auto"
              style={{ fontSize: "clamp(1rem, 1.5vw, 1.25rem)" }}
            >
              We help real estate agents and brokers build the business structure,
              financial foundation, and separate credit that turn closings into
              real capacity — so you have money when you need it.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="w-full sm:w-auto rounded-full">
                <Link to="/one-on-one">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book a Free 1:1 Session
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto rounded-full">
                <Link to="/guide">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Read the Free Guide
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="container mx-auto px-4 py-16 md:py-20 max-w-5xl">
          <div className="grid md:grid-cols-5 gap-8 md:gap-12 items-start">
            <div className="md:col-span-3 space-y-4">
              <p className="text-primary font-semibold uppercase tracking-wide text-sm">Our Story</p>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary">
                14+ years in real estate. Zero trainings on business credit.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Jessie Hunter has been a real estate broker since 2010, licensed in
                California and Georgia, with hundreds of transactions across
                residential and commercial deals. Along the way came the usual
                trainings — contracts, negotiations, scripts, designations.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                What never came up? <strong className="text-secondary">Building separate business credit.</strong>{" "}
                Every marketing dollar, tech subscription, staging bill, and
                travel expense went on personal credit cards. Personal utilization
                climbed. Family finances stayed exposed. Growth stayed capped.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                After finally researching business credit and becoming a{" "}
                <strong className="text-secondary">certified Credit Suite partner</strong>, Jessie built
                Realtor Business Credit — a Realtor-specific system so other agents
                and brokers don't have to wait a decade to figure this out.
              </p>
            </div>
            <aside className="md:col-span-2">
              <figure className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-card">
                <Quote className="h-8 w-8 text-primary" aria-hidden />
                <blockquote className="mt-3 text-secondary leading-relaxed">
                  "I wish someone had told me about business credit when I got my
                  license in 2010. I don't want other Realtors to wait 10+ years to
                  fix this."
                </blockquote>
                <figcaption className="mt-4 text-sm text-muted-foreground border-t border-border pt-3">
                  <span className="font-semibold text-secondary">Jessie Hunter</span> · Founder & Broker
                </figcaption>
              </figure>
            </aside>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="bg-secondary/[0.03] border-y border-border">
          <div className="container mx-auto px-4 py-16 md:py-20 max-w-5xl">
            <div className="grid md:grid-cols-2 gap-6">
              <article className="bg-card border border-border rounded-3xl p-8 shadow-card">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <Target className="h-6 w-6" aria-hidden />
                </div>
                <h2 className="mt-4 text-2xl md:text-3xl font-bold text-secondary">Our Mission</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Help residential and commercial real estate professionals build a
                  separate business credit profile, financial structure, and
                  funding capacity for their real estate business — so they aren't
                  relying entirely on personal credit to grow.
                </p>
              </article>
              <article className="bg-card border border-border rounded-3xl p-8 shadow-card">
                <div className="w-12 h-12 rounded-2xl bg-sky/15 text-sky flex items-center justify-center">
                  <Compass className="h-6 w-6" aria-hidden />
                </div>
                <h2 className="mt-4 text-2xl md:text-3xl font-bold text-secondary">Our Vision</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Every Realtor operating a real estate business with its own
                  financial footprint — protected personal credit, dedicated
                  business capacity, and the ability to invest in growth when
                  opportunity knocks.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="container mx-auto px-4 py-16 md:py-20 max-w-6xl">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <p className="text-primary font-semibold uppercase tracking-wide text-sm">Core Values</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold text-secondary">
              What we stand for
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map(({ icon: Icon, title, body, tone }) => (
              <div
                key={title}
                className="bg-card border border-border rounded-2xl p-6 shadow-card"
              >
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${tone}`}>
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="mt-4 font-semibold text-secondary">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What Makes Us Different */}
        <section className="bg-hero-grad">
          <div className="container mx-auto px-4 py-16 md:py-20 max-w-5xl">
            <div className="max-w-2xl mx-auto text-center mb-10">
              <p className="text-primary font-semibold uppercase tracking-wide text-sm">Why us</p>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold text-secondary">
                What makes us different
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {differentiators.map((d) => (
                <div
                  key={d.title}
                  className="bg-card border border-border rounded-2xl p-6 shadow-card"
                >
                  <h3 className="font-semibold text-secondary text-lg">{d.title}</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">{d.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How We Help */}
        <section className="container mx-auto px-4 py-16 md:py-20 max-w-6xl">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <p className="text-primary font-semibold uppercase tracking-wide text-sm">How we help</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold text-secondary">
              From closing to capacity in four steps
            </h2>
          </div>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {helpSteps.map(({ icon: Icon, title, body }, i) => (
              <li
                key={title}
                className="bg-card border border-border rounded-2xl p-6 shadow-card"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </span>
                  <Icon className="h-5 w-5 text-primary" aria-hidden />
                </div>
                <h3 className="mt-4 font-semibold text-secondary">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Trust / Credibility */}
        <section className="bg-secondary text-secondary-foreground">
          <div className="container mx-auto px-4 py-16 md:py-20 max-w-5xl">
            <div className="max-w-2xl mx-auto text-center mb-10">
              <p className="text-primary font-semibold uppercase tracking-wide text-sm">Track record</p>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold">
                Experience Realtors can trust
              </h2>
              <p className="mt-3 text-secondary-foreground/80">
                Real estate expertise plus a certified business credit partnership.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-secondary-foreground/10 bg-secondary-foreground/5 p-6 text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-primary">{s.value}</div>
                  <div className="mt-1 text-sm text-secondary-foreground/80">{s.label}</div>
                </div>
              ))}
            </div>
            <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-secondary-foreground/80">
              <li className="flex items-center gap-2"><Award className="h-4 w-4 text-primary" aria-hidden /> 14+ years brokering</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" aria-hidden /> Licensed CA &amp; GA</li>
              <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" aria-hidden /> Certified Credit Suite Partner</li>
              <li className="flex items-center gap-2"><GraduationCap className="h-4 w-4 text-primary" aria-hidden /> Educational — not legal/tax advice</li>
            </ul>
          </div>
        </section>

        {/* Meet the Team */}
        <section className="container mx-auto px-4 py-16 md:py-20 max-w-6xl">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <p className="text-primary font-semibold uppercase tracking-wide text-sm">Meet the team</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold text-secondary">
              A dual-coach model, built around you
            </h2>
            <p className="mt-3 text-muted-foreground">
              You don't have to do this alone.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {team.map((m) => (
              <article
                key={m.name}
                className="bg-card border border-border rounded-3xl p-6 shadow-card flex flex-col"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold ${m.tone}`}>
                  {m.initials}
                </div>
                <h3 className="mt-4 font-semibold text-secondary text-lg">{m.name}</h3>
                <p className="text-sm text-primary font-semibold">{m.role}</p>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1">{m.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-hero-grad border-t border-border">
          <div className="container mx-auto px-4 py-16 md:py-24 max-w-3xl text-center">
            <Handshake className="h-10 w-10 text-primary mx-auto" aria-hidden />
            <h2
              className="mt-4 font-bold text-secondary"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
            >
              Ready to turn your closings into capacity?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Book a free one-on-one session. We'll review your goals, gaps, and
              the first steps of your custom plan — no pressure, no obligation.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="w-full sm:w-auto rounded-full">
                <Link to="/one-on-one">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book a Free 1:1 Session
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto rounded-full">
                <Link to="/guide">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Read the Free Guide
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
      <StickyMobileCTABar guideLink="/guide" />
    </div>
  );
};

export default AboutPage;