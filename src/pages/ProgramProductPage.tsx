import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  Loader2,
  Lock,
  Minus,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import SiteHeader from "@/components/shared/SiteHeader";
import SiteFooter from "@/components/shared/SiteFooter";
import Seo from "@/components/shared/Seo";
import PayLaterOptions from "@/components/pricing/PayLaterOptions";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { tierBySlug } from "@/data/pricingTiers";
import { startCheckout, type CheckoutTierId } from "@/lib/startCheckout";
import { useEntitlements } from "@/hooks/useEntitlements";

export default function ProgramProductPage() {
  const { slug } = useParams();
  const tier = tierBySlug(slug);
  const { hasProduct, loading: entitlementsLoading } = useEntitlements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!tier || !tier.productPage) {
    return <Navigate to="/pricing" replace />;
  }

  const page = tier.productPage;
  const tierId = tier.id as CheckoutTierId;
  const alreadyOwned = !entitlementsLoading && hasProduct(tierId);

  const handleJoin = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    const result = await startCheckout(tierId);
    if (result.ok === false) setError(result.message);
    setIsLoading(false);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: tier.name,
    description: page.subhead,
    brand: { "@type": "Brand", name: "RE Pro Business Credit" },
    offers: {
      "@type": "Offer",
      price: tier.price.replace(/[^0-9.]/g, ""),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `/programs/${page.slug}`,
    },
  };

  const CTA = ({ block = false }: { block?: boolean }) =>
    alreadyOwned ? (
      <Button asChild size="lg" className={block ? "w-full rounded-full" : "rounded-full"}>
        <Link to="/dashboard">
          Go to your dashboard <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </Button>
    ) : (
      <Button
        size="lg"
        onClick={handleJoin}
        disabled={isLoading}
        className={block ? "w-full rounded-full" : "rounded-full"}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Redirecting to Stripe…
          </>
        ) : (
          <>
            {page.joinLabel} <ArrowRight className="ml-1 h-4 w-4" />
          </>
        )}
      </Button>
    );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-primary/5 to-white">
      <Seo
        title={`${tier.name} — RE Pro Business Credit`}
        description={page.subhead.slice(0, 155)}
        path={`/programs/${page.slug}`}
        jsonLd={jsonLd}
      />
      <SiteHeader />

      <main id="main-content" className="flex-1">
        {/* Header */}
        <section className="container mx-auto max-w-5xl px-4 pt-12 pb-8 md:pt-16 md:pb-12">
          <Link
            to="/pricing"
            className="text-sm font-medium text-secondary/70 hover:text-primary focus-visible:text-primary"
          >
            ← All programs
          </Link>
          <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-primary">
            {tier.name}
          </p>
          <h1 className="mt-2 text-3xl md:text-5xl font-bold tracking-tight text-secondary">
            {page.headline}
          </h1>
          <p className="mt-5 max-w-2xl text-base md:text-lg text-secondary/75 leading-relaxed">
            {page.subhead}
          </p>

          <div className="mt-7 flex flex-wrap items-baseline gap-2">
            <span className="text-4xl font-bold text-secondary">{tier.price}</span>
            {tier.originalPrice && (
              <span className="text-lg text-secondary/40 line-through">{tier.originalPrice}</span>
            )}
            <span className="text-sm text-secondary/60">{tier.cadence}</span>
          </div>
          {tier.cadenceNote && (
            <p className="mt-1 text-xs text-secondary/60">{tier.cadenceNote}</p>
          )}

          <div className="mt-7 flex flex-col sm:flex-row sm:items-center gap-3">
            <CTA />
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link to="/sample-plan">See a Sample Plan</Link>
            </Button>
          </div>
          {alreadyOwned && (
            <p className="mt-3 text-sm font-medium text-primary">
              You're already enrolled in {tier.name}.
            </p>
          )}
          {error && (
            <p role="alert" className="mt-3 text-sm font-medium text-destructive">
              {error}
            </p>
          )}

          <ul className="mt-8 grid gap-3 sm:grid-cols-3">
            {page.heroBullets.map((b) => (
              <li
                key={b}
                className="flex items-start gap-2 rounded-xl border border-border bg-white p-4 text-sm text-secondary/85 shadow-card-soft"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* What's included */}
        <section className="container mx-auto max-w-5xl px-4 pb-12" aria-labelledby="included">
          <h2 id="included" className="text-2xl md:text-3xl font-bold text-secondary">
            What's included
          </h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {page.includedGroups.map((group) => (
              <div
                key={group.title}
                className="rounded-2xl border border-border bg-white p-6 shadow-card-soft"
              >
                <h3 className="text-base font-semibold text-secondary">{group.title}</h3>
                <ul className="mt-4 space-y-3">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-secondary/85">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {tier.notIncluded && tier.notIncluded.length > 0 && (
            <div className="mt-5 rounded-2xl border border-border bg-secondary/[0.03] p-6">
              <h3 className="text-sm font-semibold text-secondary">Not included at this level</h3>
              <ul className="mt-3 space-y-2">
                {tier.notIncluded.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-secondary/60">
                    <Minus className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {page.highlight && (
            <div className="mt-5 rounded-2xl border border-primary/40 bg-primary/5 p-6">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" aria-hidden />
                <h3 className="text-base font-semibold text-secondary">{page.highlight.title}</h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-secondary/80">
                {page.highlight.body}
              </p>
            </div>
          )}
        </section>

        {/* Access + payment */}
        <section className="container mx-auto max-w-5xl px-4 pb-12" aria-labelledby="access">
          <h2 id="access" className="sr-only">
            Access, payment options and guarantee
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-white p-6 shadow-card-soft">
              <div className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-primary" aria-hidden />
                <h3 className="text-base font-semibold text-secondary">What unlocks after you join</h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-secondary/80">
                {page.dashboardCapabilityNote}
              </p>
              {page.partnerAccess && (
                <p className="mt-3 text-sm leading-relaxed text-secondary/80">
                  <span className="font-medium text-secondary">Partner resources: </span>
                  {page.partnerAccess}
                </p>
              )}
            </div>
            <div className="rounded-2xl border border-border bg-white p-6 shadow-card-soft">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" aria-hidden />
                <h3 className="text-base font-semibold text-secondary">Payment &amp; guarantee</h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-secondary/80">
                {page.paymentPlanNote}
              </p>
              {page.refundNote && (
                <p className="mt-3 text-sm leading-relaxed text-secondary/80">{page.refundNote}</p>
              )}
              <p className="mt-3 flex items-center gap-2 text-xs text-secondary/60">
                <Lock className="h-3.5 w-3.5" aria-hidden /> Secure Stripe checkout — we never see
                your card details.
              </p>
            </div>
          </div>
          <PayLaterOptions />
        </section>

        {/* FAQs */}
        <section className="container mx-auto max-w-3xl px-4 pb-12" aria-labelledby="faqs">
          <h2 id="faqs" className="text-2xl md:text-3xl font-bold text-secondary text-center">
            Questions about {tier.name}
          </h2>
          <Accordion type="single" collapsible className="mt-6">
            {page.faqs.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger className="text-left text-sm font-semibold text-secondary">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-secondary/80">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Closing CTA */}
        <section className="container mx-auto max-w-3xl px-4 pb-20">
          <div className="rounded-2xl border border-border bg-white p-6 md:p-8 text-center shadow-card">
            <h2 className="text-xl md:text-2xl font-bold text-secondary">
              Ready to join {tier.name}?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-secondary/75">{tier.who}</p>
            <div className="mt-6 flex justify-center">
              <CTA />
            </div>
            <p className="mt-4 text-xs text-secondary/60">
              Not ready yet?{" "}
              <Link to="/pricing" className="font-semibold text-primary hover:underline">
                Compare all programs
              </Link>
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
