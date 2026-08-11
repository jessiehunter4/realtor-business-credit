import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Check,
  Minus,
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  Users,
  Lock,
  BadgeCheck,
  Star,
  CalendarClock,
  ArrowRight,
  Loader2,
} from "lucide-react";
import SiteHeader from "@/components/shared/SiteHeader";
import SiteFooter from "@/components/shared/SiteFooter";
import Seo from "@/components/shared/Seo";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PRICING_TIERS } from "@/data/pricingTiers";
import { startCheckout, type CheckoutTierId } from "@/lib/startCheckout";
import PayLaterOptions from "@/components/pricing/PayLaterOptions";

const tiers = PRICING_TIERS;

type ComparisonRow = {
  feature: string;
  values: [boolean | string, boolean | string, boolean | string, boolean | string];
};

const comparison: ComparisonRow[] = [
  { feature: "Guide + 7-step action checklist", values: [true, true, true, true] },
  { feature: "Custom Business, Finance & Credit Plan", values: [true, true, true, true] },
  { feature: "Task checklist + progress tracking", values: [true, true, true, true] },
  { feature: "Credit Suite vendor & tradeline directory", values: [false, true, true, true] },
  { feature: "Weekly live coaching calls", values: [false, false, true, true] },
  { feature: "Small-group cohort community", values: [false, false, true, true] },
  { feature: "Credit Suite client portal + coach", values: [false, false, true, true] },
  { feature: "Private 1:1 coaching with RE Pro Coach", values: [false, false, false, true] },
  { feature: "Priority response + funding strategy", values: [false, false, false, true] },
  { feature: "Quarterly plan reviews", values: [false, false, false, true] },
];

const faqs = [
  {
    q: "Is there a free option?",
    a: "Yes. The Free tier costs nothing and gives you the full guide, your customized plan from the intake survey, and the task checklist with progress tracking in your portal. No card required.",
  },
  {
    q: "Do I have to pay upfront? Is there a payment plan?",
    a: "You can enroll directly, or start with the free guide and custom plan first. If a payment plan makes sense for the Cohort or Cohort Plus tier, we can walk through options together — no pressure, no surprise charges.",
  },
  {
    q: "What's included in the free custom plan?",
    a: "Your Needs Analysis is turned into a prioritized 90-day action plan you can implement on your own or with our help.",
  },
  {
    q: "How is this different from generic business credit programs?",
    a: "This is built specifically for residential and commercial Realtors and brokers — licensing nuances, commission cash flow, marketing spend, and the way lenders actually look at real estate income. It's not a repackaged generic course.",
  },
  {
    q: "Do you guarantee approval amounts or credit limits?",
    a: "No. Business credit outcomes depend on your entity, funding readiness, personal credit, income, and lender criteria. We share realistic expectations and typical timelines — never guarantees.",
  },
  {
    q: "Can I switch or upgrade plans later?",
    a: "Yes. Many Realtors start with DIY (Do it Yourself) or the Pro Cohort and move up to Cohort Plus later. Your custom plan carries over, so nothing is lost.",
  },
  {
    q: "What if I'm newer and haven't closed many deals yet?",
    a: "That's often the best time to start. Setting up your entity, banking, and funding readiness correctly early saves you from cleaning up messy personal-credit spending later.",
  },
  {
    q: "Do you provide legal or tax advice?",
    a: "No. Everything we do is educational and coaching. We strongly encourage you to consult your broker, attorney, and CPA about your specific situation.",
  },
  {
    q: "Is my payment secure?",
    a: "Yes. All payments are processed by Stripe over an encrypted connection. We never see or store your card details, and your receipt is delivered instantly by email.",
  },
  {
    q: "What does the 30-day guarantee cover?",
    a: "If within 30 days of enrolling you feel the program isn't the right fit, email us and we'll refund your enrollment — no hard feelings. Applies to Cohort and Cohort Plus enrollments.",
  },
];

const trustItems = [
  { icon: Sparkles, label: "16 years in real estate" },
  { icon: Users, label: "Hundreds of transactions closed" },
  { icon: ShieldCheck, label: "Credit Suite Certified Partner" },
  { icon: HeartHandshake, label: "Licensed in California & Georgia" },
];

const reassurance = [
  { icon: Lock, label: "Secure Stripe checkout" },
  { icon: BadgeCheck, label: "30-day satisfaction guarantee" },
  { icon: CalendarClock, label: "Free custom plan first" },
  { icon: ShieldCheck, label: "No hidden fees" },
];

const testimonials = [
  {
    quote:
      "Within 90 days I had a real entity, a business bank account, and my first two tradelines reporting. I stopped putting marketing on my personal card.",
    name: "Placeholder Name",
    role: "Residential Agent · CA",
    initials: "PA",
  },
  {
    quote:
      "The cohort format was the accountability I needed. Seeing other Realtors go through the same steps kept me moving every single week.",
    name: "Placeholder Name",
    role: "Broker · GA",
    initials: "PB",
  },
  {
    quote:
      "I finally have money when I need it — a business line I can tap between closings without touching my personal credit.",
    name: "Placeholder Name",
    role: "Commercial Agent · TX",
    initials: "PC",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "RE Pro Business Credit Coaching Programs",
  itemListElement: tiers.map((t, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Product",
      name: t.name,
      description: t.who,
      brand: { "@type": "Brand", name: "RE Pro Business Credit" },
      offers: {
        "@type": "Offer",
        price: t.price.replace(/[^0-9.]/g, ""),
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: t.ctaHref,
      },
    },
  })),
};

const Cell = ({ value }: { value: boolean | string }) => {
  if (value === true) {
    return <Check className="mx-auto h-5 w-5 text-primary" aria-label="Included" />;
  }
  if (value === false) {
    return <Minus className="mx-auto h-5 w-5 text-secondary/30" aria-label="Not included" />;
  }
  return <span className="text-sm text-secondary/80">{value}</span>;
};

const PricingPage = () => {
  const [loadingTier, setLoadingTier] = useState<CheckoutTierId | null>(null);
  const [errorByTier, setErrorByTier] = useState<Partial<Record<CheckoutTierId, string>>>({});

  const handleCheckout = async (tierId: CheckoutTierId) => {
    if (loadingTier) return;
    setLoadingTier(tierId);
    setErrorByTier((prev) => ({ ...prev, [tierId]: undefined }));
    const result = await startCheckout(tierId);
    if (result.ok === false) {
      setErrorByTier((prev) => ({ ...prev, [tierId]: result.message }));
    }
    setLoadingTier(null);
    if (result.ok) {
      window.setTimeout(() => setErrorByTier((prev) => ({ ...prev, [tierId]: undefined })), 1000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-primary/5 to-white">
      <Seo
        title="Pricing — RE Pro Business Credit Coaching"
        description="Transparent pricing for RE Pro Business Credit coaching. Self-paced blueprint, 90-day cohort, and private coaching — enroll directly or start with your free custom plan."
        path="/pricing"
        jsonLd={jsonLd}
      />
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="container mx-auto px-4 pt-14 pb-10 md:pt-20 md:pb-14 max-w-5xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary tracking-tight">
            Choose your path to
            <br />
            <span className="text-primary">Money when you need it.</span>
          </h1>
          <p className="mt-5 text-lg md:text-xl text-secondary/70 max-w-2xl mx-auto leading-relaxed">
            Four ways to build separate business credit for your real estate
            business — including a free option. Enroll directly below, or start
            with your free guide and custom plan first.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/guide"
              className="inline-flex items-center justify-center rounded-full border border-border bg-white px-6 py-3 text-sm md:text-base font-semibold text-secondary hover:bg-secondary/5 transition-colors"
            >
              Read the Free Guide
            </Link>
            <Link
              to="/sample-plan"
              className="inline-flex items-center justify-center rounded-full border border-border bg-white px-6 py-3 text-sm md:text-base font-semibold text-secondary hover:bg-secondary/5 transition-colors"
            >
              See a Sample Plan
            </Link>
          </div>
        </section>

        {/* Pricing cards */}
        <section className="container mx-auto px-4 pb-10 max-w-6xl" aria-labelledby="pricing-tiers">
          <h2 id="pricing-tiers" className="sr-only">Pricing tiers</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 items-stretch">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={
                  "relative flex flex-col rounded-2xl bg-white border p-6 md:p-8 shadow-card transition-transform " +
                  (tier.highlighted
                    ? "border-primary ring-2 ring-primary/30 lg:-translate-y-2"
                    : "border-border")
                }
              >
                {tier.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-card">
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl font-bold text-secondary">{tier.name}</h3>
                <p className="mt-2 text-sm text-secondary/70 min-h-[3rem]">{tier.who}</p>
                <div className="mt-5 flex items-baseline gap-2 flex-wrap">
                  <span className="text-4xl font-bold text-secondary">{tier.price}</span>
                  {tier.originalPrice && (
                    <span className="text-lg text-secondary/40 line-through">{tier.originalPrice}</span>
                  )}
                  <span className="text-sm text-secondary/60">{tier.cadence}</span>
                </div>
                {tier.cadenceNote && (
                  <p className="mt-1 text-xs text-secondary/55">{tier.cadenceNote}</p>
                )}
                <ul className="mt-6 space-y-3 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-secondary/80">
                      <Check className="mt-0.5 h-4 w-4 text-primary shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                  {tier.notIncluded?.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-secondary/45">
                      <Minus className="mt-0.5 h-4 w-4 shrink-0" aria-label="Not included" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                {tier.isFree ? (
                  <Link
                    to={tier.ctaHref}
                    className="mt-7 inline-flex items-center justify-center gap-2 rounded-full border border-secondary/20 bg-white px-5 py-3 text-sm font-semibold text-secondary hover:bg-secondary/5 transition-colors"
                  >
                    {tier.ctaLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleCheckout(tier.id as CheckoutTierId)}
                    disabled={loadingTier !== null}
                    className={
                      "mt-7 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-colors " +
                      (tier.highlighted
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-card"
                        : "border border-secondary/20 bg-white text-secondary hover:bg-secondary/5") +
                      " disabled:opacity-60 disabled:cursor-not-allowed"
                    }
                  >
                    {loadingTier === tier.id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Redirecting to Stripe…
                      </>
                    ) : (
                      <>
                        {tier.ctaLabel}
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                )}
                {!tier.isFree && errorByTier[tier.id as CheckoutTierId] && (
                  <p
                    role="alert"
                    className="mt-2 text-center text-xs font-medium text-destructive"
                  >
                    {errorByTier[tier.id as CheckoutTierId]}
                  </p>
                )}
              </div>
            ))}
          </div>
          <PayLaterOptions />
          <p className="mt-4 text-center text-xs text-secondary/60">
            Pricing shown in USD.
          </p>
        </section>

        {/* Reassurance strip */}
        <section className="container mx-auto px-4 pb-16 max-w-5xl" aria-labelledby="reassurance">
          <h2 id="reassurance" className="sr-only">Buying with confidence</h2>
          <div className="rounded-2xl bg-white border border-border shadow-card p-5 md:p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {reassurance.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-secondary/85 leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section className="container mx-auto px-4 pb-16 max-w-6xl" aria-labelledby="compare-plans">
          <h2 id="compare-plans" className="text-2xl md:text-3xl font-bold text-secondary text-center">
            Compare what's included
          </h2>
          <p className="mt-3 text-center text-sm text-secondary/65 max-w-xl mx-auto">
            Every plan builds on the one before it. Pick the level of support that fits how you like to work.
          </p>
          <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-white shadow-card">
            <table className="w-full text-left min-w-[640px]">
              <thead>
                <tr className="border-b border-border bg-secondary/5">
                  <th scope="col" className="p-4 text-sm font-semibold text-secondary">Feature</th>
                  <th scope="col" className="p-4 text-sm font-semibold text-secondary text-center">Free</th>
                  <th scope="col" className="p-4 text-sm font-semibold text-secondary text-center">Self-Paced</th>
                  <th scope="col" className="p-4 text-sm font-semibold text-primary text-center">Cohort</th>
                  <th scope="col" className="p-4 text-sm font-semibold text-secondary text-center">Cohort Plus</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, idx) => (
                  <tr key={row.feature} className={idx % 2 ? "bg-secondary/[0.03]" : ""}>
                    <th scope="row" className="p-4 text-sm font-medium text-secondary/90 border-t border-border">
                      {row.feature}
                    </th>
                    {row.values.map((v, i) => (
                      <td key={i} className="p-4 text-center border-t border-border">
                        <Cell value={v} />
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <th scope="row" className="p-4 text-sm font-medium text-secondary/90 border-t border-border">
                    &nbsp;
                  </th>
                  {(
                    [
                      { id: "free" as const, label: "Read the Guide" },
                      { id: "self-paced" as const, label: "Get Started" },
                      { id: "cohort" as const, label: "Enroll" },
                      { id: "one-on-one" as const, label: "Enroll to Cohort Plus" },
                    ]
                  ).map(({ id, label }) => (
                    <td key={id} className="p-4 text-center border-t border-border align-top">
                      {id === "free" ? (
                        <Link
                          to="/guide"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                        >
                          {label} →
                        </Link>
                      ) : (
                      <button
                        type="button"
                        onClick={() => handleCheckout(id)}
                        disabled={loadingTier !== null}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline disabled:opacity-60 disabled:no-underline disabled:cursor-not-allowed"
                      >
                        {loadingTier === id ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Redirecting…
                          </>
                        ) : (
                          <>{label} →</>
                        )}
                      </button>
                      )}
                      {id !== "free" && errorByTier[id] && (
                        <p role="alert" className="mt-1 text-[11px] text-destructive">
                          {errorByTier[id]}
                        </p>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Testimonials */}
        <section className="container mx-auto px-4 pb-16 max-w-6xl" aria-labelledby="testimonials">
          <h2 id="testimonials" className="text-2xl md:text-3xl font-bold text-secondary text-center">
            What Realtors are saying
          </h2>
          <p className="mt-3 text-center text-sm text-secondary/65">
            Sample quotes shown while we collect launch cohort testimonials.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <figure key={i} className="rounded-2xl bg-white border border-border p-6 shadow-card flex flex-col">
                <div className="flex items-center gap-1 text-primary" aria-label="5 star rating">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 text-sm text-secondary/85 leading-relaxed flex-1">
                  "{t.quote}"
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-secondary">{t.name}</div>
                    <div className="text-xs text-secondary/60">{t.role}</div>
                  </div>
                </figcaption>
                <p className="mt-3 text-[10px] uppercase tracking-wide text-secondary/40">
                  Sample testimonial — replace with real client quote
                </p>
              </figure>
            ))}
          </div>
        </section>

        {/* Guarantee */}
        <section className="container mx-auto px-4 pb-16 max-w-5xl" aria-labelledby="guarantee">
          <div className="rounded-3xl border-2 border-primary/25 bg-primary/5 p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-card">
              <BadgeCheck className="h-8 w-8" />
            </div>
            <div>
              <h2 id="guarantee" className="text-2xl md:text-3xl font-bold text-secondary">
                30-Day Satisfaction Guarantee
              </h2>
              <p className="mt-2 text-secondary/75 leading-relaxed">
                If within 30 days of enrolling you feel the program isn't the
                right fit for your real estate business, email us and we'll
                refund your enrollment — no hard feelings. Applies to Cohort
                and Cohort Plus enrollments.
              </p>
            </div>
          </div>
        </section>

        {/* Trust strip */}
        <section className="container mx-auto px-4 pb-16 max-w-5xl">
          <div className="rounded-2xl bg-secondary text-secondary-foreground p-6 md:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {trustItems.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <Icon className="h-6 w-6 text-primary shrink-0" />
                  <span className="text-sm font-medium leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="container mx-auto px-4 pb-16 max-w-3xl" aria-labelledby="pricing-faq">
          <h2 id="pricing-faq" className="text-2xl md:text-3xl font-bold text-secondary text-center">
            Pricing questions, answered
          </h2>
          <Accordion type="single" collapsible className="mt-8">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-border">
                <AccordionTrigger className="text-left text-base font-semibold text-secondary hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-secondary/75 leading-relaxed">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Final CTA */}
        <section className="container mx-auto px-4 pb-20 max-w-4xl">
          <div className="rounded-3xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-8 md:p-12 text-center shadow-card">
            <h2 className="text-3xl md:text-4xl font-bold">
              Still have questions before you buy?
            </h2>
            <p className="mt-3 text-lg text-primary-foreground/90 max-w-2xl mx-auto">
              Build your custom plan first — it's free. Then decide which enrollment path fits, with zero pressure.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                to="/intake"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm md:text-base font-semibold text-primary hover:bg-white/90 transition-colors"
              >
                Build My Custom Plan
              </Link>
              <Link
                to="/guide"
                className="inline-flex items-center justify-center rounded-full border border-white/40 bg-transparent px-6 py-3 text-sm md:text-base font-semibold text-primary-foreground hover:bg-white/10 transition-colors"
              >
                Read the Free Guide
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
};

export default PricingPage;