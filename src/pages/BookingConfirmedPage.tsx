import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Calendar, ClipboardList, Search, UserCheck, BookOpen, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const EMBED_SCRIPT_URL = "https://link.everycatch.com/js/form_embed.js";
const IFRAME_SRC = "https://link.everycatch.com/widget/booking/Xt32XcNcmKgm7vaJaR9o";

const BookingConfirmedPage = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  const intakeLink = `/intake${email || token ? `?${email ? `email=${encodeURIComponent(email)}` : ""}${email && token ? "&" : ""}${token ? `token=${token}` : ""}` : ""}`;

  useEffect(() => {
    if (!document.querySelector(`script[src="${EMBED_SCRIPT_URL}"]`)) {
      const script = document.createElement("script");
      script.src = EMBED_SCRIPT_URL;
      script.type = "text/javascript";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  const steps = [
    {
      icon: Calendar,
      title: "Pick a Time",
      description: "Choose a convenient slot on the calendar above for your free strategy session.",
    },
    {
      icon: ClipboardList,
      title: "Complete the Intake Survey",
      description: "Fill out the Realtor Business Financial Needs Analysis so Jessie can prepare a personalized plan.",
      link: { to: intakeLink, label: "Start the Intake Survey" },
    },
    {
      icon: Search,
      title: "Take the Fundability Scan (Optional)",
      description: "Get a diagnostic snapshot of how fundable your business is today.",
      link: { to: "https://mybetterbusinesscredit.fundabilityscan.com/", label: "Take Fundability Scan", external: true },
    },
    {
      icon: UserCheck,
      title: "Show Up to Your Session",
      description: "Jessie will review your intake responses and scan results to map out your next steps.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-secondary text-secondary-foreground py-16 md:py-24">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Calendar className="w-4 h-4" />
            Free Strategy Session
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Book Your Free One-on-One Business Credit Session
          </h1>
          <p className="text-lg md:text-xl text-secondary-foreground/80 max-w-2xl mx-auto">
            A 30–45 minute strategy call with Jessie Hunter to review your business credit readiness and build a personalized action plan.
          </p>
        </div>
      </section>

      {/* Calendar Embed */}
      <section className="py-12 md:py-16">
        <div className="container max-w-4xl mx-auto px-4">
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
            {steps.map((step, i) => (
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
                    step.link.external ? (
                      <a
                        href={step.link.to}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary font-medium hover:underline text-sm"
                      >
                        {step.link.label} <ArrowRight className="w-4 h-4" />
                      </a>
                    ) : (
                      <Link
                        to={step.link.to}
                        className="inline-flex items-center gap-1 text-primary font-medium hover:underline text-sm"
                      >
                        {step.link.label} <ArrowRight className="w-4 h-4" />
                      </Link>
                    )
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

      {/* Footer CTAs */}
      <section className="py-12 bg-secondary text-secondary-foreground">
        <div className="container max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="outline" asChild className="border-primary text-primary hover:bg-primary/10">
            <Link to="/guide">
              <BookOpen className="w-4 h-4 mr-2" />
              Read the Free Guide
            </Link>
          </Button>
          <Button variant="outline" asChild className="border-primary text-primary hover:bg-primary/10">
            <Link to="/one-on-one">
              Learn More About the 1:1 Session
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default BookingConfirmedPage;
