import { Link } from "react-router-dom";
import { Check, Minus, Sparkles, ShieldCheck, HeartHandshake, Users } from "lucide-react";
import SiteHeader from "@/components/shared/SiteHeader";
import SiteFooter from "@/components/shared/SiteFooter";
import Seo from "@/components/shared/Seo";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Tier = {
  id: string;
  name: string;
  price: string;
  cadence: string;
  who: string;
  features: string[];
  highlighted?: boolean;
  ctaLabel: string;
};

const tiers: Tier[] = [
  {
    id: "self-paced",
    name: "Self-Paced Blueprint",
    price: "$497",
    cadence: "one-time",
    who: "For Realtors who want the plan and want to run with it on their own.",
    features: [
      "Custom Business, Finance & Credit Plan (PDF + portal)",
      "Guide + 7-step action checklist",
      "Free Fundability Scan",
      "Credit Suite vendor & tradeline directory access",
      "Email support",
    ],
    ctaLabel: "Book Free 1:1 Session",
  },
  {
    id: "cohort",
    name: "Realtor Credit Cohort",
    price: "$1,997",
    cadence: "90 days",
    who: "For Realtors who want structure, accountability, and a small group.",
    features: [
      "Everything in Self-Paced",
      "90-day cohort with 5–10 Realtors",
      "Weekly live coaching calls",
      "Private cohort community",
      "Credit Suite client portal + coach",
    ],
    highlighted: true,
    ctaLabel: "Book Free 1:1 Session",
  },
  {
    id: "one-on-one",
    name: "1:1 Private Coaching",
    price: "$4,997",
    cadence: "per quarter",
    who: "For Realtors and brokers who want private, high-touch guidance.",
    features: [
      "Everything in Cohort",
      "Private 1:1 coaching with Jessie",
      "Dedicated Credit Suite specialist",
      "Priority response + funding strategy sessions",
      "Quarterly plan reviews",
    ],
    ctaLabel: "Book Free 1:1 Session",
  },
];

type ComparisonRow = {
  feature: string;
  values: [boolean | string, boolean | string, boolean | string];
};

const comparison: ComparisonRow[] = [
  { feature: "Custom Business, Finance & Credit Plan", values: [true, true, true] },
  { feature: "Free Fundability Scan", values: [true, true, true] },
  { feature: "Credit Suite vendor & tradeline directory", values: [true, true, true] },
  { feature: "Guide + 7-step action checklist", values: [true, true, true] },
  { feature: "Weekly live coaching calls", values: [false, true, true] },
  { feature: "Small-group cohort community", values: [false, true, true] },
  { feature: "Credit Suite client portal + coach", values: [false, true, true] },
  { feature: "Private 1:1 coaching with Jessie", values: [false, false, true] },
  { feature: "Priority response + funding strategy", values: [false, false, true] },
  { feature: "Quarterly plan reviews", values: [false, false, true] },
];

const faqs = [
  {
    q: "Do I have to pay upfront? Is there a payment plan?",
    a: "Every path starts with a free 1:1 session where we build your custom plan. If a paid option makes sense, we'll walk through pricing and payment plan availability together — no pressure, no surprise charges.",
  },
  {
    q: "What's included in the free 1:1 session?",
    a: "A 45–60 minute working call to review your intake, your Fundability Scan, and your goals. You leave with a prioritized action plan you can implement on your own or with our help.",
  },
  {
    q: "How is this different from generic business credit programs?",
    a: "This is built specifically for residential and commercial Realtors and brokers — licensing nuances, commission cash flow, marketing spend, and the way lenders actually look at real estate income. It's not a repackaged generic course.",
  },
  {
    q: "Do you guarantee approval amounts or credit limits?",
    a: "No. Business credit outcomes depend on your entity, fundability, personal credit, income, and lender criteria. We share realistic expectations and typical timelines — never guarantees.",
  },
  {
    q: "Can I switch or upgrade plans later?",
    a: "Yes. Many Realtors start with the Self-Paced Blueprint or the Cohort and move to 1:1 later. Your custom plan carries over, so nothing is lost.",
  },
  {
    q: "What if I'm newer and haven't closed many deals yet?",
    a: "That's often the best time to start. Setting up your entity, banking, and fundability correctly early saves you from cleaning up messy personal-credit spending later.",
  },
  {
    q: "Do you provide legal or tax advice?",
    a: "No. Everything we do is educational and coaching. We strongly encourage you to consult your broker, attorney, and CPA about your specific situation.",
  },
];

const trustItems = [
  { icon: Sparkles, label: "16 years in real estate" },
  { icon: Users, label: "Hundreds of transactions closed" },
  { icon: ShieldCheck, label: "Credit Suite Certified Partner" },
  { icon: HeartHandshake, label: "Licensed in California & Georgia" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Realtor Business Credit Coaching Programs",
  itemListElement: tiers.map((t, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Product",
      name: t.name,
      description: t.who,
      brand: { "@type": "Brand", name: "Realtor Business Credit" },
      offers: {
        "@type": "Offer",
        price: t.price.replace(/[^0-9.]/g, ""),
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: "https://realtorbusinesscredit.com/pricing",
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
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-primary/5 to-white">
      <Seo
        title="Pricing — Realtor Business Credit Coaching"
        description="Transparent pricing for Realtor business credit coaching. Self-paced blueprint, 90-day cohort, and 1:1 private coaching. Every path starts with a free 1:1 session."
        path="/pricing"
        jsonLd={jsonLd}
      />
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="container mx-auto px-4 pt-14 pb-10 md:pt-20 md:pb-14 max-w-5xl text-center">
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/10 border-0">
            Coaching + Implementation
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary tracking-tight">
            Simple pricing. Real support.
            <br />
            <span className="text-primary">Money when you need it.</span>
          </h1>
          <p className="mt-5 text-lg md:text-xl text-secondary/70 max-w-2xl mx-auto leading-relaxed">
            Every path starts with a free 1:1 session. We build your custom
            plan first — then you choose the support level that fits.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/one-on-one"
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm md:text-base font-semibold text-primary-foreground shadow-card hover:bg-primary/90 transition-colors"
            >
              Book Free 1:1 Session
            </Link>
            <Link
              to="/guide"
              className="inline-flex items-center justify-center rounded-full border border-border bg-white px-6 py-3 text-sm md:text-base font-semibold text-secondary hover:bg-secondary/5 transition-colors"
            >
              Read the Free Guide
            </Link>
          </div>
        </section>

        {/* Overview */}
        <section className="container mx-auto px-4 pb-14 max-w-5xl" aria-labelledby="how-pricing-works">
          <h2 id="how-pricing-works" className="sr-only">How pricing works</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { n: "1", t: "Book a free 1:1", d: "We build your custom Business, Finance & Credit Plan together." },
              { n: "2", t: "Pick your path", d: "Self-paced, cohort, or private coaching — whichever fits your goals." },
              { n: "3", t: "Get to work", d: "Implement with real support until you have money when you need it." },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl bg-white border border-border p-6 shadow-card">
                <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                  {s.n}
                </div>
                <h3 className="mt-3 font-semibold text-secondary">{s.t}</h3>
                <p className="mt-1 text-sm text-secondary/70 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing cards */}
        <section className="container mx-auto px-4 pb-16 max-w-6xl" aria-labelledby="pricing-tiers">
          <h2 id="pricing-tiers" className="sr-only">Pricing tiers</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch">
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
                <div className="mt-5 flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-secondary">{tier.price}</span>
                  <span className="text-sm text-secondary/60">{tier.cadence}</span>
                </div>
                <ul className="mt-6 space-y-3 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-secondary/80">
                      <Check className="mt-0.5 h-4 w-4 text-primary shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/one-on-one"
                  className={
                    "mt-7 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-colors " +
                    (tier.highlighted
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-card"
                      : "border border-secondary/20 bg-white text-secondary hover:bg-secondary/5")
                  }
                >
                  {tier.ctaLabel}
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-secondary/60">
            Pricing shown in USD. Payment plans may be available — we'll cover options on your free 1:1.
          </p>
        </section>

        {/* Comparison */}
        <section className="container mx-auto px-4 pb-16 max-w-6xl" aria-labelledby="compare-plans">
          <h2 id="compare-plans" className="text-2xl md:text-3xl font-bold text-secondary text-center">
            Compare what's included
          </h2>
          <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-white shadow-card">
            <table className="w-full text-left min-w-[640px]">
              <thead>
                <tr className="border-b border-border bg-secondary/5">
                  <th scope="col" className="p-4 text-sm font-semibold text-secondary">Feature</th>
                  <th scope="col" className="p-4 text-sm font-semibold text-secondary text-center">Self-Paced</th>
                  <th scope="col" className="p-4 text-sm font-semibold text-primary text-center">Cohort</th>
                  <th scope="col" className="p-4 text-sm font-semibold text-secondary text-center">1:1 Coaching</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, idx) => (
                  <tr key={row.feature} className={idx % 2 ? "bg-secondary/5/30" : ""}>
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
              </tbody>
            </table>
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
              Not sure which plan fits?
            </h2>
            <p className="mt-3 text-lg text-primary-foreground/90 max-w-2xl mx-auto">
              Start with the free 1:1. We'll build your custom plan together, then you choose the support level that makes sense.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                to="/one-on-one"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm md:text-base font-semibold text-primary hover:bg-white/90 transition-colors"
              >
                Book Free 1:1 Session
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