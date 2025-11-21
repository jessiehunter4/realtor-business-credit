import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 54, // 0.75 inch margins
    fontSize: 11,
    lineHeight: 1.6,
  },
  cover: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0d1b2a',
    padding: 40,
  },
  coverTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 1.3,
  },
  coverSubtitle: {
    fontSize: 18,
    color: '#3eaf7c',
    textAlign: 'center',
    marginBottom: 40,
  },
  coverAuthor: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 60,
  },
  coverBrand: {
    fontSize: 16,
    color: '#3eaf7c',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold',
  },
  h1: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0d1b2a',
    marginBottom: 16,
    marginTop: 24,
  },
  h2: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0d1b2a',
    marginBottom: 12,
    marginTop: 20,
  },
  h3: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0d1b2a',
    marginBottom: 8,
    marginTop: 12,
  },
  body: {
    fontSize: 11,
    lineHeight: 1.6,
    marginBottom: 10,
    color: '#1a1a1a',
  },
  calloutBox: {
    backgroundColor: '#f8f9fa',
    border: '2 solid #3eaf7c',
    borderRadius: 8,
    padding: 16,
    marginVertical: 16,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0d1b2a',
    marginBottom: 8,
  },
  calloutText: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#1a1a1a',
  },
  quote: {
    backgroundColor: '#f0f9f4',
    borderLeft: '4 solid #3eaf7c',
    padding: 16,
    marginVertical: 12,
    fontStyle: 'italic',
  },
  stepBox: {
    border: '2 solid #0d1b2a',
    borderRadius: 8,
    padding: 16,
    marginVertical: 12,
    backgroundColor: '#f8f9fa',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3eaf7c',
    marginBottom: 8,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0d1b2a',
    marginBottom: 8,
  },
  stepContent: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#1a1a1a',
    marginBottom: 6,
  },
  bullet: {
    fontSize: 11,
    lineHeight: 1.6,
    marginLeft: 16,
    marginBottom: 6,
    color: '#1a1a1a',
  },
  benefitBox: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottom: '1 solid #e5e7eb',
  },
  benefitTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0d1b2a',
    marginBottom: 6,
  },
  timelineMonth: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3eaf7c',
    marginTop: 12,
    marginBottom: 4,
  },
  timelineContent: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#1a1a1a',
    marginBottom: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 54,
    right: 54,
    textAlign: 'center',
    fontSize: 9,
    color: '#666666',
  },
  darkBox: {
    backgroundColor: '#0d1b2a',
    padding: 20,
    borderRadius: 8,
    marginVertical: 16,
  },
  darkBoxTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3eaf7c',
    marginBottom: 12,
  },
  darkBoxText: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  ctaBox: {
    backgroundColor: '#f0f9f4',
    border: '2 solid #3eaf7c',
    borderRadius: 8,
    padding: 20,
    marginVertical: 16,
  },
  ctaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0d1b2a',
    marginBottom: 12,
    textAlign: 'center',
  },
  ctaText: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  link: {
    color: '#3eaf7c',
    textDecoration: 'underline',
  },
});

export const GuidePDF = () => (
  <Document>
    {/* Cover Page */}
    <Page size="LETTER" style={styles.cover}>
      <View>
        <Text style={styles.coverTitle}>
          Why Most Realtors Don't{'\n'}Establish Separate{'\n'}Business Credit
        </Text>
        <Text style={styles.coverSubtitle}>
          The Complete Guide & Action Plan for Residential &{'\n'}Commercial Real Estate Professionals
        </Text>
        <Text style={styles.coverAuthor}>By Jessie Hunter</Text>
        <Text style={styles.coverBrand}>My Better Business Credit</Text>
      </View>
    </Page>

    {/* Introduction */}
    <Page size="LETTER" style={styles.page}>
      <Text style={styles.h1}>Introduction</Text>
      
      <View style={styles.calloutBox}>
        <Text style={styles.calloutTitle}>You're Busy. We Get It.</Text>
        <Text style={styles.calloutText}>
          You're juggling showings, listings, closings, marketing, networking, and somehow trying to have a personal life. 
          The last thing you need is another "training" that wastes your time.
        </Text>
        <Text style={[styles.calloutText, { marginTop: 8 }]}>
          That's why this guide gets straight to the point. We'll show you exactly why 90% of real estate professionals 
          never establish separate business credit—and more importantly, how YOU can be in the 10% who do.
        </Text>
      </View>

      <Text style={styles.body}>
        If you've been in real estate for any length of time, you've probably attended countless trainings, seminars, 
        and certification programs. You've learned about:
      </Text>
      
      <Text style={styles.bullet}>• Scripts and objection handling</Text>
      <Text style={styles.bullet}>• Marketing and lead generation</Text>
      <Text style={styles.bullet}>• Contract negotiations</Text>
      <Text style={styles.bullet}>• Market analysis and CMAs</Text>
      <Text style={styles.bullet}>• Technology and CRM systems</Text>
      
      <Text style={[styles.body, { marginTop: 12 }]}>
        But here's what probably NEVER came up in any of those trainings: Building separate business credit for your 
        real estate business.
      </Text>
      
      <Text style={styles.body}>
        And that's exactly the problem. This guide will show you why this critical piece of your business foundation 
        has been overlooked—and how to fix it.
      </Text>

      <Text style={styles.footer} fixed>
        © My Better Business Credit - Realtor Business Credit Guide - Page 2
      </Text>
    </Page>

    {/* Founder Story */}
    <Page size="LETTER" style={styles.page}>
      <Text style={styles.h1}>My Story: 10+ Years of Doing It Wrong</Text>
      
      <Text style={styles.body}>
        My name is Jessie Hunter, and I've been a licensed real estate broker since around 2010. I'm licensed in both 
        California and Georgia, and over the years, I've closed hundreds of transactions—residential and commercial.
      </Text>
      
      <Text style={styles.body}>
        Like you, I've invested thousands of dollars and countless hours in training and education. I've earned 
        certifications. I've attended conferences. I've read the books and taken the courses.
      </Text>
      
      <Text style={styles.body}>
        But here's the thing that still frustrates me to this day: In all of those trainings, seminars, and 
        certifications—not once did anyone suggest that I should be building separate business credit for my real 
        estate business.
      </Text>
      
      <View style={styles.quote}>
        <Text style={styles.calloutText}>
          "I spent over a decade charging every business expense to my personal credit cards. Marketing costs. 
          Technology subscriptions. Staging expenses. Travel for out-of-state deals. All of it went on MY personal 
          credit—affecting MY personal credit score, putting MY personal assets at risk, and limiting MY ability to 
          scale when opportunities came up."
        </Text>
      </View>
      
      <Text style={styles.body}>
        It wasn't until I started doing my own research that I discovered the entire world of business credit and 
        "fundability." I learned about companies like Credit Suite that have helped tens of thousands of businesses 
        establish separate business credit profiles.
      </Text>
      
      <Text style={styles.body}>
        And that's when it hit me: This information exists. The strategies are proven. The systems work. But nobody 
        in the real estate industry was talking about it.
      </Text>
      
      <Text style={styles.body}>
        So I became a certified partner with Credit Suite and created a specific system for Realtors and brokers. 
        Because I don't want you to wait another 10 years like I did.
      </Text>

      <Text style={styles.footer} fixed>
        © My Better Business Credit - Realtor Business Credit Guide - Page 3
      </Text>
    </Page>

    {/* Three Reasons */}
    <Page size="LETTER" style={styles.page}>
      <Text style={styles.h1}>The 3 Real Reasons Most Realtors Don't Have Business Credit</Text>
      
      <View style={styles.stepBox}>
        <Text style={styles.stepNumber}>Reason #1</Text>
        <Text style={styles.stepTitle}>No One Has Suggested It</Text>
        <Text style={styles.stepContent}>
          Think about your real estate training. You learned contracts, negotiations, marketing, tech platforms—but 
          did anyone ever say, "Hey, you should build separate business credit for your real estate business"?
        </Text>
        <Text style={styles.stepContent}>
          Probably not. And that's not your fault. The real estate education industry simply doesn't cover this topic. 
          It's a massive blind spot that affects thousands of agents and brokers.
        </Text>
      </View>

      <View style={styles.stepBox}>
        <Text style={styles.stepNumber}>Reason #2</Text>
        <Text style={styles.stepTitle}>No One Has Shown Them How</Text>
        <Text style={styles.stepContent}>
          Even if you've heard of "business credit" in passing, do you know the actual steps to establish it? Do you 
          know which vendors report to which bureaus? Do you understand the relationship between your real estate 
          license, your business entity, and your EIN?
        </Text>
        <Text style={styles.stepContent}>
          Most Realtors don't—because no one has given them a clear, step-by-step roadmap designed specifically for 
          real estate professionals.
        </Text>
      </View>

      <View style={styles.stepBox}>
        <Text style={styles.stepNumber}>Reason #3</Text>
        <Text style={styles.stepTitle}>They Don't Realize What They're Missing</Text>
        <Text style={styles.stepContent}>
          When you don't know what's possible, you can't know what you're missing. Most Realtors have no idea that 
          they could have:
        </Text>
        <Text style={styles.bullet}>• Business credit cards with $10K, $20K, $50K+ limits</Text>
        <Text style={styles.bullet}>• Lines of credit that don't touch their personal credit score</Text>
        <Text style={styles.bullet}>• The ability to scale their business without personal financial risk</Text>
        <Text style={styles.bullet}>• Better separation between personal and business finances</Text>
        <Text style={styles.bullet}>• A more valuable, fundable business if they ever sell or transition</Text>
      </View>

      <Text style={styles.footer} fixed>
        © My Better Business Credit - Realtor Business Credit Guide - Page 4
      </Text>
    </Page>

    {/* Benefits */}
    <Page size="LETTER" style={styles.page}>
      <Text style={styles.h1}>The Benefits of Separate Business Credit</Text>
      
      <View style={styles.benefitBox}>
        <Text style={styles.benefitTitle}>1. Higher Credit Limits Without Personal Risk</Text>
        <Text style={styles.body}>
          Business credit cards and lines can provide significantly higher limits than personal cards—often $20K to 
          $100K+. And here's the key: these limits don't require a personal guarantee in many cases, and they don't 
          affect your personal credit utilization.
        </Text>
      </View>

      <View style={styles.benefitBox}>
        <Text style={styles.benefitTitle}>2. Separation of Personal and Business Finances</Text>
        <Text style={styles.body}>
          When you run all business expenses through personal credit, you're mixing everything together. This creates 
          headaches at tax time, makes bookkeeping a nightmare, and blurs the line between your personal life and your 
          business.
        </Text>
        <Text style={styles.body}>
          With separate business credit, you have clear boundaries. Your CPA will thank you. Your family will thank you. 
          And you'll have peace of mind.
        </Text>
      </View>

      <View style={styles.benefitBox}>
        <Text style={styles.benefitTitle}>3. Ability to Scale When Opportunities Arise</Text>
        <Text style={styles.body}>
          Real estate is unpredictable. Sometimes you need to invest heavily in marketing. Sometimes you need to hire 
          help quickly. Sometimes you need to travel for a big deal.
        </Text>
        <Text style={styles.body}>
          With established business credit, you have the financial flexibility to say "yes" to opportunities without 
          worrying about maxing out your personal cards or dipping into personal savings.
        </Text>
      </View>

      <View style={styles.benefitBox}>
        <Text style={styles.benefitTitle}>4. Protection of Personal Credit Scores</Text>
        <Text style={styles.body}>
          Every time you charge a business expense to a personal credit card, it affects your personal credit 
          utilization ratio. High utilization can lower your personal credit score—affecting your ability to get a 
          mortgage, refinance, or get favorable terms on car loans.
        </Text>
        <Text style={styles.body}>
          Business credit keeps your business spending separate, protecting your personal credit profile.
        </Text>
      </View>

      <View style={styles.benefitBox}>
        <Text style={styles.benefitTitle}>5. Increased Business Value and Fundability</Text>
        <Text style={styles.body}>
          A business with its own credit profile, financial history, and borrowing capacity is more valuable than one 
          that's entirely dependent on the owner's personal credit. If you ever want to sell your book of business, 
          bring on a partner, or transition to a team model, having established business credit makes your operation 
          more attractive and valuable.
        </Text>
      </View>

      <Text style={styles.footer} fixed>
        © My Better Business Credit - Realtor Business Credit Guide - Page 5
      </Text>
    </Page>

    {/* EIN vs SSN */}
    <Page size="LETTER" style={styles.page}>
      <Text style={styles.h1}>Understanding EIN vs. SSN for Real Estate Licenses</Text>
      
      <View style={styles.calloutBox}>
        <Text style={styles.calloutTitle}>Important Note About Real Estate Licensing</Text>
        <Text style={styles.calloutText}>
          Many Realtors are initially licensed under their personal name and Social Security Number (SSN). However, 
          depending on your state, you may be able to operate under a business entity (LLC, S-Corp, C-Corp) with its 
          own Employer Identification Number (EIN).
        </Text>
        <Text style={[styles.calloutText, { marginTop: 8 }]}>
          For example, in California, agents can be licensed as sole proprietors or corporations, but NOT as LLCs for 
          a real estate license. Other states have different rules.
        </Text>
      </View>

      <Text style={styles.body}>
        Here's what you need to understand:
      </Text>

      <Text style={styles.h3}>Your Real Estate License</Text>
      <Text style={styles.body}>
        Your real estate license is typically tied to your personal identity (SSN) or a specific business entity that 
        your state allows. This is regulated by your state's Real Estate Commission or Department of Real Estate.
      </Text>

      <Text style={styles.h3}>Your Business Entity for Business Credit</Text>
      <Text style={styles.body}>
        To build business credit, you generally need a separate business entity with its own EIN. This entity:
      </Text>
      <Text style={styles.bullet}>• Can be an LLC, S-Corp, C-Corp, or other structure (depending on your state)</Text>
      <Text style={styles.bullet}>• Has its own EIN from the IRS</Text>
      <Text style={styles.bullet}>• Has its own business bank account</Text>
      <Text style={styles.bullet}>• Has its own business phone and address</Text>
      <Text style={styles.bullet}>• Can build a credit profile separate from your personal SSN</Text>

      <Text style={[styles.body, { marginTop: 12 }]}>
        In many cases, your real estate business entity can be structured to comply with both your state's licensing 
        requirements AND the requirements for building business credit.
      </Text>

      <View style={styles.calloutBox}>
        <Text style={styles.calloutTitle}>⚠️ This is NOT Legal or Tax Advice</Text>
        <Text style={styles.calloutText}>
          Every state has different rules. Every agent's situation is unique. Before making any decisions about 
          business entities or license structure, you MUST:
        </Text>
        <Text style={[styles.calloutText, { marginTop: 8 }]}>
          • Check with your state's licensing board
        </Text>
        <Text style={styles.calloutText}>• Consult with a licensed attorney in your state</Text>
        <Text style={styles.calloutText}>• Work with a tax professional or CPA familiar with real estate</Text>
        <Text style={[styles.calloutText, { marginTop: 8 }]}>
          We provide education and coaching on business credit—we do NOT provide legal or tax advice. Always get 
          professional guidance for your specific situation.
        </Text>
      </View>

      <Text style={styles.footer} fixed>
        © My Better Business Credit - Realtor Business Credit Guide - Page 6
      </Text>
    </Page>

    {/* 7-Step Checklist - Part 1 */}
    <Page size="LETTER" style={styles.page}>
      <Text style={styles.h1}>Your 7-Step Action Checklist</Text>
      
      <Text style={styles.body}>
        This is your roadmap. Follow these steps in order, and you'll be well on your way to establishing separate 
        business credit for your real estate business.
      </Text>

      <View style={styles.stepBox}>
        <Text style={styles.stepNumber}>STEP 1</Text>
        <Text style={styles.stepTitle}>Establish or Confirm Your Business Entity</Text>
        <Text style={styles.stepContent}>
          If you don't already have a business entity (LLC, S-Corp, C-Corp, etc.), you'll need to create one that 
          complies with your state's real estate licensing laws.
        </Text>
        <Text style={styles.stepContent}>
          Action Items:
        </Text>
        <Text style={styles.bullet}>□ Research your state's requirements for real estate license entity structure</Text>
        <Text style={styles.bullet}>□ Consult with your broker, attorney, and tax professional</Text>
        <Text style={styles.bullet}>□ File necessary paperwork with your state</Text>
        <Text style={styles.bullet}>□ Update your real estate license if needed</Text>
        <Text style={styles.stepContent}>
          Timeline: 1-4 weeks depending on your state's processing times.
        </Text>
      </View>

      <View style={styles.stepBox}>
        <Text style={styles.stepNumber}>STEP 2</Text>
        <Text style={styles.stepTitle}>Obtain Your EIN (Employer Identification Number)</Text>
        <Text style={styles.stepContent}>
          Your EIN is like a Social Security Number for your business. You'll need this to open a business bank 
          account and build a business credit profile.
        </Text>
        <Text style={styles.stepContent}>
          Action Items:
        </Text>
        <Text style={styles.bullet}>□ Apply for an EIN through the IRS website (free and instant)</Text>
        <Text style={styles.bullet}>□ Save your EIN confirmation letter</Text>
        <Text style={styles.bullet}>□ Keep your EIN secure (treat it like your SSN)</Text>
        <Text style={styles.stepContent}>
          Timeline: Can be completed in 15 minutes online.
        </Text>
      </View>

      <View style={styles.stepBox}>
        <Text style={styles.stepNumber}>STEP 3</Text>
        <Text style={styles.stepTitle}>Open a Business Bank Account</Text>
        <Text style={styles.stepContent}>
          A dedicated business bank account is essential. This separates your personal and business finances and is 
          required by most lenders and credit issuers.
        </Text>
        <Text style={styles.stepContent}>
          Action Items:
        </Text>
        <Text style={styles.bullet}>□ Choose a business-friendly bank or credit union</Text>
        <Text style={styles.bullet}>□ Gather required documents (EIN letter, Articles of Organization, etc.)</Text>
        <Text style={styles.bullet}>□ Open a business checking account</Text>
        <Text style={styles.bullet}>□ Consider a business savings account as well</Text>
        <Text style={styles.bullet}>□ Deposit initial funds to keep the account active</Text>
        <Text style={styles.stepContent}>
          Timeline: 1-2 weeks.
        </Text>
      </View>

      <Text style={styles.footer} fixed>
        © My Better Business Credit - Realtor Business Credit Guide - Page 7
      </Text>
    </Page>

    {/* 7-Step Checklist - Part 2 */}
    <Page size="LETTER" style={styles.page}>
      <View style={styles.stepBox}>
        <Text style={styles.stepNumber}>STEP 4</Text>
        <Text style={styles.stepTitle}>Get a Business Phone Number and Business Address</Text>
        <Text style={styles.stepContent}>
          Business credit bureaus want to see that you're a legitimate, established business. A dedicated business 
          phone and address help establish credibility.
        </Text>
        <Text style={styles.stepContent}>
          Action Items:
        </Text>
        <Text style={styles.bullet}>□ Set up a dedicated business phone line (can be VoIP like Google Voice)</Text>
        <Text style={styles.bullet}>□ Ensure your business address is on file (can be your office or home office)</Text>
        <Text style={styles.bullet}>□ List your business phone in online directories</Text>
        <Text style={styles.bullet}>□ Use consistent NAP (Name, Address, Phone) across all platforms</Text>
        <Text style={styles.stepContent}>
          Timeline: 1-2 days.
        </Text>
      </View>

      <View style={styles.stepBox}>
        <Text style={styles.stepNumber}>STEP 5</Text>
        <Text style={styles.stepTitle}>Establish Your Business Credit Profile</Text>
        <Text style={styles.stepContent}>
          This is where you start building your official business credit file with the major business credit bureaus.
        </Text>
        <Text style={styles.stepContent}>
          Action Items:
        </Text>
        <Text style={styles.bullet}>□ Get a D-U-N-S Number from Dun & Bradstreet (free)</Text>
        <Text style={styles.bullet}>□ Create an Experian Business profile</Text>
        <Text style={styles.bullet}>□ Create an Equifax Small Business profile</Text>
        <Text style={styles.bullet}>□ Ensure all information is accurate and consistent</Text>
        <Text style={styles.stepContent}>
          Timeline: 2-4 weeks for profiles to be established.
        </Text>
      </View>

      <View style={styles.stepBox}>
        <Text style={styles.stepNumber}>STEP 6</Text>
        <Text style={styles.stepTitle}>Establish Vendor Trade Lines</Text>
        <Text style={styles.stepContent}>
          Vendor trade lines are accounts with suppliers that report your payment history to business credit bureaus. 
          These are the foundation of your business credit score.
        </Text>
        <Text style={styles.stepContent}>
          Action Items:
        </Text>
        <Text style={styles.bullet}>□ Identify vendors that report to business credit bureaus</Text>
        <Text style={styles.bullet}>□ Open accounts with 3-5 reporting vendors</Text>
        <Text style={styles.bullet}>□ Make small purchases and pay on time (or early)</Text>
        <Text style={styles.bullet}>□ Request credit increases after 3-6 months of on-time payments</Text>
        <Text style={styles.stepContent}>
          Timeline: 3-6 months to establish positive payment history.
        </Text>
      </View>

      <Text style={styles.footer} fixed>
        © My Better Business Credit - Realtor Business Credit Guide - Page 8
      </Text>
    </Page>

    {/* 7-Step Checklist - Part 3 */}
    <Page size="LETTER" style={styles.page}>
      <View style={styles.stepBox}>
        <Text style={styles.stepNumber}>STEP 7</Text>
        <Text style={styles.stepTitle}>Apply for Business Credit Cards and Lines of Credit</Text>
        <Text style={styles.stepContent}>
          Once you have established business credit profiles and positive trade lines, you can start applying for 
          business credit cards and lines of credit.
        </Text>
        <Text style={styles.stepContent}>
          Action Items:
        </Text>
        <Text style={styles.bullet}>□ Research business credit cards that fit your needs</Text>
        <Text style={styles.bullet}>□ Apply for starter business credit cards (may require personal guarantee initially)</Text>
        <Text style={styles.bullet}>□ Use cards responsibly and pay on time</Text>
        <Text style={styles.bullet}>□ Apply for higher-limit cards as your profile strengthens</Text>
        <Text style={styles.bullet}>□ Consider business lines of credit for larger expenses</Text>
        <Text style={styles.stepContent}>
          Timeline: 6-12 months to build to significant credit limits.
        </Text>
      </View>

      <View style={styles.calloutBox}>
        <Text style={styles.calloutTitle}>✓ Complete This Checklist at Your Own Pace</Text>
        <Text style={styles.calloutText}>
          Some steps can be completed quickly (like getting an EIN). Others take time (like building trade line 
          history). The key is to start and stay consistent.
        </Text>
        <Text style={[styles.calloutText, { marginTop: 8 }]}>
          Most Realtors who follow this process see meaningful results within 6-12 months—and continue to build 
          stronger business credit profiles over time.
        </Text>
      </View>

      <Text style={styles.footer} fixed>
        © My Better Business Credit - Realtor Business Credit Guide - Page 9
      </Text>
    </Page>

    {/* Timeline & Expectations */}
    <Page size="LETTER" style={styles.page}>
      <Text style={styles.h1}>Timeline & Expectations</Text>
      
      <Text style={styles.body}>
        Building business credit is not an overnight process, but it's also not as slow as you might think. Here's a 
        realistic timeline of what to expect:
      </Text>

      <View style={styles.stepBox}>
        <Text style={styles.timelineMonth}>Month 1-2: Foundation</Text>
        <Text style={styles.timelineContent}>
          • Establish or confirm your business entity
        </Text>
        <Text style={styles.timelineContent}>
          • Obtain your EIN
        </Text>
        <Text style={styles.timelineContent}>
          • Open business bank account
        </Text>
        <Text style={styles.timelineContent}>
          • Set up business phone and address
        </Text>
        <Text style={[styles.timelineContent, { fontWeight: 'bold', marginTop: 8 }]}>
          What to expect: You're laying the groundwork. Not much visible progress yet, but you're building the 
          foundation for everything that comes next.
        </Text>
      </View>

      <View style={styles.stepBox}>
        <Text style={styles.timelineMonth}>Month 3-4: Profile Creation</Text>
        <Text style={styles.timelineContent}>
          • Get your D-U-N-S Number
        </Text>
        <Text style={styles.timelineContent}>
          • Create Experian and Equifax business profiles
        </Text>
        <Text style={styles.timelineContent}>
          • Ensure all information is accurate across bureaus
        </Text>
        <Text style={styles.timelineContent}>
          • Open initial vendor trade line accounts
        </Text>
        <Text style={[styles.timelineContent, { fontWeight: 'bold', marginTop: 8 }]}>
          What to expect: Your business now officially "exists" in the eyes of credit bureaus. You're starting to 
          build a track record.
        </Text>
      </View>

      <View style={styles.stepBox}>
        <Text style={styles.timelineMonth}>Month 5-8: Building History</Text>
        <Text style={styles.timelineContent}>
          • Make regular purchases through vendor trade lines
        </Text>
        <Text style={styles.timelineContent}>
          • Pay on time (or early) every single time
        </Text>
        <Text style={styles.timelineContent}>
          • Your payment history is being reported to business credit bureaus
        </Text>
        <Text style={styles.timelineContent}>
          • Apply for starter business credit cards
        </Text>
        <Text style={[styles.timelineContent, { fontWeight: 'bold', marginTop: 8 }]}>
          What to expect: You're building momentum. You may receive your first business credit cards with modest 
          limits ($500-$5,000). Your business credit scores are starting to form.
        </Text>
      </View>

      <Text style={styles.footer} fixed>
        © My Better Business Credit - Realtor Business Credit Guide - Page 10
      </Text>
    </Page>

    {/* Timeline Continued */}
    <Page size="LETTER" style={styles.page}>
      <View style={styles.stepBox}>
        <Text style={styles.timelineMonth}>Month 9-12: Growth Phase</Text>
        <Text style={styles.timelineContent}>
          • Your business credit profile is maturing
        </Text>
        <Text style={styles.timelineContent}>
          • You may qualify for higher-limit business credit cards ($10K-$25K+)
        </Text>
        <Text style={styles.timelineContent}>
          • Some cards may not require a personal guarantee
        </Text>
        <Text style={styles.timelineContent}>
          • You can start applying for business lines of credit
        </Text>
        <Text style={[styles.timelineContent, { fontWeight: 'bold', marginTop: 8 }]}>
          What to expect: This is where you start seeing real results. You have significant business borrowing capacity 
          that's separate from your personal credit.
        </Text>
      </View>

      <View style={styles.stepBox}>
        <Text style={styles.timelineMonth}>Month 12+: Established Credit</Text>
        <Text style={styles.timelineContent}>
          • Your business has a strong credit profile
        </Text>
        <Text style={styles.timelineContent}>
          • You may qualify for $50K-$100K+ in business credit limits
        </Text>
        <Text style={styles.timelineContent}>
          • You have flexibility to invest in growth when opportunities arise
        </Text>
        <Text style={styles.timelineContent}>
          • Your personal credit is protected from business expenses
        </Text>
        <Text style={[styles.timelineContent, { fontWeight: 'bold', marginTop: 8 }]}>
          What to expect: You've achieved what most Realtors never do—a truly separate, fundable business with its 
          own financial identity.
        </Text>
      </View>

      <View style={styles.calloutBox}>
        <Text style={styles.calloutTitle}>Important Notes on Timeline</Text>
        <Text style={styles.calloutText}>
          • These are typical timelines based on our experience with hundreds of clients
        </Text>
        <Text style={styles.calloutText}>
          • Your results may be faster or slower depending on your starting point and consistency
        </Text>
        <Text style={styles.calloutText}>
          • Credit approval amounts are never guaranteed and depend on many factors
        </Text>
        <Text style={styles.calloutText}>
          • The key is consistency—following the process step-by-step without skipping stages
        </Text>
      </View>

      <Text style={styles.footer} fixed>
        © My Better Business Credit - Realtor Business Credit Guide - Page 11
      </Text>
    </Page>

    {/* Why Not Alone */}
    <Page size="LETTER" style={styles.page}>
      <Text style={styles.h1}>Why You Shouldn't Try This Alone</Text>
      
      <Text style={styles.body}>
        Could you follow this guide and do everything yourself? Technically, yes. But here's why that's not the best 
        approach:
      </Text>

      <Text style={styles.h3}>Reason #1: Real Estate Licensing Complexity</Text>
      <Text style={styles.body}>
        Your situation as a real estate professional is unique. You need someone who understands:
      </Text>
      <Text style={styles.bullet}>• How real estate licenses work across different states</Text>
      <Text style={styles.bullet}>• The relationship between your license and business entities</Text>
      <Text style={styles.bullet}>• How to structure things properly for both licensing AND credit building</Text>
      <Text style={styles.bullet}>• When you need to involve your broker, attorney, or CPA</Text>

      <Text style={styles.h3}>Reason #2: The Devil is in the Details</Text>
      <Text style={styles.body}>
        There are hundreds of small decisions along the way that can make or break your success:
      </Text>
      <Text style={styles.bullet}>• Which vendors actually report to which bureaus?</Text>
      <Text style={styles.bullet}>• How do you handle the timing of applications?</Text>
      <Text style={styles.bullet}>• What's the right sequence to avoid red flags?</Text>
      <Text style={styles.bullet}>• How do you handle inquiries and denials?</Text>
      
      <Text style={[styles.body, { marginTop: 12 }]}>
        Without guidance, it's easy to make mistakes that set you back months.
      </Text>

      <Text style={styles.h3}>Reason #3: It Takes Time You Don't Have</Text>
      <Text style={styles.body}>
        You're already juggling listings, showings, clients, marketing, and your personal life. Learning the ins and 
        outs of business credit on top of everything else? That's a recipe for giving up halfway through.
      </Text>
      
      <Text style={styles.body}>
        Having a coach means you stay on track, avoid pitfalls, and get answers to your specific questions as they 
        come up.
      </Text>

      <View style={styles.darkBox}>
        <Text style={styles.darkBoxTitle}>Our Dual Coaching Model</Text>
        <Text style={styles.darkBoxText}>
          When you work with us, you get TWO coaches:
        </Text>
        <Text style={[styles.darkBoxText, { marginTop: 8 }]}>
          1. Realtor Business Credit Coach
        </Text>
        <Text style={styles.darkBoxText}>
          • Understands real estate licensing and the unique challenges Realtors face
        </Text>
        <Text style={styles.darkBoxText}>
          • Helps you navigate the intersection of real estate licensing and business credit
        </Text>
        <Text style={styles.darkBoxText}>
          • Knows when you need to consult your broker, attorney, or CPA
        </Text>
        <Text style={[styles.darkBoxText, { marginTop: 8 }]}>
          2. Credit Suite Coach
        </Text>
        <Text style={styles.darkBoxText}>
          • Specializes in business credit, trade lines, and fundability
        </Text>
        <Text style={styles.darkBoxText}>
          • Provides the technical expertise on credit building strategies
        </Text>
        <Text style={styles.darkBoxText}>
          • Has helped tens of thousands of businesses establish business credit
        </Text>
      </View>

      <Text style={styles.footer} fixed>
        © My Better Business Credit - Realtor Business Credit Guide - Page 12
      </Text>
    </Page>

    {/* Call to Action */}
    <Page size="LETTER" style={styles.page}>
      <Text style={styles.h1}>Your Next Steps</Text>
      
      <Text style={styles.body}>
        Now that you understand why most Realtors don't have business credit—and how to be one of the few who do—
        it's time to take action.
      </Text>

      <View style={styles.ctaBox}>
        <Text style={styles.ctaTitle}>Step 1: Take Your Free Fundability Scan</Text>
        <Text style={styles.ctaText}>
          Find out how "fundable" your business is right now. This diagnostic assessment will show you:
        </Text>
        <Text style={styles.ctaText}>
          • Where you stand today
        </Text>
        <Text style={styles.ctaText}>
          • What needs to be fixed or improved
        </Text>
        <Text style={styles.ctaText}>
          • Your personalized roadmap forward
        </Text>
        <Text style={[styles.ctaText, { marginTop: 12 }]}>
          Visit: mybetterbusinesscredit.fundabilityscan.com
        </Text>
      </View>

      <View style={styles.ctaBox}>
        <Text style={styles.ctaTitle}>Step 2: Schedule Your One-on-One Consultation</Text>
        <Text style={styles.ctaText}>
          Talk directly with a Realtor Business Credit coach who understands your industry and can answer your 
          specific questions.
        </Text>
        <Text style={[styles.ctaText, { marginTop: 12 }]}>
          During this call, we'll:
        </Text>
        <Text style={styles.ctaText}>
          • Review your Fundability Scan results
        </Text>
        <Text style={styles.ctaText}>
          • Discuss your specific situation (state licensing, entity structure, etc.)
        </Text>
        <Text style={styles.ctaText}>
          • Map out your personalized action plan
        </Text>
        <Text style={styles.ctaText}>
          • Answer all your questions
        </Text>
        <Text style={[styles.ctaText, { marginTop: 12 }]}>
          Book your call: realtorbusinesscredit.com
        </Text>
      </View>

      <View style={styles.calloutBox}>
        <Text style={styles.calloutTitle}>🚀 Launch Special for Early Adopters</Text>
        <Text style={styles.calloutText}>
          As one of the first Realtors to discover this program, you qualify for special launch pricing and benefits:
        </Text>
        <Text style={[styles.calloutText, { marginTop: 8 }]}>
          ✓ Launch pricing (locked in for life)
        </Text>
        <Text style={styles.calloutText}>
          ✓ Priority coaching and support
        </Text>
        <Text style={styles.calloutText}>
          ✓ Direct access to founder Jessie Hunter
        </Text>
        <Text style={styles.calloutText}>
          ✓ Free Fundability Scan (normally $97)
        </Text>
        <Text style={[styles.calloutText, { marginTop: 8 }]}>
          This is your chance to be ahead of the curve. Don't wait another 10 years like I did.
        </Text>
      </View>

      <Text style={styles.footer} fixed>
        © My Better Business Credit - Realtor Business Credit Guide - Page 13
      </Text>
    </Page>

    {/* Final Page */}
    <Page size="LETTER" style={styles.page}>
      <View style={styles.quote}>
        <Text style={[styles.calloutText, { fontSize: 13 }]}>
          "I wish someone had told me about business credit when I got my license in 2010. I don't want you to make 
          the same mistake I did. The time to start building your business credit is now—right after your recent 
          closing, when you have momentum and fresh commission income."
        </Text>
        <Text style={[styles.calloutText, { marginTop: 12, textAlign: 'right' }]}>
          — Jessie Hunter
        </Text>
        <Text style={[styles.calloutText, { textAlign: 'right' }]}>
          Founder, My Better Business Credit
        </Text>
      </View>

      <Text style={styles.h2}>Important Disclaimers</Text>
      
      <Text style={styles.body}>
        This guide provides education and coaching only. It is NOT legal, tax, or financial advice.
      </Text>
      
      <Text style={styles.body}>
        Before making any decisions about business entities, licensing, or financial matters, you should:
      </Text>
      <Text style={styles.bullet}>• Consult with your state's real estate licensing board</Text>
      <Text style={styles.bullet}>• Work with a licensed attorney in your state</Text>
      <Text style={styles.bullet}>• Consult with a tax professional or CPA</Text>
      <Text style={styles.bullet}>• Discuss any changes with your broker</Text>
      
      <Text style={[styles.body, { marginTop: 12 }]}>
        Results vary by individual. No specific credit approval amounts or timelines are guaranteed. Your results will 
        depend on your starting point, consistency, and individual circumstances.
      </Text>

      <Text style={styles.h2}>About My Better Business Credit</Text>
      
      <Text style={styles.body}>
        My Better Business Credit is a specialized coaching program for real estate professionals who want to establish 
        separate business credit. We partner with Credit Suite, an industry-leading business credit specialist that has 
        helped tens of thousands of businesses build fundable credit profiles.
      </Text>
      
      <Text style={[styles.body, { marginTop: 12 }]}>
        Learn more: mybetterbusinesscredit.com
      </Text>
      <Text style={styles.body}>
        Realtor-specific program: realtorbusinesscredit.com
      </Text>
      <Text style={styles.body}>
        Free Fundability Scan: mybetterbusinesscredit.fundabilityscan.com
      </Text>

      <View style={{ marginTop: 40, alignItems: 'center' }}>
        <Text style={[styles.h2, { color: '#3eaf7c' }]}>
          My Plan. My Progress. My Better Business Credit.
        </Text>
      </View>

      <Text style={styles.footer} fixed>
        © My Better Business Credit - Realtor Business Credit Guide - Page 14
      </Text>
    </Page>
  </Document>
);
