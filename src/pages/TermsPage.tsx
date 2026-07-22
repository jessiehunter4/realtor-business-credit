import { Link } from "react-router-dom";
import Seo from "@/components/shared/Seo";
import SiteFooter from "@/components/shared/SiteFooter";
import SiteHeader from "@/components/shared/SiteHeader";

const LAST_UPDATED = "May 9, 2026";

const TermsPage = () => (
  <div className="min-h-screen bg-background">
    <SiteHeader />
    <Seo
      title="Terms of Service · RE Pro Business Credit"
      description="Terms of service for the RE Pro Business Credit program by My Better Business Credit, including educational scope, payments, and limitations of liability."
      path="/terms"
    />
    <main className="container mx-auto max-w-3xl px-4 py-12 md:py-16">
      <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-2">Terms of Service</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: {LAST_UPDATED}</p>

      <article className="prose prose-slate max-w-none space-y-6 text-foreground/90">
        <section>
          <p>
            These Terms of Service ("Terms") govern your access to and use of
            realtorbusinesscredit.com, the RE Pro Business Credit program, the free guide,
            one-on-one sessions, intake survey, custom plan, portal, cohort, and any related
            services (collectively, the "Services") provided by{" "}
            <strong>My Better Business Credit</strong> ("we," "us," "our").
          </p>
          <p>By using the Services you agree to these Terms.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary">1. Educational scope · Not advice</h2>
          <p>
            The Services provide <strong>education, coaching, and implementation support</strong>{" "}
            related to business credit, fundability, and business formation concepts for real
            estate professionals. The Services <strong>do not</strong> constitute legal, tax,
            accounting, financial, or investment advice. We are not your attorney, CPA, broker,
            or fiduciary.
          </p>
          <p>
            You are responsible for confirming all decisions with your own state licensing board,
            attorney, CPA, broker, and any other qualified professional.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary">2. No guarantees</h2>
          <p>
            Outcomes vary based on each Realtor's actions, credit profile, business activities,
            timing, and third-party decisions (banks, vendors, bureaus, regulators). We make no
            promise of any specific approval amount, credit limit, funding outcome, or timeline.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary">3. Eligibility &amp; account</h2>
          <p>
            You must be 18+ and a U.S. resident to use the Services. You agree to provide accurate
            information and to keep your contact details current. You are responsible for the
            confidentiality of any portal access credentials issued to you.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary">4. Payments &amp; refunds</h2>
          <p>
            Paid program tiers are billed through our payment processor. Specific pricing,
            inclusions, and refund eligibility are described on the checkout page at the time of
            purchase and in any program-specific agreement you sign. Unless explicitly stated,
            digital deliverables and one-on-one coaching time are non-refundable once delivered or
            scheduled.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary">5. Communications &amp; SMS consent</h2>
          <p>
            By submitting a form, booking a session, or enrolling, you consent to receive service
            and marketing communications by email and SMS as described in our{" "}
            <Link to="/privacy" className="text-primary underline">Privacy Policy</Link>. You may
            opt out of marketing emails using the unsubscribe link, and out of SMS by replying
            <strong> STOP</strong>. Service messages related to your account or scheduled sessions
            may continue.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary">6. Acceptable use</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Resell, republish, or redistribute the guide, plan, portal content, or coaching materials.</li>
            <li>Use the Services to violate any law or third-party right.</li>
            <li>Attempt to interfere with the Services, scrape protected content, or bypass access controls.</li>
            <li>Misrepresent your identity, your license, or your authority to act for another agent.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary">7. Intellectual property</h2>
          <p>
            All content, branding, plan templates, and methodology are owned by My Better Business
            Credit or our licensors. We grant you a personal, non-transferable, revocable license
            to use the Services for your own real estate business.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary">8. Third-party partners</h2>
          <p>
            We may refer you to partners, including Credit Suite, banks, vendors, and other
            service providers. We are not responsible for their products, decisions, or actions.
            Your use of any partner service is governed by that partner's own terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary">9. Disclaimer &amp; limitation of liability</h2>
          <p>
            The Services are provided "as is" without warranties of any kind. To the maximum
            extent permitted by law, our aggregate liability for any claim arising out of or
            related to the Services will not exceed the amount you paid us in the 12 months
            preceding the claim. We are not liable for indirect, incidental, special,
            consequential, or punitive damages, including lost profits or lost business credit
            opportunities.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary">10. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless My Better Business Credit and its officers,
            employees, contractors, and partners from any claim arising out of your use of the
            Services, your violation of these Terms, or your violation of any law or third-party
            right.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary">11. Governing law</h2>
          <p>
            These Terms are governed by the laws of the State of California, without regard to
            conflict-of-law principles. Any dispute will be resolved in the state or federal
            courts located in California, and you consent to that jurisdiction.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary">12. Changes</h2>
          <p>
            We may update these Terms from time to time. The "Last updated" date above reflects
            the most recent change. Continued use of the Services after changes constitutes
            acceptance.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary">13. Contact</h2>
          <p>
            My Better Business Credit ·{" "}
            <a href="mailto:support@mybetterbusinesscredit.com" className="text-primary underline">
              support@mybetterbusinesscredit.com
            </a>
          </p>
        </section>
      </article>
    </main>

    <SiteFooter />
  </div>
);

export default TermsPage;