import { Link } from "react-router-dom";
import Seo from "@/components/shared/Seo";
import SiteFooter from "@/components/shared/SiteFooter";
import { BookOpen } from "lucide-react";
import SiteHeader from "@/components/shared/SiteHeader";

const LAST_UPDATED = "May 9, 2026";

const PrivacyPage = () => (
  <div className="min-h-screen bg-background">
    <SiteHeader />
    <Seo
      title="Privacy Policy · Realtor Business Credit"
      description="How Realtor Business Credit and My Better Business Credit collect, use, store, and protect your information, including SMS and email communications."
      path="/privacy"
    />
    <main className="container mx-auto max-w-3xl px-4 py-12 md:py-16">
      <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: {LAST_UPDATED}</p>

      <article className="prose prose-slate max-w-none space-y-6 text-foreground/90">
        <section>
          <p>
            This Privacy Policy explains how <strong>My Better Business Credit</strong> and its
            program brand <strong>Realtor Business Credit</strong> ("we," "us," "our") collect,
            use, share, and protect information about you when you visit{" "}
            <Link to="/" className="text-primary underline">realtorbusinesscredit.com</Link>,
            request our guide, book a session, complete our intake survey, or receive emails or
            SMS messages from us.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary">1. Information we collect</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Contact details</strong> you provide: name, email, phone, brokerage, city, state, license type.</li>
            <li><strong>Survey responses</strong> from the Realtor Business Financial Needs Analysis.</li>
            <li><strong>Public real estate data</strong>: closed-transaction information from MLS exports our broker is authorized to access.</li>
            <li><strong>Usage data</strong>: pages visited, time on page, scroll depth, referrer, device, and approximate location, used to improve the site and measure marketing performance.</li>
            <li><strong>Communication consent</strong>: timestamp and source of your opt-in to receive email and SMS.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary">2. How we use your information</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Deliver the free guide, your custom plan, and your portal access.</li>
            <li>Schedule and conduct one-on-one sessions and program coaching.</li>
            <li>Send service messages, educational content, program updates, and reminders by email and SMS.</li>
            <li>Improve our content, funnel, and conversion analytics.</li>
            <li>Comply with legal obligations and protect against fraud and abuse.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary">3. SMS &amp; messaging program</h2>
          <p>
            By providing your mobile number on a form, by checking a consent box, or by replying
            to a message, you agree to receive recurring marketing and service text messages from
            Realtor Business Credit at the number you provided. Message frequency varies. Message
            and data rates may apply. Consent is not a condition of any purchase.
          </p>
          <p>
            You can opt out at any time by replying <strong>STOP</strong> to any message. Reply{" "}
            <strong>HELP</strong> for help. For support, email{" "}
            <a href="mailto:support@mybetterbusinesscredit.com" className="text-primary underline">
              support@mybetterbusinesscredit.com
            </a>
            . Carriers are not liable for delayed or undelivered messages.
          </p>
          <p className="text-sm text-muted-foreground">
            Mobile information will not be shared with third parties or affiliates for marketing
            or promotional purposes. Information sharing to subcontractors that support the
            messaging program (such as our CRM and SMS provider) is permitted.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary">4. How we share information</h2>
          <p>We share information only with:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Service providers who run our CRM, email/SMS, hosting, analytics, and payments under contract.</li>
            <li>Our coaching and partner network (including Credit Suite) when you choose to enroll.</li>
            <li>Authorities when legally required.</li>
          </ul>
          <p>We do not sell your personal information.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary">5. Cookies &amp; analytics</h2>
          <p>
            We use cookies and similar technologies to remember your visit, measure traffic, and
            understand how visitors move through the funnel. You can disable cookies in your
            browser; some site features may not work as a result.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary">6. Data retention &amp; security</h2>
          <p>
            We retain your information for as long as needed to deliver the program, comply with
            legal obligations, and resolve disputes. We use industry-standard administrative and
            technical safeguards, but no system is perfectly secure.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary">7. Your rights</h2>
          <p>
            Depending on your state, you may have rights to access, correct, delete, or port your
            personal information, and to opt out of certain processing. To make a request, email{" "}
            <a href="mailto:support@mybetterbusinesscredit.com" className="text-primary underline">
              support@mybetterbusinesscredit.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary">8. Children</h2>
          <p>This site is not directed to children under 16, and we do not knowingly collect their information.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary">9. Changes</h2>
          <p>
            We may update this policy from time to time. The "Last updated" date above reflects
            the most recent change. Continued use of the site after changes means you accept the
            updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary">10. Contact</h2>
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

export default PrivacyPage;