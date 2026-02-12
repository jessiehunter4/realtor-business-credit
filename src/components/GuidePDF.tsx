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
    padding: 54,
    fontSize: 11,
    lineHeight: 1.6,
    fontFamily: 'Helvetica',
  },
  // Cover
  cover: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0d1b2a',
    padding: 40,
  },
  coverTitle: { fontSize: 30, fontFamily: 'Helvetica-Bold', color: '#FFFFFF', textAlign: 'center', marginBottom: 20, lineHeight: 1.3 },
  coverHighlight: { color: '#3eaf7c' },
  coverSubtitle: { fontSize: 16, fontStyle: 'italic', color: '#cccccc', textAlign: 'center', marginBottom: 10 },
  coverDesc: { fontSize: 12, color: '#999999', textAlign: 'center', marginBottom: 50, maxWidth: 400 },
  coverAuthor: { fontSize: 13, color: '#FFFFFF', textAlign: 'center', marginTop: 40 },
  coverBrand: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: '#3eaf7c', textAlign: 'center', marginTop: 8 },
  coverCopyright: { fontSize: 9, color: '#666666', textAlign: 'center', marginTop: 30 },

  // Headings
  h1: { fontSize: 22, fontFamily: 'Helvetica-Bold', color: '#0d1b2a', marginBottom: 14, marginTop: 4 },
  chapterLabel: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#3eaf7c', marginBottom: 4, letterSpacing: 1.5 },
  h2: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: '#0d1b2a', marginBottom: 10, marginTop: 18 },
  h3: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: '#0d1b2a', marginBottom: 6, marginTop: 12 },
  divider: { borderBottom: '2 solid #3eaf7c', marginBottom: 14, width: 80 },

  // Body
  body: { fontSize: 11, lineHeight: 1.6, marginBottom: 8, color: '#1a1a1a' },
  bold: { fontFamily: 'Helvetica-Bold' },
  italic: { fontStyle: 'italic' },
  bullet: { fontSize: 11, lineHeight: 1.6, marginLeft: 16, marginBottom: 4, color: '#1a1a1a' },

  // Boxes - all use wrap={false} or break-inside avoid
  calloutBox: { backgroundColor: '#f0f9f4', border: '1.5 solid #3eaf7c', borderRadius: 6, padding: 14, marginVertical: 10 },
  calloutTitle: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#0d1b2a', marginBottom: 6 },
  calloutText: { fontSize: 10.5, lineHeight: 1.6, color: '#1a1a1a' },

  warningBox: { backgroundColor: '#fffbeb', border: '1.5 solid #f59e0b', borderRadius: 6, padding: 14, marginVertical: 10 },

  storyBox: { backgroundColor: '#f8f9fa', border: '1.5 solid #0d1b2a', borderRadius: 6, padding: 14, marginVertical: 10 },

  quoteBox: { backgroundColor: '#f0f9f4', borderLeft: '4 solid #3eaf7c', padding: 14, marginVertical: 10 },
  quoteText: { fontSize: 11, lineHeight: 1.6, fontStyle: 'italic', color: '#1a1a1a' },
  quoteAttr: { fontSize: 10, color: '#3eaf7c', textAlign: 'right', marginTop: 6 },

  stepBox: { border: '1.5 solid #0d1b2a', borderRadius: 6, padding: 14, marginVertical: 8, backgroundColor: '#f8f9fa' },
  stepNumber: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#3eaf7c', marginBottom: 4 },
  stepTitle: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#0d1b2a', marginBottom: 6 },

  darkBox: { backgroundColor: '#0d1b2a', padding: 16, borderRadius: 6, marginVertical: 10 },
  darkTitle: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: '#3eaf7c', marginBottom: 8 },
  darkText: { fontSize: 10.5, lineHeight: 1.6, color: '#FFFFFF', marginBottom: 6 },

  ctaBox: { backgroundColor: '#f0f9f4', border: '2 solid #3eaf7c', borderRadius: 8, padding: 18, marginVertical: 14 },
  ctaTitle: { fontSize: 15, fontFamily: 'Helvetica-Bold', color: '#0d1b2a', marginBottom: 10, textAlign: 'center' },
  ctaText: { fontSize: 11, lineHeight: 1.6, color: '#1a1a1a', marginBottom: 6, textAlign: 'center' },

  keyTakeaway: { backgroundColor: '#fffbeb', border: '1.5 solid #f59e0b', borderRadius: 6, padding: 14, marginVertical: 12 },
  keyTakeawayTitle: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#92400e', marginBottom: 6 },

  link: { color: '#3eaf7c', textDecoration: 'underline' },

  // Footer
  footer: { position: 'absolute', bottom: 28, left: 54, right: 54, flexDirection: 'row', justifyContent: 'space-between' },
  footerLeft: { fontSize: 8, color: '#999999' },
  footerRight: { fontSize: 8, color: '#999999' },

  // TOC
  tocEntry: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottom: '0.5 solid #e5e7eb' },
  tocLabel: { fontSize: 12, color: '#0d1b2a' },
  tocBold: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#0d1b2a' },

  // Two column
  row: { flexDirection: 'row', gap: 12 },
  col: { flex: 1 },
});

// Helper components
const P = ({ children, style = {} }: { children: React.ReactNode; style?: any }) => (
  <Text style={[s.body, style]}>{children}</Text>
);
const B = ({ children }: { children: React.ReactNode }) => (
  <Text style={[s.body, s.bold]}>{children}</Text>
);
const Bullet = ({ children }: { children: React.ReactNode }) => (
  <Text style={s.bullet}>• {children}</Text>
);
const CheckBullet = ({ children }: { children: React.ReactNode }) => (
  <Text style={s.bullet}>□ {children}</Text>
);

const PageFooter = () => (
  <View style={s.footer} fixed>
    <Text style={s.footerLeft}>© 2026 My Better Business Credit</Text>
    <Text style={s.footerRight} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
  </View>
);

const ChapterStart = ({ label, title }: { label: string; title: string }) => (
  <View>
    <Text style={s.chapterLabel}>{label}</Text>
    <Text style={s.h1}>{title}</Text>
    <View style={s.divider} />
  </View>
);

const KeyTakeawayBox = ({ chapter, items }: { chapter: string; items: string[] }) => (
  <View style={s.keyTakeaway} wrap={false}>
    <Text style={s.keyTakeawayTitle}>Key Takeaways from {chapter}:</Text>
    {items.map((item, i) => <Text key={i} style={[s.calloutText, { marginLeft: 10, marginBottom: 3 }]}>• {item}</Text>)}
  </View>
);

const BookCTA = () => (
  <View style={s.ctaBox} wrap={false}>
    <Text style={s.ctaTitle}>Ready to Take the Next Step?</Text>
    <Text style={s.ctaText}>Book your free one-on-one session with Jessie Hunter.</Text>
    <Link src={CTA_URL} style={[s.link, { textAlign: 'center', fontSize: 12, marginTop: 6 }]}>
      realtorbusinesscredit.com/get_started →
    </Link>
    <Text style={[s.ctaText, { marginTop: 6, fontSize: 9, color: '#666' }]}>Limited availability. No obligation. No pressure.</Text>
  </View>
);

export const GuidePDF = () => (
  <Document title="Realtor Business Credit Guide" author="Jessie Hunter" subject="Business Credit for Real Estate Professionals">
    {/* ===== COVER ===== */}
    <Page size="LETTER" style={s.cover}>
      <View>
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

    {/* ===== TABLE OF CONTENTS ===== */}
    <Page size="LETTER" style={s.page}>
      <Text style={s.h1}>Table of Contents</Text>
      <View style={s.divider} />
      {[
        ['Introduction', 'Congratulations on Your Recent Closing'],
        ['Chapter 1', 'My Story — The $8,000 Mistake'],
        ['Chapter 2', 'What Business Credit Actually Is'],
        ['Chapter 3', 'The True Cost of Using Personal Credit'],
        ['Chapter 4', 'Common Questions & Objections'],
        ['Chapter 5', 'The Seven-Step Process'],
        ['Chapter 6', 'The Emotional Journey'],
        ['Chapter 7', 'Why You Need Professional Guidance'],
        ['Chapter 8', 'Success Stories from Fellow Realtors'],
        ['Chapter 9', 'Advanced Strategies'],
        ['Conclusion', 'Your Next Steps'],
        ['Resources', 'Additional Information & About the Author'],
      ].map(([ch, title], i) => (
        <View key={i} style={s.tocEntry}>
          <Text style={i === 0 || i >= 10 ? s.tocBold : s.tocLabel}>{ch}: {title}</Text>
        </View>
      ))}
      <PageFooter />
    </Page>

    {/* ===== INTRODUCTION ===== */}
    <Page size="LETTER" style={s.page}>
      <ChapterStart label="INTRODUCTION" title="Congratulations on Your Recent Closing" />
      <View style={s.calloutBox} wrap={false}>
        <Text style={s.calloutTitle}>You're Busy. We Get It.</Text>
        <Text style={s.calloutText}>
          You're juggling showings, listings, closings, marketing, networking, and somehow trying to have a personal life. The last thing you need is another "training" that wastes your time.
        </Text>
        <Text style={[s.calloutText, { marginTop: 6 }]}>
          That's why this guide gets straight to the point. We'll show you exactly why 90% of real estate professionals never establish separate business credit — and more importantly, how YOU can be in the 10% who do.
        </Text>
      </View>
      <P>If you've been in real estate for any length of time, you've probably attended countless trainings. You've learned about:</P>
      <Bullet>Scripts and objection handling</Bullet>
      <Bullet>Marketing and lead generation</Bullet>
      <Bullet>Contract negotiations</Bullet>
      <Bullet>Market analysis and CMAs</Bullet>
      <Bullet>Technology and CRM systems</Bullet>
      <P style={{ marginTop: 10 }}>But here's what probably NEVER came up in any of those trainings: Building separate business credit for your real estate business.</P>
      <P>And that's exactly the problem. This guide will show you why this critical piece of your business foundation has been overlooked — and how to fix it.</P>
      <PageFooter />
    </Page>

    {/* ===== CHAPTER 1 ===== */}
    <Page size="LETTER" style={s.page}>
      <ChapterStart label="CHAPTER 1" title="My Story — The $8,000 Mistake" />
      <P>My name is Jessie Hunter, and I've been a licensed real estate broker since around 2010. I'm licensed in both California and Georgia, and over the years, I've closed hundreds of transactions — residential and commercial.</P>
      <P>Like you, I've invested thousands of dollars and countless hours in training and education. I've earned certifications. I've attended conferences. I've read the books and taken the courses.</P>
      <P>But here's the thing that still frustrates me to this day:</P>
      <B>In all of those trainings — not once did anyone suggest that I should be building separate business credit for my real estate business.</B>
      <View style={s.quoteBox} wrap={false}>
        <Text style={s.quoteText}>
          "I spent over a decade charging every business expense to my personal credit cards. Marketing costs. Technology subscriptions. Staging expenses. Travel for out-of-state deals. All of it went on MY personal credit — affecting MY personal credit score, putting MY personal assets at risk."
        </Text>
        <Text style={s.quoteAttr}>— Jessie Hunter</Text>
      </View>

      <Text style={s.h2}>The Cost of Not Knowing</Text>
      <View style={s.warningBox} wrap={false}>
        <Text style={s.calloutTitle}>The Real Numbers</Text>
        <Text style={s.calloutText}>Personal credit card interest paid: ~$3,600 over two years</Text>
        <Text style={s.calloutText}>Higher interest rates on personal loans: ~$2,800 over two years</Text>
        <Text style={s.calloutText}>Home equity line interest: ~$1,600 (money I could have avoided borrowing entirely)</Text>
        <Text style={[s.calloutText, { marginTop: 6, fontFamily: 'Helvetica-Bold' }]}>Total unnecessary cost: $8,000+</Text>
        <Text style={[s.calloutText, { marginTop: 6, color: '#dc2626' }]}>And that's just the direct financial cost. It doesn't count the stress, the damaged personal credit score, or the lost opportunities.</Text>
      </View>
      <P>It wasn't until I started doing my own research that I discovered the world of business credit and "fundability." I learned about companies like Credit Suite that have helped tens of thousands of businesses establish separate business credit profiles.</P>
      <P>So I became a certified partner with Credit Suite and created a specific system for Realtors and brokers. Because I don't want you to wait another 10 years like I did.</P>
      <PageFooter />
    </Page>

    {/* ===== CHAPTER 2 ===== */}
    <Page size="LETTER" style={s.page}>
      <ChapterStart label="CHAPTER 2" title="What Business Credit Actually Is" />
      <P>Business credit is a financial profile for your business that is completely separate from your personal credit.</P>
      <P>Just like you have a personal credit score (FICO), your business can have its own credit scores through:</P>
      <Bullet>Dun & Bradstreet (D-U-N-S Number and PAYDEX Score)</Bullet>
      <Bullet>Experian Business</Bullet>
      <Bullet>Equifax Small Business</Bullet>

      <Text style={s.h2}>How Business Credit Actually Works</Text>
      <View style={s.calloutBox} wrap={false}>
        <Text style={s.calloutTitle}>Step 1: Your Business Gets an EIN</Text>
        <Text style={s.calloutText}>An Employer Identification Number (EIN) is like a Social Security Number for your business. It's free from the IRS. Takes 10 minutes online. This is the foundation. Without an EIN, you can't build business credit.</Text>
      </View>
      <View style={s.calloutBox} wrap={false}>
        <Text style={s.calloutTitle}>Step 2: Your Business Establishes a Credit Profile</Text>
        <Text style={s.calloutText}>You register your business with the business credit bureaus (Dun & Bradstreet, Experian Business, Equifax Small Business). They create a file for YOUR business, separate from YOUR personal file.</Text>
      </View>
      <View style={s.calloutBox} wrap={false}>
        <Text style={s.calloutTitle}>Step 3: You Build Credit History</Text>
        <Text style={s.calloutText}>You establish vendor accounts, get business credit cards, make payments on time. Each payment builds YOUR business credit profile, not your personal one.</Text>
      </View>
      <View style={s.calloutBox} wrap={false}>
        <Text style={s.calloutTitle}>Step 4: Your Business Becomes "Fundable"</Text>
        <Text style={s.calloutText}>Over time, your business develops its own financial identity. You can access $10K, $20K, $50K+ in business credit — without a personal guarantee in many cases.</Text>
      </View>

      <KeyTakeawayBox chapter="Chapter 2" items={[
        'Business credit is a separate financial profile for your business',
        'Three major business credit bureaus track your business credit',
        'The process follows clear, predictable steps',
        'The end result: your business becomes independently "fundable"',
      ]} />
      <PageFooter />
    </Page>

    {/* ===== CHAPTER 3 ===== */}
    <Page size="LETTER" style={s.page}>
      <ChapterStart label="CHAPTER 3" title="The True Cost of Using Personal Credit" />
      <P>Let's get specific about what it costs you to NOT have separate business credit. These aren't hypothetical numbers — they're based on real situations.</P>

      <View style={s.warningBox} wrap={false}>
        <Text style={s.calloutTitle}>The Average Agent's Annual Business Expenses</Text>
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
          "Commission checks are lumpy. You might close 3 deals in one month and nothing for the next two. During the dry spells, those personal credit cards become your lifeline. And that's when the real damage happens — high utilization, missed payments, accumulating interest."
        </Text>
      </View>
      <P>Business credit solves this. It gives you a dedicated financial buffer for business expenses that doesn't impact your personal financial life.</P>

      <KeyTakeawayBox chapter="Chapter 3" items={[
        'You\'re likely spending $8,000-21,000+ per year on business expenses via personal credit',
        'High utilization damages your personal credit score significantly',
        'The real cost compounds through higher interest rates on everything personal',
        'Commission income is irregular — business credit smooths the gaps',
      ]} />
      <PageFooter />
    </Page>

    {/* ===== CHAPTER 4 ===== */}
    <Page size="LETTER" style={s.page}>
      <ChapterStart label="CHAPTER 4" title="Common Questions & Objections" />
      <P>Let me address the most common questions and objections I hear from realtors:</P>

      <View style={s.storyBox} wrap={false}>
        <Text style={[s.calloutTitle, { color: '#0d1b2a' }]}>"But I'm Just an Agent, Not a Real Business"</Text>
        <Text style={s.calloutText}>If you have business expenses — marketing, gas, technology, staging — you ARE a business owner. The IRS treats you like one (15.3% self-employment tax). If you're a business for tax purposes, you deserve business credit protection.</Text>
      </View>

      <View style={s.storyBox} wrap={false}>
        <Text style={[s.calloutTitle, { color: '#0d1b2a' }]}>"My Broker Handles Everything"</Text>
        <Text style={s.calloutText}>Your broker doesn't pay YOUR Zillow bill. Your broker doesn't pay YOUR CRM subscription. Your broker doesn't pay YOUR gas. Those are YOUR business expenses on YOUR personal credit.</Text>
      </View>

      <View style={s.storyBox} wrap={false}>
        <Text style={[s.calloutTitle, { color: '#0d1b2a' }]}>"This Sounds Complicated and Expensive"</Text>
        <Text style={s.calloutText}>Setup costs: $50-300 total. EIN from IRS: Free. LLC filing: $100-300 depending on state. That's less than one month of Zillow — and WAY less than the $15,000-25,000/year you're losing by NOT doing this.</Text>
      </View>

      <View style={s.storyBox} wrap={false}>
        <Text style={[s.calloutTitle, { color: '#0d1b2a' }]}>"I'll Do This When I'm More Established"</Text>
        <Text style={s.calloutText}>Building credit takes 6-12 months. Every month you wait is another month of damage to your personal credit. Start NOW so you have business credit when you need it. I waited 10+ years. Don't make my mistake.</Text>
      </View>

      <View style={s.storyBox} wrap={false}>
        <Text style={[s.calloutTitle, { color: '#0d1b2a' }]}>"I Need Perfect Personal Credit First"</Text>
        <Text style={s.calloutText}>Business credit is separate from personal credit. Once you have 3-5 trade lines established, your business credit stands on its own. The process works even with a 550+ personal score.</Text>
      </View>

      <KeyTakeawayBox chapter="Chapter 4" items={[
        'Most objections come from lack of information, not reality',
        'If you have business expenses, you need business credit',
        'Setup is less expensive and complicated than you think',
        'Waiting doesn\'t make it easier — it just costs you more',
      ]} />
      <PageFooter />
    </Page>

    {/* ===== CHAPTER 5 ===== */}
    <Page size="LETTER" style={s.page}>
      <ChapterStart label="CHAPTER 5" title="The Seven-Step Process" />
      <P>Building business credit follows a proven, predictable process — much like a real estate transaction. But here's what nobody shows you: there are a LOT of moving parts, and each requires decisions that affect everything after.</P>

      <Text style={s.h2}>The Real Estate Transaction Analogy</Text>
      <P>Think about a real estate transaction. You know exactly what happens: Offer, Escrow, Inspection, Appraisal, Walkthrough, Closing. It's predictable. But could your client handle it alone? Technically yes. Should they? Absolutely not.</P>
      <P>Building business credit is the same.</P>

      <Text style={s.h2}>The Seven Steps</Text>
      {[
        ['Step 1', 'Choose the Right Business Structure', 'LLC, S-Corp, or C-Corp? Depends on your state, broker, income, tax situation, and goals. Get this wrong and you may need to dissolve and start over.'],
        ['Step 2', 'Obtain Your EIN', 'Your business\'s Social Security Number. Free from the IRS, takes 15 minutes. Simple but foundational — mistakes here create problems down the line.'],
        ['Step 3', 'Open a Business Bank Account', 'Not all business accounts are equal for credit-building. ALL business transactions must go through this account. No exceptions.'],
        ['Step 4', 'Establish Business Phone & Address', 'Dedicated phone number and physical address. Information must be consistent across ALL registrations.'],
      ].map(([num, title, desc], i) => (
        <View key={i} style={s.stepBox} wrap={false}>
          <Text style={s.stepNumber}>{num}</Text>
          <Text style={s.stepTitle}>{title}</Text>
          <Text style={s.calloutText}>{desc}</Text>
        </View>
      ))}
      <PageFooter />
    </Page>

    <Page size="LETTER" style={s.page}>
      <Text style={s.h2}>The Seven Steps (continued)</Text>
      {[
        ['Step 5', 'Register with Credit Bureaus', 'Three separate registrations: Dun & Bradstreet, Experian Business, Equifax Small Business. Information must match perfectly across all three.'],
        ['Step 6', 'Establish Vendor Trade Lines', 'Which vendors report to which bureaus? What order to apply? How long between applications? Getting this wrong sets you back months.'],
        ['Step 7', 'Apply for Business Credit Cards', 'Once you have 3-5 trade lines reporting, apply for business credit cards. The right card at the right time = approval with higher limits than personal cards.'],
      ].map(([num, title, desc], i) => (
        <View key={i} style={s.stepBox} wrap={false}>
          <Text style={s.stepNumber}>{num}</Text>
          <Text style={s.stepTitle}>{title}</Text>
          <Text style={s.calloutText}>{desc}</Text>
        </View>
      ))}

      <View style={s.calloutBox} wrap={false}>
        <Text style={s.calloutTitle}>Why This Isn't a DIY Project</Text>
        <Text style={s.calloutText}>Think of it like a real estate transaction: You COULD try to buy a house without an agent. But why would you? The process is complex, mistakes are expensive, and having a professional guide you saves time, money, and stress.</Text>
      </View>

      <KeyTakeawayBox chapter="Chapter 5" items={[
        'Building business credit follows 7 specific steps in a specific order',
        'Each step requires decisions that affect everything after it',
        'Professional guidance prevents expensive mistakes and wasted time',
        'This is not a DIY project for the same reason buying a house isn\'t',
      ]} />
      <PageFooter />
    </Page>

    {/* ===== CHAPTER 6 ===== */}
    <Page size="LETTER" style={s.page}>
      <ChapterStart label="CHAPTER 6" title="The Emotional Journey" />
      <P>I want to be honest about what this process actually FEELS like, because the emotional journey is just as important as the practical steps.</P>

      <View style={s.calloutBox} wrap={false}>
        <Text style={s.calloutTitle}>Month 1: "The Relief Phase"</Text>
        <Text style={[s.calloutText, { fontFamily: 'Helvetica-Bold' }]}>What You're Doing: Setting up your business structure, EIN, bank account</Text>
        <Text style={s.calloutText}>How You Feel: Excited. Relieved. Like you're finally doing something proactive about your financial future.</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>The Moment: When you open your business bank account and think: "This is MY business. Separate from me. Professional."</Text>
      </View>

      <View style={s.calloutBox} wrap={false}>
        <Text style={s.calloutTitle}>Months 2-3: "The Waiting Game"</Text>
        <Text style={[s.calloutText, { fontFamily: 'Helvetica-Bold' }]}>What You're Doing: Establishing vendor accounts, making first purchases</Text>
        <Text style={s.calloutText}>How You Feel: Impatient. "Is this working? When will I see results?"</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>The Moment: Your first vendor account gets approved without requiring a personal guarantee. "Wait, they're giving me credit based on my BUSINESS, not me personally?"</Text>
      </View>

      <View style={s.calloutBox} wrap={false}>
        <Text style={s.calloutTitle}>Months 4-5: "The Momentum Shift"</Text>
        <Text style={[s.calloutText, { fontFamily: 'Helvetica-Bold' }]}>What You're Doing: Adding trade lines, watching your business credit score grow</Text>
        <Text style={s.calloutText}>How You Feel: Confident. You check your personal credit score and realize it's IMPROVING — because business expenses are no longer hitting it.</Text>
      </View>

      <View style={s.calloutBox} wrap={false}>
        <Text style={s.calloutTitle}>Month 6+: "The Freedom Feeling"</Text>
        <Text style={[s.calloutText, { fontFamily: 'Helvetica-Bold' }]}>What You're Doing: Using your first business credit card for business expenses</Text>
        <Text style={s.calloutText}>How You Feel: FREE. Protected. Professional. You buy a $2,000 marketing package knowing it won't touch your personal credit at all.</Text>
        <Text style={[s.calloutText, { marginTop: 4 }]}>Then you think: "Why did I wait so long to do this?"</Text>
      </View>

      <KeyTakeawayBox chapter="Chapter 6" items={[
        'Building business credit has emotional phases — knowing what to expect helps',
        'The waiting periods are normal and necessary',
        'Professional guidance keeps you on track through the slow periods',
        'The "freedom feeling" at the end makes the entire journey worthwhile',
      ]} />
      <PageFooter />
    </Page>

    {/* ===== CHAPTER 7 ===== */}
    <Page size="LETTER" style={s.page}>
      <ChapterStart label="CHAPTER 7" title="Why You Need Professional Guidance" />
      <P>Think about your clients. They COULD buy a house without you. They could search online, call listing agents directly, write their own offers, navigate inspections. But they don't. Why?</P>

      <View style={s.calloutBox} wrap={false}>
        <Text style={s.calloutTitle}>Because:</Text>
        <Text style={s.calloutText}>• The process is complex with many moving parts</Text>
        <Text style={s.calloutText}>• Mistakes are expensive and stressful</Text>
        <Text style={s.calloutText}>• Your expertise saves them time, money, and headaches</Text>
        <Text style={s.calloutText}>• The cost of guidance is tiny compared to potential mistakes</Text>
      </View>

      <B>Building business credit is the exact same situation.</B>

      <Text style={s.h2}>You Get Two Dedicated Coaches</Text>

      <View style={s.storyBox} wrap={false}>
        <Text style={[s.calloutTitle, { color: '#3eaf7c' }]}>Coach #1: Realtor Business Credit Coach</Text>
        <Text style={s.calloutText}>Understands real estate licensing requirements by state, broker relationships, commission structures, and the unique financial situation realtors face. They've worked with hundreds of agents and brokers.</Text>
      </View>

      <View style={s.storyBox} wrap={false}>
        <Text style={[s.calloutTitle, { color: '#3eaf7c' }]}>Coach #2: Credit Suite Coach</Text>
        <Text style={s.calloutText}>Knows exactly which vendors to use (and avoid), which credit cards to apply for and when, how to troubleshoot reporting issues, and how to optimize your strategy. Credit Suite has helped tens of thousands of businesses.</Text>
      </View>

      <Text style={s.h2}>You Get a Customized Plan</Text>
      <P>Not generic advice. A plan built for YOUR state regulations, YOUR broker requirements, YOUR income level, YOUR goals, and YOUR timeline.</P>

      <Text style={s.h2}>The Real Value</Text>
      <P>Every hour you spend researching vendors or troubleshooting credit bureau issues is an hour you're NOT following up with leads, showing properties, or closing deals. What's your hourly rate when you're working in your business? The math isn't even close.</P>

      <KeyTakeawayBox chapter="Chapter 7" items={[
        'You guide your clients because expertise matters — same applies here',
        'Professional guidance means two dedicated coaches plus a customized plan',
        'The real value is focusing your time on what you do best (closing deals)',
        'DIY is possible but rarely optimal when your time has significant value',
      ]} />
      <PageFooter />
    </Page>

    {/* ===== CHAPTER 8 ===== */}
    <Page size="LETTER" style={s.page}>
      <ChapterStart label="CHAPTER 8" title="Success Stories from Fellow Realtors" />
      <P>Here are stories from realtors who've gone through this process. These are early adopters who tested the system, but their results are real.</P>

      <View style={s.quoteBox} wrap={false}>
        <Text style={s.quoteText}>"I closed 8 deals last year and my personal credit score dropped to 580 because of business expenses. After 6 months with this program, my business has its own credit profile and my PERSONAL score is back to 720. This literally changed my financial life."</Text>
        <Text style={s.quoteAttr}>— Maria Rodriguez, Residential Agent, Texas</Text>
      </View>

      <View style={s.quoteBox} wrap={false}>
        <Text style={s.quoteText}>"I've been in real estate for 15 years. FIFTEEN YEARS mixing personal and business. I calculated what it cost me — conservatively $30,000 in extra interest. Better late than never, but I wish I'd known about this in 2009."</Text>
        <Text style={s.quoteAttr}>— David Chen, Commercial Broker, California</Text>
      </View>

      <View style={s.quoteBox} wrap={false}>
        <Text style={s.quoteText}>"The dual coaching is what sold me. Having someone who understands real estate licensing plus a credit expert was exactly what I needed. Setup took maybe 3 hours total over two weeks."</Text>
        <Text style={s.quoteAttr}>— Jennifer Williams, Broker, Georgia</Text>
      </View>

      <View style={s.quoteBox} wrap={false}>
        <Text style={s.quoteText}>"I was skeptical at first. But then I realized — when you're not making a ton of money, you can't afford to have business expenses destroying your personal credit. I'm setting myself up for success instead of reacting to problems."</Text>
        <Text style={s.quoteAttr}>— Marcus Thompson, Agent, Florida</Text>
      </View>

      <Text style={s.h2}>Common Themes</Text>
      <Bullet>"I wish I'd done this years ago"</Bullet>
      <Bullet>"It was easier than I expected"</Bullet>
      <Bullet>"The freedom feeling is real"</Bullet>
      <Bullet>"I feel more professional"</Bullet>
      <PageFooter />
    </Page>

    {/* ===== CHAPTER 9 ===== */}
    <Page size="LETTER" style={s.page}>
      <ChapterStart label="CHAPTER 9" title="What's Next: Advanced Strategies" />
      <P>Once you have established business credit, a whole world of financial strategies opens up:</P>

      <Text style={s.h2}>Using Business Credit for Investment Properties</Text>
      <Bullet>Fund down payments without touching personal savings</Bullet>
      <Bullet>Finance renovations on business credit</Bullet>
      <Bullet>Keep investment activities separate from personal finances</Bullet>
      <Bullet>Build a portfolio without impacting personal debt-to-income ratio</Bullet>

      <Text style={s.h2}>Strategic 0% APR Business Card Usage</Text>
      <Bullet>Use promotional 0% APR offers for short-term capital</Bullet>
      <Bullet>Fund marketing campaigns with essentially free money</Bullet>
      <Bullet>Smooth cash flow between commissions</Bullet>

      <Text style={s.h2}>Building Multiple Business Credit Profiles</Text>
      <Bullet>Each entity can have its own credit profile</Bullet>
      <Bullet>Multiply your available capital</Bullet>
      <Bullet>Create saleable assets (businesses with their own credit)</Bullet>

      <Text style={s.h2}>Tax Optimization Strategies</Text>
      <Bullet>Maximizing business expense deductions</Bullet>
      <Bullet>Optimal entity structure for tax purposes</Bullet>
      <Bullet>Clean books that make tax preparation easier and cheaper</Bullet>
      <Bullet>Audit protection (clean separation prevents issues)</Bullet>

      <View style={s.calloutBox} wrap={false}>
        <Text style={s.calloutTitle}>Why These Strategies Come Later</Text>
        <Text style={s.calloutText}>All advanced strategies require one thing: established business credit. You can't do Level 2 until you've completed Level 1. That's why starting now is so important. Build the foundation now.</Text>
      </View>

      <KeyTakeawayBox chapter="Chapter 9" items={[
        'Established business credit opens advanced financial strategies',
        'Investment properties, 0% APR strategies, multiple profiles, tax optimization',
        'All advanced strategies require the foundation first',
        'Starting now means you\'ll be ready when opportunities arise',
      ]} />
      <PageFooter />
    </Page>

    {/* ===== CONCLUSION ===== */}
    <Page size="LETTER" style={s.page}>
      <ChapterStart label="CONCLUSION" title="Your Next Steps" />
      <P>If you've read this far, congratulations. You now understand something that 90% of real estate professionals don't:</P>
      <B>Business credit exists. It's accessible. And it can protect your financial future.</B>
      <P>More importantly, you understand that every month you wait is costing you money — real money that could be in your pocket, building your wealth, protecting your family.</P>

      <Text style={s.h2}>You Have a Choice</Text>
      <View style={{ flexDirection: 'row', gap: 10, marginVertical: 10 }}>
        <View style={[s.storyBox, { flex: 1, borderColor: '#dc2626' }]} wrap={false}>
          <Text style={[s.calloutTitle, { color: '#dc2626' }]}>Path 1: Continue As Is</Text>
          <Text style={s.calloutText}>Keep mixing finances. Keep risking personal credit. Cost: $5,000-26,000/year. $50,000-260,000+ over a career.</Text>
        </View>
        <View style={[s.storyBox, { flex: 1, borderColor: '#3eaf7c' }]} wrap={false}>
          <Text style={[s.calloutTitle, { color: '#3eaf7c' }]}>Path 2: Establish Business Credit</Text>
          <Text style={s.calloutText}>Take 9-12 months to build properly. Separate finances. Protect personal credit. Investment: One-time. Payoff: Permanent.</Text>
        </View>
      </View>

      <BookCTA />

      <Text style={s.h2}>One Year from Now</Text>
      <View style={{ flexDirection: 'row', gap: 10, marginVertical: 10 }}>
        <View style={[s.storyBox, { flex: 1, borderColor: '#dc2626' }]} wrap={false}>
          <Text style={[s.calloutTitle, { color: '#dc2626' }]}>Scenario A: You Didn't Act</Text>
          <Text style={s.calloutText}>Still using personal credit. Declined for refinance. Spouse worried about maxed cards. Cost this year: $5,000-10,000+</Text>
        </View>
        <View style={[s.storyBox, { flex: 1, borderColor: '#3eaf7c' }]} wrap={false}>
          <Text style={[s.calloutTitle, { color: '#3eaf7c' }]}>Scenario B: You Took Action</Text>
          <Text style={s.calloutText}>$25,000+ in business credit. Personal score increased. Approved for investment property loan. Investment: $1,500-3,000 (one-time)</Text>
        </View>
      </View>
      <PageFooter />
    </Page>

    {/* ===== RESOURCES & BACK COVER ===== */}
    <Page size="LETTER" style={s.page}>
      <ChapterStart label="RESOURCES" title="Additional Information" />

      <Text style={s.h2}>Take Your Next Step</Text>
      <View style={s.ctaBox} wrap={false}>
        <Text style={s.ctaTitle}>Book Your Free One-on-One Session</Text>
        <Text style={s.ctaText}>5 minutes for the Fundability Scan. 30 minutes for our conversation.{'\n'}Complete clarity on YOUR path forward.</Text>
        <Link src={CTA_URL} style={[s.link, { textAlign: 'center', fontSize: 13, marginTop: 8 }]}>
          realtorbusinesscredit.com/get_started →
        </Link>
      </View>

      <View style={s.calloutBox} wrap={false}>
        <Text style={s.calloutTitle}>Useful Links</Text>
        <Text style={s.calloutText}>Main Website: <Link src={MAIN_URL} style={s.link}>mybetterbusinesscredit.com</Link></Text>
        <Text style={s.calloutText}>Realtor-Specific Resources: <Link src={REALTOR_URL} style={s.link}>realtorbusinesscredit.com</Link></Text>
        <Text style={s.calloutText}>Free Fundability Scan: <Link src={SCAN_URL} style={s.link}>mybetterbusinesscredit.fundabilityscan.com</Link></Text>
      </View>

      <Text style={s.h2}>About the Author</Text>
      <View style={s.storyBox} wrap={false}>
        <Text style={[s.calloutTitle, { color: '#3eaf7c' }]}>Jessie Hunter</Text>
        <Text style={s.calloutText}>Licensed real estate broker in California and Georgia with over 15 years of experience in residential and commercial real estate. After discovering business credit late in his career — and calculating what it cost him not to know earlier — Jessie became a certified partner with Credit Suite to help fellow real estate professionals avoid the same mistakes.</Text>
        <Text style={[s.calloutText, { marginTop: 6 }]}>His mission: Ensure that no realtor waits 10+ years to discover business credit like he did.</Text>
      </View>

      <Text style={s.h2}>Important Disclaimers</Text>
      <P>This guide provides education and coaching only. It is NOT legal, tax, or financial advice. Before making any decisions, consult with your state's licensing board, a licensed attorney, and a tax professional or CPA.</P>
      <P>Results vary by individual. No specific credit approval amounts or timelines are guaranteed.</P>

      <View style={s.quoteBox} wrap={false}>
        <Text style={[s.quoteText, { fontSize: 12 }]}>
          "I wish someone had told me about business credit when I got my license in 2010. I don't want you to make the same mistake I did. The time to start is now."
        </Text>
        <Text style={s.quoteAttr}>— Jessie Hunter, Founder</Text>
      </View>

      <View style={{ alignItems: 'center', marginTop: 20 }}>
        <Text style={[s.h2, { color: '#3eaf7c', textAlign: 'center' }]}>My Plan. My Progress.{'\n'}My Better Business Credit.</Text>
        <Text style={{ fontSize: 9, color: '#999', marginTop: 10 }}>© 2026 RealtorBusinessCredit.com | All Rights Reserved</Text>
      </View>
      <PageFooter />
    </Page>
  </Document>
);
