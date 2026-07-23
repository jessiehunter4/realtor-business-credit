import { useMemo } from "react";
import { Link } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Calendar, Download, ArrowLeft, FileText } from "lucide-react";
import PlanDocument from "@/components/plan/PlanDocument";
import PlanPDF from "@/components/plan/PlanPDF";
import NextStepPanel from "@/components/plan/NextStepPanel";
import SiteFooter from "@/components/shared/SiteFooter";
import SiteHeader from "@/components/shared/SiteHeader";
import Seo from "@/components/shared/Seo";
import { SAMPLE_PLAN } from "@/data/samplePlan";

const SamplePlanPage = () => {
  const sampleCreatedAt = useMemo(
    () => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    []
  );
  const sampleUpdatedAt = useMemo(
    () => new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    []
  );
  const pdfDoc = useMemo(
    () => <PlanPDF planData={SAMPLE_PLAN} createdAt={sampleCreatedAt} updatedAt={sampleUpdatedAt} />,
    [sampleCreatedAt, sampleUpdatedAt]
  );

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <Seo
        title="Sample RE Pro Business Credit Plan — See What You'll Receive"
        description="A full sample of the personalized RE Pro Business Structure, Finance & Credit Plan you receive after your free 1:1 session. Built for a fictional Sacramento broker so you know exactly what to expect."
        path="/sample-plan"
      />

      <section className="bg-hero-grad border-b border-border">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm font-semibold text-secondary hover:text-primary mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 bg-white/80 backdrop-blur border border-border rounded-full px-3 py-1 text-xs font-semibold text-primary shadow-card">
              <FileText className="h-3.5 w-3.5" />
              Sample Plan · Not a real Realtor
            </span>
            <h1 className="mt-3 text-3xl md:text-5xl font-bold text-secondary tracking-tight">
              See exactly what your custom plan will look like.
            </h1>
            <p className="mt-4 text-muted-foreground text-lg">
              This is the same format every Realtor walks away with after a free 1:1.
              We built this sample for <strong>Sarah Mitchell</strong>, a fictional
              Sacramento, CA residential broker, so you can read a full one before you
              decide to book.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 md:py-14">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              Scroll through the full plan below — same sections, same layout, same PDF.
            </p>
            <PDFDownloadLink
              document={pdfDoc}
              fileName="Sample-Realtor-Business-Credit-Plan.pdf"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-sky text-sky-foreground px-5 py-2.5 text-sm font-semibold shadow-card hover:shadow-card-hover hover:bg-sky/90 transition-all"
            >
              {({ loading }) => (
                <>
                  <Download className="h-4 w-4" />
                  {loading ? "Preparing PDF…" : "Download Sample PDF"}
                </>
              )}
            </PDFDownloadLink>
          </div>

          <PlanDocument
            planData={SAMPLE_PLAN}
            createdAt={sampleCreatedAt}
            updatedAt={sampleUpdatedAt}
          />

          <NextStepPanel demo />
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto bg-hero-grad border border-border rounded-3xl p-8 md:p-12 text-center shadow-card">
          <h2 className="text-2xl md:text-4xl font-bold text-secondary">
            Ready for <em>your</em> plan?
          </h2>
          <p className="mt-3 text-muted-foreground text-lg">
            Book your free 1:1 and walk away with one just like this — built from your
            RE Pro Business Financial Needs Analysis.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/one-on-one"
              data-analytics-id="cta-book-sample-plan-bottom"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-3.5 text-base font-semibold shadow-card hover:shadow-card-hover hover:bg-primary/90 transition-all"
            >
              <Calendar className="h-5 w-5" />
              Book My Free 1:1
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted-foreground italic">
            Fail to plan — plan to fail.
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default SamplePlanPage;