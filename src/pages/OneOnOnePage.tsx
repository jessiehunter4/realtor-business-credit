import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
  Users,
  Target,
  FileText,
  Sparkles,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import planMockup from "@/assets/plan-mockup.jpg";

const BOOKING_URL = import.meta.env.VITE_BOOKING_URL || "/get_started";

const OneOnOnePage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-secondary text-secondary-foreground py-16 md:py-28">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <p className="text-primary font-semibold text-sm md:text-base tracking-widest uppercase mb-4">
            Free Strategy Session
          </p>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Why a One-on-One Business Credit Session{" "}
            <span className="text-primary">Changes Everything</span>
          </h1>
          <p className="text-lg md:text-xl text-secondary-foreground/80 max-w-2xl mx-auto mb-10">
            Turn your recent closings into a real business credit strategy — not
            just another expense on your personal cards.
          </p>
          <Button
            asChild
            size="lg"
            className="text-lg px-8 py-6"
            data-analytics-id="cta-one-on-one-hero"
          >
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
              <Calendar className="mr-2 h-5 w-5" />
              Book My Free One-on-One Session
            </a>
          </Button>
        </div>
      </section>

      {/* Why 1:1 vs the Guide */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4 text-center">
            Why a 1:1 Session — Not Just the Guide
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
                text: "We interpret your Fundability Scan in the context of your state and brokerage structure.",
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
                  title: "Walk Through Your Fundability Scan",
                  desc: "We'll review your Fundability Scan results together and explain what each score means for your ability to secure business credit.",
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
                  desc: "We'll explore whether 1:1 coaching, a small Realtor cohort, or self-paced work with Credit Suite tools is the right path. No pressure — just options.",
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
              <img
                src={planMockup}
                alt="Preview of a custom Realtor Business Credit Plan document"
                className="w-full h-auto"
                loading="lazy"
              />
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
      <section className="bg-secondary py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-secondary-foreground">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get <span className="text-primary">Your Plan</span>?
            </h2>
            <p className="text-lg text-secondary-foreground/80 mb-10 max-w-2xl mx-auto">
              30 minutes. No cost. No pressure. Just a straightforward business
              conversation between two real estate professionals.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                asChild
                size="lg"
                className="text-lg px-8 py-6"
                data-analytics-id="cta-one-on-one-bottom"
              >
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
                  <Calendar className="mr-2 h-5 w-5" />
                  Schedule My Free 1:1 Session
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-primary/40 text-primary hover:bg-primary/10"
              >
                <Link to="/guide">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Read the Guide First
                </Link>
              </Button>
            </div>

            <p className="text-sm text-secondary-foreground/60 italic">
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
    </div>
  );
};

export default OneOnOnePage;
