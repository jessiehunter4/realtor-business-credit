import {
  Document,
  Page,
  Text,
  View,
  Link,
  StyleSheet,
} from '@react-pdf/renderer';

const CTA_URL = 'https://realtorbusinesscredit.com/get_started';
const SCAN_URL = 'https://mybetterbusinesscredit.fundabilityscan.com/';
const MAIN_URL = 'https://mybetterbusinesscredit.com';
const REALTOR_URL = 'https://realtorbusinesscredit.com';

const s = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    paddingTop: 54,
    paddingBottom: 72,
    paddingHorizontal: 72,
    fontSize: 11,
    lineHeight: 1.8,
    fontFamily: 'Helvetica',
  },
  // Cover
  coverPage: {
    backgroundColor: '#0d1b2a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 60,
  },
  coverTitle: { fontSize: 30, fontFamily: 'Helvetica-Bold', color: '#FFFFFF', textAlign: 'center', marginBottom: 20, lineHeight: 1.3 },
  coverHighlight: { color: '#3eaf7c' },
  coverSubtitle: { fontSize: 16, fontStyle: 'italic', color: '#cccccc', textAlign: 'center', marginBottom: 30 },
  coverDesc: { fontSize: 12, color: '#999999', textAlign: 'center', marginBottom: 50, maxWidth: 360, lineHeight: 1.6 },
  coverAuthor: { fontSize: 13, color: '#FFFFFF', textAlign: 'center', marginTop: 40 },
  coverBrand: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: '#3eaf7c', textAlign: 'center', marginTop: 8 },
  coverCopyright: { fontSize: 9, color: '#666666', textAlign: 'center', marginTop: 30 },

  // Copyright page
  copyrightPage: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    paddingTop: 400,
    paddingBottom: 72,
    paddingHorizontal: 72,
    fontSize: 9,
    lineHeight: 1.6,
    fontFamily: 'Helvetica',
    color: '#6c757d',
  },

  // Headings
  h1: { fontSize: 22, fontFamily: 'Helvetica-Bold', color: '#1e3a5f', marginBottom: 14, marginTop: 4 },
  chapterLabel: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#3eaf7c', marginBottom: 4, letterSpacing: 1.5 },
  h2: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: '#1e3a5f', marginBottom: 10, marginTop: 20 },
  h3: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: '#0d1b2a', marginBottom: 6, marginTop: 14 },
  divider: { borderBottom: '3 solid #3eaf7c', marginBottom: 16, width: 100 },

  // Body
  body: { fontSize: 11, lineHeight: 1.8, marginBottom: 8, color: '#2c3e50' },
  bold: { fontFamily: 'Helvetica-Bold' },
  italic: { fontStyle: 'italic' },
  bullet: { fontSize: 11, lineHeight: 1.8, marginLeft: 20, marginBottom: 4, color: '#2c3e50' },
  olItem: { fontSize: 11, lineHeight: 1.8, marginLeft: 20, marginBottom: 4, color: '#2c3e50' },

  // Callout box (green)
  calloutBox: { backgroundColor: '#f0f9f4', borderLeft: '4 solid #3eaf7c', padding: 16, marginVertical: 10 },
  calloutTitle: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#1b5e20', marginBottom: 6 },
  calloutText: { fontSize: 10.5, lineHeight: 1.7, color: '#2c3e50' },

  // Warning box (amber)
  warningBox: { backgroundColor: '#fff3cd', borderLeft: '4 solid #f59e0b', padding: 16, marginVertical: 10 },
  warningTitle: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#92400e', marginBottom: 6 },

  // Important box (red)
  importantBox: { backgroundColor: '#fff5f5', borderLeft: '4 solid #e74c3c', padding: 16, marginVertical: 10 },
  importantTitle: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#c0392b', marginBottom: 6 },

  // Story box
  storyBox: { backgroundColor: '#e8f5e9', border: '2 solid #3eaf7c', padding: 20, marginVertical: 12 },
  storyTitle: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#1b5e20', marginBottom: 6 },

  // Quote box
  quoteBox: { backgroundColor: '#f8f9fa', borderLeft: '3 solid #3eaf7c', padding: 16, marginVertical: 12 },
  quoteText: { fontSize: 11, lineHeight: 1.7, fontStyle: 'italic', color: '#2c3e50' },
  quoteAttr: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#1e3a5f', marginTop: 8 },

  // Action steps box
  actionBox: { backgroundColor: '#e3f2fd', borderLeft: '4 solid #2196f3', padding: 16, marginVertical: 10 },
  actionTitle: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#1565c0', marginBottom: 6 },

  // Key takeaway
  keyTakeaway: { backgroundColor: '#fff3cd', border: '2 solid #f59e0b', padding: 20, marginVertical: 14 },
  keyTakeawayTitle: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#92400e', marginBottom: 6 },

  // CTA box
  ctaBox: { backgroundColor: '#f0f9f4', borderLeft: '4 solid #3eaf7c', padding: 16, marginVertical: 14 },

  // Big CTA box
  bigCtaBox: { backgroundColor: '#f0f9f4', border: '2 solid #3eaf7c', borderRadius: 8, padding: 20, marginVertical: 14 },
  bigCtaTitle: { fontSize: 15, fontFamily: 'Helvetica-Bold', color: '#1e3a5f', marginBottom: 10, textAlign: 'center' },

  link: { color: '#3eaf7c', textDecoration: 'underline' },

  // Footer
  footer: { position: 'absolute', bottom: 28, left: 72, right: 72, flexDirection: 'row', justifyContent: 'space-between' },
  footerLeft: { fontSize: 8, color: '#999999' },
  footerRight: { fontSize: 8, color: '#999999' },

  // TOC
  tocEntry: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, borderBottom: '0.5 solid #e5e7eb' },
  tocChapter: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#1e3a5f' },
  tocSection: { fontSize: 11, color: '#2c3e50', paddingLeft: 24 },
  tocPage: { fontSize: 11, color: '#2c3e50' },

  // Centered text
  centerBold: { fontSize: 14, fontFamily: 'Helvetica-Bold', textAlign: 'center', color: '#c0392b', marginVertical: 12 },

  // Two column row
  row: { flexDirection: 'row', gap: 10, marginVertical: 10 },
  col: { flex: 1 },
});

// Helper components
const P = ({ children, style = {} }: { children: React.ReactNode; style?: any }) => (
  <Text style={[s.body, style]}>{children}</Text>
);
const B = ({ children, style = {} }: { children: React.ReactNode; style?: any }) => (
  <Text style={[s.body, s.bold, style]}>{children}</Text>
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
  <View minPresenceAhead={100}>
    {label && <Text style={s.chapterLabel}>{label}</Text>}
    <Text style={s.h1}>{title}</Text>
    <View style={s.divider} />
  </View>
);

const KeyTakeawayBox = ({ chapter, items }: { chapter: string; items: string[] }) => (
  <View style={s.keyTakeaway} wrap={false}>
    <Text style={s.keyTakeawayTitle}>Key Takeaways from {chapter}:</Text>
    {items.map((item, i) => <Text key={i} style={[s.calloutText, { marginLeft: 12, marginBottom: 3 }]}>• {item}</Text>)}
  </View>
);

const BookSessionCTA = () => (
  <View style={s.ctaBox} wrap={false}>
    <Text style={[s.calloutText, { fontStyle: 'italic' }]}>
      Want to discuss YOUR specific situation? Book a one-on-one session — realtor to realtor, no pressure.
    </Text>
    <Text style={[s.calloutText, { marginTop: 8 }]}>
      <Text style={s.bold}>Book your session: </Text>
      <Link src={CTA_URL} style={s.link}>RealtorBusinessCredit.com/get_started</Link>
    </Text>
  </View>
);

const BookCTA = () => (
  <View style={s.bigCtaBox} wrap={false}>
    <Text style={s.bigCtaTitle}>Book Your One-on-One Session</Text>
    <Text style={[s.calloutText, { textAlign: 'center', marginBottom: 6 }]}>
      5 minutes for the Fundability Scan. 30 minutes for our conversation.{'\n'}Complete clarity on YOUR path forward.
    </Text>
    <Link src={CTA_URL} style={[s.link, { textAlign: 'center', fontSize: 12, marginTop: 6 }]}>
      RealtorBusinessCredit.com/get_started →
    </Link>
    <Text style={[s.calloutText, { textAlign: 'center', marginTop: 6, fontSize: 9, color: '#6c757d' }]}>
      Limited availability. No obligation. No pressure.
    </Text>
  </View>
);

export const GuidePDF = () => (
  <Document title="What Every Realtor Should Know About Business Credit" author="Jessie Hunter" subject="Business Credit for Real Estate Professionals">

    {/* ==================== COVER ==================== */}
    <Page size="LETTER" style={s.coverPage}>
      <View style={{ alignItems: 'center' }}>
        <Text style={s.coverTitle}>
          What Every Realtor{'\n'}Should Know{' '}
          <Text style={s.coverHighlight}>About{'\n'}Business Credit</Text>
        </Text>
        <Text style={s.coverSubtitle}>And Why 90% Never Find Out</Text>
        <Text style={s.coverDesc}>
          A practical guide for real estate professionals who want to stop risking their personal credit and start building business credit the right way.
        </Text>
        <Text style={s.coverAuthor}>by Jessie Hunter</Text>
        <Text style={{ fontSize: 10, color: '#cccccc', textAlign: 'center', marginTop: 4 }}>
          Real Estate Broker | California & Georgia
        </Text>
        <Text style={s.coverBrand}>Realtor Business Credit</Text>
        <Text style={s.coverCopyright}>
          © 2026 RealtorBusinessCredit.com — All Rights Reserved.{'\n'}Educational purposes only.
        </Text>
      </View>
    </Page>

    {/* ==================== COPYRIGHT ==================== */}
    <Page size="LETTER" style={s.copyrightPage}>
      <Text style={{ marginBottom: 8 }}>© 2026 RealtorBusinessCredit.com</Text>
      <Text style={{ marginBottom: 8 }}>All Rights Reserved.</Text>
      <Text style={{ marginTop: 20, lineHeight: 1.6 }}>
        This guide is provided for educational purposes. The author and publisher are not providing legal, financial, or tax advice. Readers should consult with appropriate professionals before making business structure decisions.
      </Text>
      <Text style={{ marginTop: 20, lineHeight: 1.6 }}>
        <Text style={{ fontFamily: 'Helvetica-Bold' }}>About the Author: </Text>
        Jessie Hunter is a licensed real estate broker in California and Georgia with over 15 years of experience in the industry. After discovering business credit late in his career, he became a certified partner with Credit Suite to help fellow real estate professionals avoid the mistakes he made.
      </Text>
    </Page>

    {/* ==================== TABLE OF CONTENTS ==================== */}
    <Page size="LETTER" style={s.page}>
      <Text style={[s.h1, { textAlign: 'center', marginBottom: 20 }]}>Table of Contents</Text>

      {[
        { label: 'Introduction: Congratulations on Your Recent Closing', page: '4', isChapter: true },
        { label: '    The Wake-Up Call', page: '', isChapter: false },
        { label: 'Chapter 1: My Story—The $8,000 Mistake', page: '6', isChapter: true },
        { label: '    The Wake-Up Call', page: '', isChapter: false },
        { label: '    The Mistakes I Made', page: '', isChapter: false },
        { label: '    What I Wish I\'d Known', page: '', isChapter: false },
        { label: 'Chapter 2: What Business Credit Actually Is', page: '11', isChapter: true },
        { label: '    The Missing Piece in Real Estate Education', page: '', isChapter: false },
        { label: '    Why Nobody Told You', page: '', isChapter: false },
        { label: '    What It Means for YOUR Business', page: '', isChapter: false },
        { label: 'Chapter 3: The True Cost of Using Personal Credit', page: '16', isChapter: true },
        { label: '    Real Numbers from Real Situations', page: '', isChapter: false },
        { label: '    What Waiting Another Year Will Cost', page: '', isChapter: false },
        { label: '    The Commission Check Reality', page: '', isChapter: false },
        { label: 'Chapter 4: Common Questions & Objections', page: '20', isChapter: true },
        { label: '    "But I\'m Just an Agent, Not a Business"', page: '', isChapter: false },
        { label: '    "My Broker Handles Everything"', page: '', isChapter: false },
        { label: '    "I\'ll Do This When I\'m More Established"', page: '', isChapter: false },
        { label: '    And More...', page: '', isChapter: false },
        { label: 'Chapter 5: The Seven-Step Process', page: '23', isChapter: true },
        { label: '    Understanding What\'s Involved', page: '', isChapter: false },
        { label: '    Why This Isn\'t a DIY Project', page: '', isChapter: false },
        { label: '    The Real Estate Transaction Analogy', page: '', isChapter: false },
        { label: 'Chapter 6: The Emotional Journey', page: '27', isChapter: true },
        { label: '    Month 1: The Relief Phase', page: '', isChapter: false },
        { label: '    Months 2-3: The Waiting Game', page: '', isChapter: false },
        { label: '    Months 4-5: The Momentum Shift', page: '', isChapter: false },
        { label: '    Month 6+: The Freedom Feeling', page: '', isChapter: false },
        { label: 'Chapter 7: Why You Need Professional Guidance', page: '29', isChapter: true },
        { label: '    The Realtor-Client Analogy', page: '', isChapter: false },
        { label: '    The Dual Coach System', page: '', isChapter: false },
        { label: '    Customization Matters', page: '', isChapter: false },
        { label: 'Chapter 8: Success Stories from Fellow Realtors', page: '32', isChapter: true },
        { label: 'Chapter 9: What\'s Next—Advanced Strategies', page: '34', isChapter: true },
        { label: 'Conclusion: Your Next Steps', page: '36', isChapter: true },
        { label: 'Resources & Additional Information', page: '40', isChapter: true },
      ].map((entry, i) => (
        <View key={i} style={[s.tocEntry, !entry.isChapter && { borderBottom: 'none', paddingVertical: 2 }]}>
          <Text style={entry.isChapter ? s.tocChapter : s.tocSection}>{entry.label}</Text>
          {entry.page ? <Text style={entry.isChapter ? s.tocChapter : s.tocPage}>{entry.page}</Text> : null}
        </View>
      ))}
      <PageFooter />
    </Page>

    {/* ==================== INTRODUCTION ==================== */}
    <Page size="LETTER" style={s.page} break>
      <ChapterStart title="Introduction: Congratulations on Your Recent Closing" />

      <P>You just closed a deal. That commission check is hitting your account.</P>
      <P>It feels good, doesn't it?</P>
      <P>But let me ask you something: Where does that money actually go?</P>
      <P>If you're like most real estate professionals, here's the reality of a $15,000 commission:</P>

      <Bullet>$4,500 to taxes (30%)</Bullet>
      <Bullet>$2,250 to your broker split</Bullet>
      <Bullet>You're down to $8,250</Bullet>
      <Bullet>Then you subtract business expenses: $2,000 marketing, $500 technology, $300 gas, $200 staging</Bullet>
      <B>• You actually keep: $5,250</B>

      <P>But here's the part that nobody talks about—the part I wish someone had told me 15 years ago:</P>

      <View style={s.importantBox} wrap={false}>
        <B style={{ color: '#c0392b' }}>You probably charged $3,000 or more of those business expenses on YOUR personal credit card this month.</B>
        <Text style={[s.calloutText, { marginTop: 6 }]}>
          Your credit utilization just jumped 30%. Your personal credit score drops 20 points. And this affects YOUR mortgage rate, YOUR car loan, YOUR ability to refinance—everything in YOUR personal financial life.
        </Text>
      </View>

      <P>Nobody told you there was a better way.</P>
      <P>Nobody told you about business credit.</P>
      <P>That's what this guide is about.</P>

      <Text style={s.h2}>What You'll Learn</Text>
      <P>This guide will show you:</P>
      <Bullet>What business credit is and why it's the missing piece in real estate education</Bullet>
      <Bullet>The true cost of using personal credit for business expenses (with real numbers)</Bullet>
      <Bullet>Why I waited over 10 years to discover this—and what it cost me</Bullet>
      <Bullet>The seven-step process to building business credit</Bullet>
      <Bullet>Why this isn't something you should try to figure out alone</Bullet>
      <Bullet>What the journey actually feels like (month by month)</Bullet>
      <Bullet>How to determine if this makes sense for YOUR specific situation</Bullet>

      <Text style={s.h2}>Who This Guide Is For</Text>
      <P>This guide is written specifically for:</P>
      <Bullet>Residential and commercial real estate agents</Bullet>
      <Bullet>Real estate brokers (solo and team leaders)</Bullet>
      <Bullet>Anyone who has business expenses related to their real estate practice</Bullet>
      <Bullet>Realtors who are tired of mixing personal and business finances</Bullet>
      <Bullet>Anyone who just closed a deal and is thinking about their financial future</Bullet>

      <View style={s.importantBox} wrap={false}>
        <Text style={s.importantTitle}>Already Know You Need This?</Text>
        <Text style={s.calloutText}>
          Look, I'm a realtor too. I know some of us are "bottom-line" people. If you already know you need business credit and just want to talk through YOUR specific situation—skip the guide.
        </Text>
        <Text style={[s.calloutText, { marginTop: 6 }]}>
          <Text style={{ fontFamily: 'Helvetica-Bold' }}>For a limited time, I'm offering one-on-one sessions.</Text> Just you and me, realtor to realtor. In our session together, we'll:
        </Text>
        <Text style={[s.calloutText, { marginLeft: 12, marginTop: 4 }]}>• How "Fundable" are you? We will run your "Fundability Scan" live together (takes about 5 minutes)</Text>
        <Text style={[s.calloutText, { marginLeft: 12 }]}>• Discuss YOUR current situation and what prompted you to reach out</Text>
        <Text style={[s.calloutText, { marginLeft: 12 }]}>• Outline customized next steps specifically for YOUR business</Text>
        <Text style={[s.calloutText, { marginTop: 8 }]}>
          No obligation. No pressure. Just a straightforward business conversation between two professionals. I guarantee it will be worthwhile.
        </Text>
        <Text style={[s.calloutText, { marginTop: 8 }]}>
          <Text style={{ fontFamily: 'Helvetica-Bold' }}>Book your one-on-one session: </Text>
          <Link src={CTA_URL} style={s.link}>RealtorBusinessCredit.com/get_started</Link>
        </Text>
        <Text style={[s.calloutText, { marginTop: 8, fontSize: 9, fontStyle: 'italic' }]}>
          For everyone else—keep reading. By the end of this guide, you'll understand exactly why this matters for your business.
        </Text>
      </View>

      <Text style={s.h2}>How to Use This Guide</Text>
      <P>You can read this guide straight through, or jump to the chapters most relevant to your situation.</P>
      <P>Throughout the guide, you'll find:</P>
      <Bullet><Text style={s.bold}>Callout boxes</Text> highlighting key points</Bullet>
      <Bullet><Text style={s.bold}>Real examples</Text> from my own experience</Bullet>
      <Bullet><Text style={s.bold}>Action steps</Text> you can take</Bullet>
      <Bullet><Text style={s.bold}>Key takeaways</Text> at the end of each chapter</Bullet>
      <P>My goal isn't to sell you anything in this guide. My goal is to give you the information I wish I'd had 15 years ago, so you can make an informed decision about YOUR financial future.</P>
      <P>Let's get started.</P>
      <PageFooter />
    </Page>

    {/* ==================== CHAPTER 1 ==================== */}
    <Page size="LETTER" style={s.page} break>
      <ChapterStart label="CHAPTER 1" title="My Story: Running Out of Options" />

      <P>I need to start with my story, because understanding how I got here will help you understand why this guide exists—and why I'm so passionate about making sure you don't repeat my mistakes.</P>
      <P>My name is Jessie Hunter. I've been a real estate broker since 2010. I'm licensed in both California and Georgia. Over my 12+ years in real estate, I've experienced both the good times and the tough times.</P>
      <P>When times were good, all was well. When times were tough, I honestly struggled financially.</P>
      <P>But whether good times or bad, I always did one thing the same: <Text style={s.bold}>I used only my personal credit for my independent real estate broker business.</Text></P>
      <P>It never even occurred to me there was another way.</P>

      <Text style={s.h2}>Finding My Niche</Text>
      <P>Eventually, I found my niche working with tenants and home rentals.</P>
      <P>I became passionate about helping renters become homeowners. I developed systems for working with first-time buyers. I enjoyed the process of guiding people through what is often one of the most stressful experiences of their lives.</P>
      <P>That passion led me to create something new: <Text style={s.bold}>Good Tenants Services, Inc.</Text></P>
      <P>The concept was simple but powerful: a service that connects quality tenants with landlords, provides tenant screening, rental history verification, and creates a pathway for renters to build their rental credentials—ultimately helping them qualify for mortgages.</P>
      <P>I was excited. I saw the need. I had the experience. I was ready to scale.</P>
      <P>There was just one problem: <Text style={s.bold}>I needed capital.</Text></P>

      <Text style={s.h2}>The Financial Reality Check</Text>
      <P>Starting a business requires money. I knew this. What I didn't know was how expensive my approach would be.</P>
      <P>Here's what I did (and what most realtors do when they need business capital):</P>

      <View style={s.storyBox} wrap={false}>
        <Text style={s.storyTitle}>My Financing "Strategy"</Text>
        <Text style={s.calloutText}>Step 1: Applied for personal credit cards with the highest limits I could get</Text>
        <Text style={s.calloutText}>Step 2: Used those personal cards for ALL business expenses</Text>
        <Text style={s.calloutText}>Step 3: When those maxed out, I took out a personal loan</Text>
        <Text style={s.calloutText}>Step 4: When that wasn't enough, I tapped into my home equity</Text>
        <Text style={[s.calloutText, { marginTop: 6, fontFamily: 'Helvetica-Bold', color: '#c0392b' }]}>
          Step 5: When THAT wasn't enough... I was stuck.
        </Text>
      </View>

      <P>Every dollar I put into Good Tenants Services came from MY personal finances. MY personal credit cards. MY home equity.</P>
      <P>And every dollar I borrowed personally for business:</P>
      <Bullet>Appeared on MY personal credit report</Bullet>
      <Bullet>Increased MY personal credit utilization</Bullet>
      <Bullet>Lowered MY personal credit score</Bullet>
      <Bullet>Put MY personal assets at risk</Bullet>
      <Bullet>Affected MY ability to get personal loans, refinance my home, or even get a decent car loan</Bullet>

      <Text style={s.h2}>The Discovery</Text>
      <P>After struggling for about two years trying to scale Good Tenants Services using only personal credit, I attended a business seminar.</P>
      <P>Someone mentioned "business credit" in passing.</P>
      <P>I asked, "What's that?"</P>
      <P>That question changed everything.</P>
      <P>I discovered that business credit—a credit profile for YOUR business that's completely separate from YOUR personal credit—actually exists.</P>
      <P>And not only does it exist, but it's accessible.</P>
      <P>And not only is it accessible, but it should have been the FIRST thing I set up before starting Good Tenants Services.</P>

      <View style={s.importantBox} wrap={false}>
        <Text style={s.importantTitle}>The Information That Changed Everything</Text>
        <Text style={s.calloutText}>If I had known about business credit in 2023, here's what I could have done differently:</Text>
        <Text style={[s.calloutText, { marginLeft: 12, marginTop: 4 }]}>• Spent 9-12 months building business credit before launching</Text>
        <Text style={[s.calloutText, { marginLeft: 12 }]}>• Applied for business credit cards (not personal)</Text>
        <Text style={[s.calloutText, { marginLeft: 12 }]}>• Qualified for vendor credit accounts</Text>
        <Text style={[s.calloutText, { marginLeft: 12 }]}>• Built a strong business credit profile</Text>
        <Text style={[s.calloutText, { marginLeft: 12 }]}>• Eventually qualified for SBA loans designed for startups</Text>
        <Text style={[s.calloutText, { marginTop: 8, fontFamily: 'Helvetica-Bold' }]}>
          My personal credit would have remained untouched. My home equity would have remained safe.
        </Text>
      </View>

      <P>But I didn't know. So instead, I:</P>
      <Bullet>Damaged my personal credit score</Bullet>
      <Bullet>Paid thousands in high-interest charges</Bullet>
      <Bullet>Risked my family's financial security</Bullet>
      <Bullet>Eventually ran out of personal credit options</Bullet>

      <Text style={s.h2}>The Cost of Not Knowing</Text>
      <P>Let me break down what my ignorance cost me in concrete terms:</P>

      <View style={s.storyBox} wrap={false}>
        <Text style={s.storyTitle}>The Real Numbers</Text>
        <Text style={s.calloutText}><Text style={s.bold}>Personal credit card interest paid:</Text> Approximately $3,600 over two years</Text>
        <Text style={s.calloutText}><Text style={s.bold}>Higher interest rates on personal loans:</Text> An extra $2,800 over two years (because my credit score dropped from maxing out cards)</Text>
        <Text style={s.calloutText}><Text style={s.bold}>Home equity line interest:</Text> $1,600 (money I could have avoided borrowing entirely)</Text>
        <Text style={[s.calloutText, { marginTop: 6, fontFamily: 'Helvetica-Bold' }]}>Total unnecessary cost: $8,000+</Text>
        <Text style={[s.calloutText, { marginTop: 6, fontFamily: 'Helvetica-Bold', color: '#c0392b' }]}>And that's just the direct financial cost. It doesn't count:</Text>
        <Text style={[s.calloutText, { marginLeft: 12 }]}>• The stress on my family</Text>
        <Text style={[s.calloutText, { marginLeft: 12 }]}>• The damaged personal credit score (affecting future mortgage rates, car loans, etc.)</Text>
        <Text style={[s.calloutText, { marginLeft: 12 }]}>• The lost opportunity cost (what I could have done with proper business credit)</Text>
        <Text style={[s.calloutText, { marginLeft: 12 }]}>• The limitations on scaling the business</Text>
      </View>

      <P>If someone—anyone—had told me about business credit when I first got my real estate license in 2010, I could have avoided all of this.</P>
      <P>But nobody did.</P>
      <P>And that's the problem this guide is designed to solve.</P>

      <BookSessionCTA />

      <Text style={s.h2}>What I Wish I'd Known</Text>
      <P>Here's what I wish someone had told me in 2010, or 2015, or even 2020:</P>

      <View style={s.calloutBox} wrap={false}>
        <Text style={s.calloutTitle}>Business Credit Exists</Text>
        <Text style={s.calloutText}>Your business can have its own credit profile, completely separate from your personal credit. You can get business credit cards, lines of credit, and loans that don't appear on your personal credit report and don't affect your personal credit score.</Text>
      </View>

      <View style={s.calloutBox} wrap={false}>
        <Text style={s.calloutTitle}>It Takes Time, But Not As Long As You Think</Text>
        <Text style={s.calloutText}>Building business credit typically takes 9-12 months. That's it. Not years. Not decades. Just 9-12 months of strategic actions.</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>And once I had built good business credit history, I could actually qualify for an <Text style={s.bold}>SBA loan designed specifically for start-ups like mine.</Text></Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>All of this was available. All of it was accessible.</Text>
        <Text style={[s.calloutText, { marginTop: 4, fontFamily: 'Helvetica-Bold' }]}>I just didn't know it existed.</Text>
      </View>

      <Text style={s.h2}>The Math That Haunts Me</Text>
      <P>Let me break down what my ignorance cost me:</P>
      <B>If I had known about business credit in 2023:</B>
      <Bullet>I would have spent 9-12 months building business credit</Bullet>
      <Bullet>I would have started Good Tenants Services with business credit lines, not personal</Bullet>
      <Bullet>I would have qualified for SBA financing</Bullet>
      <Bullet>My personal credit would have remained intact</Bullet>
      <Bullet>My home equity would still be there</Bullet>
      <Bullet>I would have had MORE capital available with LESS personal risk</Bullet>

      <B>Instead, what actually happened:</B>
      <Bullet>I spent 2 years struggling with insufficient personal credit</Bullet>
      <Bullet>I maxed out personal credit cards (paying 18-24% interest)</Bullet>
      <Bullet>I tapped my home equity (risking my family's security)</Bullet>
      <Bullet>I took personal loans at high rates</Bullet>
      <Bullet>I damaged my personal credit score</Bullet>
      <Bullet>I ran out of options before the business could fully scale</Bullet>

      <P>The difference? <Text style={s.bold}>Nobody told me business credit existed.</Text></P>

      <Text style={s.h2}>Why I'm Still Building Good Tenants Services</Text>
      <P>Here's something important: I haven't given up on Good Tenants Services, Inc.</P>
      <P>I'm still building it. I still believe in the concept. I'm now properly structuring it with business credit and exploring crowdfunding options to scale it the right way.</P>
      <P>But I'm doing it smarter now. With proper business structure. With business credit. With the knowledge I wish I'd had from day one.</P>

      <Text style={s.h2}>The Decision to Sound the Alarm</Text>
      <P>In January 2026, I made a decision.</P>
      <P>I determined to sound the alarm and write this guide.</P>
      <P>I wanted to share it with other realtors and business people:</P>
      <Text style={s.centerBold}>BUILD YOUR BUSINESS CREDIT ASAP!</Text>
      <P>Don't make my mistake. Don't wait until you run out of personal credit options. Don't risk your home, your family's security, your personal financial future.</P>
      <P>Start with business credit. Build it properly. Have it ready BEFORE you need it.</P>

      <Text style={s.h2}>What I Created</Text>
      <P>That's why I created:</P>
      <Bullet><Text style={s.bold}>MyBetterBusinessCredit.com</Text> – For all business owners</Bullet>
      <Bullet><Text style={s.bold}>RealtorBusinessCredit.com</Text> – Specifically for my fellow real estate professionals</Bullet>
      <Bullet><Text style={s.bold}>This Guide</Text> – "Why Most Realtors Don't Establish Separate Business Credit"</Bullet>
      <P>I partnered with Credit Suite—a company that has helped over 40,000 businesses establish business credit—and became a certified partner so I could offer the same guidance I wish I'd had.</P>

      <Text style={s.h2}>The Mistakes I Made (So You Don't Have To)</Text>

      <View style={s.warningBox} wrap={false}>
        <Text style={s.warningTitle}>Mistake #1: I Didn't Know Business Credit Existed</Text>
        <Text style={s.calloutText}>In 12+ years in real estate, through countless trainings and certifications, nobody ever mentioned it. Not once.</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>This is the education gap I'm trying to fill.</Text>
      </View>

      <View style={s.warningBox} wrap={false}>
        <Text style={s.warningTitle}>Mistake #2: I Assumed Personal Credit Was the Only Option</Text>
        <Text style={s.calloutText}>Every agent I knew used personal credit for business. So I thought that was just "how it's done."</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>It's not. There's a better way.</Text>
      </View>

      <View style={s.warningBox} wrap={false}>
        <Text style={s.warningTitle}>Mistake #3: I Waited Until I Ran Out of Options</Text>
        <Text style={s.calloutText}>I discovered business credit only AFTER I'd maxed out my personal credit. By then, I'd already made costly mistakes.</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>You should build business credit BEFORE you need it, not after.</Text>
      </View>

      <View style={s.warningBox} wrap={false}>
        <Text style={s.warningTitle}>Mistake #4: I Risked Everything Personal for Business Growth</Text>
        <Text style={s.calloutText}>My home equity. My personal credit score. My family's financial security.</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>All at risk because I didn't know there was a way to separate business and personal finances.</Text>
      </View>

      <Text style={s.h2}>What I Want for You</Text>
      <P>I can't go back and change my past.</P>
      <P>But I can help YOU avoid my mistakes.</P>
      <P>Whether you're planning to expand your real estate business, start a new venture, or just want to protect your personal finances while running your current operation—business credit should be part of your strategy from day one.</P>
      <P>Not as a backup plan. Not as something you explore when personal credit runs out.</P>
      <P>As a foundational element of how you structure your business.</P>

      <KeyTakeawayBox chapter="Chapter 1" items={[
        'Business credit exists but isn\'t taught in real estate education',
        'Using only personal credit for business can lead to maxed cards, tapped equity, and financial stress',
        'Building business credit takes 9-12 months—start BEFORE you need it',
        'Separating business and personal finances protects your family\'s security',
        'Learning this the hard way is expensive—learning from someone else\'s mistakes is free',
      ]} />
      <PageFooter />
    </Page>

    {/* ==================== CHAPTER 2 ==================== */}
    <Page size="LETTER" style={s.page} break>
      <ChapterStart label="CHAPTER 2" title="What Business Credit Actually Is" />

      <P>Now that you understand how I discovered business credit, let's talk about what it actually is—and why it matters for YOUR real estate business.</P>

      <Text style={s.h2}>The Simple Definition</Text>
      <P>Business credit is a credit profile for YOUR business that's completely separate from YOUR personal credit.</P>
      <P>Just like you have a personal credit score (FICO score) based on your Social Security Number, your business can have its own credit scores based on its Employer Identification Number (EIN).</P>
      <P>The three major business credit bureaus are:</P>
      <Bullet>Dun & Bradstreet (D&B)</Bullet>
      <Bullet>Experian Business</Bullet>
      <Bullet>Equifax Small Business</Bullet>
      <P>These are completely separate from the personal credit bureaus (Experian, Equifax, TransUnion) that track your personal credit.</P>

      <Text style={s.h2}>What This Means in Practice</Text>

      <View style={s.calloutBox} wrap={false}>
        <Text style={s.calloutTitle}>With Business Credit:</Text>
        <Text style={s.calloutText}>• YOUR business expenses go on business credit cards</Text>
        <Text style={s.calloutText}>• Those charges don't appear on YOUR personal credit report</Text>
        <Text style={s.calloutText}>• YOUR personal credit utilization stays low</Text>
        <Text style={s.calloutText}>• YOUR personal credit score stays protected</Text>
        <Text style={s.calloutText}>• YOUR business builds its own financial identity</Text>
        <Text style={s.calloutText}>• YOU can access MORE capital with LESS personal risk</Text>
      </View>

      <View style={s.warningBox} wrap={false}>
        <Text style={s.warningTitle}>Without Business Credit (What Most Realtors Do):</Text>
        <Text style={s.calloutText}>• All business expenses go on YOUR personal credit cards</Text>
        <Text style={s.calloutText}>• YOUR personal credit utilization spikes</Text>
        <Text style={s.calloutText}>• YOUR personal credit score drops</Text>
        <Text style={s.calloutText}>• This affects YOUR mortgage rates, car loans, refinancing options</Text>
        <Text style={s.calloutText}>• YOUR personal finances are at risk for business activities</Text>
        <Text style={s.calloutText}>• YOU have limited access to capital (only what your personal credit allows)</Text>
      </View>

      <P>The difference is stark. And expensive.</P>

      <Text style={s.h2}>Why Nobody Told You About This</Text>
      <P>Here's a question I get all the time: "If business credit is so important, why didn't anyone tell me about it?"</P>
      <P>Great question. Here's my theory based on 15 years in the industry:</P>

      <View style={s.storyBox} wrap={false}>
        <Text style={s.storyTitle}>Reason #1: It's Not Part of Real Estate Education</Text>
        <Text style={s.calloutText}>Your real estate pre-licensing course didn't cover it. Your continuing education classes don't mention it. Your broker training didn't include it.</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>Real estate education focuses on: license law, contracts, ethics, fair housing, disclosures. All important.</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>But business credit? Business structure? Financial fundamentals? Not covered.</Text>
      </View>

      <View style={s.storyBox} wrap={false}>
        <Text style={s.storyTitle}>Reason #2: Most Brokers Don't Know About It Either</Text>
        <Text style={s.calloutText}>Your broker probably uses personal credit for their business too. It's the real estate industry norm.</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>So when you become an agent, you simply replicate what you see others doing.</Text>
      </View>

      <View style={s.storyBox} wrap={false}>
        <Text style={s.storyTitle}>Reason #3: We're Independent Contractors, Not "Real" Business Owners</Text>
        <Text style={s.calloutText}>Many agents think: "I'm just an independent contractor. I'm not a business. This doesn't apply to me."</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>Wrong. As an independent contractor, YOU are a business. You have business expenses. You need business credit.</Text>
      </View>

      <View style={s.storyBox} wrap={false}>
        <Text style={s.storyTitle}>Reason #4: It Seems Complicated</Text>
        <Text style={s.calloutText}>Business credit sounds like something only "real" businesses need—corporations, franchises, companies with employees.</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>But that's not true. Even sole proprietors (which many realtors are) can and should have business credit.</Text>
      </View>

      <P>The result of all these factors? An entire industry of independent business professionals who don't know business credit exists.</P>

      <BookSessionCTA />

      <Text style={s.h2}>How Business Credit Actually Works</Text>
      <P>Let me break this down into simple terms:</P>

      <View style={s.actionBox} wrap={false}>
        <Text style={s.actionTitle}>Step 1: Your Business Gets an EIN</Text>
        <Text style={s.calloutText}>An Employer Identification Number (EIN) is like a Social Security Number for your business. It's free from the IRS. Takes 10 minutes online.</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>This is the foundation. Without an EIN, you can't build business credit.</Text>
      </View>

      <View style={s.actionBox} wrap={false}>
        <Text style={s.actionTitle}>Step 2: Your Business Establishes a Credit Profile</Text>
        <Text style={s.calloutText}>You register your business with the business credit bureaus (Dun & Bradstreet, Experian Business, Equifax Small Business).</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>They create a file for YOUR business, separate from YOUR personal file.</Text>
      </View>

      <View style={s.actionBox} wrap={false}>
        <Text style={s.actionTitle}>Step 3: You Build Credit History</Text>
        <Text style={s.calloutText}>You establish vendor accounts, get business credit cards, make payments on time.</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>Each payment builds YOUR business credit profile, not your personal credit profile.</Text>
      </View>

      <View style={s.actionBox} wrap={false}>
        <Text style={s.actionTitle}>Step 4: Your Business Credit Score Grows</Text>
        <Text style={s.calloutText}>As your business builds a positive payment history, your business credit scores increase.</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>Higher scores = more credit available = more capital for growth.</Text>
      </View>

      <View style={s.actionBox} wrap={false}>
        <Text style={s.actionTitle}>Step 5: You Access Business Credit Lines</Text>
        <Text style={s.calloutText}>With good business credit, you can qualify for:</Text>
        <Text style={[s.calloutText, { marginLeft: 12, marginTop: 4 }]}>• Business credit cards (not requiring personal guarantee)</Text>
        <Text style={[s.calloutText, { marginLeft: 12 }]}>• Lines of credit</Text>
        <Text style={[s.calloutText, { marginLeft: 12 }]}>• SBA loans</Text>
        <Text style={[s.calloutText, { marginLeft: 12 }]}>• Equipment financing</Text>
        <Text style={[s.calloutText, { marginTop: 6 }]}>All without touching YOUR personal credit.</Text>
      </View>

      <Text style={s.h2}>The Timeline Reality</Text>
      <P>One question I always get: "How long does this take?"</P>
      <P>Honest answer: <Text style={s.bold}>9-12 months to build a strong business credit profile.</Text></P>
      <P>That's not long. Consider:</P>
      <Bullet>You'll be in real estate for years (hopefully decades)</Bullet>
      <Bullet>You'll have business expenses every single month</Bullet>
      <Bullet>You'll need capital for growth opportunities</Bullet>
      <P>Investing 9-12 months to build business credit is one of the smartest business decisions you can make.</P>
      <P>And here's the key: <Text style={s.bold}>You should start BEFORE you desperately need it.</Text></P>
      <P>Don't wait until you're maxing out personal cards or facing a major expense. Start now, while you have time to build it properly.</P>

      <Text style={s.h2}>Common Misconceptions About Business Credit</Text>

      <View style={s.warningBox} wrap={false}>
        <Text style={s.warningTitle}>"I need to be incorporated to get business credit"</Text>
        <Text style={s.calloutText}>FALSE. While having a formal business entity (LLC, Corp) is recommended, even sole proprietors with an EIN can start building business credit. The right structure depends on your state and situation.</Text>
      </View>

      <View style={s.warningBox} wrap={false}>
        <Text style={s.warningTitle}>"Business credit cards still affect my personal credit"</Text>
        <Text style={s.calloutText}>PARTIALLY TRUE. Some business cards report to personal bureaus. Part of the strategy is knowing which ones DON'T report personally. This is where professional guidance is critical.</Text>
      </View>

      <View style={s.warningBox} wrap={false}>
        <Text style={s.warningTitle}>"I can just use a separate personal card for business"</Text>
        <Text style={s.calloutText}>THIS ISN'T THE SAME THING. A personal card designated for business use is still on YOUR personal credit report, still affects YOUR utilization, still impacts YOUR score. It provides organization but zero credit protection.</Text>
      </View>

      <KeyTakeawayBox chapter="Chapter 2" items={[
        'Business credit is a separate financial profile for your business, based on your EIN',
        'Three major bureaus track business credit (Dun & Bradstreet, Experian Business, Equifax Small Business)',
        'The real estate industry doesn\'t teach this—creating a massive knowledge gap',
        'The process follows clear, predictable steps (EIN → Profile → History → Score → Credit Lines)',
        'Timeline: 9-12 months to build a strong business credit profile',
        'Common misconceptions keep agents from taking action',
      ]} />
      <PageFooter />
    </Page>

    {/* ==================== CHAPTER 3 ==================== */}
    <Page size="LETTER" style={s.page} break>
      <ChapterStart label="CHAPTER 3" title="The True Cost of Using Personal Credit" />

      <P>Let's get specific about what it costs you to NOT have separate business credit. These aren't hypothetical numbers—they're based on real situations.</P>

      <View style={s.warningBox} wrap={false}>
        <Text style={s.warningTitle}>The Average Agent's Annual Business Expenses</Text>
        <Text style={s.calloutText}>Marketing & advertising: $3,000-8,000/year</Text>
        <Text style={s.calloutText}>Technology (CRM, website, tools): $1,200-3,600/year</Text>
        <Text style={s.calloutText}>Vehicle expenses: $2,000-5,000/year</Text>
        <Text style={s.calloutText}>Professional development: $500-2,000/year</Text>
        <Text style={s.calloutText}>Insurance & memberships: $1,000-2,500/year</Text>
        <Text style={[s.calloutText, { marginTop: 6, fontFamily: 'Helvetica-Bold' }]}>Total: $8,000-21,000+ annually on personal credit</Text>
      </View>

      <Text style={s.h2}>The Real Damage</Text>
      <Bullet>Credit utilization above 30% drops your FICO score 30-50 points</Bullet>
      <Bullet>Lower scores = higher rates on mortgages, auto loans, everything</Bullet>
      <Bullet>A single point on a $400K mortgage = $80/month or $28,800 over 30 years</Bullet>
      <Bullet>Your family's mortgage, car loans, and credit are all affected</Bullet>

      <Text style={s.h2}>The Commission Check Reality</Text>
      <P>Here's something every realtor knows but rarely says out loud:</P>

      <View style={s.quoteBox} wrap={false}>
        <Text style={s.quoteText}>
          "Commission checks are lumpy. You might close 3 deals in one month and nothing for the next two. During the dry spells, those personal credit cards become your lifeline. And that's when the real damage happens—high utilization, missed payments, accumulating interest."
        </Text>
      </View>

      <P>Business credit solves this. It gives you a dedicated financial buffer for business expenses that doesn't impact your personal financial life.</P>

      <Text style={s.h2}>The Opportunity Cost</Text>
      <P>Beyond direct costs, there's what you CAN'T do because your personal credit is damaged:</P>
      <Bullet>You can't refinance your mortgage at better rates (saving $200-400/month)</Bullet>
      <Bullet>You can't get favorable car loans (paying $50-150/month more)</Bullet>
      <Bullet>You can't take advantage of new business opportunities (because you have no available credit)</Bullet>
      <Bullet>You can't help your kids with college (because you tapped your equity)</Bullet>
      <P>These opportunity costs are harder to quantify, but they're real. And they're expensive.</P>

      <Text style={s.h2}>What One More Year Will Cost You</Text>
      <P>Let's make this personal. If you wait one more year to establish business credit, here's what it might cost you:</P>

      <View style={s.storyBox} wrap={false}>
        <Text style={s.storyTitle}>Conservative Estimate (12 Months of Waiting)</Text>
        <Text style={s.calloutText}>• Interest on business expenses carried on personal cards: $2,000-3,500</Text>
        <Text style={s.calloutText}>• Higher interest rates on personal loans due to higher utilization: $1,000-2,000</Text>
        <Text style={s.calloutText}>• Lost refinancing opportunity: $2,400-4,800 (12 months × $200-400/month savings)</Text>
        <Text style={s.calloutText}>• Stress, worry, family tension: Priceless (but very real)</Text>
        <Text style={[s.calloutText, { marginTop: 6, fontFamily: 'Helvetica-Bold' }]}>Total Direct Cost of Waiting: $5,400-10,300</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>And that's just ONE year. Multiply by 5, 10, 15 years in real estate...</Text>
      </View>

      <Text style={s.h2}>The Alternative: What Having Business Credit Would Cost</Text>
      <P>Now let's look at the other side. What does it actually cost to BUILD business credit?</P>

      <View style={s.calloutBox} wrap={false}>
        <Text style={s.calloutTitle}>The Investment in Building Business Credit</Text>
        <Text style={s.calloutText}>• Professional guidance and coaching: $1,500-3,000 (one-time)</Text>
        <Text style={s.calloutText}>• Time investment: 9-12 months of following a strategic plan</Text>
        <Text style={s.calloutText}>• Initial vendor accounts: Minimal (you're already buying these things for your business)</Text>
        <Text style={[s.calloutText, { marginTop: 6, fontFamily: 'Helvetica-Bold' }]}>Total Investment: $1,500-3,000</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}><Text style={s.bold}>Payoff Time:</Text> 3-6 months (after which you're saving $5,000-10,000/year)</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}><Text style={s.bold}>10-Year Return:</Text> $50,000-100,000+ in saved costs and increased opportunities</Text>
      </View>

      <P>From a pure ROI perspective, this might be the best business decision you make in your entire real estate career.</P>

      <Text style={s.h2}>The Question You Should Be Asking</Text>
      <P>The question isn't "Should I invest in building business credit?"</P>
      <P>The question is: "Can I afford NOT to?"</P>
      <P>Every month you wait is another month of:</P>
      <Bullet>Damaging your personal credit</Bullet>
      <Bullet>Paying unnecessary interest</Bullet>
      <Bullet>Missing opportunities</Bullet>
      <Bullet>Risking your family's financial security</Bullet>

      <KeyTakeawayBox chapter="Chapter 3" items={[
        'Using personal credit for business costs $5,000-26,000/year in direct and opportunity costs',
        'Over a 10-year career, this can total $50,000-260,000+',
        'The costs compound over time—they don\'t just add up, they get WORSE',
        'Building business credit is a one-time investment with massive long-term ROI',
        'Every month you wait costs you money',
        'The question isn\'t whether you can afford to build business credit—it\'s whether you can afford NOT to',
      ]} />
      <PageFooter />
    </Page>

    {/* ==================== CHAPTER 4 ==================== */}
    <Page size="LETTER" style={s.page} break>
      <ChapterStart label="CHAPTER 4" title="Common Questions & Objections" />

      <P>By now, you're probably thinking of reasons why this might not apply to you, or why it might not be the right time.</P>
      <P>I know, because I had the exact same thoughts.</P>
      <P>Let me address the most common questions and objections I hear from realtors:</P>

      <Text style={s.h2}>"But I'm Just an Agent, Not a Real Business"</Text>
      <View style={s.calloutBox} wrap={false}>
        <Text style={[s.calloutText, { fontFamily: 'Helvetica-Bold' }]}>The Reality:</Text>
        <Text style={s.calloutText}>If YOU have business expenses—marketing, gas, technology, staging—YOU ARE a business owner.</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>The IRS certainly treats you like a business when it comes to self-employment tax (15.3%), right?</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>If you're a business for tax purposes, you deserve business credit protection.</Text>
      </View>

      <Text style={s.h2}>"My Broker Handles Everything"</Text>
      <View style={s.calloutBox} wrap={false}>
        <Text style={[s.calloutText, { fontFamily: 'Helvetica-Bold' }]}>The Reality:</Text>
        <Text style={s.calloutText}>Your broker doesn't pay YOUR Zillow bill.</Text>
        <Text style={s.calloutText}>Your broker doesn't pay YOUR CRM subscription.</Text>
        <Text style={s.calloutText}>Your broker doesn't pay YOUR gas.</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>Those are YOUR business expenses. And mixing them with personal spending is hurting YOUR credit score, not theirs.</Text>
      </View>

      <Text style={s.h2}>"I Don't Make Enough to Worry About This"</Text>
      <View style={s.calloutBox} wrap={false}>
        <Text style={[s.calloutText, { fontFamily: 'Helvetica-Bold' }]}>The Reality:</Text>
        <Text style={s.calloutText}>That's exactly WHY you need it.</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>If you're struggling financially, the last thing you need is business expenses damaging your personal credit and making everything worse.</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>Protect what you have NOW. Build credit NOW so it's ready when you need it—not 6-12 months AFTER you needed it.</Text>
      </View>

      <Text style={s.h2}>"This Sounds Complicated and Expensive"</Text>
      <View style={s.calloutBox} wrap={false}>
        <Text style={[s.calloutText, { fontFamily: 'Helvetica-Bold' }]}>The Reality:</Text>
        <Text style={s.calloutText}>Setup costs: $50-300 total</Text>
        <Text style={[s.calloutText, { marginLeft: 12 }]}>• EIN from IRS: Free</Text>
        <Text style={[s.calloutText, { marginLeft: 12 }]}>• LLC filing: $100-300 (depending on your state)</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>That's less than one month of Zillow.</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>And it's WAY less expensive than the $15,000-25,000 per year you're losing by NOT doing this.</Text>
      </View>

      <Text style={s.h2}>"My Broker Won't Let Me Set Up a Separate Business"</Text>
      <View style={s.calloutBox} wrap={false}>
        <Text style={[s.calloutText, { fontFamily: 'Helvetica-Bold' }]}>The Reality:</Text>
        <Text style={s.calloutText}>Your real estate license and your business credit structure are two different things.</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>For example, in California (where I practice), you can have your license under your personal name or a corporation, AND run business finances through a separate entity.</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>Most agents can set this up without broker involvement. But every situation is different—this is one reason why consultation with professionals who understand real estate licensing is important.</Text>
      </View>

      <Text style={s.h2}>"I'll Do This When I'm More Established"</Text>
      <View style={s.calloutBox} wrap={false}>
        <Text style={[s.calloutText, { fontFamily: 'Helvetica-Bold' }]}>The Reality:</Text>
        <Text style={s.calloutText}>Building credit takes 6-12 months.</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>Every month you wait is another month of damage to your personal credit.</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>Start NOW so you have business credit when you need it—not 6-12 months AFTER you needed it.</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>I waited 10+ years. Don't make my mistake.</Text>
      </View>

      <Text style={s.h2}>"I Need Perfect Personal Credit to Get Business Credit"</Text>
      <View style={s.calloutBox} wrap={false}>
        <Text style={[s.calloutText, { fontFamily: 'Helvetica-Bold' }]}>The Reality:</Text>
        <Text style={s.calloutText}>Business credit is separate from personal credit.</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>Yes, some initial vendors may check your personal credit. But once you have 3-5 trade lines established, your business credit stands on its own.</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>The process works even if your personal credit has taken hits from business expenses (typically 550+ personal score is sufficient to start).</Text>
      </View>

      <KeyTakeawayBox chapter="Chapter 4" items={[
        'Most objections come from lack of information, not reality',
        'If you have business expenses, you need business credit—regardless of your situation',
        'Setup is less expensive and complicated than you think',
        'Waiting doesn\'t make it easier—it just costs you more',
      ]} />

      <BookSessionCTA />
      <PageFooter />
    </Page>

    {/* ==================== CHAPTER 5 ==================== */}
    <Page size="LETTER" style={s.page} break>
      <ChapterStart label="CHAPTER 5" title="The Seven-Step Process: What's Actually Involved" />

      <P>Building business credit follows a proven, predictable process.</P>
      <P>It's not random. It's not mysterious. It follows specific steps in a specific order—much like a real estate transaction.</P>
      <P>But here's what nobody shows you: <Text style={s.bold}>there are a LOT of moving parts, and each requires decisions that affect everything that comes after.</Text></P>

      <Text style={s.h2}>The Real Estate Transaction Analogy</Text>
      <P>Think about a real estate transaction. You know exactly what happens:</P>
      <OL num={1}>Offer & Acceptance</OL>
      <OL num={2}>Opening Escrow</OL>
      <OL num={3}>Inspection Period</OL>
      <OL num={4}>Appraisal</OL>
      <OL num={5}>Final Walkthrough</OL>
      <OL num={6}>Closing</OL>
      <P>It's predictable. But could your client handle it alone? Technically yes. Should they? Absolutely not.</P>
      <P>Building business credit is the same.</P>

      <Text style={s.h2}>The Seven Steps Overview</Text>
      <P>Here's what's involved in building business credit. I'm not giving you DIY instructions—I'm showing you what the process looks like so you understand why professional guidance matters.</P>

      <Text style={s.h3}>Step 1: Choose the Right Business Structure</Text>
      <P>LLC, S-Corp, or C-Corp?</P>
      <P>The answer depends on:</P>
      <Bullet>YOUR state regulations</Bullet>
      <Bullet>YOUR broker's requirements</Bullet>
      <Bullet>YOUR income level</Bullet>
      <Bullet>YOUR tax situation</Bullet>
      <Bullet>YOUR long-term goals</Bullet>

      <View style={s.warningBox} wrap={false}>
        <Text style={s.warningTitle}>Why This Matters:</Text>
        <Text style={s.calloutText}>Get this wrong and you'll have to dissolve the entity and start over. Or worse, you'll operate with a structure that doesn't protect you properly or costs you extra in taxes.</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>For example, in California, real estate licenses can be held under corporations but NOT LLCs. But you might be able to operate a separate entity for business expenses while keeping your license under your personal name or corporation.</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>Confused yet? This is exactly why consultation with professionals who understand real estate licensing is critical.</Text>
      </View>

      <Text style={s.h3}>Step 2: Obtain Your EIN</Text>
      <P>Your Employer Identification Number (EIN) is your business's Social Security Number.</P>
      <P>You apply through the IRS website. It's free and takes about 15 minutes.</P>
      <P>This seems simple—and it is—but it's the foundation for everything else. Any mistakes here create problems down the line.</P>

      <Text style={s.h3}>Step 3: Open a Business Bank Account</Text>
      <P>Not all business bank accounts are created equal for credit-building purposes.</P>
      <P>Questions to answer:</P>
      <Bullet>Which bank?</Bullet>
      <Bullet>What fees?</Bullet>
      <Bullet>What documentation do you need?</Bullet>
      <Bullet>How do you set it up to actually help build credit?</Bullet>
      <P>Most importantly: Once opened, ALL business transactions must go through this account. No exceptions. Mixing personal and business undermines the entire purpose.</P>

      <Text style={s.h3}>Step 4: Establish Business Phone & Address</Text>
      <P>Your business needs a dedicated phone number (Google Voice works) and a physical address.</P>
      <P>Critical point: This information must be consistent across ALL registrations. Inconsistency causes reporting issues later.</P>

      <Text style={s.h3}>Step 5: Register with Credit Bureaus</Text>
      <P>Three separate registrations:</P>
      <Bullet>Dun & Bradstreet (for D-U-N-S Number)</Bullet>
      <Bullet>Experian Business</Bullet>
      <Bullet>Equifax Small Business</Bullet>
      <P>Your information must match perfectly across all three. Even small discrepancies (like "Street" vs "St") can cause reporting problems.</P>

      <Text style={s.h3}>Step 6: Establish Vendor Trade Lines</Text>
      <P>This is where most people get stuck.</P>
      <P>Questions you need answers to:</P>
      <Bullet>Which vendors actually report to business credit bureaus?</Bullet>
      <Bullet>Which ones accept new businesses without personal guarantees?</Bullet>
      <Bullet>What order should you apply in? (Wrong sequence can hurt your score)</Bullet>
      <Bullet>How much should you purchase?</Bullet>
      <Bullet>When should you pay? (Early payment matters—not just on-time)</Bullet>
      <Bullet>How do you verify they're actually reporting?</Bullet>
      <P>Apply to the wrong vendor and you've wasted time. Apply in the wrong order and you've potentially damaged your business credit score before you even got started.</P>

      <Text style={s.h3}>Step 7: Apply for Business Credit Cards</Text>
      <P>Timing is everything:</P>
      <Bullet>Too early: You get denied</Bullet>
      <Bullet>Too late: You've wasted months</Bullet>
      <P>Plus, you need to know:</P>
      <Bullet>Which cards report to business bureaus? (Not all do)</Bullet>
      <Bullet>Which cards don't require personal guarantees?</Bullet>
      <Bullet>Which cards are appropriate for your business age and credit profile?</Bullet>
      <P>Apply for the wrong card and you've hurt your score for nothing.</P>

      <Text style={s.h2}>Why This Isn't a DIY Project</Text>
      <P>Could you figure all this out yourself? Yes.</P>
      <P>Should you? That depends on how you value your time.</P>
      <P>Here's what DIY typically looks like:</P>
      <Bullet>Hours of research trying to figure out which structure is right</Bullet>
      <Bullet>Mistakes in registration that cause delays</Bullet>
      <Bullet>Applying to vendors that don't report (wasting time)</Bullet>
      <Bullet>Applying in the wrong sequence (potentially hurting your score)</Bullet>
      <Bullet>Months of troubleshooting why things aren't reporting correctly</Bullet>
      <Bullet>Potentially having to restart parts of the process</Bullet>
      <P>All while you're trying to close deals, serve clients, and run your real estate business.</P>

      <View style={s.calloutBox} wrap={false}>
        <Text style={s.calloutTitle}>The Professional Guidance Alternative:</Text>
        <Text style={s.calloutText}>Someone tells you exactly what structure works in YOUR state.</Text>
        <Text style={s.calloutText}>Someone gives you the approved vendor list that actually works.</Text>
        <Text style={s.calloutText}>Someone monitors to ensure everything is reporting correctly.</Text>
        <Text style={s.calloutText}>Someone tells you exactly when to apply for business credit cards.</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>You focus on closing deals. They handle the complexity.</Text>
      </View>

      <KeyTakeawayBox chapter="Chapter 5" items={[
        'Building business credit follows a predictable 7-step process',
        'Each step has multiple decisions that affect everything that comes after',
        'Mistakes are costly in time and potentially in credit score damage',
        'Professional guidance exists for the same reason real estate agents exist—complexity requires expertise',
      ]} />

      <BookSessionCTA />
      <PageFooter />
    </Page>

    {/* ==================== CHAPTER 6 ==================== */}
    <Page size="LETTER" style={s.page} break>
      <ChapterStart label="CHAPTER 6" title="The Emotional Journey: What It Actually Feels Like" />

      <P>Let me tell you something nobody else will: Building business credit isn't just a process—it's a journey with emotional ups and downs.</P>
      <P>Knowing what to expect helps you stay on track when things feel slow or confusing.</P>

      <Text style={s.h2}>Month 1: "The Relief Phase"</Text>
      <Text style={s.h3}>What You're Doing:</Text>
      <P>Business structure setup, EIN application, opening bank accounts</P>
      <Text style={s.h3}>How You Feel:</Text>
      <P>Relieved that you're finally doing something about this. Maybe a little overwhelmed by the paperwork, but excited to take control of your finances.</P>
      <Text style={s.h3}>The Moment That Matters:</Text>
      <P>When you receive your EIN letter from the IRS.</P>
      <P>That's when it hits you: "I have a REAL business entity now."</P>
      <P>You feel legitimate in a way you never did before. You're not just an agent—you're a business owner with proper structure.</P>
      <Text style={s.h3}>What Professional Guidance Provides:</Text>
      <P>Making sure every form is filed correctly the first time, so you don't have to redo anything. Answering the questions that come up during setup. Ensuring your structure is optimal for YOUR state and situation.</P>

      <Text style={s.h2}>Months 2-3: "The Waiting Game"</Text>
      <Text style={s.h3}>What You're Doing:</Text>
      <P>Establishing vendor accounts, making first purchases, waiting for things to process</P>
      <Text style={s.h3}>How You Feel:</Text>
      <P>Impatient. "Is this working? When will I see results?"</P>
      <Text style={s.h3}>The Moment That Matters:</Text>
      <P>Your first vendor account gets approved without requiring a personal guarantee.</P>
      <P>"Wait, they're giving me credit based on my BUSINESS, not me personally?"</P>
      <P>That's when the concept becomes real. You're no longer reading about business credit—you're experiencing it.</P>
      <Text style={s.h3}>What Professional Guidance Provides:</Text>
      <P>Knowing exactly which vendors to apply to and in what order. Monitoring to make sure things are reporting correctly. Keeping you on track when impatience kicks in.</P>

      <Text style={s.h2}>Months 4-5: "The Momentum Shift"</Text>
      <Text style={s.h3}>What You're Doing:</Text>
      <P>Adding more trade lines, watching your business credit score grow</P>
      <Text style={s.h3}>How You Feel:</Text>
      <P>Confident. You check your personal credit score and realize it's IMPROVING—because business expenses are no longer hitting it.</P>
      <Text style={s.h3}>The Moment That Matters:</Text>
      <P>You check your business credit score for the first time and it actually EXISTS. Your business has a financial identity.</P>
      <Text style={s.h3}>What Professional Guidance Provides:</Text>
      <P>Strategic timing for the next applications. Making sure you're maximizing your score growth. Preparing you for the next phase.</P>

      <Text style={s.h2}>Month 6+: "The Freedom Feeling"</Text>
      <Text style={s.h3}>What You're Doing:</Text>
      <P>Applying for and receiving your first business credit card</P>
      <Text style={s.h3}>How You Feel:</Text>
      <P>FREE. Protected. Professional.</P>
      <P>You swipe your business credit card for a $2,000 marketing package knowing it won't touch your personal credit at all.</P>
      <P>Then you think: "Why did I wait so long to do this?"</P>
      <Text style={s.h3}>What Professional Guidance Provides:</Text>
      <P>Knowing which credit cards to apply for and when. Ensuring your applications are optimized for approval with the highest limits. Planning for long-term credit growth.</P>

      <KeyTakeawayBox chapter="Chapter 6" items={[
        'Building business credit has emotional phases—knowing what to expect helps',
        'The waiting periods are normal and necessary',
        'Professional guidance keeps you on track through the slow periods',
        'The "freedom feeling" at the end makes the entire journey worthwhile',
      ]} />
      <PageFooter />
    </Page>

    {/* ==================== CHAPTER 7 ==================== */}
    <Page size="LETTER" style={s.page} break>
      <ChapterStart label="CHAPTER 7" title="Why You Need Professional Guidance" />

      <P>Think about your clients. They COULD buy a house without you. They could search online, call listing agents directly, write their own offers, navigate inspections, negotiate repairs, and manage the closing process.</P>
      <P>But they don't. Why?</P>

      <View style={s.calloutBox} wrap={false}>
        <Text style={s.calloutTitle}>Because:</Text>
        <Text style={s.calloutText}>• The process is complex with many moving parts</Text>
        <Text style={s.calloutText}>• Mistakes are expensive and stressful</Text>
        <Text style={s.calloutText}>• Your expertise saves them time, money, and headaches</Text>
        <Text style={s.calloutText}>• The cost of your guidance is tiny compared to the cost of potential mistakes</Text>
      </View>

      <B>Building business credit is the exact same situation.</B>

      <Text style={s.h2}>The Dual Coach System</Text>
      <P>When you work with us, you don't get just one advisor. You get TWO dedicated coaches, each with specific expertise:</P>

      <View style={s.storyBox} wrap={false}>
        <Text style={[s.storyTitle, { color: '#3eaf7c' }]}>Coach #1: Your Realtor Business Credit Coach</Text>
        <Text style={s.calloutText}>This is someone who understands:</Text>
        <Text style={[s.calloutText, { marginLeft: 12, marginTop: 4 }]}>• Real estate licensing requirements by state</Text>
        <Text style={[s.calloutText, { marginLeft: 12 }]}>• Broker relationships and how they affect your options</Text>
        <Text style={[s.calloutText, { marginLeft: 12 }]}>• Commission structures and cash flow patterns</Text>
        <Text style={[s.calloutText, { marginLeft: 12 }]}>• The unique financial situation realtors face</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>They've worked with hundreds of agents and brokers. They know the pitfalls, the shortcuts, and the state-specific issues.</Text>
      </View>

      <View style={s.storyBox} wrap={false}>
        <Text style={[s.storyTitle, { color: '#3eaf7c' }]}>Coach #2: Your Credit Suite Coach</Text>
        <Text style={s.calloutText}>This is the technical expert who knows:</Text>
        <Text style={[s.calloutText, { marginLeft: 12, marginTop: 4 }]}>• Exactly which vendors to use (and which to avoid)</Text>
        <Text style={[s.calloutText, { marginLeft: 12 }]}>• Which credit cards to apply for and when</Text>
        <Text style={[s.calloutText, { marginLeft: 12 }]}>• How to troubleshoot reporting issues</Text>
        <Text style={[s.calloutText, { marginLeft: 12 }]}>• How to optimize your business credit strategy</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>Credit Suite has helped tens of thousands of businesses build business credit. Their coaches have seen every scenario.</Text>
      </View>

      <Text style={s.h2}>You Get a Customized Plan</Text>
      <P>Not generic advice. A plan built specifically for:</P>
      <Bullet>YOUR state regulations</Bullet>
      <Bullet>YOUR broker requirements</Bullet>
      <Bullet>YOUR income level</Bullet>
      <Bullet>YOUR goals</Bullet>
      <Bullet>YOUR timeline</Bullet>

      <Text style={s.h2}>The Real Value</Text>
      <B>You focus on closing deals. Professionals handle the complexity of building your business credit.</B>
      <P>Your time is valuable. Every hour you spend researching vendors or troubleshooting credit bureau issues is an hour you're NOT:</P>
      <Bullet>Following up with leads</Bullet>
      <Bullet>Showing properties</Bullet>
      <Bullet>Negotiating offers</Bullet>
      <Bullet>Closing deals</Bullet>
      <P>What's YOUR hourly rate when you're working in your business?</P>
      <P>Now compare that to the cost of professional guidance.</P>
      <P>The math isn't even close.</P>

      <KeyTakeawayBox chapter="Chapter 7" items={[
        'You guide your clients because expertise matters—the same applies to building business credit',
        'Professional guidance means two dedicated coaches plus a customized plan',
        'The real value is focusing your time on what you do best (closing deals)',
        'DIY is possible but rarely optimal when your time has significant value',
      ]} />

      <BookSessionCTA />
      <PageFooter />
    </Page>

    {/* ==================== CHAPTER 8 ==================== */}
    <Page size="LETTER" style={s.page} break>
      <ChapterStart label="CHAPTER 8" title="Success Stories from Fellow Realtors" />

      <P>I want to share some stories from realtors who've gone through this process.</P>
      <P>Full disclosure: We're just launching this specialized program for real estate professionals, so these are early adopters who tested the system. But their results are real.</P>

      <View style={s.quoteBox} wrap={false}>
        <Text style={s.quoteText}>
          "I closed 8 deals last year and my personal credit score dropped to 580 because of business expenses. I couldn't even get approved for a new personal card. After 6 months with this program, my business has its own credit profile and my PERSONAL score is back to 720. I can finally refinance my house. This literally changed my financial life."
        </Text>
        <Text style={s.quoteAttr}>— Maria Rodriguez, Residential Agent, Texas</Text>
      </View>

      <View style={s.quoteBox} wrap={false}>
        <Text style={s.quoteText}>
          "I've been in real estate for 15 years. FIFTEEN YEARS mixing personal and business. I had no idea this was even possible. I calculated what it cost me—conservatively $30,000 in extra interest over the years, plus who knows how much in lost opportunities because my personal credit was maxed. Better late than never, but I wish I'd known about this in 2009."
        </Text>
        <Text style={s.quoteAttr}>— David Chen, Commercial Broker, California</Text>
      </View>

      <View style={s.quoteBox} wrap={false}>
        <Text style={s.quoteText}>
          "The dual coaching is what sold me. I didn't want to figure this out on my own—I'm busy running my business. Having someone who actually understands real estate licensing plus a credit expert was exactly what I needed. They handled the complexity. I just followed the steps they gave me. Setup took maybe 3 hours total over two weeks. Now my business expenses are completely separate and I have access to capital I didn't have before."
        </Text>
        <Text style={s.quoteAttr}>— Jennifer Williams, Broker, Georgia</Text>
      </View>

      <View style={s.quoteBox} wrap={false}>
        <Text style={s.quoteText}>
          "I was skeptical at first. I thought 'I'm not making enough to worry about this.' But then I realized—that's exactly WHY I need it. When you're not making a ton of money, you can't afford to have business expenses destroying your personal credit. Now my personal score is improving, and when I DO have a great year, I'll have business credit ready to help me scale. I'm setting myself up for success instead of reacting to problems."
        </Text>
        <Text style={s.quoteAttr}>— Marcus Thompson, Residential & Commercial Agent, Florida</Text>
      </View>

      <Text style={s.h2}>Common Themes</Text>
      <P>When I talk to realtors who've gone through this process, I hear the same things repeatedly:</P>

      <View style={s.calloutBox} wrap={false}>
        <Text style={s.calloutTitle}>"I Wish I'd Done This Years Ago"</Text>
        <Text style={s.calloutText}>Almost everyone says they wish they'd known about this earlier. The regret isn't about the decision to do it—it's about waiting so long.</Text>
      </View>

      <View style={s.calloutBox} wrap={false}>
        <Text style={s.calloutTitle}>"It Was Easier Than I Expected"</Text>
        <Text style={s.calloutText}>With guidance, the actual work involved is minimal. Most of the "work" is just waiting for things to process.</Text>
      </View>

      <View style={s.calloutBox} wrap={false}>
        <Text style={s.calloutTitle}>"The Freedom Feeling Is Real"</Text>
        <Text style={s.calloutText}>There's something psychologically powerful about knowing your business expenses can't hurt your personal finances. It changes how you think about investing in your business.</Text>
      </View>

      <View style={s.calloutBox} wrap={false}>
        <Text style={s.calloutTitle}>"I Feel More Professional"</Text>
        <Text style={s.calloutText}>Having proper business structure and business credit makes people feel like "real" business owners, not just agents operating out of their personal checking account.</Text>
      </View>

      <KeyTakeawayBox chapter="Chapter 8" items={[
        'Real realtors are successfully building business credit with professional guidance',
        'The common regret is waiting too long, not doing it',
        'With guidance, the process is more straightforward than expected',
        'The psychological and financial benefits are significant',
      ]} />
      <PageFooter />
    </Page>

    {/* ==================== CHAPTER 9 ==================== */}
    <Page size="LETTER" style={s.page} break>
      <ChapterStart label="CHAPTER 9" title="What's Next: Advanced Strategies" />

      <P>This guide has focused on the foundation—establishing business credit and separating your business and personal finances.</P>
      <P>But there's a "Level 2" that most realtors never discover.</P>
      <P>Once you have established business credit, a whole world of financial strategies opens up:</P>

      <Text style={s.h2}>Using Business Credit for Investment Properties</Text>
      <P>Many realtors eventually want to invest in real estate themselves. With established business credit, you can:</P>
      <Bullet>Fund down payments without touching personal savings</Bullet>
      <Bullet>Finance renovations on business credit</Bullet>
      <Bullet>Keep investment activities completely separate from your personal finances</Bullet>
      <Bullet>Build a portfolio without impacting your personal debt-to-income ratio</Bullet>

      <Text style={s.h2}>Strategic 0% APR Business Card Usage</Text>
      <P>Once you have multiple business credit cards, you can:</P>
      <Bullet>Use promotional 0% APR offers for short-term capital</Bullet>
      <Bullet>Fund marketing campaigns with essentially free money (if paid off during promo period)</Bullet>
      <Bullet>Smooth cash flow between commissions</Bullet>
      <Bullet>Never pay interest if managed strategically</Bullet>

      <Text style={s.h2}>Building Multiple Business Credit Profiles</Text>
      <P>For agents with multiple business entities or team brokers:</P>
      <Bullet>Each entity can have its own credit profile</Bullet>
      <Bullet>Multiply your available capital</Bullet>
      <Bullet>Separate different business activities</Bullet>
      <Bullet>Create saleable assets (businesses with their own credit)</Bullet>

      <Text style={s.h2}>Funding Your Transition Out of Real Estate</Text>
      <P>Eventually, many agents want to transition to something else—investing full-time, coaching, different business ventures, or retirement.</P>
      <P>Established business credit becomes an asset you can:</P>
      <Bullet>Use to fund your next venture</Bullet>
      <Bullet>Sell as part of your real estate business</Bullet>
      <Bullet>Leverage for investment opportunities</Bullet>
      <Bullet>Keep active even as you wind down real estate activities</Bullet>

      <Text style={s.h2}>Tax Optimization Strategies</Text>
      <P>With proper business structure and business credit, you can work with your CPA on:</P>
      <Bullet>Maximizing business expense deductions</Bullet>
      <Bullet>Optimal entity structure for tax purposes</Bullet>
      <Bullet>Clean books that make tax preparation easier and cheaper</Bullet>
      <Bullet>Audit protection (clean separation prevents issues)</Bullet>

      <Text style={s.h2}>Why These Strategies Come Later</Text>
      <P>All of these advanced strategies require one thing: <Text style={s.bold}>established business credit.</Text></P>
      <P>You can't do Level 2 until you've completed Level 1.</P>
      <P>That's why starting now—even if you're not ready for advanced strategies—is so important.</P>
      <P>Build the foundation now. The advanced strategies will be available when you're ready for them.</P>

      <View style={s.calloutBox} wrap={false}>
        <Text style={s.calloutTitle}>What Your Coaches Will Cover:</Text>
        <Text style={s.calloutText}>Your Realtor Business Credit Coach and Credit Suite Coach will introduce these advanced strategies once you've established your foundation.</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>But first, you need that foundation. That's what the program builds.</Text>
      </View>

      <KeyTakeawayBox chapter="Chapter 9" items={[
        'Established business credit opens up advanced financial strategies',
        'These strategies can help you invest, grow, and eventually transition',
        'All advanced strategies require the foundation first',
        'Starting now means you\'ll be ready when opportunities arise',
      ]} />
      <PageFooter />
    </Page>

    {/* ==================== CONCLUSION ==================== */}
    <Page size="LETTER" style={s.page} break>
      <ChapterStart label="CONCLUSION" title="Your Next Steps" />

      <P>If you've read this far, congratulations.</P>
      <P>You now understand something that 90% of real estate professionals don't:</P>
      <B>Business credit exists. It's accessible. And it can protect your financial future.</B>
      <P>More importantly, you understand that every month you wait is costing you money—real money that could be in your pocket, building your wealth, protecting your family.</P>

      <Text style={s.h2}>You Have a Choice</Text>
      <P>You're at a decision point. And honestly, there are really only two paths forward:</P>

      <View style={s.storyBox} wrap={false}>
        <Text style={[s.storyTitle, { color: '#c0392b' }]}>Path 1: Continue As Is</Text>
        <Text style={s.calloutText}>Keep mixing personal and business finances. Keep using personal credit for business expenses. Keep risking your personal credit score, your refinancing options, your family's financial security.</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>I understand this path. I lived it for over 10 years. It's familiar. It's what everyone else does.</Text>
        <Text style={[s.calloutText, { marginTop: 4, fontFamily: 'Helvetica-Bold' }]}>But you now know what it's costing you: $5,000-26,000 per year. $50,000-260,000+ over a career.</Text>
      </View>

      <View style={s.storyBox} wrap={false}>
        <Text style={[s.storyTitle, { color: '#3eaf7c' }]}>Path 2: Establish Business Credit</Text>
        <Text style={s.calloutText}>Take 9-12 months to build business credit properly. Separate your business and personal finances. Protect your personal credit. Access more capital with less personal risk.</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>This path requires an investment of time and money upfront. But the payoff is massive and permanent.</Text>
        <Text style={[s.calloutText, { marginTop: 4, fontFamily: 'Helvetica-Bold' }]}>This is the path I wish I'd taken 15 years ago.</Text>
      </View>

      <P>The choice is yours. But please—make it an INFORMED choice.</P>

      <Text style={s.h2}>If You're Ready for Path 2</Text>
      <P>If you've read this guide and thought, "This makes sense. I need to do this"—then let's talk about YOUR specific situation.</P>
      <P>Because here's the truth: Every realtor's situation is different.</P>
      <Bullet>Different states have different regulations</Bullet>
      <Bullet>Different broker arrangements have different implications</Bullet>
      <Bullet>Different business goals require different strategies</Bullet>
      <Bullet>Different financial situations need different approaches</Bullet>
      <P>There's no one-size-fits-all solution. What worked for Sarah in California might not work for Marcus in Georgia. What's right for a solo agent isn't necessarily right for a broker with a team.</P>
      <P>That's why I'm offering something specific:</P>

      <View style={s.importantBox} wrap={false}>
        <Text style={s.importantTitle}>Limited One-on-One Sessions</Text>
        <Text style={s.calloutText}><Text style={s.bold}>For a limited time,</Text> I'm personally offering one-on-one sessions with realtors who are serious about establishing business credit.</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>This isn't a sales call. This isn't a pitch. This is a realtor-to-realtor business conversation.</Text>
        <Text style={[s.calloutText, { marginTop: 8, fontFamily: 'Helvetica-Bold' }]}>Here's exactly what happens in our session:</Text>
        <Text style={[s.calloutText, { marginTop: 8, fontFamily: 'Helvetica-Bold' }]}>First 5 Minutes: Your Fundability Scan</Text>
        <Text style={s.calloutText}>We'll run your Fundability Scan together. This shows you exactly where YOUR business stands right now for credit purposes.</Text>
        <Text style={[s.calloutText, { marginTop: 8, fontFamily: 'Helvetica-Bold' }]}>Next 10-15 Minutes: Your Situation</Text>
        <Text style={s.calloutText}>We'll discuss:</Text>
        <Text style={[s.calloutText, { marginLeft: 12 }]}>• Why you booked this session—what's your current situation?</Text>
        <Text style={[s.calloutText, { marginLeft: 12 }]}>• What prompted you to look into business credit?</Text>
        <Text style={[s.calloutText, { marginLeft: 12 }]}>• What are your goals for your real estate business?</Text>
        <Text style={[s.calloutText, { marginLeft: 12 }]}>• What state you're in and how that affects your options</Text>
        <Text style={[s.calloutText, { marginLeft: 12 }]}>• What your broker arrangement looks like</Text>
        <Text style={[s.calloutText, { marginTop: 8, fontFamily: 'Helvetica-Bold' }]}>Final 10-15 Minutes: Your Customized Next Steps</Text>
        <Text style={s.calloutText}>Based on YOUR specific situation, I'll outline:</Text>
        <Text style={[s.calloutText, { marginLeft: 12 }]}>• What business structure makes sense for YOU</Text>
        <Text style={[s.calloutText, { marginLeft: 12 }]}>• What YOUR timeline would look like</Text>
        <Text style={[s.calloutText, { marginLeft: 12 }]}>• What YOUR specific challenges might be</Text>
        <Text style={[s.calloutText, { marginLeft: 12 }]}>• What YOUR next steps should be</Text>
        <Text style={[s.calloutText, { marginTop: 8 }]}><Text style={s.bold}>No obligation. No pressure. No hard sell.</Text></Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>At the end of our conversation, you'll know whether establishing business credit makes sense for YOUR situation. And if it does, you'll know exactly what to do next.</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>If it doesn't make sense for you, I'll tell you that too. Some realtors honestly don't need business credit right now. And that's okay.</Text>
      </View>

      <Text style={s.h2}>Why I'm Offering This</Text>
      <P>You might be wondering: "Why would Jessie take time to do one-on-one sessions?"</P>
      <P>Fair question. Here's my honest answer:</P>
      <P>Because I remember what it felt like to discover business credit at age 40, after 10+ years in real estate, after I'd already made expensive mistakes.</P>
      <P>I remember thinking: "Where was this information when I needed it? Why didn't anyone tell me?"</P>
      <P>And I decided: I'm going to be that person for other realtors. I'm going to be the person who sounds the alarm, who shares the information, who helps people avoid my mistakes.</P>

      <Text style={s.h2}>What Happens After Our Session?</Text>
      <P>After we talk, you'll make a decision. Maybe you decide to move forward with establishing business credit. Maybe you decide to wait. Maybe you decide it's not right for you at all.</P>
      <P>All of those are valid choices.</P>
      <P>If you DO decide to move forward, here's what that looks like:</P>
      <Bullet>You'll work with professional business credit coaches who specialize in realtors</Bullet>
      <Bullet>You'll follow a customized plan based on YOUR state, YOUR situation, YOUR goals</Bullet>
      <Bullet>You'll have support throughout the 9-12 month process</Bullet>
      <Bullet>You'll build business credit the RIGHT way, avoiding common pitfalls</Bullet>
      <P>But that's getting ahead of ourselves. First, let's just have a conversation about whether this makes sense for you.</P>

      <Text style={s.h2}>How to Book Your Session</Text>

      <View style={s.actionBox} wrap={false}>
        <Text style={s.actionTitle}>Step 1: Schedule Your One-on-One Session</Text>
        <Text style={s.calloutText}>Schedule a time to talk with me directly.</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>
          <Text style={s.bold}>Book your session: </Text>
          <Link src={CTA_URL} style={s.link}>RealtorBusinessCredit.com/get_started</Link>
        </Text>
      </View>

      <View style={s.actionBox} wrap={false}>
        <Text style={s.actionTitle}>Step 2: Complete Your Free Fundability Scan</Text>
        <Text style={s.calloutText}>Done during the session, it takes about 5 minutes. It's a simple assessment that shows where your business stands for credit purposes. Once you complete your scan, we'll review YOUR results together and discuss YOUR specific situation.</Text>
      </View>

      <View style={s.actionBox} wrap={false}>
        <Text style={s.actionTitle}>Step 3: Show Up Ready to Talk</Text>
        <Text style={s.calloutText}>Come prepared to discuss:</Text>
        <Text style={[s.calloutText, { marginLeft: 12, marginTop: 4 }]}>• Your current business structure (or lack thereof)</Text>
        <Text style={[s.calloutText, { marginLeft: 12 }]}>• Your state and broker arrangement</Text>
        <Text style={[s.calloutText, { marginLeft: 12 }]}>• Your goals for your real estate business</Text>
        <Text style={[s.calloutText, { marginLeft: 12 }]}>• Any concerns or questions you have</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>The more open you are, the more helpful I can be.</Text>
      </View>

      <Text style={s.h2}>One Year from Now</Text>
      <P>Let me paint two pictures of where you could be one year from today:</P>

      <View style={s.storyBox} wrap={false}>
        <Text style={[s.storyTitle, { color: '#c0392b' }]}>Scenario A: You Didn't Act</Text>
        <Text style={s.calloutText}>You're still using personal credit for business expenses. You just got declined for a mortgage refinance because your credit score dropped another 30 points. You're paying $300/month more in interest than you would have with better credit. Your spouse is worried about your maxed-out credit cards. You still haven't figured out business credit.</Text>
        <Text style={[s.calloutText, { marginTop: 6, fontFamily: 'Helvetica-Bold' }]}>Cost this year: $5,000-10,000+</Text>
        <Text style={[s.calloutText, { fontFamily: 'Helvetica-Bold' }]}>Position: Same as today, but worse</Text>
      </View>

      <View style={s.storyBox} wrap={false}>
        <Text style={[s.storyTitle, { color: '#3eaf7c' }]}>Scenario B: You Took Action</Text>
        <Text style={s.calloutText}>You spent 9-12 months building business credit. You now have business credit cards with $25,000+ in available credit. You're charging all business expenses to business accounts. Your personal credit score has INCREASED (because utilization is down). You just got approved for that investment property loan. Your family's finances are protected. You have options.</Text>
        <Text style={[s.calloutText, { marginTop: 6, fontFamily: 'Helvetica-Bold' }]}>Investment: $1,500-3,000 (one-time)</Text>
        <Text style={[s.calloutText, { fontFamily: 'Helvetica-Bold' }]}>Position: Protected, positioned for growth, sleeping better at night</Text>
      </View>

      <P>Which scenario do you want?</P>

      <Text style={s.h2}>The Final Word</Text>
      <P>I can't make this decision for you. Only you can decide whether establishing business credit makes sense for your situation.</P>
      <P>But I can tell you this:</P>

      <View style={s.quoteBox} wrap={false}>
        <Text style={s.quoteText}>Ten years from now, you'll look back on this moment.</Text>
        <Text style={[s.quoteText, { marginTop: 4 }]}>If you take action today, you'll think: "That was one of the smartest business decisions I ever made."</Text>
        <Text style={[s.quoteText, { marginTop: 4 }]}>If you don't take action, you'll think: "Why didn't I do that when I first learned about it? How much did my delay cost me?"</Text>
        <Text style={[s.quoteText, { marginTop: 4 }]}>I know which thought I'd rather have.</Text>
      </View>

      <P>Don't wait another 10 years like I did.</P>
      <P>Don't wait until you've maxed out your personal credit.</P>
      <P>Don't wait until you've tapped your home equity.</P>
      <P>Don't wait until you're in crisis mode.</P>
      <B>Take action today.</B>

      <View style={s.importantBox} wrap={false}>
        <Text style={s.importantTitle}>Book Your One-on-One Session Now</Text>
        <Text style={s.calloutText}>
          <Text style={s.bold}>Book your session: </Text>
          <Link src={CTA_URL} style={s.link}>RealtorBusinessCredit.com/get_started</Link>
        </Text>
        <Text style={[s.calloutText, { marginTop: 6 }]}>5 minutes for the scan. 30 minutes for our conversation. Complete clarity on YOUR path forward.</Text>
        <Text style={[s.calloutText, { marginTop: 8, fontStyle: 'italic' }]}>Your future self will thank you.</Text>
      </View>

      <P style={{ marginTop: 20, fontStyle: 'italic' }}>— Jessie Hunter{'\n'}Broker | California & Georgia{'\n'}Founder, Realtor Business Credit</P>
      <P style={{ fontSize: 9, color: '#6c757d' }}>P.S. Remember: These one-on-one sessions are offered for a limited time. I'm a working realtor like you, so I can only do so many of these. If this resonates with you, book your session now while it's available.</P>
      <PageFooter />
    </Page>

    {/* ==================== RESOURCES ==================== */}
    <Page size="LETTER" style={s.page} break>
      <ChapterStart title="Resources & Additional Information" />

      <Text style={s.h2}>Take Your Next Step</Text>
      <View style={s.calloutBox} wrap={false}>
        <Text style={s.calloutTitle}>Realtor Business Credit</Text>
        <Text style={s.calloutText}><Text style={s.bold}>Main Website:</Text> <Link src={MAIN_URL} style={s.link}>mybetterbusinesscredit.com</Link></Text>
        <Text style={s.calloutText}><Text style={s.bold}>Realtor-Specific Resources:</Text> <Link src={REALTOR_URL} style={s.link}>realtorbusinesscredit.com</Link></Text>
        <Text style={s.calloutText}><Text style={s.bold}>Free Fundability Scan & Session Booking:</Text> <Link src={CTA_URL} style={s.link}>RealtorBusinessCredit.com/get_started</Link></Text>
      </View>

      <Text style={s.h2}>About the Author</Text>
      <View style={s.storyBox} wrap={false}>
        <Text style={s.storyTitle}>Jessie Hunter</Text>
        <Text style={s.calloutText}>Jessie Hunter is a licensed real estate broker in California and Georgia with over 15 years of experience in residential and commercial real estate.</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>After discovering business credit late in his career—and calculating what it cost him not to know earlier—Jessie became a certified partner with Credit Suite to help fellow real estate professionals avoid the same mistakes.</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>He founded Realtor Business Credit specifically to address the gap in real estate education around business finance fundamentals.</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>Jessie's mission is simple: Ensure that no realtor waits 10+ years to discover business credit like he did.</Text>
      </View>

      <Text style={s.h2}>Share This Guide</Text>
      <P>If you found this guide valuable, please share it with fellow real estate professionals.</P>
      <P>Every agent and broker deserves to know that business credit exists and that there's a better way than mixing personal and business finances.</P>
      <P><Text style={s.bold}>Download at:</Text> <Link src={REALTOR_URL} style={s.link}>realtorbusinesscredit.com</Link></P>

      <Text style={s.h2}>Important Disclaimers</Text>
      <P>This guide provides education and coaching only. It is NOT legal, tax, or financial advice. Before making any decisions, consult with your state's licensing board, a licensed attorney, and a tax professional or CPA.</P>
      <P>Results vary by individual. No specific credit approval amounts or timelines are guaranteed.</P>
      <PageFooter />
    </Page>

    {/* ==================== BACK COVER ==================== */}
    <Page size="LETTER" style={[s.page, { justifyContent: 'center', alignItems: 'center' }]}>
      <Text style={[s.h1, { fontSize: 26, textAlign: 'center', marginBottom: 20 }]}>Don't Wait Another 10 Years</Text>
      <Text style={[s.body, { fontSize: 13, textAlign: 'center', maxWidth: 380, lineHeight: 1.8 }]}>
        Business credit exists. It's accessible. It can protect your financial future.
      </Text>
      <Text style={[s.body, { fontSize: 13, textAlign: 'center', maxWidth: 380, marginTop: 10, lineHeight: 1.8 }]}>
        The only question is: Will you take action now, or will you wait—and pay the hidden costs for years to come?
      </Text>

      <View style={[s.bigCtaBox, { marginTop: 40 }]} wrap={false}>
        <Text style={s.bigCtaTitle}>Book Your One-on-One Session</Text>
        <Link src={CTA_URL} style={[s.link, { textAlign: 'center', fontSize: 13, marginTop: 4 }]}>
          RealtorBusinessCredit.com/get_started
        </Link>
        <Text style={[s.calloutText, { textAlign: 'center', marginTop: 8, color: '#6c757d' }]}>
          Limited availability. Complete clarity. No pressure.
        </Text>
      </View>

      <View style={{ alignItems: 'center', marginTop: 40 }}>
        <Text style={[s.body, { fontFamily: 'Helvetica-Bold', color: '#1e3a5f', fontSize: 12, textAlign: 'center' }]}>Realtor Business Credit</Text>
        <Text style={[s.body, { textAlign: 'center', fontSize: 10 }]}>Helping Real Estate Professionals Build Better Business Credit</Text>
        <Text style={[s.body, { textAlign: 'center', marginTop: 10, fontSize: 9 }]}>
          <Link src={MAIN_URL} style={s.link}>mybetterbusinesscredit.com</Link>
        </Text>
        <Text style={[s.body, { textAlign: 'center', fontSize: 9 }]}>
          <Link src={REALTOR_URL} style={s.link}>realtorbusinesscredit.com</Link>
        </Text>
      </View>

      <View style={{ alignItems: 'center', marginTop: 30 }}>
        <Text style={[s.h2, { color: '#3eaf7c', textAlign: 'center', fontSize: 14 }]}>My Plan. My Progress.{'\n'}My Better Business Credit.</Text>
        <Text style={{ fontSize: 9, color: '#6c757d', marginTop: 10 }}>© 2026 RealtorBusinessCredit.com | All Rights Reserved</Text>
      </View>
    </Page>
  </Document>
);
