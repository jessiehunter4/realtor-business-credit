import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  AlertTriangle,
  Building2,
  Plane,
  Wrench,
  Wallet,
  ShieldCheck,
  BookOpen,
  Calendar,
  Sparkles,
  ArrowRight,
  Mail,
  Loader2,
  Clock,
  ShieldAlert,
  Layers,
  Users,
  GraduationCap,
  PhoneCall,
} from "lucide-react";
import { postFunnelEvent } from "@/lib/logFunnelEvent";
import { useContactIdentity } from "@/hooks/useContactIdentity";
import { supabase } from "@/integrations/supabase/client";
import Seo from "@/components/shared/Seo";
import SiteFooter from "@/components/shared/SiteFooter";
import SiteHeader from "@/components/shared/SiteHeader";
import FinalCTABright from "@/components/landing/FinalCTABright";
import HeroVideo from "@/components/shared/HeroVideo";
import PartnerCTA from "@/components/card-guide/PartnerCTA";
import { AFFILIATE_DISCLOSURE_SHORT, FULL_DISCLOSURES, RESULTS_STATEMENT } from "@/config/partner";

const SHOW_CHECKLIST_CTA = false;

const cardCategories = [
  {
    icon: Wallet,
    tone: "bg-primary/10 text-primary",
    name: "Cash-back business cards",
    filterLabel: "Cash-Back",
    bestFor:
      "Realtors with steady marketing spend (Zillow, FB ads, photography) who want a flat 1.5–2% return on every dollar.",
    watchOuts:
      "Most still require a personal guarantee in year 1. Look for cards that report only to business bureaus, not your personal credit, so high utilization between closings doesn't drag your FICO.",
  },
  {
    icon: Plane,
    tone: "bg-sky/15 text-sky",
    name: "Travel & points business cards",
    filterLabel: "Travel & Points",
    bestFor:
      "Agents who travel for showings, conferences (NAR, Inman, broker conventions), or relocation business. Sign-up bonuses can offset a year of conference travel.",
    watchOuts:
      "Annual fees ($95–$695) only pay off if you actually use the perks. Don't chase points if you can't pay the balance in full each month.",
  },
  {
    icon: Building2,
    tone: "bg-accent/20 text-accent-foreground",
    name: "Office supply / category bonus cards",
    filterLabel: "Office Supply",
    bestFor:
      "Brokers and team leads with recurring spend on signs, lockboxes, printers, software subscriptions, and office supplies.",
    watchOuts:
      "Bonus categories rotate. Read the fine print — \"office supply stores\" usually doesn't include big-box retailers or online marketplaces.",
  },
  {
    icon: Wrench,
    tone: "bg-primary/10 text-primary",
    name: "EIN-only / no personal guarantee cards",
    filterLabel: "No PG",
    bestFor:
      "Established businesses with strong fundability (D-U-N-S, business bank account, 6+ months of business credit history, vendor tradelines reporting).",
    watchOuts:
      "Limits are usually lower at first. Most Realtors don't qualify until after they've intentionally built business credit — which is the whole point of the 7-step plan in the guide.",
  },
  {
    icon: ShieldCheck,
    tone: "bg-sky/15 text-sky",
    name: "Charge cards (pay in full each month)",
    filterLabel: "Charge Cards",
    bestFor:
      "Agents who want higher purchasing power without a fixed credit limit, and who close consistently enough to pay balances in full.",
    watchOuts:
      "Missing a payment cycle hurts a lot more than on a revolving card. Not a fit if commission timing is unpredictable.",
  },
];

const filterTabs = [
  { label: "All", value: "All" },
  ...cardCategories.map((c) => ({ label: c.filterLabel, value: c.filterLabel })),
];


const faqs = [
  {
    q: "Do I need an LLC or S-corp to get a business credit card as a Realtor?",
    a: "No. Most issuers will let a sole proprietor apply with their SSN and an EIN. But applying without proper business structure means the card almost always reports to your personal credit and requires a full personal guarantee — defeating most of the upside. We walk through the order of operations in the free guide.",
  },
  {
    q: "Will applying for a business credit card hurt my personal credit?",
    a: "The application itself usually triggers a hard inquiry on your personal credit. After that, whether the ongoing balance reports to your personal credit depends on the issuer. Some report only to business bureaus, some report only when you're delinquent, and some report everything. We cover this issuer-by-issuer in the free guide.",
  },
  {
    q: "How many business credit cards should a Realtor have?",
    a: "Start with one well-chosen card and pay it perfectly for 6 months. Adding a second card too early can stall your business credit progression. The plan we build with you sequences this around your closings.",
  },
  {
    q: "What's the difference between a business credit card and 'business credit'?",
    a: "A business credit card is one product. 'Business credit' is a separate credit profile (D-U-N-S, Experian Business, Equifax Small Business) tied to your EIN, built through vendor tradelines and on-time payments. The card is a downstream benefit of having real business credit.",
  },
  {
    q: "What is credit card stacking?",
    a: "It is applying for several business credit cards in a planned sequence so the approved limits together give your business meaningful spending capacity that can be used much like a line of credit. It is not a loan, not a line of credit product, and not credit repair. Every credit decision is made by third-party issuers.",
  },
  {
    q: "Will I have to sign a personal guarantee?",
    a: "Almost always, early on. Most business credit cards available to a newer business require a personal guarantee and involve a credit inquiry. As the business builds revenue, banking history, and its own credit profile, some products reduce or remove that requirement.",
  },
  {
    q: "How much can I expect to be approved for?",
    a: "There is no promised amount. Well-qualified clients may access up to $300,000 in business credit across multiple rounds, but results vary and depend on your credit profile, business details, and issuer decisions.",
  },
  {
    q: "What happens on a bank verification call?",
    a: "An issuer may call to verify what the business does, how long it has operated, where it is located, and how to reach it. Consistent answers and a professionally answered business phone matter. Coaching through these calls is one of the most valuable parts of a good support program.",
  },
];

const BusinessCreditCardsForRealtorsPage = () => {
  const { contactId } = useContactIdentity();
  const logged = useRef(false);

  const [selectedFilter, setSelectedFilter] = useState("All");

  const filteredCategories =
    selectedFilter === "All"
      ? cardCategories
      : cardCategories.filter((c) => c.filterLabel === selectedFilter);

  const [checklistEmail, setChecklistEmail] = useState("");
  const [checklistStatus, setChecklistStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [checklistMessage, setChecklistMessage] = useState("");

  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const sections = ["sneak-peek", "tldr", "categories", "order-matters", "how-it-works", "red-flags", "faqs"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const jumpLinks = [
    { id: "sneak-peek", label: "What's inside" },
    { id: "tldr", label: "The 60-second version" },
    { id: "categories", label: "5 categories" },
    { id: "order-matters", label: "Why order matters" },
    { id: "how-it-works", label: "How the program works" },
    { id: "red-flags", label: "Red flags" },
    { id: "faqs", label: "FAQs" },
  ];

  const handleJump = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(id);
    }
  };

  useEffect(() => {
    if (logged.current) return;
    logged.current = true;

    void postFunnelEvent({
      contactId: contactId || undefined,
      eventType: "comparison_page_view",
    }).catch((e) => console.error("[Comparison] Failed to log comparison_page_view:", e));
  }, [contactId]);

  const handleChecklistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checklistEmail || !/^\S+@\S+\.\S+$/.test(checklistEmail)) {
      setChecklistStatus("error");
      setChecklistMessage("Please enter a valid email address.");
      return;
    }
    setChecklistStatus("loading");
    try {
      const { data, error } = await supabase.functions.invoke("submit-checklist-email", {
        body: {
          email: checklistEmail,
          source: "business-credit-cards-checklist",
          pagePath: window.location.pathname,
          ghlContactId: contactId || undefined,
        },
      });
      if (error) throw error;
      setChecklistStatus("success");
      setChecklistMessage((data?.message as string) || "Checklist coming to your inbox!");
      void postFunnelEvent({
        contactId: contactId || undefined,
        eventType: "checklist_email_submitted",
        metadata: { page: "business-credit-cards-for-realtors" },
      }).catch((err) => console.error("[Comparison] Failed to log checklist_email_submitted:", err));
    } catch (err) {
      setChecklistStatus("error");
      setChecklistMessage(
        err instanceof Error ? err.message : "We could not process your request. Please try again."
      );
    }
  };

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
      <SiteHeader />
      <Seo
        title="Business Credit Cards for Realtors: 2026 Buyer's Guide"
        description="A Realtor-specific look at the categories of business credit cards that actually fit real estate agents and brokers — and what to set up first so you qualify."
        path="/business-credit-cards-for-realtors"
        jsonLd={jsonLd}
      />

      {/* Floating jump-link sidebar (desktop only) */}
      <nav
        className="hidden xl:block fixed top-28 right-6 z-40 w-56"
        aria-label="Page sections"
      >
        <div className="bg-card/90 backdrop-blur-sm border border-border rounded-2xl shadow-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Jump to
          </p>
          <ul className="space-y-2">
            {jumpLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => handleJump(link.id)}
                    className={`w-full text-left text-sm font-medium transition-colors px-2 py-1.5 rounded-lg ${
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-secondary hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    {link.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-grad">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -bottom-32 -right-16 w-[28rem] h-[28rem] rounded-full bg-sky/15 blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-56 h-56 rounded-full bg-accent/15 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl relative z-10">
          <p className="text-primary text-sm md:text-base font-semibold uppercase tracking-wider mb-3">
            Free guide · Updated 2026
          </p>
          <h1 className="text-[clamp(2rem,6vw,3.5rem)] font-bold text-secondary leading-[1.1] tracking-tight text-balance mb-5">
            Business Credit Cards for Real Estate Pros:
            <span className="block text-primary mt-2">the How &amp; Why of Credit Card Stacking</span>
          </h1>
          <div className="mt-6 mx-auto w-full max-w-[720px]">
            <div className="relative aspect-video w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-card-hover border border-border bg-secondary">
              <HeroVideo
                storagePath="public/card-guide-jessie.mp4"
                captionsPath="public/card-guide-jessie.vtt"
                alt="Jessie Hunter explains business credit card stacking for real estate professionals"
                className="rounded-2xl sm:rounded-3xl"
              />
            </div>
          </div>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty max-w-3xl mx-auto text-center">
            Written for residential and commercial agents, brokers, and investors — how a planned sequence of
            business credit cards can give your business working capital, what it really costs, and the structure
            you need in place first.
          </p>
          <div className="mt-8 flex flex-col items-center gap-2">
            <Link
              to="/card-guide"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-sky text-sky-foreground px-7 py-4 text-base font-semibold shadow-card hover:shadow-card-hover hover:bg-sky/90 transition-all"
            >
              <BookOpen className="h-5 w-5" />
              Read the Free Card Guide
            </Link>
            <div className="flex items-center justify-center gap-2 text-sm font-medium text-secondary/80">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-1.5">
                <Clock className="h-3.5 w-3.5" />
                Updated for 2026
              </span>
              <span className="text-secondary/50">•</span>
              <span>5-Min Read</span>
            </div>
          </div>
          <p className="mt-6 mx-auto max-w-2xl rounded-xl border border-border bg-card/80 px-4 py-3 text-xs text-foreground/75 leading-relaxed text-center">
            {AFFILIATE_DISCLOSURE_SHORT}
          </p>
        </div>
      </section>

      {/* Sneak peek at what's inside */}
      <section id="sneak-peek" className="container mx-auto px-4 py-12 md:py-16 max-w-5xl scroll-mt-28">
        <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-3 text-center tracking-tight">
          A sneak peek at what&apos;s coming your way
        </h2>
        <p className="text-base md:text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-8">
          The card guide is free, plain-English, and written for how real estate income actually works.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            {
              icon: Layers,
              title: "How the strategy actually works",
              body: "What credit card stacking is, why sequence and spacing drive outcomes, and how rounds are paced over months rather than days.",
            },
            {
              icon: AlertTriangle,
              title: "The pitfalls that trigger denials",
              body: "Inconsistent business details, applying for everything at once, and being unreachable when an issuer calls to verify your business.",
            },
            {
              icon: Wallet,
              title: "Paying for things that don't take cards",
              body: "How third-party balance transfer and bill-pay services work for contractors and vendors — and the fees you need to price in first.",
            },
            {
              icon: ShieldCheck,
              title: "What you get for free",
              body: "The full card guide, the main structure and credit guide, your customized plan, and a private dashboard — no credit card required.",
            },
          ].map(({ icon: Icon, title, body }) => (
            <Card key={title} className="border-border rounded-2xl shadow-card bg-card">
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-secondary">{title}</h3>
                </div>
                <p className="text-sm text-foreground/85 leading-relaxed">{body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 flex flex-col items-center gap-3">
          <Link
            to="/card-guide"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-sky text-sky-foreground px-7 py-4 text-base font-semibold shadow-card hover:shadow-card-hover hover:bg-sky/90 transition-all"
          >
            <BookOpen className="h-5 w-5" />
            Read the Free Card Guide
          </Link>
          <p className="text-xs text-muted-foreground italic">{RESULTS_STATEMENT}</p>
        </div>
      </section>

      {/* Who this is for */}
      <section className="container mx-auto px-4 py-8 md:py-10 max-w-5xl">
        <div className="rounded-3xl border border-border bg-card shadow-card px-6 py-8 md:py-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-secondary tracking-tight">Who this is for</h2>
          </div>
          <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
            {[
              "Residential Realtors carrying marketing and overhead between closings",
              "Commercial agents with long deal cycles and lumpy income",
              "Brokers and team leads covering payroll, office, and lead spend",
              "Investors funding rehabs, materials, and carrying costs",
              "Transaction coordinators, property managers, and other real estate professionals",
              "Anyone tired of putting business expenses on personal cards",
            ].map((item) => (
              <li key={item} className="flex gap-2 py-1 text-base text-foreground/85">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* TL;DR */}
      <section id="tldr" className="container mx-auto px-4 py-12 md:py-16 max-w-4xl scroll-mt-28">
        <Card className="border-border rounded-2xl shadow-card bg-card">
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
      <section id="categories" className="container mx-auto px-4 py-8 md:py-12 max-w-5xl scroll-mt-28">
        <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-6 text-center">
          5 categories of business cards Realtors actually use
        </h2>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {filterTabs.map((tab) => {
            const isActive = tab.value === selectedFilter;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setSelectedFilter(tab.value)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                    : "bg-card text-secondary border-border hover:border-primary/50 hover:bg-primary/5"
                }`}
                aria-pressed={isActive}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredCategories.map(({ icon: Icon, tone, name, bestFor, watchOuts }, idx) => {
            const isLastAlone =
              idx === filteredCategories.length - 1 && filteredCategories.length % 2 === 1;
            return (
              <Card
                key={name}
                className={`border-border rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 bg-card ${
                  isLastAlone ? "md:col-span-2 md:justify-self-center md:max-w-2xl" : ""
                }`}
              >
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tone}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-secondary">{name}</h3>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">Best for</p>
                    <p className="text-sm text-foreground/85 leading-relaxed">{bestFor}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-accent-foreground mb-1 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Watch-outs
                    </p>
                    <p className="text-sm text-foreground/75 leading-relaxed">{watchOuts}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground italic mt-6 text-center max-w-2xl mx-auto">
          We intentionally don&apos;t list specific card names or affiliate links here.
          Card terms change quarterly, and the right answer depends on your structure.
          The free guide walks through how to choose for your situation.
        </p>
      </section>

      {/* The order matters */}
      <section id="order-matters" className="container mx-auto px-4 py-14 md:py-20 max-w-5xl scroll-mt-28">
        <div className="relative overflow-hidden bg-hero-grad border border-border rounded-3xl shadow-card px-6 py-12 md:py-16">
          <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-sky/15 blur-3xl pointer-events-none" />
          <div className="relative max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-4 tracking-tight">
            Why the order you do this in matters more than the card
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-4">
            The single biggest mistake we see Realtors make is applying for a
            business card the same week they form an LLC. The result is almost
            always: approved on personal credit, full personal guarantee, no
            business credit benefit, and a hard inquiry on the personal report.
          </p>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6">
            The free guide walks through a 7-step setup — entity, EIN, business
            address, business phone, business bank account, D-U-N-S, vendor
            tradelines — that takes 60–120 days but unlocks dramatically better
            cards afterward.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/guide"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-sky text-sky-foreground px-7 py-4 text-base font-semibold shadow-card hover:shadow-card-hover hover:bg-sky/90 transition-all"
            >
              <BookOpen className="h-5 w-5" />
              Get the 7-step guide (free)
            </Link>
          </div>
          </div>
        </div>
      </section>

      {/* Dedicated callout banner */}
      <section className="container mx-auto px-4 py-6 md:py-8 max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-card px-6 py-8 md:py-10">
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-accent/15 blur-3xl pointer-events-none" />
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-5 md:gap-6">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-bold text-secondary mb-2 tracking-tight">
                Want the right card for your specific situation?
              </h3>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                The best card is the one you qualify for after your business
                structure is set up correctly. Our free Needs Analysis builds a
                90-day action plan that puts you in position for higher limits,
                better terms, and less reliance on your personal credit.
              </p>
            </div>
            <Link
              to="/one-on-one"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-sky text-sky-foreground px-6 py-3.5 text-base font-semibold shadow-card hover:shadow-card-hover hover:bg-sky/90 transition-all whitespace-nowrap"
            >
              <Calendar className="h-5 w-5" />
              Book Free Needs Analysis
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How the funding partner program works */}
      <section id="how-it-works" className="container mx-auto px-4 py-12 md:py-16 max-w-5xl scroll-mt-28">
        <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-3 text-center tracking-tight">
          If you want help implementing it
        </h2>
        <p className="text-base md:text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-8">
          We work with a funding partner that runs a 12-month coaching and support program for business credit card
          strategy. Here is what that program covers.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            {
              icon: Building2,
              title: "Entity and business setup support",
              body: "Getting the business details right — entity, EIN, address, phone, and industry code — so applications are consistent and verifiable.",
            },
            {
              icon: Layers,
              title: "Strategic application sequencing",
              body: "A planned order and pacing for applications across multiple rounds instead of a scattershot afternoon of submissions.",
            },
            {
              icon: GraduationCap,
              title: "Business credit profile building",
              body: "Establishing and strengthening your profile with the business credit bureaus over time.",
            },
            {
              icon: PhoneCall,
              title: "Coaching through bank approvals",
              body: "Hand-holding through the bank approval process, including the verification calls that decide real approvals.",
            },
          ].map(({ icon: Icon, title, body }) => (
            <Card key={title} className="border-border rounded-2xl shadow-card bg-card">
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-sky/15 text-sky flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-secondary">{title}</h3>
                </div>
                <p className="text-sm text-foreground/85 leading-relaxed">{body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <PartnerCTA className="mt-8" />
      </section>

      {/* Red flags */}
      <section id="red-flags" className="container mx-auto px-4 py-12 md:py-16 max-w-4xl scroll-mt-28">
        <div className="rounded-3xl border border-border bg-card shadow-card px-6 py-8 md:py-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-secondary tracking-tight">
              How to spot a bad stacking company
            </h2>
          </div>
          <ul className="space-y-2.5">
            {[
              "Promises of guaranteed approval, guaranteed funding amounts, or guaranteed timelines",
              "Claims of special or insider relationships with banks",
              "Any suggestion of no credit check, or that this will not affect your personal credit at all",
              "Encouraging you to misstate revenue, time in business, or the purpose of the funds",
              "Large fees with no coaching, no support, and no one available when a bank calls you",
              "Calling it a loan or a line of credit, or blurring it with credit repair",
            ].map((item) => (
              <li key={item} className="flex gap-2 py-1 text-base text-foreground/85">
                <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-muted-foreground italic">
            Nobody has a back door at the banks. Preparation, sequencing, and support are the real product.
          </p>
        </div>
      </section>

      {SHOW_CHECKLIST_CTA && (
        <section className="container mx-auto px-4 py-14 md:py-20 max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-card px-6 py-10 md:py-14">
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-sky/15 blur-3xl pointer-events-none" />
            <div className="relative text-center max-w-2xl mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <Mail className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-3 tracking-tight">
                Get the Realtor Business Credit Checklist (PDF)
              </h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8">
                A one-page printable checklist with the 7 steps to set up your business
                structure, bank account, and credit profile — so you qualify for the right
                cards faster.
              </p>

              {checklistStatus === "success" ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-lg font-medium text-secondary">{checklistMessage}</p>
                  <p className="text-sm text-muted-foreground">
                    Check your inbox (and spam folder) for the PDF.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleChecklistSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                  <div className="flex-1 space-y-2 text-left">
                    <Label htmlFor="checklist-email" className="sr-only">
                      Email address
                    </Label>
                    <Input
                      id="checklist-email"
                      type="email"
                      placeholder="Enter your email address"
                      required
                      value={checklistEmail}
                      onChange={(e) => setChecklistEmail(e.target.value)}
                      className="h-12 rounded-xl border-border bg-background px-4 text-base"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={checklistStatus === "loading"}
                    className="h-12 px-6 rounded-xl text-base font-semibold"
                  >
                    {checklistStatus === "loading" ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send My Checklist"
                    )}
                  </Button>
                </form>
              )}
              {checklistStatus === "error" && (
                <p className="mt-3 text-sm text-red-600">{checklistMessage}</p>
              )}
              <p className="mt-4 text-xs text-muted-foreground">
                We respect your inbox. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* FAQs */}
      <section id="faqs" className="container mx-auto px-4 py-14 md:py-20 max-w-3xl scroll-mt-28">
        <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-8 text-center">
          Frequently asked questions
        </h2>
        <div className="space-y-5">
          {faqs.map((f) => (
            <div key={f.q} className="border-l-2 border-primary pl-4">
              <h3 className="text-lg font-semibold text-secondary mb-1">{f.q}</h3>
              <p className="text-base text-muted-foreground leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Full disclosures */}
      <section className="bg-muted/40 border-t border-border">
        <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
          <h2 className="text-xl md:text-2xl font-bold text-secondary mb-3">Important disclosures</h2>
          <p className="text-sm text-foreground/80 leading-relaxed mb-6">{AFFILIATE_DISCLOSURE_SHORT}</p>
          <div className="space-y-4">
            {FULL_DISCLOSURES.map((d) => (
              <div key={d.title} className="rounded-2xl border border-border bg-card p-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-2">{d.title}</h3>
                <p className="text-sm text-foreground/80 leading-relaxed m-0">{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FinalCTABright guideLink="/card-guide" />
      <SiteFooter />
    </div>
  );
};

export default BusinessCreditCardsForRealtorsPage;