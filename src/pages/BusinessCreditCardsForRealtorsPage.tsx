import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  AlertTriangle,
  Building2,
  Plane,
  Wrench,
  Wallet,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { postFunnelEvent } from "@/lib/logFunnelEvent";
import { useContactIdentity } from "@/hooks/useContactIdentity";
import Seo from "@/components/shared/Seo";
import SiteFooter from "@/components/shared/SiteFooter";

const cardCategories = [
  {
    icon: Wallet,
    name: "Cash-back business cards",
    bestFor:
      "Realtors with steady marketing spend (Zillow, FB ads, photography) who want a flat 1.5–2% return on every dollar.",
    watchOuts:
      "Most still require a personal guarantee in year 1. Look for cards that report only to business bureaus, not your personal credit, so high utilization between closings doesn't drag your FICO.",
  },
  {
    icon: Plane,
    name: "Travel & points business cards",
    bestFor:
      "Agents who travel for showings, conferences (NAR, Inman, broker conventions), or relocation business. Sign-up bonuses can offset a year of conference travel.",
    watchOuts:
      "Annual fees ($95–$695) only pay off if you actually use the perks. Don't chase points if you can't pay the balance in full each month.",
  },
  {
    icon: Building2,
    name: "Office supply / category bonus cards",
    bestFor:
      "Brokers and team leads with recurring spend on signs, lockboxes, printers, software subscriptions, and office supplies.",
    watchOuts:
      "Bonus categories rotate. Read the fine print — \"office supply stores\" usually doesn't include big-box retailers or online marketplaces.",
  },
  {
    icon: Wrench,
    name: "EIN-only / no personal guarantee cards",
    bestFor:
      "Established businesses with strong fundability (D-U-N-S, business bank account, 6+ months of business credit history, vendor tradelines reporting).",
    watchOuts:
      "Limits are usually lower at first. Most Realtors don't qualify until after they've intentionally built business credit — which is the whole point of the 7-step plan in the guide.",
  },
  {
    icon: ShieldCheck,
    name: "Charge cards (pay in full each month)",
    bestFor:
      "Agents who want higher purchasing power without a fixed credit limit, and who close consistently enough to pay balances in full.",
    watchOuts:
      "Missing a payment cycle hurts a lot more than on a revolving card. Not a fit if commission timing is unpredictable.",
  },
];

const faqs = [
  {
    q: "Do I need an LLC or S-corp to get a business credit card as a Realtor?",
    a: "No. Most issuers will let a sole proprietor apply with their SSN and an EIN. But applying without proper business structure means the card almost always reports to your personal credit and requires a full personal guarantee — defeating most of the upside. We walk through the order of operations in the free guide.",
  },
  {
    q: "Will applying for a business credit card hurt my personal credit?",
    a: "The application itself usually triggers a hard inquiry on your personal credit. After that, whether the ongoing balance reports to your personal credit depends on the issuer. Some report only to business bureaus, some report only when you're delinquent, and some report everything. We cover this issuer-by-issuer in the one-on-one session.",
  },
  {
    q: "How many business credit cards should a Realtor have?",
    a: "Start with one well-chosen card and pay it perfectly for 6 months. Adding a second card too early can stall your business credit progression. The plan we build with you sequences this around your closings.",
  },
  {
    q: "What's the difference between a business credit card and 'business credit'?",
    a: "A business credit card is one product. 'Business credit' is a separate credit profile (D-U-N-S, Experian Business, Equifax Small Business) tied to your EIN, built through vendor tradelines and on-time payments. The card is a downstream benefit of having real business credit.",
  },
];

const BusinessCreditCardsForRealtorsPage = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Business Credit Cards for Realtors: 2026 Buyer's Guide"
        description="A Realtor-specific look at the categories of business credit cards that actually fit real estate agents and brokers — and what to set up first so you qualify."
        path="/business-credit-cards-for-realtors"
        jsonLd={jsonLd}
      />

      {/* Hero */}
      <section className="bg-secondary text-secondary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="text-primary text-sm md:text-base font-semibold uppercase tracking-wider mb-3">
            Educational round-up · Updated 2026
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-5">
            Business Credit Cards for Realtors:
            <span className="block text-primary mt-2">A Plain-English Buyer&apos;s Guide</span>
          </h1>
          <p className="text-lg md:text-xl text-secondary-foreground/85 leading-relaxed">
            Most articles on this topic are written for "small businesses" in general.
            This one is written for residential and commercial real estate agents
            and brokers — the categories of cards that actually fit, and the
            order to set them up so you qualify for higher limits later.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/guide">
                Read the free 7-step guide <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
              <Link to="/one-on-one">Book a free One-on-One</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* TL;DR */}
      <section className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6 space-y-3">
            <h2 className="text-xl md:text-2xl font-bold text-secondary">
              The 60-second version
            </h2>
            <ul className="space-y-2 text-base">
              <li className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>The "best card" depends on your spend pattern (marketing, travel, office) and how predictable your commission timing is.</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>If you apply before you have a real business profile (EIN, bank account, vendor tradelines), you'll be approved on personal credit only — which is the trap most Realtors fall into.</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>The cards that <em>don't</em> report to your personal credit are the most valuable, and the hardest to qualify for. Building toward them is what the 7-step plan is for.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-8 text-center">
          5 categories of business cards Realtors actually use
        </h2>
        <div className="grid md:grid-cols-2 gap-5">
          {cardCategories.map(({ icon: Icon, name, bestFor, watchOuts }) => (
            <Card key={name} className="border-border">
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-secondary">{name}</h3>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">Best for</p>
                  <p className="text-sm text-foreground/85 leading-relaxed">{bestFor}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Watch-outs
                  </p>
                  <p className="text-sm text-foreground/75 leading-relaxed">{watchOuts}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-xs text-muted-foreground italic mt-6 text-center max-w-2xl mx-auto">
          We intentionally don&apos;t list specific card names or affiliate links here.
          Card terms change quarterly, and the right answer depends on your structure.
          Book a one-on-one if you want a recommendation for your situation.
        </p>
      </section>

      {/* The order matters */}
      <section className="bg-muted/30 py-14 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-4">
            Why the order you do this in matters more than the card
          </h2>
          <p className="text-base md:text-lg text-foreground/80 leading-relaxed mb-4">
            The single biggest mistake we see Realtors make is applying for a
            business card the same week they form an LLC. The result is almost
            always: approved on personal credit, full personal guarantee, no
            business credit benefit, and a hard inquiry on the personal report.
          </p>
          <p className="text-base md:text-lg text-foreground/80 leading-relaxed mb-6">
            The free guide walks through a 7-step setup — entity, EIN, business
            address, business phone, business bank account, D-U-N-S, vendor
            tradelines — that takes 60–120 days but unlocks dramatically better
            cards afterward.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/guide">Get the 7-step guide (free)</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/one-on-one">Book a One-on-One review</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="container mx-auto px-4 py-14 md:py-20 max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-8 text-center">
          Frequently asked questions
        </h2>
        <div className="space-y-5">
          {faqs.map((f) => (
            <div key={f.q} className="border-l-2 border-primary pl-4">
              <h3 className="text-lg font-semibold text-secondary mb-1">{f.q}</h3>
              <p className="text-base text-foreground/80 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default BusinessCreditCardsForRealtorsPage;