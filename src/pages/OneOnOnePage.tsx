import { useEffect, useMemo, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BookOpen,
  Calendar,
  CheckCircle,
  ClipboardList,
  Users,
  Target,
  FileText,
  Sparkles,
  MessageSquare,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import PlanMockupCard from "@/components/oneonone/PlanMockupCard";
import { useContactIdentity } from "@/hooks/useContactIdentity";
import { useEngagementTracker } from "@/hooks/useEngagementTracker";
import SiteFooter from "@/components/shared/SiteFooter";
import SiteHeader from "@/components/shared/SiteHeader";
import Seo from "@/components/shared/Seo";

const EMBED_SCRIPT_URL = "https://link.everycatch.com/js/form_embed.js";
const IFRAME_SRC = "https://link.everycatch.com/widget/booking/Xt32XcNcmKgm7vaJaR9o";

const OneOnOnePage = () => {
  const [searchParams] = useSearchParams();
  const { contactId, email, buildForwardParams } = useContactIdentity();
  const token = searchParams.get("token") || "";
  const mountLogged = useRef(false);
  const forwardParams = buildForwardParams();

  const intakeLink = useMemo(() => {
    const params = new URLSearchParams();
    if (email) params.set("email", email);
    if (token) params.set("token", token);
    if (forwardParams) {
      const forwarded = new URLSearchParams(forwardParams);
      forwarded.forEach((value, key) => {
        if (!params.has(key)) params.set(key, value);
      });
    }
    return `/intake${params.toString() ? `?${params.toString()}` : ""}`;
  }, [email, token, forwardParams]);

  const { logEvent } = useEngagementTracker({
    contactId,
    pageName: "one_on_one",
  });

  useEffect(() => {
    if (mountLogged.current) return;
    mountLogged.current = true;
    void logEvent("one_on_one_visited");
  }, [logEvent]);

  useEffect(() => {
    if (!document.querySelector(`script[src="${EMBED_SCRIPT_URL}"]`)) {
      const script = document.createElement("script");
      script.src = EMBED_SCRIPT_URL;
      script.type = "text/javascript";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  const nextSteps = [
    {
      icon: Calendar,
      title: "Session Booked ✓",
      description: "You've picked a time — check your email for a confirmation.",
    },
    {
      icon: ClipboardList,
      title: "Complete the Intake Survey",
      description: "Fill out the Realtor Business Financial Needs Analysis so Jessie can prepare a personalized plan.",
      link: { to: intakeLink, label: "Start the Intake Survey" },
    },
    {
      icon: UserCheck,
      title: "Show Up to Your Session",
      description: "Jessie will review your intake responses and map out your next steps with you on the call.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <Seo
        title="Free One-on-One Business Credit Session for Realtors"
        description="30 minutes with Jessie Hunter, Realtor and Credit Suite Certified Partner. Walk away with a 90-day plan tailored to your state, your closings, and your goals."
        path="/one-on-one"
      />
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-grad py-16 md:py-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -bottom-32 -right-16 w-[28rem] h-[28rem] rounded-full bg-sky/15 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-primary text-xs font-semibold tracking-wide uppercase">
              Free Strategy Session
            </span>
          </div>
          <h1 className="text-[clamp(2rem,6vw,3.5rem)] font-bold text-secondary leading-[1.1] tracking-tight text-balance mb-5">
            Why a One-on-One Business Credit Session{" "}
            <span className="text-primary">Changes Everything</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            In 30 minutes we map exactly where your <em>money when you need it</em>
            {" "}is leaking — and what to fix first.
          </p>
          <a
            href="#book"
            data-analytics-id="cta-one-on-one-hero"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-4 text-base font-semibold shadow-card hover:shadow-card-hover hover:bg-primary/90 transition-all"
          >
            <Calendar className="h-5 w-5" />
            Book My Free One-on-One Session
          </a>
          <p className="mt-6 text-sm text-muted-foreground">
            Want to see what you'll receive first?{" "}
            <Link to="/sample-plan" className="font-semibold text-primary hover:underline">
              Preview a sample custom plan →
            </Link>
          </p>
        </div>
      </section>

      {/* Calendar Embed */}
      <section id="book" className="py-12 md:py-16 scroll-mt-4">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
            Pick a Time That Works for You
          </h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-6">
            30 minutes. No pressure. No pitch deck. Here's exactly what we'll cover:
          </p>
          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
            {[
              { icon: Target, text: "Your top 3 financial goals & gaps" },
              { icon: FileText, text: "A 90-day action plan tailored to your state" },
              { icon: CheckCircle, text: "Clear next steps — yours to keep, no obligation" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex gap-3 items-start bg-muted/50 border border-border rounded-lg p-4">
                <Icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground/90 leading-snug">{text}</p>
              </div>
            ))}
          </div>
          <Card className="overflow-hidden border-2">
            <CardContent className="p-0">
              <iframe
                src={IFRAME_SRC}
                style={{ width: "100%", border: "none", overflow: "hidden", minHeight: "700px" }}
                scrolling="no"
                id="Xt32XcNcmKgm7vaJaR9o_booking"
                title="Book your session"
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* What Happens Next */}
      <section className="py-12 md:py-16 bg-muted">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            What Happens Next
          </h2>
          <div className="grid gap-6">
            {nextSteps.map((step, i) => (
              <div key={i} className="flex gap-4 md:gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
                    <step.icon className="w-5 h-5 text-primary" />
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground mb-2">{step.description}</p>
                  {step.link && (
                    <Link
                      to={step.link.to}
                      className="inline-flex items-center gap-1 text-primary font-medium hover:underline text-sm"
                    >
                      {step.link.label} <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Complete the Intake */}
      <section className="py-12 md:py-16">
        <div className="container max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Why Complete the Intake First?</h2>
          <p className="text-muted-foreground text-lg mb-6">
            When you fill out the Realtor Business Financial Needs Analysis before your call, Jessie can review your goals, business structure, and credit situation ahead of time — so your session is focused, productive, and personalized to you.
          </p>
          <Button asChild size="lg">
            <Link to={intakeLink}>
              <ClipboardList className="w-5 h-5 mr-2" />
              Complete the Intake Survey
            </Link>
          </Button>
        </div>
      </section>

      {/* Why One-On-One vs the Guide */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4 text-center">
            Why a One-On-One Session — Not Just the Guide
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            The free guide gives you the knowledge. A session gives you the{" "}
            <strong className="text-foreground">strategy</strong> — built
            around your exact situation.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Target,
                text: "We interpret your situation in the context of your state and brokerage structure.",
              },
              {
                icon: Sparkles,
                text: "We connect your financial goals to a realistic business credit capacity roadmap.",
              },
              {
                icon: MessageSquare,
                text: "We clarify what's realistic in 90 days vs 12 months for YOUR production level.",
              },
              {
                icon: Users,
                text: "You get answers to questions specific to your license type, entity options, and local regulations.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex gap-4 items-start bg-muted/50 rounded-xl p-6 border border-border"
              >
                <item.icon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <p className="text-foreground/90 text-base md:text-lg leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We'll Do */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4 text-center">
              What We'll Do in Your Session
            </h2>
            <p className="text-center text-muted-foreground text-lg mb-12">
              30–45 minutes. One conversation. Complete clarity.
            </p>

            <div className="space-y-6">
              {[
                {
                  step: 1,
                  title: "Review Your Needs Analysis",
                  desc: "We'll go through your Realtor Business Financial Needs Analysis responses so I understand your goals, production level, and current business structure.",
                },
                {
                  step: 2,
                  title: "Map Your Foundation & Credit Capacity",
                  desc: "We'll review your current business structure and financial foundation together so you know exactly what's working and what's missing.",
                },
                {
                  step: 3,
                  title: "Identify the 3–5 Biggest Gaps",
                  desc: "Whether it's your entity structure, missing tradelines, or no business credit bureau presence — we'll pinpoint exactly what's holding you back.",
                },
                {
                  step: 4,
                  title: "Outline Your 90-Day Action Plan",
                  desc: "You'll leave with a clear, step-by-step roadmap for the next 90 days and a longer 6–12 month vision tied to your production goals.",
                },
                {
                  step: 5,
                  title: "Discuss the Best Fit for You",
                  desc: "We'll explore whether one-on-one coaching, a small Realtor cohort, or self-paced work with Credit Suite tools is the right path. No pressure — just options.",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-5 items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-secondary mb-1">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What You Receive After */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4 text-center">
            What You Receive After the Call
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            This isn't just a phone call — you walk away with real deliverables.
          </p>

          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              {[
                {
                  icon: FileText,
                  text: "A custom Realtor Business Credit Plan (click & read + downloadable PDF).",
                },
                {
                  icon: CheckCircle,
                  text: "Clear, prioritized actions you can start this week.",
                },
                {
                  icon: Users,
                  text: "Option to join a 5–10 Realtor accountability cohort for 90 days.",
                },
                {
                  icon: Sparkles,
                  text: "Clarity on how the Credit Suite portal and coach can support you.",
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <item.icon className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <p className="text-foreground/90 text-base md:text-lg leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-xl overflow-hidden border border-border shadow-lg">
              <PlanMockupCard />
              <div className="bg-muted p-4 text-center">
                <p className="text-sm text-muted-foreground italic">
                  Sample custom plan — yours will be tailored to your specific
                  situation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="bg-primary/10 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-10">
              Who This Session Is For
            </h2>

            <div className="space-y-4 text-left max-w-2xl mx-auto">
              {[
                "You've closed at least a few transactions and want more financial stability between closings.",
                "You're tired of putting marketing and business expenses on your personal credit cards.",
                "You want a clear, personalized plan — not just another generic business credit article.",
                "You know you should separate personal and business finances but aren't sure where to start.",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex gap-3 items-start bg-card rounded-lg p-4 border border-border"
                >
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-foreground/90 text-base md:text-lg">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-10 text-center">
            Frequently Asked Questions
          </h2>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="cost">
              <AccordionTrigger className="text-left text-base md:text-lg font-semibold">
                Is there any cost or obligation?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                No. The one-on-one session and your custom plan are completely
                free. If you decide to enroll in a coaching program or the
                Credit Suite platform, that's entirely optional — and we'll
                discuss pricing and payment options only if you ask.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="advice">
              <AccordionTrigger className="text-left text-base md:text-lg font-semibold">
                Do you give legal or tax advice?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                No. This is education and coaching only. We'll discuss general
                principles and common approaches, but we always recommend you
                consult your broker, attorney, and CPA/tax professional for
                advice specific to your situation and state.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="duration">
              <AccordionTrigger className="text-left text-base md:text-lg font-semibold">
                How long is the session?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                Plan for 30–45 minutes. Most sessions run about 35 minutes —
                enough time to review your scan, discuss your goals, and outline
                your next steps without feeling rushed.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="states">
              <AccordionTrigger className="text-left text-base md:text-lg font-semibold">
                Is this only for Realtors in certain states?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                The principles of business credit are broadly applicable across
                all 50 states. However, entity rules (LLC vs. Corp for your
                license) vary by state, so we'll discuss what applies in your
                situation and encourage you to verify with your state licensing
                board.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="preparation">
              <AccordionTrigger className="text-left text-base md:text-lg font-semibold">
                Do I need to prepare anything before the call?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                Just complete the Realtor Business Financial Needs Analysis
                intake form (we'll send it after you book). It takes about 5–10
                minutes and helps us make the most of our time together.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="new-agents">
              <AccordionTrigger className="text-left text-base md:text-lg font-semibold">
                I'm a newer agent — is this still for me?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                Absolutely. In fact, starting earlier means you can build your
                business credit profile alongside your career — rather than
                trying to catch up after years of mixing personal and business
                finances.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="commercial">
              <AccordionTrigger className="text-left text-base md:text-lg font-semibold">
                I'm a commercial agent / broker. Does this apply to me?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                Yes. Whether residential or commercial, the fundamentals of
                business credit are the same. Commercial agents often have even
                higher business expenses and greater need for dedicated business
                funding.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative overflow-hidden bg-hero-grad py-16 md:py-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 right-1/4 w-56 h-56 rounded-full bg-accent/15 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 w-96 h-96 rounded-full bg-primary/15 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4 tracking-tight">
              Ready to Get <span className="text-primary">Your Plan</span>?
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              30 minutes. No cost. No pressure. Just a straightforward business
              conversation between two real estate professionals.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <a
                href="#book"
                data-analytics-id="cta-one-on-one-bottom"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-4 text-base font-semibold shadow-card hover:shadow-card-hover hover:bg-primary/90 transition-all"
              >
                <Calendar className="h-5 w-5" />
                Schedule My Free One-On-One Session
              </a>
              <Link
                to={`/guide${forwardParams ? `?${forwardParams}` : ""}`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-sky text-sky-foreground px-7 py-4 text-base font-semibold shadow-card hover:shadow-card-hover hover:bg-sky/90 transition-all"
              >
                <BookOpen className="h-5 w-5" />
                Read the Guide First
              </Link>
            </div>

            <p className="text-sm text-muted-foreground italic">
              Limited availability. Sessions fill up quickly.
            </p>
          </div>
        </div>
      </section>

      {/* Founder Quote */}
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg italic text-foreground/80 mb-4">
              "I remember what it felt like to discover business credit at age
              40, after 10+ years in real estate. I can't change my past. But I
              can help you avoid repeating it."
            </p>
            <p className="font-bold text-primary">
              — Jessie Hunter, Broker | California & Georgia
            </p>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
};

export default OneOnOnePage;
