import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Calendar, ClipboardList, Search, UserCheck, BookOpen, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { postFunnelEvent } from "@/lib/logFunnelEvent";
import { useContactIdentity } from "@/hooks/useContactIdentity";
import SiteHeader from "@/components/shared/SiteHeader";

const BookingConfirmedPage = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";
  const appointmentId = searchParams.get("appointment") || searchParams.get("appointmentId") || "";
  const { contactId } = useContactIdentity();

  useEffect(() => {
    void postFunnelEvent({
      eventType: "booking_confirmed",
      contactId: contactId || undefined,
      metadata: {
        email: email || undefined,
        appointment_id: appointmentId || undefined,
        has_token: !!token,
      },
    }).catch((err) => console.error("[booking_confirmed] log failed:", err));
    // fire once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const intakeLink = `/intake${email || token ? `?${email ? `email=${encodeURIComponent(email)}` : ""}${email && token ? "&" : ""}${token ? `token=${token}` : ""}` : ""}`;

  const steps = [
    {
      icon: CheckCircle,
      title: "Session Booked ✓",
      description: "Your session is confirmed — check your email for the details and calendar invite.",
    },
    {
      icon: ClipboardList,
      title: "Complete the Intake Survey",
      description: "Fill out the RE Pro Business Financial Needs Analysis so Jessie can prepare a personalized plan.",
      link: { to: intakeLink, label: "Start the Intake Survey" },
    },
    {
      icon: UserCheck,
      title: "Show Up to Your Session",
      description: "Jessie will review your intake responses and map out your next steps together on the call.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-grad py-16 md:py-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -bottom-24 -right-16 w-[28rem] h-[28rem] rounded-full bg-sky/15 blur-3xl" />
        </div>
        <div className="container max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-5">
            <CheckCircle className="w-4 h-4" />
            Session Confirmed
          </div>
          <h1 className="text-[clamp(2rem,6vw,3.25rem)] font-bold text-secondary tracking-tight leading-[1.1] text-balance mb-4">
            Your Session Is Booked — Here's What to Do Next
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Complete the steps below before your call so Jessie can prepare a personalized action plan just for you.
          </p>
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
            When you fill out the RE Pro Business Financial Needs Analysis before your call, Jessie can review your goals, business structure, and credit situation ahead of time — so your session is focused, productive, and personalized to you.
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
      <section className="py-12 bg-hero-grad">
        <div className="container max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/guide"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-sky text-sky-foreground px-6 py-3 text-sm font-semibold shadow-card hover:shadow-card-hover hover:bg-sky/90 transition-all"
          >
            <BookOpen className="w-4 h-4" />
            Read the Free Guide
          </Link>
          <Link
            to="/one-on-one"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold shadow-card hover:shadow-card-hover hover:bg-primary/90 transition-all"
          >
            Learn More About the 1:1 Session
          </Link>
        </div>
      </section>
    </div>
  );
};

export default BookingConfirmedPage;
