import { Callout, StoryBox, KeyTakeaway, ActionStep, ChapterHeader, SectionHeading, Paragraph, BookSessionCTA } from "./GuideComponents";

const GuideChapter2 = () => (
  <section id="chapter-2" className="scroll-mt-20 container mx-auto px-4 py-16">
    <div className="max-w-4xl mx-auto">
      <ChapterHeader number="CHAPTER 2" title="What Business Credit Actually Is" />

      <Paragraph>Now that you understand how I discovered business credit, let's talk about what it actually is—and why it matters for YOUR real estate business.</Paragraph>

      <SectionHeading>The Simple Definition</SectionHeading>
      <Paragraph>Business credit is a credit profile for YOUR business that's completely separate from YOUR personal credit.</Paragraph>
      <Paragraph>Just like you have a personal credit score (FICO score) based on your Social Security Number, your business can have its own credit scores based on its Employer Identification Number (EIN).</Paragraph>
      <Paragraph>The three major business credit bureaus are:</Paragraph>
      <ul className="list-disc pl-6 space-y-2 text-base md:text-lg text-foreground/90 my-4">
        <li>Dun & Bradstreet (D&B)</li>
        <li>Experian Business</li>
        <li>Equifax Small Business</li>
      </ul>
      <Paragraph>These are completely separate from the personal credit bureaus (Experian, Equifax, TransUnion) that track your personal credit.</Paragraph>

      <SectionHeading>What This Means in Practice</SectionHeading>
      <Callout>
        <h3 className="font-bold text-lg text-primary mt-0 mb-3">✅ With Business Credit:</h3>
        <ul className="list-disc pl-6 space-y-1 text-base text-foreground/90">
          <li>YOUR business expenses go on business credit cards</li>
          <li>Those charges don't appear on YOUR personal credit report</li>
          <li>YOUR personal credit utilization stays low</li>
          <li>YOUR personal credit score stays protected</li>
          <li>YOUR business builds its own financial identity</li>
          <li>YOU can access MORE capital with LESS personal risk</li>
        </ul>
      </Callout>

      <Callout variant="warning">
        <h3 className="font-bold text-lg text-accent-foreground mt-0 mb-3">❌ Without Business Credit (What Most Realtors Do):</h3>
        <ul className="list-disc pl-6 space-y-1 text-base text-foreground/90">
          <li>All business expenses go on YOUR personal credit cards</li>
          <li>YOUR personal credit utilization spikes</li>
          <li>YOUR personal credit score drops</li>
          <li>This affects YOUR mortgage rates, car loans, refinancing options</li>
          <li>YOUR personal finances are at risk for business activities</li>
          <li>YOU have limited access to capital (only what your personal credit allows)</li>
        </ul>
      </Callout>

      <Paragraph>The difference is stark. And expensive.</Paragraph>

      <SectionHeading>Why Nobody Told You About This</SectionHeading>
      <Paragraph>Here's a question I get all the time: "If business credit is so important, why didn't anyone tell me about it?"</Paragraph>
      <Paragraph>Great question. Here's my theory based on 15 years in the industry:</Paragraph>

      {[
        { title: "Reason #1: It's Not Part of Real Estate Education", text: "Your real estate pre-licensing course didn't cover it. Your continuing education classes don't mention it. Your broker training didn't include it. Real estate education focuses on: license law, contracts, ethics, fair housing, disclosures. All important. But business credit? Business structure? Financial fundamentals? Not covered." },
        { title: "Reason #2: Most Brokers Don't Know About It Either", text: "Your broker probably uses personal credit for their business too. It's the real estate industry norm. So when you become an agent, you simply replicate what you see others doing." },
        { title: 'Reason #3: We\'re Independent Contractors, Not "Real" Business Owners', text: 'Many agents think: "I\'m just an independent contractor. I\'m not a business. This doesn\'t apply to me." Wrong. As an independent contractor, YOU are a business. You have business expenses. You need business credit.' },
        { title: "Reason #4: It Seems Complicated", text: 'Business credit sounds like something only "real" businesses need—corporations, franchises, companies with employees. But that\'s not true. Even sole proprietors (which many realtors are) can and should have business credit.' },
      ].map((r, i) => (
        <StoryBox key={i}>
          <h3 className="font-bold text-lg text-primary mt-0 mb-3">{r.title}</h3>
          <Paragraph>{r.text}</Paragraph>
        </StoryBox>
      ))}

      <Paragraph>The result of all these factors? An entire industry of independent business professionals who don't know business credit exists.</Paragraph>

      <BookSessionCTA />

      <SectionHeading>How Business Credit Actually Works</SectionHeading>
      {[
        { step: "Step 1: Your Business Gets an EIN", text: "An Employer Identification Number (EIN) is like a Social Security Number for your business. It's free from the IRS. Takes 10 minutes online. This is the foundation. Without an EIN, you can't build business credit." },
        { step: "Step 2: Your Business Establishes a Credit Profile", text: "You register your business with the business credit bureaus (Dun & Bradstreet, Experian Business, Equifax Small Business). They create a file for YOUR business, separate from YOUR personal file." },
        { step: "Step 3: You Build Credit History", text: "You establish vendor accounts, get business credit cards, make payments on time. Each payment builds YOUR business credit profile, not your personal credit profile." },
        { step: "Step 4: Your Business Credit Score Grows", text: "As your business builds a positive payment history, your business credit scores increase. Higher scores = more credit available = more capital for growth." },
        { step: "Step 5: You Access Business Credit Lines", text: "With good business credit, you can qualify for: business credit cards (not requiring personal guarantee), lines of credit, SBA loans, equipment financing, and more. All without touching YOUR personal credit." },
      ].map((s, i) => (
        <ActionStep key={i}>
          <h4 className="font-bold text-foreground mt-0 mb-2">{s.step}</h4>
          <Paragraph>{s.text}</Paragraph>
        </ActionStep>
      ))}

      <SectionHeading>The Timeline Reality</SectionHeading>
      <Paragraph>Honest answer: <strong>9-12 months to build a strong business credit profile.</strong></Paragraph>
      <Paragraph>That's not long. Consider:</Paragraph>
      <ul className="list-disc pl-6 space-y-2 text-base md:text-lg text-foreground/90 my-4">
        <li>You'll be in real estate for years (hopefully decades)</li>
        <li>You'll have business expenses every single month</li>
        <li>You'll need capital for growth opportunities</li>
      </ul>
      <Paragraph>Investing 9-12 months to build business credit is one of the smartest business decisions you can make.</Paragraph>
      <Paragraph>And here's the key: <strong>You should start BEFORE you desperately need it.</strong></Paragraph>

      <SectionHeading>Common Misconceptions About Business Credit</SectionHeading>
      <Callout variant="warning">
        <h3 className="font-bold text-lg text-accent-foreground mt-0 mb-3">Misconception: "Business credit requires a big business"</h3>
        <Paragraph>Reality: Solo practitioners, freelancers, and independent contractors can all build business credit. You don't need employees, an office, or high revenue.</Paragraph>
      </Callout>
      <Callout variant="warning">
        <h3 className="font-bold text-lg text-accent-foreground mt-0 mb-3">Misconception: "It takes years to build"</h3>
        <Paragraph>Reality: With proper guidance, you can have a functioning business credit profile in 9-12 months.</Paragraph>
      </Callout>
      <Callout variant="warning">
        <h3 className="font-bold text-lg text-accent-foreground mt-0 mb-3">Misconception: "My personal credit has to be perfect first"</h3>
        <Paragraph>Reality: Business credit is separate. While some initial vendors may check personal credit, the goal is building a separate business profile. Typically 550+ personal score is sufficient to start.</Paragraph>
      </Callout>

      <KeyTakeaway>
        <h4 className="font-bold text-accent-foreground mt-0 mb-3">Key Takeaways from Chapter 2:</h4>
        <ul className="list-disc pl-6 space-y-1 text-base text-foreground/90">
          <li>Business credit is a completely separate credit profile for your business</li>
          <li>Three major bureaus track it: D&B, Experian Business, Equifax Small Business</li>
          <li>Nobody told you because it's not part of real estate education</li>
          <li>Building it takes 9-12 months with proper guidance</li>
          <li>You don't need a big business, perfect credit, or employees to start</li>
        </ul>
      </KeyTakeaway>
    </div>
  </section>
);

export default GuideChapter2;
