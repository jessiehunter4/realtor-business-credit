import {
  ChapterHeader,
  SectionHeading,
  SubHeading,
  Paragraph,
  Callout,
  JessieNote,
  GoodNugget,
  NextMove,
  ChapterTakeaway,
} from "@/components/guide/GuideComponents";
import { PARTNER_PROGRAM_SUMMARY, RESULTS_STATEMENT } from "@/config/partner";
import stackingSequence from "@/assets/card-guide/stacking-sequence.jpg";
import introAprWindow from "@/assets/card-guide/intro-apr-window.jpg";

export const cardTocItems = [
  { id: "cg-introduction", label: "Welcome from Jessie" },
  { id: "cg-chapter-1", label: "1. What credit card stacking actually is" },
  { id: "cg-chapter-2", label: "2. Why real estate income changes the math" },
  { id: "cg-chapter-3", label: "3. Business cards vs personal cards" },
  { id: "cg-chapter-4", label: "4. Personal guarantees and what gets reported" },
  { id: "cg-chapter-5", label: "5. The introductory rate window" },
  { id: "cg-chapter-6", label: "6. Why the business entity comes first" },
  { id: "cg-chapter-7", label: "7. The application sequence" },
  { id: "cg-chapter-8", label: "8. Bank verification calls" },
  { id: "cg-chapter-9", label: "9. Paying things that don't take cards" },
  { id: "cg-chapter-10", label: "10. Real estate use cases" },
  { id: "cg-chapter-11", label: "11. How to spot a bad stacking company" },
  { id: "cg-chapter-12", label: "12. What this is not" },
  { id: "cg-chapter-13", label: "13. Your next step" },
  { id: "cg-conclusion", label: "Closing message from Jessie" },
  { id: "cg-resources", label: "Resources & full disclosures" },
];

const Chapter = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <section id={id} className="scroll-mt-24 container mx-auto px-4 py-14 md:py-16">
    <div className="max-w-4xl mx-auto">{children}</div>
  </section>
);

const Figure = ({ src, alt, caption }: { src: string; alt: string; caption: string }) => (
  <figure className="my-8 rounded-2xl bg-card border border-border p-3 md:p-4 shadow-[0_8px_18px_rgba(11,31,59,.06)]">
    <img src={src} alt={alt} loading="lazy" width={1408} height={800} className="w-full h-auto rounded-xl" />
    <figcaption className="mt-3 text-center text-xs text-muted-foreground italic">{caption}</figcaption>
  </figure>
);

export const CardIntro = () => (
  <Chapter id="cg-introduction">
    <ChapterHeader title="Welcome from Jessie Hunter" />
    <Paragraph>
      Twice in my real estate career the market changed faster than my income could adjust — 2008 and 2020. Both
      times I got through it on personal credit, personal savings, and personal risk. That is the expensive way to
      survive a slow quarter.
    </Paragraph>
    <Paragraph>
      When I started studying business funding seriously, one strategy kept coming up: using a coordinated set of
      business credit cards, opened in a deliberate sequence, as flexible working capital for the business. In the
      funding world it is usually called <strong>credit card stacking</strong>.
    </Paragraph>
    <Paragraph>
      This guide explains how it works, who it fits, what it costs, what can go wrong, and how it connects to the
      business structure work in the main RE Pro Business Finance &amp; Credit Guide. It is written for Realtors
      first, and it applies just as well to brokers, investors, and other real estate professionals.
    </Paragraph>
    <JessieNote title="How to read this">
      <p>
        Nothing in here is a promise. Credit decisions belong to the issuing banks. What I can give you is a clear
        picture of the strategy, the honest tradeoffs, and the order of operations that gives you the best shot.
      </p>
    </JessieNote>
    <Callout variant="info">
      <SubHeading>What this guide is</SubHeading>
      <Paragraph className="m-0">
        Education and coaching guidance. It is not legal, tax, accounting, or investment advice, and it is not an
        offer of credit. {RESULTS_STATEMENT}
      </Paragraph>
    </Callout>
  </Chapter>
);

export const CardCh01 = () => (
  <Chapter id="cg-chapter-1">
    <ChapterHeader number="CHAPTER 1" title="What credit card stacking actually is" />
    <Paragraph>
      Credit card stacking is the practice of applying for several business credit cards in a planned sequence so
      the approved limits, taken together, give your business meaningful spending capacity — capacity you can use
      much the way you would use a line of credit.
    </Paragraph>
    <Paragraph>
      The key words are <strong>business</strong>, <strong>planned</strong>, and <strong>sequence</strong>. One card
      applied for at random is not a strategy. A set of business cards opened in a deliberate order, with the
      business information presented consistently to every issuer, is.
    </Paragraph>
    <Figure
      src={stackingSequence}
      alt="Four-step diagram: prepare, then three sequenced rounds of business credit card applications"
      caption="A simplified view of how rounds are sequenced over time. Actual pacing depends on your profile."
    />
    <SectionHeading>What it is not</SectionHeading>
    <Paragraph>
      It is not a loan. It is not a business line of credit product. It is not credit repair. And it is not a
      shortcut around underwriting — every application is a real application, reviewed by a real issuer, that can be
      approved or declined.
    </Paragraph>
    <GoodNugget>
      Business credit cards can be <em>used like</em> a line of credit. They are not a line of credit, and the
      difference matters in how they are reported, priced, and repaid.
    </GoodNugget>
    <ChapterTakeaway>
      Stacking is sequencing. The value comes from planning and preparation, not from the number of applications.
    </ChapterTakeaway>
  </Chapter>
);

export const CardCh02 = () => (
  <Chapter id="cg-chapter-2">
    <ChapterHeader number="CHAPTER 2" title="Why real estate income changes the math" />
    <Paragraph>
      A salaried business owner gets paid on the 1st and the 15th. You get paid when escrow closes. Your expenses do
      not follow that rhythm — photography, staging, ad spend, dues, insurance, and your household bills all arrive
      on their own schedule.
    </Paragraph>
    <Paragraph>
      That gap is where most real estate professionals reach for a personal card. It works, and it quietly does two
      things: it raises your personal utilization, and it leaves your business with no credit history of its own.
    </Paragraph>
    <Callout variant="warning">
      <SubHeading>The lumpy-income trap</SubHeading>
      <Paragraph className="m-0">
        Carrying business expenses on personal cards can push personal utilization high right when you are also
        applying for a mortgage, a car, or new credit — the exact moment your personal profile needs to look its
        best.
      </Paragraph>
    </Callout>
    <ChapterTakeaway>
      Commission income is lumpy. Business credit capacity is how you smooth the gap without borrowing against your
      personal profile every time.
    </ChapterTakeaway>
  </Chapter>
);

export const CardCh03 = () => (
  <Chapter id="cg-chapter-3">
    <ChapterHeader number="CHAPTER 3" title="Business cards vs personal cards: the separation that protects your FICO" />
    <Paragraph>
      Most business credit cards report balances and utilization to the business bureaus rather than to your
      personal consumer report — while still typically reporting to you personally if the account goes seriously
      delinquent.
    </Paragraph>
    <Paragraph>
      Practically, that means a $12,000 marketing month on a business card usually does not spike your personal
      utilization the way the same spend on a personal card would. Reporting practices vary by issuer, so never
      assume — confirm with the issuer.
    </Paragraph>
    <SectionHeading>Separation also means cleaner books</SectionHeading>
    <Paragraph>
      Business spend on business accounts makes bookkeeping, tax prep, and eventual financial statements far easier
      — and those financial statements are what future lenders read.
    </Paragraph>
    <ChapterTakeaway>
      The point of business cards is not just capacity. It is keeping business activity off your personal report.
    </ChapterTakeaway>
  </Chapter>
);

export const CardCh04 = () => (
  <Chapter id="cg-chapter-4">
    <ChapterHeader number="CHAPTER 4" title="Personal guarantee, personal liability, and what actually gets reported" />
    <Paragraph>
      Be clear-eyed here: almost every business credit card a newer business can get requires a{" "}
      <strong>personal guarantee</strong>. You are personally responsible for the balance. Applications generally
      involve a credit inquiry.
    </Paragraph>
    <Paragraph>
      Over time, as the business builds revenue, banking history, and its own credit profile, some products reduce
      or remove that requirement. That is a destination, not a starting point.
    </Paragraph>
    <Callout variant="important">
      <SubHeading>Say it plainly</SubHeading>
      <Paragraph className="m-0">
        Business credit is debt. Inquiries happen. Personal guarantees are normal. Anyone telling you otherwise is
        selling you something.
      </Paragraph>
    </Callout>
    <ChapterTakeaway>
      Expect a personal guarantee early. Work toward the profile where it matters less.
    </ChapterTakeaway>
  </Chapter>
);

export const CardCh05 = () => (
  <Chapter id="cg-chapter-5">
    <ChapterHeader number="CHAPTER 5" title="The introductory rate window — a tool, not free money" />
    <Paragraph>
      Many business credit cards offer an introductory rate for a limited period. Used well, that window lets you
      fund a marketing push or a renovation and repay it out of the closing it helps create.
    </Paragraph>
    <Figure
      src={introAprWindow}
      alt="Timeline showing an introductory rate period followed by the standard rate"
      caption="Introductory periods end. Plan repayment against the date, not against optimism."
    />
    <Paragraph>
      When the introductory period ends, the card's standard rate applies to whatever is left. Terms are set by the
      issuer and can change. Write the end date on your calendar the week you open the account.
    </Paragraph>
    <NextMove>
      <p>
        For any balance you carry, divide it by the number of months left in the introductory window. That number is
        your minimum monthly payment target — not the statement minimum.
      </p>
    </NextMove>
    <ChapterTakeaway>
      An introductory rate is a repayment deadline with a discount attached, not a reason to borrow more.
    </ChapterTakeaway>
  </Chapter>
);

export const CardCh06 = () => (
  <Chapter id="cg-chapter-6">
    <ChapterHeader number="CHAPTER 6" title="Why the business entity comes first" />
    <Paragraph>
      Business card applications ask business questions: legal name, entity type, EIN, industry code, business
      address and phone, time in business, and revenue. Answering those consistently across issuers is a large part
      of why some people get approved and others do not.
    </Paragraph>
    <Paragraph>
      In real estate this gets nuanced, because your license may sit with you personally while your business
      operations run through an entity. Confirm your structure with your broker, CPA, attorney, and state licensing
      board before you file anything.
    </Paragraph>
    <SectionHeading>The foundation checklist</SectionHeading>
    <ul className="my-4 space-y-2 text-base md:text-lg text-foreground/90">
      {[
        "Entity confirmed with your CPA and attorney (and allowed by your state licensing board)",
        "EIN issued and used consistently",
        "Business bank account, separate from personal",
        "Business address and business phone that can be verified",
        "Business email on your own domain and a working website",
        "Accurate industry code and clean, current bookkeeping",
      ].map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
    <ChapterTakeaway>
      The application is downstream of the structure. Fix the structure and the applications get easier.
    </ChapterTakeaway>
  </Chapter>
);

export const CardCh07 = () => (
  <Chapter id="cg-chapter-7">
    <ChapterHeader number="CHAPTER 7" title="The application sequence: why order and timing drive outcomes" />
    <Paragraph>
      Issuers differ in what they weigh, how they treat recent inquiries, and how many of their own accounts they
      will extend. A coordinated sequence takes that into account. A scattershot afternoon of applications does not.
    </Paragraph>
    <Paragraph>
      Rounds are usually spaced by months, not days, so new accounts have time to season and report before the next
      round. Between rounds you use the accounts responsibly, keep utilization sane, and pay on time — which is
      exactly what the next issuer wants to see.
    </Paragraph>
    <GoodNugget>
      The most common self-inflicted wound is applying for everything at once and then wondering why round two goes
      badly.
    </GoodNugget>
    <ChapterTakeaway>
      Sequence and spacing are the strategy. Patience between rounds is what compounds capacity.
    </ChapterTakeaway>
  </Chapter>
);

export const CardCh08 = () => (
  <Chapter id="cg-chapter-8">
    <ChapterHeader number="CHAPTER 8" title="The part nobody prepares you for: bank verification calls" />
    <Paragraph>
      Applications frequently go to manual review, and a bank representative calls to verify the business. This is
      routine — and it is where unprepared applicants lose approvals they had already earned.
    </Paragraph>
    <Paragraph>
      They may ask what the business does, how long it has operated, what it earns, where it is located, and how to
      reach it. If your answers do not match your application, the file stalls.
    </Paragraph>
    <Callout variant="info">
      <SubHeading>Be reachable and be consistent</SubHeading>
      <Paragraph className="m-0">
        Answer your business phone professionally. Know your own numbers. Keep one version of your business facts and
        use it everywhere.
      </Paragraph>
    </Callout>
    <Paragraph>
      This is also the single biggest argument for having a coach walk you through the process. Being talked through
      a bank approval call by someone who has done it hundreds of times is worth a great deal on the day it happens.
    </Paragraph>
    <ChapterTakeaway>
      Verification calls decide real approvals. Prepare for them like a listing appointment.
    </ChapterTakeaway>
  </Chapter>
);

export const CardCh09 = () => (
  <Chapter id="cg-chapter-9">
    <ChapterHeader number="CHAPTER 9" title="Using cards for things that don't take cards" />
    <Paragraph>
      Contractors, some vendors, and many obligations do not accept cards. Third-party balance transfer and bill-pay
      services exist to bridge that gap — and they charge fees for doing so.
    </Paragraph>
    <Paragraph>
      Those fees are real money. Read the fee schedule, calculate the total cost, and compare it honestly against
      your alternatives before you use any such service.
    </Paragraph>
    <Callout variant="warning">
      <SubHeading>Run the number first</SubHeading>
      <Paragraph className="m-0">
        Cost of access plus cost of carry, against the return you expect from the spend. If the math does not work on
        paper, it will not work in your bank account.
      </Paragraph>
    </Callout>
    <ChapterTakeaway>
      Access to cash from cards is possible and it is never free. Price it before you use it.
    </ChapterTakeaway>
  </Chapter>
);

export const CardCh10 = () => (
  <Chapter id="cg-chapter-10">
    <ChapterHeader number="CHAPTER 10" title="Real estate use cases that actually pencil" />
    <Paragraph>
      The best uses of business credit share one trait: the spend has a plausible path back to revenue. Here are the
      patterns I see most often, presented as illustrative examples rather than typical results.
    </Paragraph>
    <div className="grid md:grid-cols-2 gap-4 my-8">
      {[
        {
          title: "The listing agent",
          body: "Fronts staging, photography, and a launch marketing budget on a business card, then repays from the commission the listing produces.",
        },
        {
          title: "The broker between closings",
          body: "Covers payroll, office rent, and dues during a slow month without touching personal savings or personal cards.",
        },
        {
          title: "The investor",
          body: "Funds a light rehab — materials, labor deposits, permits — inside a defined repayment window tied to the sale or refinance.",
        },
        {
          title: "The team builder",
          body: "Invests in a transaction coordinator, CRM, and lead spend before the revenue those hires create shows up.",
        },
      ].map((c) => (
        <div key={c.title} className="rounded-2xl bg-card border border-border p-5 shadow-[0_8px_18px_rgba(11,31,59,.06)]">
          <h4 className="font-bold text-secondary text-lg mb-2">{c.title}</h4>
          <p className="text-sm text-foreground/85 leading-relaxed m-0">{c.body}</p>
        </div>
      ))}
    </div>
    <Callout variant="important">
      <SubHeading>The discipline test</SubHeading>
      <Paragraph className="m-0">
        If you cannot name the source of repayment and the date, the spend is not ready to be funded.
      </Paragraph>
    </Callout>
    <ChapterTakeaway>
      Use capital to create capacity. Fund things that produce income, on a repayment plan you wrote down first.
    </ChapterTakeaway>
  </Chapter>
);

export const CardCh11 = () => (
  <Chapter id="cg-chapter-11">
    <ChapterHeader number="CHAPTER 11" title="How to spot a bad stacking company" />
    <Paragraph>
      This industry has good operators and bad ones. The bad ones tend to sound the same, so here is the short list
      of red flags.
    </Paragraph>
    <ul className="my-4 space-y-2 text-base md:text-lg text-foreground/90">
      {[
        "Promises of guaranteed approval, guaranteed funding amounts, or guaranteed timelines",
        "Claims of special or insider relationships with banks",
        "Any suggestion of no credit check, or that this will not affect your personal credit at all",
        "Encouraging you to misstate revenue, time in business, or the purpose of the funds",
        "Large fees with no coaching, no support, and no one available when a bank calls you",
        "Calling it a loan or a line of credit, or blurring it with credit repair",
      ].map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-destructive" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
    <JessieNote title="What honest sounds like">
      <p>
        No one has a back door at the banks. What a good partner actually provides is preparation, sequencing,
        coaching through the approval process, and support across multiple rounds over time.
      </p>
    </JessieNote>
    <ChapterTakeaway>
      Certainty is the red flag. Preparation and support are the product.
    </ChapterTakeaway>
  </Chapter>
);

export const CardCh12 = () => (
  <Chapter id="cg-chapter-12">
    <ChapterHeader number="CHAPTER 12" title="What this is not" />
    <div className="grid sm:grid-cols-2 gap-4 my-6">
      {[
        { t: "Not a loan", b: "No lump sum is disbursed. These are revolving business credit card accounts." },
        { t: "Not a line of credit", b: "Business credit cards can be used like a line of credit, but they are a different product with different terms." },
        { t: "Not credit repair", b: "Nothing here removes, disputes, or alters items on your credit reports." },
        { t: "Not a guarantee", b: "Every credit decision is made by third-party issuers. Approvals and amounts vary." },
      ].map((x) => (
        <div key={x.t} className="rounded-2xl border border-border bg-card p-5">
          <h4 className="font-bold text-secondary mb-1">{x.t}</h4>
          <p className="text-sm text-foreground/85 m-0 leading-relaxed">{x.b}</p>
        </div>
      ))}
    </div>
    <ChapterTakeaway>
      Knowing exactly what a strategy is — and is not — is what keeps you out of trouble with it.
    </ChapterTakeaway>
  </Chapter>
);

export const CardCh13 = () => (
  <Chapter id="cg-chapter-13">
    <ChapterHeader number="CHAPTER 13" title="Your next step" />
    <Paragraph>
      If the structure chapters made you realize your foundation is not finished, start there. Your free Customized
      Plan takes about five minutes and tells you which gaps to close first, in order.
    </Paragraph>
    <Paragraph>
      If your foundation is solid and you want experienced help sequencing applications and getting through bank
      approval calls, that is what the funding partner program is for. {PARTNER_PROGRAM_SUMMARY}
    </Paragraph>
    <Callout variant="info">
      <SubHeading>Order of operations</SubHeading>
      <Paragraph className="m-0">
        Structure first. Then profile. Then applications. Skipping ahead is the most expensive mistake in this whole
        guide.
      </Paragraph>
    </Callout>
    <ChapterTakeaway>
      Read, then plan, then implement — in that order, at whatever pace fits your business.
    </ChapterTakeaway>
  </Chapter>
);

export const CardConclusion = () => (
  <Chapter id="cg-conclusion">
    <ChapterHeader title="Closing message from Jessie" />
    <Paragraph>
      I am not interested in convincing anyone to take on debt. I am interested in real estate professionals having
      options before they need them — because the moment you need money is the worst possible moment to start
      looking for it.
    </Paragraph>
    <Paragraph>
      Build the structure. Build the profile. Then, if it fits your business and your risk tolerance, build the
      capacity. Do it in that order and you will be in a very different position the next time the market turns.
    </Paragraph>
    <JessieNote title="One last thing">
      <p>
        Ask questions. Read the fine print. Make the bank explain the terms. Nobody has ever regretted being the
        careful one.
      </p>
    </JessieNote>
  </Chapter>
);