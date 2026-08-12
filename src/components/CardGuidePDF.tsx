import { Document, Page, Text, View, Link, StyleSheet } from "@react-pdf/renderer";
import { FULL_DISCLOSURES, AFFILIATE_DISCLOSURE_SHORT, RESULTS_STATEMENT } from "@/config/partner";

const NAVY = "#0B1F3B";
const TEAL = "#12B886";
const AMBER = "#FFB020";
const BG = "#F7FAFC";
const BORDER = "#E6EEF5";
const TEXT = "#233044";
const MUTED = "#6B7A90";

const s = StyleSheet.create({
  page: {
    backgroundColor: "#FFFFFF",
    paddingTop: 54,
    paddingBottom: 64,
    paddingHorizontal: 64,
    fontSize: 11,
    lineHeight: 1.7,
    fontFamily: "Helvetica",
    color: TEXT,
  },
  coverPage: { backgroundColor: BG, padding: 0 },
  band: { height: 8, backgroundColor: TEAL },
  coverInner: { paddingTop: 90, paddingHorizontal: 64, alignItems: "center" },
  eyebrow: { fontSize: 10.5, color: TEAL, letterSpacing: 2.5, marginBottom: 14, fontFamily: "Helvetica-Bold" },
  coverTitle: { fontSize: 26, fontFamily: "Helvetica-Bold", color: NAVY, textAlign: "center", marginBottom: 14, lineHeight: 1.25 },
  coverSub: { fontSize: 12.5, color: TEXT, textAlign: "center", lineHeight: 1.55, maxWidth: 400, marginBottom: 20 },
  coverAuthor: { fontSize: 11, color: NAVY, fontFamily: "Helvetica-Bold", textAlign: "center" },
  coverMeta: { fontSize: 10, color: MUTED, textAlign: "center", marginTop: 2 },
  coverNote: { fontSize: 9, color: MUTED, textAlign: "center", marginTop: 28, maxWidth: 420, lineHeight: 1.5 },
  h1: { fontSize: 20, fontFamily: "Helvetica-Bold", color: NAVY, marginBottom: 8, lineHeight: 1.3 },
  chapterLabel: { fontSize: 9.5, fontFamily: "Helvetica-Bold", color: TEAL, letterSpacing: 1.5, marginBottom: 5 },
  divider: { borderBottom: `2 solid ${TEAL}`, marginBottom: 14, width: 70 },
  h2: { fontSize: 13, fontFamily: "Helvetica-Bold", color: NAVY, marginTop: 14, marginBottom: 6 },
  body: { fontSize: 11, lineHeight: 1.7, marginBottom: 8 },
  bullet: { fontSize: 11, lineHeight: 1.65, marginLeft: 12, marginBottom: 3 },
  callout: { backgroundColor: "#E8F8F2", borderLeft: `4 solid ${TEAL}`, padding: 12, marginVertical: 10, borderRadius: 6 },
  warn: { backgroundColor: "#FFF5DE", borderLeft: `4 solid ${AMBER}`, padding: 12, marginVertical: 10, borderRadius: 6 },
  calloutTitle: { fontSize: 10.5, fontFamily: "Helvetica-Bold", color: NAVY, marginBottom: 3 },
  calloutText: { fontSize: 10.5, lineHeight: 1.6 },
  takeaway: { backgroundColor: BG, border: `1 solid ${BORDER}`, padding: 12, marginTop: 12, borderRadius: 8 },
  takeawayLabel: { fontSize: 9, fontFamily: "Helvetica-Bold", color: TEAL, letterSpacing: 1.2, marginBottom: 3 },
  tocRow: { flexDirection: "row", marginBottom: 6 },
  tocText: { fontSize: 11, color: TEXT },
  discTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", color: NAVY, marginBottom: 3, marginTop: 10 },
  discBody: { fontSize: 9.5, lineHeight: 1.6, color: TEXT },
  footer: { position: "absolute", bottom: 28, left: 64, right: 64, fontSize: 8.5, color: MUTED, textAlign: "center" },
});

type Block =
  | { k: "p"; t: string }
  | { k: "h2"; t: string }
  | { k: "ul"; items: string[] }
  | { k: "callout"; title: string; t: string }
  | { k: "warn"; title: string; t: string }
  | { k: "takeaway"; t: string };

const chapters: { label?: string; title: string; blocks: Block[] }[] = [
  {
    title: "Welcome from Jessie Hunter",
    blocks: [
      { k: "p", t: "Twice in my real estate career the market changed faster than my income could adjust — 2008 and 2020. Both times I got through it on personal credit, personal savings, and personal risk. That is the expensive way to survive a slow quarter." },
      { k: "p", t: "When I started studying business funding seriously, one strategy kept coming up: using a coordinated set of business credit cards, opened in a deliberate sequence, as flexible working capital for the business. In the funding world it is usually called credit card stacking." },
      { k: "p", t: "This guide explains how it works, who it fits, what it costs, what can go wrong, and how it connects to the business structure work in the main RE Pro Business Finance & Credit Guide. It is written for Realtors first, and applies just as well to brokers, investors, and other real estate professionals." },
      { k: "callout", title: "What this guide is", t: `Education and coaching guidance. It is not legal, tax, accounting, or investment advice, and it is not an offer of credit. ${RESULTS_STATEMENT}` },
    ],
  },
  {
    label: "CHAPTER 1",
    title: "What credit card stacking actually is",
    blocks: [
      { k: "p", t: "Credit card stacking is the practice of applying for several business credit cards in a planned sequence so the approved limits, taken together, give your business meaningful spending capacity — capacity you can use much the way you would use a line of credit." },
      { k: "p", t: "The key words are business, planned, and sequence. One card applied for at random is not a strategy. A set of business cards opened in a deliberate order, with the business information presented consistently to every issuer, is." },
      { k: "h2", t: "What it is not" },
      { k: "p", t: "It is not a loan. It is not a business line of credit product. It is not credit repair. And it is not a shortcut around underwriting — every application is reviewed by a real issuer that can approve or decline it." },
      { k: "takeaway", t: "Stacking is sequencing. The value comes from planning and preparation, not from the number of applications." },
    ],
  },
  {
    label: "CHAPTER 2",
    title: "Why real estate income changes the math",
    blocks: [
      { k: "p", t: "A salaried business owner gets paid on the 1st and the 15th. You get paid when escrow closes. Your expenses do not follow that rhythm — photography, staging, ad spend, dues, insurance, and household bills all arrive on their own schedule." },
      { k: "p", t: "That gap is where most real estate professionals reach for a personal card. It works, and it quietly raises personal utilization while leaving the business with no credit history of its own." },
      { k: "warn", title: "The lumpy-income trap", t: "Carrying business expenses on personal cards can push personal utilization high right when you are also applying for a mortgage, a car, or new credit." },
      { k: "takeaway", t: "Commission income is lumpy. Business credit capacity is how you smooth the gap without borrowing against your personal profile every time." },
    ],
  },
  {
    label: "CHAPTER 3",
    title: "Business cards vs personal cards",
    blocks: [
      { k: "p", t: "Most business credit cards report balances and utilization to the business bureaus rather than to your personal consumer report — while still typically reporting to you personally if the account goes seriously delinquent." },
      { k: "p", t: "Practically, a large marketing month on a business card usually does not spike personal utilization the way the same spend on a personal card would. Reporting practices vary by issuer, so confirm rather than assume." },
      { k: "takeaway", t: "The point of business cards is not just capacity. It is keeping business activity off your personal report." },
    ],
  },
  {
    label: "CHAPTER 4",
    title: "Personal guarantee, personal liability, and what gets reported",
    blocks: [
      { k: "p", t: "Almost every business credit card a newer business can get requires a personal guarantee. You are personally responsible for the balance, and applications generally involve a credit inquiry." },
      { k: "p", t: "Over time, as the business builds revenue, banking history, and its own credit profile, some products reduce or remove that requirement. That is a destination, not a starting point." },
      { k: "takeaway", t: "Expect a personal guarantee early. Work toward the profile where it matters less." },
    ],
  },
  {
    label: "CHAPTER 5",
    title: "The introductory rate window — a tool, not free money",
    blocks: [
      { k: "p", t: "Many business credit cards offer an introductory rate for a limited period. Used well, that window lets you fund a marketing push or a renovation and repay it out of the closing it helps create." },
      { k: "p", t: "When the introductory period ends, the card's standard rate applies to whatever is left. Terms are set by the issuer and can change. Write the end date on your calendar the week you open the account." },
      { k: "takeaway", t: "An introductory rate is a repayment deadline with a discount attached, not a reason to borrow more." },
    ],
  },
  {
    label: "CHAPTER 6",
    title: "Why the business entity comes first",
    blocks: [
      { k: "p", t: "Business card applications ask business questions: legal name, entity type, EIN, industry code, business address and phone, time in business, and revenue. Answering those consistently across issuers is a large part of why some applicants are approved and others are not." },
      { k: "p", t: "In real estate this gets nuanced, because your license may sit with you personally while operations run through an entity. Confirm your structure with your broker, CPA, attorney, and state licensing board before you file anything." },
      { k: "h2", t: "The foundation checklist" },
      {
        k: "ul",
        items: [
          "Entity confirmed with your CPA and attorney (and allowed by your state licensing board)",
          "EIN issued and used consistently",
          "Business bank account, separate from personal",
          "Business address and business phone that can be verified",
          "Business email on your own domain and a working website",
          "Accurate industry code and clean, current bookkeeping",
        ],
      },
      { k: "takeaway", t: "The application is downstream of the structure. Fix the structure and the applications get easier." },
    ],
  },
  {
    label: "CHAPTER 7",
    title: "The application sequence: why order and timing drive outcomes",
    blocks: [
      { k: "p", t: "Issuers differ in what they weigh, how they treat recent inquiries, and how many of their own accounts they will extend. A coordinated sequence takes that into account. A scattershot afternoon of applications does not." },
      { k: "p", t: "Rounds are usually spaced by months, not days, so new accounts have time to season and report before the next round. Between rounds you use the accounts responsibly, keep utilization sane, and pay on time." },
      { k: "takeaway", t: "Sequence and spacing are the strategy. Patience between rounds is what compounds capacity." },
    ],
  },
  {
    label: "CHAPTER 8",
    title: "The part nobody prepares you for: bank verification calls",
    blocks: [
      { k: "p", t: "Applications frequently go to manual review, and a bank representative calls to verify the business. This is routine — and it is where unprepared applicants lose approvals they had already earned." },
      { k: "p", t: "They may ask what the business does, how long it has operated, what it earns, where it is located, and how to reach it. If your answers do not match your application, the file stalls." },
      { k: "callout", title: "Be reachable and be consistent", t: "Answer your business phone professionally. Know your own numbers. Keep one version of your business facts and use it everywhere." },
      { k: "takeaway", t: "Verification calls decide real approvals. Prepare for them like a listing appointment." },
    ],
  },
  {
    label: "CHAPTER 9",
    title: "Using cards for things that don't take cards",
    blocks: [
      { k: "p", t: "Contractors, some vendors, and many obligations do not accept cards. Third-party balance transfer and bill-pay services exist to bridge that gap — and they charge fees for doing so." },
      { k: "p", t: "Those fees are real money. Read the fee schedule, calculate the total cost, and compare it honestly against your alternatives before using any such service." },
      { k: "takeaway", t: "Access to cash from cards is possible and it is never free. Price it before you use it." },
    ],
  },
  {
    label: "CHAPTER 10",
    title: "Real estate use cases that actually pencil",
    blocks: [
      { k: "p", t: "The best uses of business credit share one trait: the spend has a plausible path back to revenue. These are illustrative examples, not typical results." },
      {
        k: "ul",
        items: [
          "The listing agent fronts staging, photography, and a launch marketing budget, then repays from the commission the listing produces.",
          "The broker covers payroll, office rent, and dues during a slow month without touching personal savings.",
          "The investor funds a light rehab inside a defined repayment window tied to the sale or refinance.",
          "The team builder invests in a transaction coordinator, CRM, and lead spend ahead of the revenue those create.",
        ],
      },
      { k: "warn", title: "The discipline test", t: "If you cannot name the source of repayment and the date, the spend is not ready to be funded." },
      { k: "takeaway", t: "Use capital to create capacity. Fund things that produce income, on a repayment plan you wrote down first." },
    ],
  },
  {
    label: "CHAPTER 11",
    title: "How to spot a bad stacking company",
    blocks: [
      {
        k: "ul",
        items: [
          "Promises of guaranteed approval, guaranteed funding amounts, or guaranteed timelines",
          "Claims of special or insider relationships with banks",
          "Any suggestion of no credit check, or that this will not affect your personal credit at all",
          "Encouraging you to misstate revenue, time in business, or the purpose of the funds",
          "Large fees with no coaching, no support, and no one available when a bank calls you",
          "Calling it a loan or a line of credit, or blurring it with credit repair",
        ],
      },
      { k: "p", t: "No one has a back door at the banks. What a good partner actually provides is preparation, sequencing, coaching through the approval process, and support across multiple rounds over time." },
      { k: "takeaway", t: "Certainty is the red flag. Preparation and support are the product." },
    ],
  },
  {
    label: "CHAPTER 12",
    title: "What this is not",
    blocks: [
      {
        k: "ul",
        items: [
          "Not a loan. No lump sum is disbursed; these are revolving business credit card accounts.",
          "Not a line of credit. Business credit cards can be used like a line of credit but are a different product.",
          "Not credit repair. Nothing here removes, disputes, or alters items on your credit reports.",
          "Not a guarantee. Every credit decision is made by third-party issuers.",
        ],
      },
      { k: "takeaway", t: "Knowing exactly what a strategy is — and is not — is what keeps you out of trouble with it." },
    ],
  },
  {
    label: "CHAPTER 13",
    title: "Your next step",
    blocks: [
      { k: "p", t: "If the structure chapters made you realize your foundation is not finished, start there. Your free Customized Plan takes about five minutes and tells you which gaps to close first, in order." },
      { k: "p", t: "If your foundation is solid and you want experienced help sequencing applications and getting through bank approval calls, that is what the funding partner program is for: a 12-month coaching and support program covering entity setup, strategic application sequencing, business credit profile building, and ongoing coaching across multiple rounds." },
      { k: "takeaway", t: "Read, then plan, then implement — in that order, at whatever pace fits your business." },
    ],
  },
  {
    title: "Closing message from Jessie",
    blocks: [
      { k: "p", t: "I am not interested in convincing anyone to take on debt. I am interested in real estate professionals having options before they need them — because the moment you need money is the worst possible moment to start looking for it." },
      { k: "p", t: "Build the structure. Build the profile. Then, if it fits your business and your risk tolerance, build the capacity." },
    ],
  },
];

const renderBlock = (b: Block, i: number) => {
  switch (b.k) {
    case "h2":
      return <Text key={i} style={s.h2}>{b.t}</Text>;
    case "ul":
      return (
        <View key={i}>
          {b.items.map((it, j) => (
            <Text key={j} style={s.bullet}>{`•  ${it}`}</Text>
          ))}
        </View>
      );
    case "callout":
    case "warn":
      return (
        <View key={i} style={b.k === "callout" ? s.callout : s.warn}>
          <Text style={s.calloutTitle}>{b.title}</Text>
          <Text style={s.calloutText}>{b.t}</Text>
        </View>
      );
    case "takeaway":
      return (
        <View key={i} style={s.takeaway}>
          <Text style={s.takeawayLabel}>CHAPTER TAKEAWAY</Text>
          <Text style={s.calloutText}>{b.t}</Text>
        </View>
      );
    default:
      return <Text key={i} style={s.body}>{b.t}</Text>;
  }
};

const CardGuidePDF = () => (
  <Document
    title="RE Pro Business Credit Card Guide — How & Why of Credit Card Stacking"
    author="Jessie Hunter · RE Pro Business Credit"
  >
    {/* Cover */}
    <Page size="LETTER" style={[s.page, s.coverPage]}>
      <View style={s.band} />
      <View style={s.coverInner}>
        <Text style={s.eyebrow}>RE PRO BUSINESS CREDIT · FREE GUIDE</Text>
        <Text style={s.coverTitle}>
          The RE Pro Business Credit Card Guide{"\n"}The How &amp; Why of Credit Card Stacking
        </Text>
        <Text style={s.coverSub}>
          How real estate professionals use a planned sequence of business credit cards as working capital — the
          strategy, the tradeoffs, the fees, and the order of operations.
        </Text>
        <Text style={s.coverAuthor}>by Jessie Hunter</Text>
        <Text style={s.coverMeta}>Real Estate Broker · California &amp; Georgia</Text>
        <Text style={s.coverNote}>{AFFILIATE_DISCLOSURE_SHORT}</Text>
        <Text style={s.coverNote}>
          Educational only. Not legal, tax, accounting, or investment advice, and not an offer of credit.
        </Text>
      </View>
    </Page>

    {/* Table of contents */}
    <Page size="LETTER" style={s.page}>
      <Text style={s.h1}>Table of Contents</Text>
      <View style={s.divider} />
      {chapters.map((c, i) => (
        <View key={i} style={s.tocRow}>
          <Text style={s.tocText}>{c.label ? `${c.label.replace("CHAPTER ", "")}. ${c.title}` : c.title}</Text>
        </View>
      ))}
      <View style={s.tocRow}>
        <Text style={s.tocText}>Resources &amp; full disclosures</Text>
      </View>
      <Text style={s.footer} fixed>
        RE Pro Business Credit · A specialized program of My Better Business Credit
      </Text>
    </Page>

    {/* Chapters */}
    {chapters.map((c, i) => (
      <Page key={i} size="LETTER" style={s.page}>
        {c.label && <Text style={s.chapterLabel}>{c.label}</Text>}
        <Text style={s.h1}>{c.title}</Text>
        <View style={s.divider} />
        {c.blocks.map(renderBlock)}
        <Text style={s.footer} fixed>
          RE Pro Business Credit ·{" "}
          <Link src="https://reprobusinesscredit.com/card-guide">reprobusinesscredit.com/card-guide</Link>
        </Text>
      </Page>
    ))}

    {/* Disclosures */}
    <Page size="LETTER" style={s.page}>
      <Text style={s.h1}>Resources &amp; full disclosures</Text>
      <View style={s.divider} />
      <Text style={s.discBody}>{AFFILIATE_DISCLOSURE_SHORT}</Text>
      {FULL_DISCLOSURES.map((d) => (
        <View key={d.title}>
          <Text style={s.discTitle}>{d.title}</Text>
          <Text style={s.discBody}>{d.body}</Text>
        </View>
      ))}
      <Text style={s.footer} fixed>
        RE Pro Business Credit · A specialized program of My Better Business Credit
      </Text>
    </Page>
  </Document>
);

export default CardGuidePDF;