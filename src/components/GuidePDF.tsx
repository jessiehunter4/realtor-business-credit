import {
  Document,
  Page,
  Text,
  View,
  Link,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';
import heroImg from '@/assets/guide/hero-agent.jpg';
import jessieHeadshot from '@/assets/jessie-hunter-headshot.png.asset.json';
import structureDiagram from '@/assets/guide-structure-diagram.png.asset.json';
import structureHowItWorks from '@/assets/guide-structure-how-it-works.png.asset.json';

const SITE_URL = 'https://reprobusinesscredit.com';
const PLAN_URL = 'https://reprobusinesscredit.com/intake';

// CDN asset pointers are same-origin paths (/__l5e/assets-v1/...).
// The PDF is rendered client-side, so we resolve to absolute URLs at render time.
const cdn = (path: string) => {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}${path}`;
  }
  return `${SITE_URL}${path}`;
};
const headshotSrc = cdn(jessieHeadshot.url);
const structureDiagramSrc = cdn(structureDiagram.url);
const structureHowItWorksSrc = cdn(structureHowItWorks.url);

// Brand palette (mirrors --rbc-* tokens)
const NAVY = '#0B1F3B';
const TEAL = '#12B886';
const SKY = '#3AA9FF';
const CORAL = '#FF6B6B';
const AMBER = '#FFB020';
const BG = '#F7FAFC';
const CARD = '#FFFFFF';
const BORDER = '#E6EEF5';
const TEXT = '#233044';
const MUTED = '#6B7A90';

const s = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: CARD,
    paddingTop: 54,
    paddingBottom: 72,
    paddingHorizontal: 64,
    fontSize: 11,
    lineHeight: 1.7,
    fontFamily: 'Helvetica',
    color: TEXT,
  },

  // Cover
  coverPage: {
    backgroundColor: NAVY,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 60,
  },
  coverEyebrow: { fontSize: 11, color: TEAL, letterSpacing: 2, marginBottom: 16, fontFamily: 'Helvetica-Bold' },
  coverTitle: { fontSize: 30, fontFamily: 'Helvetica-Bold', color: '#FFFFFF', textAlign: 'center', marginBottom: 18, lineHeight: 1.25 },
  coverHighlight: { color: TEAL },
  coverSubtitle: { fontSize: 14, color: '#CFE3FF', textAlign: 'center', marginBottom: 32, lineHeight: 1.5, maxWidth: 380 },
  coverAuthor: { fontSize: 12, color: '#FFFFFF', textAlign: 'center', marginTop: 40 },
  coverBrand: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: TEAL, textAlign: 'center', marginTop: 6 },
  coverCopyright: { fontSize: 9, color: '#8AA0BE', textAlign: 'center', marginTop: 28, lineHeight: 1.5 },

  // Headings
  eyebrow: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: TEAL, marginBottom: 6, letterSpacing: 1.5 },
  h1: { fontSize: 22, fontFamily: 'Helvetica-Bold', color: NAVY, marginBottom: 10, marginTop: 0, lineHeight: 1.3 },
  h2: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: NAVY, marginBottom: 8, marginTop: 18 },
  divider: { borderBottom: `2 solid ${TEAL}`, marginBottom: 16, width: 80 },

  // Body
  body: { fontSize: 11, lineHeight: 1.7, marginBottom: 8, color: TEXT },
  bold: { fontFamily: 'Helvetica-Bold' },
  bullet: { fontSize: 11, lineHeight: 1.7, marginLeft: 14, marginBottom: 3, color: TEXT },
  olItem: { fontSize: 11, lineHeight: 1.7, marginLeft: 14, marginBottom: 3, color: TEXT },

  // Callouts (bright)
  calloutInfo: { backgroundColor: '#E8F8F2', borderLeft: `4 solid ${TEAL}`, padding: 14, marginVertical: 10, borderRadius: 6 },
  calloutSky: { backgroundColor: '#E8F3FF', borderLeft: `4 solid ${SKY}`, padding: 14, marginVertical: 10, borderRadius: 6 },
  calloutWarn: { backgroundColor: '#FFF5DE', borderLeft: `4 solid ${AMBER}`, padding: 14, marginVertical: 10, borderRadius: 6 },
  calloutCoral: { backgroundColor: '#FFECEC', borderLeft: `4 solid ${CORAL}`, padding: 14, marginVertical: 10, borderRadius: 6 },
  calloutTitle: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: NAVY, marginBottom: 4 },
  calloutText: { fontSize: 10.5, lineHeight: 1.65, color: TEXT },

  // Story sidebar
  storyBox: { backgroundColor: BG, border: `1 solid ${BORDER}`, padding: 16, marginVertical: 12, borderRadius: 8 },
  storyTitle: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: TEAL, marginBottom: 6, letterSpacing: 0.5 },

  // Key takeaway
  keyTakeaway: { backgroundColor: '#FFF8E6', border: `1 solid ${AMBER}`, padding: 14, marginVertical: 12, borderRadius: 8 },
  keyTakeawayTitle: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: NAVY, marginBottom: 6 },

  // Big CTA
  bigCtaBox: { backgroundColor: NAVY, padding: 22, marginVertical: 16, borderRadius: 10 },
  bigCtaTitle: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: '#FFFFFF', marginBottom: 10, textAlign: 'center' },
  bigCtaText: { fontSize: 11, color: '#CFE3FF', textAlign: 'center', lineHeight: 1.6, marginBottom: 10 },
  bigCtaLink: { fontSize: 12, color: TEAL, textAlign: 'center', textDecoration: 'underline', fontFamily: 'Helvetica-Bold' },

  link: { color: SKY, textDecoration: 'underline' },

  // Footer
  footer: { position: 'absolute', bottom: 28, left: 64, right: 64, flexDirection: 'row', justifyContent: 'space-between' },
  footerLeft: { fontSize: 8, color: MUTED },
  footerRight: { fontSize: 8, color: MUTED },

  // TOC
  tocEntry: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottom: `0.5 solid ${BORDER}` },
  tocLabel: { fontSize: 11, color: NAVY, fontFamily: 'Helvetica-Bold' },
  tocPage: { fontSize: 11, color: MUTED },

  // Status row (Strong / Watch / Missing)
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  statusPill: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: '#FFFFFF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginRight: 8 },
});

// ---- helpers ----
const P = ({ children, style = {} }: { children: React.ReactNode; style?: any }) => (
  <Text style={[s.body, style]}>{children}</Text>
);
const B = ({ children }: { children: React.ReactNode }) => (
  <Text style={s.bold}>{children}</Text>
);
const Bullet = ({ children }: { children: React.ReactNode }) => (
  <Text style={s.bullet}>• {children}</Text>
);
const OL = ({ num, children }: { num: number; children: React.ReactNode }) => (
  <Text style={s.olItem}>{num}. {children}</Text>
);

const PageFooter = () => (
  <View style={s.footer} fixed>
    <Text style={s.footerLeft}>© 2026 RealtorBusinessCredit.com</Text>
    <Text style={s.footerRight} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
  </View>
);

const ChapterStart = ({ label, title }: { label?: string; title: string }) => (
  <View minPresenceAhead={120}>
    {label && <Text style={s.eyebrow}>{label}</Text>}
    <Text style={s.h1}>{title}</Text>
    <View style={s.divider} />
  </View>
);

const Takeaway = ({ chapter, items }: { chapter: string; items: string[] }) => (
  <View style={s.keyTakeaway} wrap={false}>
    <Text style={s.keyTakeawayTitle}>{chapter} takeaways</Text>
    {items.map((item, i) => (
      <Text key={i} style={[s.calloutText, { marginLeft: 10, marginBottom: 3 }]}>• {item}</Text>
    ))}
  </View>
);

const BookCTA = () => (
  <View style={s.bigCtaBox} wrap={false}>
    <Text style={s.bigCtaTitle}>Book your free 1:1</Text>
    <Text style={s.bigCtaText}>
      5 minutes for the Needs Analysis. 30 minutes together.{'\n'}
      You leave with your Custom RE Pro Business Structure, Finance &amp; Credit Plan.
    </Text>
    <Link src={CTA_URL} style={s.bigCtaLink}>RealtorBusinessCredit.com/one-on-one →</Link>
    <Text style={[s.bigCtaText, { marginTop: 8, fontSize: 9, color: '#8AA0BE' }]}>
      No cost. No obligation. No pressure.
    </Text>
  </View>
);

const StatusItem = ({ status, label }: { status: 'Strong' | 'Watch' | 'Missing'; label: string }) => {
  const color = status === 'Strong' ? TEAL : status === 'Watch' ? AMBER : CORAL;
  return (
    <View style={s.statusRow}>
      <Text style={[s.statusPill, { backgroundColor: color }]}>{status.toUpperCase()}</Text>
      <Text style={{ fontSize: 10.5, color: TEXT, flex: 1 }}>{label}</Text>
    </View>
  );
};

// ============= DOCUMENT =============
export const GuidePDF = () => (
  <Document
    title="RE Pro Business Structure, Finance & Credit Guide"
    author="Jessie Hunter"
    subject="Business Structure, Finance & Credit for Real Estate Professionals"
  >
    {/* COVER */}
    <Page size="LETTER" style={s.coverPage}>
      <View style={{ alignItems: 'center' }}>
        <Text style={s.coverEyebrow}>RE PRO BUSINESS CREDIT</Text>
        <Text style={s.coverTitle}>
          The Realtor Business{'\n'}
          <Text style={s.coverHighlight}>Structure, Finance &amp; Credit</Text>{'\n'}Guide
        </Text>
        <Text style={s.coverSubtitle}>
          A practical, Realtor-specific path to a fundable business — and a custom plan built with you in your free 1:1.
        </Text>
        <Text style={s.coverAuthor}>by Jessie Hunter</Text>
        <Text style={{ fontSize: 10, color: '#CFE3FF', textAlign: 'center', marginTop: 4 }}>
          Real Estate Broker · California &amp; Georgia
        </Text>
        <Text style={s.coverBrand}>RE Pro Business Credit</Text>
        <Text style={s.coverCopyright}>
          © 2026 RealtorBusinessCredit.com — All Rights Reserved.{'\n'}Educational purposes only.
        </Text>
      </View>
    </Page>

    {/* TOC */}
    <Page size="LETTER" style={s.page}>
      <Text style={s.eyebrow}>CONTENTS</Text>
      <Text style={s.h1}>What's in this guide</Text>
      <View style={s.divider} />
      {[
        ['Introduction — You just closed. Now what?', '3'],
        ['Chapter 1 — Why most Realtors never build a real foundation', '4'],
        ['Chapter 2 — The Realtor business model & fundability', '5'],
        ['Chapter 3 — Business structure options for Realtors', '6'],
        ['Chapter 4 — Commission-to-entity compliance', '7'],
        ['Chapter 5 — Asset protection basics & where trusts fit', '8'],
        ['Chapter 6 — The 3-Account Financial Foundation', '9'],
        ['Chapter 7 — Bookkeeping & documentation lenders look for', '10'],
        ['Chapter 8 — Fundability signals checklist', '11'],
        ['Chapter 9 — Business credit: how it really works', '12'],
        ['Chapter 10 — The Realtor Credit Ladder', '13'],
        ['Chapter 11 — Common mistakes & objections', '14'],
        ['Chapter 12 — Your 30 / 60 / 90-day action plan', '15'],
        ['Chapter 13 — Custom Plan + Program: your next step', '16'],
        ['Conclusion & Resources', '17'],
      ].map(([label, page], i) => (
        <View key={i} style={s.tocEntry}>
          <Text style={s.tocLabel}>{label}</Text>
          <Text style={s.tocPage}>{page}</Text>
        </View>
      ))}
      <PageFooter />
    </Page>

    {/* INTRODUCTION */}
    <Page size="LETTER" style={s.page}>
      <ChapterStart label="INTRODUCTION" title="You just closed. Now what?" />
      <P>That commission feels good. But where does the money actually go — and what does it build?</P>
      <P>On a $15,000 commission, most Realtors net about a third after taxes, splits and expenses. And most of those expenses get charged to a <B>personal</B> credit card, raising personal utilization, dropping personal scores, and quietly making future mortgages, refis and auto loans more expensive.</P>
      <View style={s.calloutCoral} wrap={false}>
        <Text style={s.calloutTitle}>The hidden tax</Text>
        <Text style={s.calloutText}>$3,000 of business spend on a personal card can cost you 20+ FICO points and show up months later as a worse mortgage rate. Nobody warned you. That's what this guide fixes.</Text>
      </View>
      <Text style={s.h2}>What this guide does</Text>
      <Bullet>Shows you the structure underneath a real Realtor business.</Bullet>
      <Bullet>Explains how lenders and bureaus actually evaluate you.</Bullet>
      <Bullet>Walks you through the 13-chapter map: structure → finance → credit.</Bullet>
      <Bullet>Hands off to the free 1:1, where we build your custom plan together.</Bullet>
      <Text style={s.h2}>Who it's for</Text>
      <Bullet>Residential and commercial agents and brokers.</Bullet>
      <Bullet>Realtors who are tired of mixing personal and business finances.</Bullet>
      <Bullet>Anyone who just closed and wants the next commission to build something.</Bullet>
      <PageFooter />
    </Page>

    {/* CHAPTER 1 */}
    <Page size="LETTER" style={s.page}>
      <ChapterStart label="CHAPTER 1" title="Why most Realtors never build a real business foundation" />
      <P>You've been trained on contracts, scripts, negotiations and market trends. You've passed exams. You've sat through countless designation classes.</P>
      <P>And yet almost nobody trained you on the part that decides whether your business survives slow months and scales good ones: <B>the business architecture underneath your production.</B></P>
      <Text style={s.h2}>What you were trained on</Text>
      <Bullet>Lead generation and conversion</Bullet>
      <Bullet>Contracts and negotiation</Bullet>
      <Bullet>Scripts and objection handling</Bullet>
      <Bullet>Market and product knowledge</Bullet>
      <Text style={s.h2}>What you were never trained on</Text>
      <Bullet>Entity structure that supports growth</Bullet>
      <Bullet>Clean banking and money flow between closings</Bullet>
      <Bullet>Business credit profiles and funding readiness</Bullet>
      <Bullet>How lenders actually evaluate a Realtor's business</Bullet>
      <View style={s.calloutWarn} wrap={false}>
        <Text style={s.calloutTitle}>The core insight</Text>
        <Text style={s.calloutText}>Business credit is a downstream outcome of business <Text style={s.bold}>structure</Text> and <Text style={s.bold}>finance</Text>. Skip the foundation and the credit never shows up the way you need it.</Text>
      </View>
      <View style={s.storyBox} wrap={false}>
        <Text style={s.storyTitle}>FOUNDER SIDEBAR — "I waited 15 years to find this out"</Text>
        <Text style={s.calloutText}>I'm Jessie Hunter — broker in CA &amp; GA since 2010. Hundreds of closings, dozens of trainings — and not one taught me my real estate business could have its own credit profile, cards, and funding.</Text>
        <Text style={[s.calloutText, { marginTop: 6 }]}>When I needed capital to grow, I did what most Realtors do: maxed personal cards at 18–24%, took a personal loan, then tapped home equity. The concept I was funding wasn't the mistake. <Text style={s.bold}>How I funded it was.</Text></Text>
      </View>
      <Takeaway chapter="Chapter 1" items={[
        'Real estate education skips business architecture almost entirely.',
        'Personal-credit-funded businesses cap their own growth and risk personal finances.',
        'Credit is downstream of structure and finance — fix the foundation first.',
      ]} />
      <PageFooter />
    </Page>

    {/* CHAPTER 2 */}
    <Page size="LETTER" style={s.page}>
      <ChapterStart label="CHAPTER 2" title="The Realtor business model: lumpy income, steady expenses, real fundability" />
      <P>Realtors don't get a salary. You get <B>chunks</B> — large, irregular, taxable. In between, the meter never stops: CRM, ads, signs, staging, photography, mileage, subscriptions, dues.</P>
      <Text style={s.h2}>Why this shape matters</Text>
      <P>Lenders and bureaus aren't grading your production. They're grading the <B>shape and signal of your business identity</B>:</P>
      <Bullet>Stable identity (name, address, phone, email, website, EIN).</Bullet>
      <Bullet>Consistent business banking month over month.</Bullet>
      <Bullet>Documentation that matches your applications.</Bullet>
      <Bullet>Low chaos in statements — no random co-mingled spending.</Bullet>
      <View style={s.calloutInfo} wrap={false}>
        <Text style={s.calloutText}>Your goal isn't "get a card." It's a business that looks fundable from ten angles. That's what unlocks higher limits and lower scrutiny.</Text>
      </View>
      <Text style={s.h2}>The hidden tax of using personal credit</Text>
      <P>Charge $3,000 of business expenses to a personal card and you don't just pay 18–24% interest. You raise your personal utilization, often costing 20+ FICO points — which shows up later as a worse mortgage rate, worse auto loan, or a declined personal application.</P>
      <Takeaway chapter="Chapter 2" items={[
        'Lumpy income, flat expenses — fundability closes that gap.',
        'Lenders evaluate identity, behavior and consistency — not just production.',
        'Business spend on personal cards quietly damages your personal credit and pricing.',
      ]} />
      <PageFooter />
    </Page>

    {/* CHAPTER 3 */}
    <Page size="LETTER" style={s.page}>
      <ChapterStart label="CHAPTER 3" title="Business structure options for Realtors" />
      <P>Structure is a <B>tool</B>, not a religion. The right entity depends on your state's licensing rules, brokerage policies, income level, liability profile and growth plans.</P>
      <Text style={s.h2}>Sole Proprietor</Text>
      <P><B>Best for:</B> early stage, low complexity, limited liability concerns. <B>Pros:</B> simple, cheap, fast. <B>Cons:</B> weaker separation, more exposure, less fundability polish.</P>
      <Text style={s.h2}>LLC</Text>
      <P><B>Best for:</B> many service businesses and asset separation (state-dependent for Realtors). <B>Pros:</B> flexible, liability separation. <B>Cons:</B> may not align with licensing rules in some states; tax election decisions matter.</P>
      <Text style={s.h2}>S-Corp (tax election)</Text>
      <P><B>Best for:</B> higher-income agents wanting tax efficiency and clean structure. <B>Pros:</B> clean identity, owner-pay structure, strong fundability story. <B>Cons:</B> payroll and compliance must be done correctly.</P>
      <Text style={s.h2}>C-Corporation</Text>
      <P><B>Best for:</B> scaling companies with teams, benefits and long-term corporate strategy. <B>Pros:</B> scalable, strong corporate identity. <B>Cons:</B> more complexity, usually not needed for solo agents initially.</P>
      <View style={s.calloutWarn} wrap={false}>
        <Text style={s.calloutTitle}>Confirm with your professionals</Text>
        <Text style={s.calloutText}>Your specific path should be confirmed with your CPA, attorney, broker, and state licensing board. RBC provides education, not legal or tax advice.</Text>
      </View>
      <Takeaway chapter="Chapter 3" items={[
        'There is no universal "best" entity — only the right one for your state, broker, income and goals.',
        'Structure choices affect taxes, liability and fundability all at once.',
        'The free 1:1 maps the right starting structure for your situation.',
      ]} />
      <PageFooter />
    </Page>

    {/* CHAPTER 4 */}
    <Page size="LETTER" style={s.page}>
      <ChapterStart label="CHAPTER 4" title="Commission-to-entity compliance" />
      <P>This is where Realtors get tripped up — and where you protect yourself and your fundability.</P>
      <View style={s.calloutSky} wrap={false}>
        <Text style={s.calloutTitle}>Compliance notice</Text>
        <Text style={s.calloutText}>Commission handling — whether paid to the individual licensee or to an authorized corporation/entity — must comply with state law, brokerage supervision, and CPA/attorney guidance. RBC provides education and a planning framework only.</Text>
      </View>
      <Text style={s.h2}>Why this matters for funding</Text>
      <P>Business credit depends on <B>consistent</B> business banking: income routed through your business accounts, business expenses paid from business accounts, documentation that matches your applications.</P>
      <P>When commissions get deposited to personal accounts and shuffled sporadically, statements look chaotic, deposits don't tie to the entity, and underwriters can't tell what's the business and what's you.</P>
      <Text style={s.h2}>What good looks like</Text>
      <Bullet>A compliant pathway your broker and CPA both sign off on.</Bullet>
      <Bullet>Income deposited (where allowed) into a clearly named business account.</Bullet>
      <Bullet>All business expenses paid from that account or a linked business card.</Bullet>
      <Bullet>A monthly rhythm a stranger could read in 60 seconds.</Bullet>
      <Takeaway chapter="Chapter 4" items={[
        'Commission handling must respect state law, brokerage policy and CPA guidance.',
        'Fundability rewards clean, consistent business banking every month.',
        'The free 1:1 maps your pathway before you make structural moves.',
      ]} />
      <PageFooter />
    </Page>

    {/* CHAPTER 5 */}
    <Page size="LETTER" style={s.page}>
      <ChapterStart label="CHAPTER 5" title="Asset protection basics — and where trusts fit" />
      <P>Most Realtors think asset protection equals "I need an LLC." Real asset protection is <B>layered</B>.</P>
      <Text style={s.h2}>The five layers</Text>
      <OL num={1}><B>Correct entity</B> for how you actually operate.</OL>
      <OL num={2}><B>Correct insurance</B> — E&amp;O, general liability, and personal umbrella.</OL>
      <OL num={3}><B>Correct contracts</B> — clean engagements and disclosures.</OL>
      <OL num={4}><B>Correct separation</B> of personal and business assets, accounts and credit.</OL>
      <OL num={5}><B>Trust planning</B> when family/asset complexity warrants it.</OL>
      <Text style={s.h2}>Where trusts fit</Text>
      <P>Trusts may belong in your plan when you have significant personal assets, real-estate holdings, or want long-term family and business continuity planning.</P>
      <View style={s.calloutInfo} wrap={false}>
        <Text style={s.calloutText}>Your custom plan flags where trust coordination may fit. Execution is handled by an attorney. The program does not draft trusts — it tells you where the conversation belongs.</Text>
      </View>
      <Takeaway chapter="Chapter 5" items={[
        'An LLC alone is not asset protection — it is one of five layers.',
        'Insurance, contracts and clean separation do the daily work.',
        'Trusts enter when assets and family planning justify them.',
      ]} />
      <PageFooter />
    </Page>

    {/* CHAPTER 6 */}
    <Page size="LETTER" style={s.page}>
      <ChapterStart label="CHAPTER 6" title="The 3-Account Financial Foundation for Realtors" />
      <P>Realtors love simple systems. Here's the simplest one that solves lumpy income and makes your business look fundable.</P>
      <Text style={s.h2}>The three accounts</Text>
      <Bullet><B>Operating Checking</B> — where every commission lands and every business expense is paid.</Bullet>
      <Bullet><B>Tax Reserve Savings</B> — automatic % off every deposit, untouched until quarterly taxes.</Bullet>
      <Bullet><B>Opportunity Reserve</B> — a smaller % set aside for marketing pushes, slow months and growth.</Bullet>
      <Text style={s.h2}>How the flow works</Text>
      <OL num={1}>Commission deposit lands in Operating Checking.</OL>
      <OL num={2}>Automatic transfer moves your tax % to Tax Reserve the same day.</OL>
      <OL num={3}>Second transfer routes a smaller % to Opportunity Reserve.</OL>
      <OL num={4}>What's left funds the next 30–60 days of business expenses and owner pay.</OL>
      <Text style={s.h2}>Optional add-ons as you grow</Text>
      <Bullet>Owner Pay personal transfer on schedule</Bullet>
      <Bullet>Marketing Reserve for campaigns and ads</Bullet>
      <Bullet>Client Experience Reserve — staging, gifts, photography</Bullet>
      <Bullet>Team Payroll / Contractor Reserve</Bullet>
      <View style={s.calloutInfo} wrap={false}>
        <Text style={s.calloutText}>Card issuers and lenders love clean inflows and outflows, predictable reserves, and statements that don't look like personal checking with a business name taped on.</Text>
      </View>
      <Takeaway chapter="Chapter 6" items={[
        'Three accounts: Operating, Tax Reserve, Opportunity Reserve.',
        'Automate the transfers — willpower is not a financial system.',
        'Predictable reserves are what underwriters reward with higher limits.',
      ]} />
      <PageFooter />
    </Page>

    {/* CHAPTER 7 */}
    <Page size="LETTER" style={s.page}>
      <ChapterStart label="CHAPTER 7" title="Bookkeeping & documentation lenders actually look for" />
      <P>Fundability isn't only credit scores. It's <B>paperwork confidence</B> — how fast an underwriter can answer: "Is this a real business that pays on time?"</P>
      <Text style={s.h2}>The minimum bar</Text>
      <Bullet>Business bank statements that match your story.</Bullet>
      <Bullet>Basic P&amp;L tracking — even a simple monthly summary.</Bullet>
      <Bullet>Consistent business name, address, phone, email across every application, invoice, website and directory.</Bullet>
      <Text style={s.h2}>The "serious funding" bar</Text>
      <Bullet>Separate merchant processing where applicable.</Bullet>
      <Bullet>Clean accounting categories (marketing, technology, transportation, dues, etc.).</Bullet>
      <Bullet>Consistent monthly deposits routed through business accounts.</Bullet>
      <Bullet>A bookkeeping rhythm you can hand to a CPA in under an hour.</Bullet>
      <View style={s.calloutWarn} wrap={false}>
        <Text style={s.calloutText}>You don't need enterprise accounting. You need <Text style={s.bold}>predictable</Text> accounting. A shoebox with no system is more dangerous than admitting you need a bookkeeper.</Text>
      </View>
      <Takeaway chapter="Chapter 7" items={[
        'Lenders reward clarity, not complexity.',
        'Match your identity exactly across every document and listing.',
        'Predictable monthly close beats fancy software with no rhythm.',
      ]} />
      <PageFooter />
    </Page>

    {/* CHAPTER 8 */}
    <Page size="LETTER" style={s.page}>
      <ChapterStart label="CHAPTER 8" title="Fundability signals: the business identity checklist" />
      <P>Underwriters pattern-match. They look for the same business across your bank, applications, website, and public directories — and the moment those signals contradict, your file slows down or stops.</P>
      <Text style={s.h2}>Your fundability signal checklist</Text>
      <Bullet>Entity formed correctly for your state and brokerage rules.</Bullet>
      <Bullet>EIN obtained and used consistently.</Bullet>
      <Bullet>Business address (not a P.O. box where avoidable).</Bullet>
      <Bullet>Business phone discoverable in directories.</Bullet>
      <Bullet>Business email on a custom domain.</Bullet>
      <Bullet>Business website you control.</Bullet>
      <Bullet>Separate business bank account.</Bullet>
      <Bullet>Bookkeeping rhythm in place.</Bullet>
      <Bullet>D-U-N-S Number and bureau profiles forming.</Bullet>
      <Bullet>Identity matches across every surface.</Bullet>
      <Text style={s.h2}>Sample "where do I stand?" snapshot</Text>
      <P>During your free 1:1 we generate this for you. It looks like:</P>
      <View style={{ marginVertical: 6 }}>
        <StatusItem status="Strong" label="Business bank account with consistent deposits" />
        <StatusItem status="Strong" label="EIN in use across applications" />
        <StatusItem status="Watch" label="Business phone not yet in major directories" />
        <StatusItem status="Watch" label="Website live but inconsistent address" />
        <StatusItem status="Missing" label="D-U-N-S Number" />
        <StatusItem status="Missing" label="Reporting vendor tradelines" />
      </View>
      <Takeaway chapter="Chapter 8" items={[
        'Fundability is a pattern, not a single score.',
        'Consistency across surfaces matters more than perfection on any one.',
        'The free 1:1 produces your personalized Strong / Watch / Missing snapshot.',
      ]} />
      <PageFooter />
    </Page>

    {/* CHAPTER 9 */}
    <Page size="LETTER" style={s.page}>
      <ChapterStart label="CHAPTER 9" title="Business credit: how it really works" />
      <P>"Business credit" gets thrown around like magic money. It isn't. Here's the honest version.</P>
      <Text style={s.h2}>The mechanics</Text>
      <Bullet>Business credit profiles are built through <B>reporting behavior</B> and <B>identity consistency</B>, not just by having an EIN.</Bullet>
      <Bullet>The major business bureaus — <B>Dun &amp; Bradstreet, Experian Business, Equifax Small Business</B> — are separate from personal bureaus and use different scoring models.</Bullet>
      <Bullet>What earns scores: accounts that actually <B>report</B>, paid on time, in matching identity.</Bullet>
      <Text style={s.h2}>What "separate" really means</Text>
      <P>Truly separate business credit means starter vendor accounts (NET-30 type) that report to business bureaus, then store and fleet cards, then business credit cards — many initially with a personal guarantee — and over time, accounts that stand more on the business profile alone.</P>
      <View style={s.calloutSky} wrap={false}>
        <Text style={s.calloutText}>Personal guarantees aren't shameful — they're a starting point. The goal over time is a profile strong enough that more of your funding stands on the business itself.</Text>
      </View>
      <Takeaway chapter="Chapter 9" items={[
        'Business credit comes from reporting behavior, not just an EIN.',
        'There are three separate business bureaus with separate models.',
        'Personal guarantees are a starting point, not the destination.',
      ]} />
      <PageFooter />
    </Page>

    {/* CHAPTER 10 */}
    <Page size="LETTER" style={s.page}>
      <ChapterStart label="CHAPTER 10" title="The Realtor Credit Ladder" />
      <P>Think of credit as a ladder, not a button. Each rung exists for a reason and each one unlocks the next.</P>
      <Text style={s.h2}>The five rungs</Text>
      <OL num={1}><B>Foundation</B> — entity, EIN, address, phone, email, website, banking.</OL>
      <OL num={2}><B>Bureaus</B> — D-U-N-S, Experian Business, Equifax Small Business profiles open and matching identity.</OL>
      <OL num={3}><B>Tradelines</B> — starter vendors reporting on-time payments.</OL>
      <OL num={4}><B>Revolving</B> — store cards, fleet cards, then real business credit cards.</OL>
      <OL num={5}><B>Growth funding</B> — lines of credit, equipment financing, larger limits with less personal exposure.</OL>
      <Text style={s.h2}>What each phase tends to feel like</Text>
      <View style={s.calloutInfo} wrap={false}>
        <Text style={s.calloutTitle}>Month 1 — Relief</Text>
        <Text style={s.calloutText}>Your business identity exists on paper and online. You stop charging business spend to personal cards.</Text>
      </View>
      <View style={s.calloutSky} wrap={false}>
        <Text style={s.calloutTitle}>Months 2–3 — Patience</Text>
        <Text style={s.calloutText}>Quiet months. Tradelines reporting. Bureau profiles forming. Easy to feel like nothing's happening — it is.</Text>
      </View>
      <View style={s.calloutWarn} wrap={false}>
        <Text style={s.calloutTitle}>Months 4–5 — Momentum</Text>
        <Text style={s.calloutText}>First scores appear. Vendor approvals come through. Personal score starts recovering.</Text>
      </View>
      <View style={s.calloutInfo} wrap={false}>
        <Text style={s.calloutTitle}>Month 6+ — Freedom</Text>
        <Text style={s.calloutText}>First real revolving business card. A line of credit conversation becomes realistic. The system compounds.</Text>
      </View>
      <Takeaway chapter="Chapter 10" items={[
        'Foundation → Bureaus → Tradelines → Revolving → Growth funding.',
        'You cannot skip rungs — but you can climb them faster with guidance.',
        'The quiet months are where the work happens; do not quit there.',
      ]} />
      <PageFooter />
    </Page>

    {/* CHAPTER 11 */}
    <Page size="LETTER" style={s.page}>
      <ChapterStart label="CHAPTER 11" title="Common mistakes that block approvals" />
      <P>If applications get declined or limits come in low, it's almost always one of these.</P>
      <Bullet>Mixing personal and business expenses.</Bullet>
      <Bullet>Inconsistent address across applications and directories.</Bullet>
      <Bullet>No discoverable business phone or online footprint.</Bullet>
      <Bullet>Applying too early — no bureau presence, no tradelines.</Bullet>
      <Bullet>Entity / licensing / brokerage identity mismatch.</Bullet>
      <Bullet>No reserves, frequent overdrafts, or chaotic statements.</Bullet>
      <Text style={s.h2}>The objections we hear most</Text>
      <P><B>"I'm just an agent, not a real business."</B>{'\n'}If you have business expenses, you ARE a business owner. The IRS already treats you that way.</P>
      <P><B>"My broker handles everything."</B>{'\n'}Your broker doesn't pay your CRM, your ads, your gas or your photography. Those are yours — and mixing them damages your credit, not your broker's.</P>
      <P><B>"I don't make enough to worry about this yet."</B>{'\n'}That's exactly why it matters now. When margins are tight, you can't afford for business expenses to keep dragging down your personal score.</P>
      <P><B>"This sounds complicated and expensive."</B>{'\n'}Setup is usually $50–$300 in filing fees plus a small amount of time. That's less than a month of Zillow — and far less than the carrying cost of doing nothing.</P>
      <P><B>"I'll do this when I'm more established."</B>{'\n'}The credit ladder takes months to climb either way. Winners start before they need it.</P>
      <Takeaway chapter="Chapter 11" items={[
        'Most declines are identity, timing and consistency — not credit.',
        'Objections collapse once you see the math and timeline.',
        'The cost of doing nothing is always higher than the cost of starting.',
      ]} />
      <PageFooter />
    </Page>

    {/* CHAPTER 12 */}
    <Page size="LETTER" style={s.page}>
      <ChapterStart label="CHAPTER 12" title="Your 30 / 60 / 90-day action plan" />
      <P>Your specific actions get customized in your free 1:1. But every Realtor's first 90 days looks roughly like this.</P>
      <Text style={s.h2}>Days 1–30 — Structure &amp; banking</Text>
      <Bullet>Confirm entity pathway with CPA / attorney / broker.</Bullet>
      <Bullet>EIN in place; business name and address locked.</Bullet>
      <Bullet>Open business checking + tax reserve + opportunity reserve.</Bullet>
      <Bullet>Move all business spend off personal cards.</Bullet>
      <Text style={s.h2}>Days 31–60 — Bureaus &amp; starter tradelines</Text>
      <Bullet>D-U-N-S Number; Experian Business and Equifax SB profiles open.</Bullet>
      <Bullet>2–4 starter vendor accounts that report to bureaus.</Bullet>
      <Bullet>Bookkeeping rhythm in place (monthly close).</Bullet>
      <Bullet>Business phone, email, website all matching identity.</Bullet>
      <Text style={s.h2}>Days 61–90 — Expansion &amp; first revolving</Text>
      <Bullet>Add store/fleet accounts as bureau profile thickens.</Bullet>
      <Bullet>First business credit card application — informed, not random.</Bullet>
      <Bullet>Refine reserves and owner-pay rhythm.</Bullet>
      <Bullet>Plan the next 90 days based on actual scores and approvals.</Bullet>
      <View style={s.calloutInfo} wrap={false}>
        <Text style={s.calloutTitle}>What Realtors say after 90 days</Text>
        <Text style={s.calloutText}>"I finally know where every dollar of every commission is going. The 3-account setup alone changed how I sleep at night."</Text>
      </View>
      <Takeaway chapter="Chapter 12" items={[
        'Days 1–30: structure and banking.',
        'Days 31–60: bureaus and starter tradelines.',
        'Days 61–90: expansion and first revolving credit.',
      ]} />
      <PageFooter />
    </Page>

    {/* CHAPTER 13 */}
    <Page size="LETTER" style={s.page}>
      <ChapterStart label="CHAPTER 13" title="The next step: Custom Plan + Program" />
      <P>This guide gives you the map. The free 1:1 gives you the route. The optional program executes it with you.</P>
      <Text style={s.h2}>What happens in your free 1:1</Text>
      <OL num={1}>We complete the <B>RE Pro Business Financial Needs Analysis</B> together — about 5 minutes.</OL>
      <OL num={2}>We identify the top 3–5 structural gaps blocking your fundability today.</OL>
      <OL num={3}>You receive your <B>Custom RE Pro Business Structure, Finance &amp; Credit Plan</B> — a click-and-read page plus downloadable PDF with prioritized 90-day action steps.</OL>
      <View style={s.calloutInfo} wrap={false}>
        <Text style={s.calloutTitle}>No cost. No obligation.</Text>
        <Text style={s.calloutText}>The guide is free. The 1:1 is free. The plan generated from your Needs Analysis is yours to keep, whether you join the program or not.</Text>
      </View>
      <Text style={s.h2}>If you want help executing — the program</Text>
      <Bullet>Coaching support tailored to Realtors.</Bullet>
      <Bullet>Cohort accountability with 5–10 Realtors per group.</Bullet>
      <Bullet>Platform tools, checklists and guides.</Bullet>
      <Bullet>Credit-building milestones and task tracking.</Bullet>
      <BookCTA />
      <PageFooter />
    </Page>

    {/* CONCLUSION & RESOURCES */}
    <Page size="LETTER" style={s.page}>
      <ChapterStart label="CONCLUSION" title="You just closed. Now build a better future." />
      <P>Every commission is a chance to build something — or to just survive the next few weeks. The structure, finance and credit foundation you build in the next 90 days decides which one your business actually does.</P>
      <P>You don't have to figure it out alone. That's literally what the free 1:1 is for.</P>
      <Text style={s.h2}>Resources</Text>
      <P><B>Website:</B> <Link src={REALTOR_URL} style={s.link}>RealtorBusinessCredit.com</Link></P>
      <P><B>Book the free 1:1:</B> <Link src={CTA_URL} style={s.link}>RealtorBusinessCredit.com/one-on-one</Link></P>
      <Text style={s.h2}>Important disclaimers</Text>
      <P>This guide is educational. It is not legal, tax, accounting, or investment advice. Always confirm entity, commission-handling, and asset-protection decisions with your state licensing board, broker, CPA, and attorney.</P>
      <P>No specific funding outcome, approval amount, credit limit or timeline is guaranteed. Results vary by individual circumstances, credit profile, and execution.</P>
      <BookCTA />
      <PageFooter />
    </Page>
  </Document>
);

export default GuidePDF;