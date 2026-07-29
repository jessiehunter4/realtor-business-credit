import { Link } from "react-router-dom";
import { ArrowRight, Calendar, CreditCard, BookOpen, CheckCircle } from "lucide-react";

interface Props {
  readiness?: string;
}

type Response = {
  headline: string;
  body: string;
  accent: string;
  cta?: { label: string; href: string; icon: typeof CreditCard; external?: boolean };
  secondary?: { label: string; href: string };
};

const RESPONSES: Record<string, Response> = {
  "I'm ready to start now": {
    headline: "Great — let's get you started.",
    body:
      "You'll head to secure Stripe checkout. Once you enroll, your coach kicks off onboarding within one business day.",
    accent: "border-primary/40 bg-primary/5",
    cta: { label: "Enroll now", href: "/checkout?tier=cohort", icon: CreditCard },
  },
  "I want to start within 30 days": {
    headline: "No problem — and no pressure.",
    body:
      "We'll help you prep so day one moves fast. Review the pricing above whenever you're ready and come back to enroll.",
    accent: "border-amber-300 bg-amber-50",
  },
  "I need more clarity first": {
    headline: "Okay — let's talk it through.",
    body:
      "Schedule a free 1-on-1 with a coach. We'll walk your situation together and help you decide what fits.",
    accent: "border-sky-300 bg-sky-50",
    cta: { label: "Book a free 1-on-1", href: "/one-on-one", icon: Calendar },
  },
  "I'm just exploring": {
    headline: "No problem — take your time.",
    body:
      "We'll keep you updated. In the meantime, the free guide is the best place to keep learning.",
    accent: "border-secondary/20 bg-secondary/[0.03]",
    secondary: { label: "Read the free guide", href: "/guide" },
  },
};

export default function IntakePricingAndReadiness({ readiness }: Props) {
  const active = readiness ? RESPONSES[readiness] : undefined;

  if (!active) return null;

  return (
    <div className={`rounded-2xl border p-5 ${active.accent}`}>
      <div className="flex items-start gap-3">
        <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-base font-bold text-secondary">{active.headline}</h4>
          <p className="text-sm text-secondary/80 mt-1 leading-relaxed">{active.body}</p>
          {(active.cta || active.secondary) && (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {active.cta && (
                active.cta.external ? (
                  <a
                    href={active.cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold shadow-card hover:bg-primary/90 transition-colors"
                  >
                    <active.cta.icon className="h-4 w-4" />
                    {active.cta.label}
                  </a>
                ) : (
                  <Link
                    to={active.cta.href}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold shadow-card hover:bg-primary/90 transition-colors"
                  >
                    <active.cta.icon className="h-4 w-4" />
                    {active.cta.label}
                  </Link>
                )
              )}
              {active.secondary && (
                <Link to={active.secondary.href} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                  <BookOpen className="h-4 w-4" />
                  {active.secondary.label}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}