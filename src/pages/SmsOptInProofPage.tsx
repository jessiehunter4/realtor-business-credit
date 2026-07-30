import Seo from "@/components/shared/Seo";
import { SMS_CONSENT_TEXT, TERMS_CONSENT_TEXT } from "@/lib/messagingConsent";

const SITE = "https://reprobusinesscredit.com";

const steps = [
  {
    n: "1",
    title: "Visitor lands on our website",
    body:
      "A real estate agent or broker visits reprobusinesscredit.com — usually from an email, a referral, or a search result — to request our free business structure, finance and credit guide or to book a one-on-one session.",
  },
  {
    n: "2",
    title: "Visitor submits a web form with their own mobile number",
    body:
      "The visitor types their own first name, last name, email and mobile phone number into the form. No number is ever purchased, rented, appended, or imported for SMS.",
  },
  {
    n: "3",
    title: "Visitor checks the separate SMS opt-in box",
    body:
      "The SMS consent checkbox is separate from every other agreement, is unchecked by default, and only appears once the visitor has entered a mobile number. It is never required to submit the form, receive the guide, create an account, or purchase anything.",
  },
  {
    n: "4",
    title: "Consent is recorded and messaging begins",
    body:
      "We store the exact consent wording shown, the timestamp, the page it was given on, and the phone number. Only after this record exists does the number become eligible for SMS. Every message identifies RE Pro Business Credit and includes STOP / HELP instructions.",
  },
];

const screenshots = [
  {
    src: "/opt-in/create-account.png",
    label: "Account creation form (reprobusinesscredit.com/mock-login → Create account)",
    note: "Mobile phone is optional. The SMS opt-in checkbox is separate and unchecked by default. The Terms of Use / Privacy Policy agreement is a distinct, separate checkbox.",
  },
  {
    src: "/opt-in/guide-opt-in.png",
    label: "Free guide request form (reprobusinesscredit.com/guide)",
    note: "The visitor enters their own mobile number, then a separate unchecked SMS consent box appears with the full disclosure and links to Terms and Privacy.",
  },
];

const messageSamples = [
  "Hi John! This is Jessie from RE Pro Business Credit. Your one-on-one business credit session on July 20 at 11:00 AM is confirmed. Reply STOP to unsubscribe, HELP for help.",
  "Hi John, Jessie from RE Pro Business Credit. Your custom 90-day business structure and credit plan is ready in your portal: https://reprobusinesscredit.com/dashboard Reply STOP to unsubscribe.",
  "Hi John, this is Jessie with RE Pro Business Credit following up on your session. Want to grab a time this week? https://reprobusinesscredit.com/one-on-one Reply STOP to cancel, HELP for help.",
];

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mt-10">
    <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3">{title}</h2>
    <div className="space-y-3 text-base text-foreground/85 leading-relaxed">{children}</div>
  </section>
);

const SmsOptInProofPage = () => (
  <main className="min-h-screen bg-background">
    <Seo
      title="SMS Opt-In Workflow | RE Pro Business Credit"
      description="Documentation of the SMS opt-in workflow, consent language, and message samples for RE Pro Business Credit."
      path="/sms-opt-in"
      noindex
    />

    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <header className="border-b border-border pb-6">
        <p className="text-xs font-semibold tracking-widest text-primary uppercase">
          Messaging Compliance
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
          SMS Opt-In Workflow
        </h1>
        <p className="text-muted-foreground mt-3">
          RE Pro Business Credit — a program of My Better Business Credit. This page documents how
          end users give express written consent to receive text messages from us, and what those
          messages look like.
        </p>
        <dl className="mt-5 grid gap-2 text-sm text-foreground/80 sm:grid-cols-2">
          <div>
            <dt className="font-semibold">Brand / Business name</dt>
            <dd>RE Pro Business Credit (My Better Business Credit)</dd>
          </div>
          <div>
            <dt className="font-semibold">Website</dt>
            <dd>
              <a href={SITE} className="text-primary underline">
                reprobusinesscredit.com
              </a>
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Opt-in type</dt>
            <dd>Web form (express written consent)</dd>
          </div>
          <div>
            <dt className="font-semibold">Message type</dt>
            <dd>Appointment confirmations, reminders, customer care, account notifications</dd>
          </div>
        </dl>
      </header>

      <Section title="How subscribers opt in">
        <ol className="space-y-4">
          {steps.map((s) => (
            <li key={s.n} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {s.n}
              </span>
              <div>
                <p className="font-semibold text-foreground">{s.title}</p>
                <p className="text-foreground/80">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Exact consent language shown to the user">
        <div className="rounded-lg border border-border bg-muted/40 p-4">
          <p className="text-sm font-semibold text-foreground mb-1">
            SMS opt-in checkbox (separate, unchecked by default, never required):
          </p>
          <p className="text-foreground">“{SMS_CONSENT_TEXT}”</p>
        </div>
        <div className="rounded-lg border border-border bg-muted/40 p-4">
          <p className="text-sm font-semibold text-foreground mb-1">
            Separate Terms &amp; Privacy agreement checkbox:
          </p>
          <p className="text-foreground">“{TERMS_CONSENT_TEXT}”</p>
        </div>
        <p>
          Full policies:{" "}
          <a href="/terms" className="text-primary underline">
            Terms of Use
          </a>{" "}
          ·{" "}
          <a href="/privacy" className="text-primary underline">
            Privacy Policy
          </a>
          . Mobile opt-in information is never shared or sold to third parties or affiliates for
          marketing purposes.
        </p>
      </Section>

      <Section title="Screenshots of the live opt-in forms">
        <div className="space-y-8">
          {screenshots.map((s) => (
            <figure key={s.src} className="space-y-2">
              <img
                src={s.src}
                alt={s.label}
                loading="lazy"
                className="w-full rounded-lg border border-border shadow-sm bg-card"
              />
              <figcaption className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{s.label}</span> — {s.note}{" "}
                <a href={`${SITE}${s.src}`} className="text-primary underline">
                  Direct image link
                </a>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section title="Sample messages we send">
        <ul className="space-y-3">
          {messageSamples.map((m) => (
            <li key={m} className="rounded-lg border border-border bg-card p-4 text-foreground">
              {m}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Opt-out and help">
        <p>
          Every message includes opt-out instructions. Subscribers may reply <strong>STOP</strong>{" "}
          at any time to end all messages, or <strong>HELP</strong> for assistance. Signed-in users
          can also turn text messages off at any time from the Message Preferences card in their
          dashboard. Opt-out requests are honored immediately and the number is suppressed from all
          future sends.
        </p>
      </Section>

      <Section title="Additional compliance notes">
        <ul className="list-disc pl-6 space-y-2">
          <li>Consent is never a condition of purchase or of receiving the free guide.</li>
          <li>
            Contacts are treated as email-only and are explicitly flagged as not SMS-consented until
            they opt in through a web form on this site.
          </li>
          <li>
            We store a complete consent record for each subscriber: phone number, exact consent
            wording displayed, source page, and timestamp.
          </li>
          <li>No phone numbers are purchased, rented, appended, or shared with third parties.</li>
        </ul>
      </Section>

      <footer className="mt-12 border-t border-border pt-6 text-sm text-muted-foreground">
        RE Pro Business Credit — Business Credit &amp; Finance for Real Estate Professionals. A
        specialized program of My Better Business Credit. Educational content only; not legal, tax,
        or investment advice.
      </footer>
    </div>
  </main>
);

export default SmsOptInProofPage;