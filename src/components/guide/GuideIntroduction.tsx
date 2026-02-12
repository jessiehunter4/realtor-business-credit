import { Link } from "react-router-dom";
import { Callout, ChapterHeader, SectionHeading, Paragraph } from "./GuideComponents";

const GuideIntroduction = () => (
  <section id="introduction" className="scroll-mt-20 container mx-auto px-4 py-16">
    <div className="max-w-4xl mx-auto">
      <ChapterHeader title="Introduction: Congratulations on Your Recent Closing" />

      <Paragraph>You just closed a deal. That commission check is hitting your account.</Paragraph>
      <Paragraph>It feels good, doesn't it?</Paragraph>
      <Paragraph>But let me ask you something: <strong>Where does that money actually go?</strong></Paragraph>
      <Paragraph>If you're like most real estate professionals, here's the reality of a $15,000 commission:</Paragraph>

      <ul className="list-disc pl-6 space-y-2 text-base md:text-lg text-foreground/90 my-4">
        <li>$4,500 to taxes (30%)</li>
        <li>$2,250 to your broker split</li>
        <li>You're down to $8,250</li>
        <li>Then you subtract business expenses: $2,000 marketing, $500 technology, $300 gas, $200 staging</li>
        <li><strong>You actually keep: $5,250</strong></li>
      </ul>

      <Paragraph>But here's the part that nobody talks about—the part I wish someone had told me 15 years ago:</Paragraph>

      <Callout variant="important">
        <Paragraph><strong>You probably charged $3,000 or more of those business expenses on YOUR personal credit card this month.</strong></Paragraph>
        <Paragraph>Your credit utilization just jumped 30%. Your personal credit score drops 20 points. And this affects YOUR mortgage rate, YOUR car loan, YOUR ability to refinance—everything in YOUR personal financial life.</Paragraph>
      </Callout>

      <Paragraph>Nobody told you there was a better way.</Paragraph>
      <Paragraph>Nobody told you about business credit.</Paragraph>
      <Paragraph>That's what this guide is about.</Paragraph>

      <SectionHeading>What You'll Learn</SectionHeading>
      <ul className="list-disc pl-6 space-y-2 text-base md:text-lg text-foreground/90 my-4">
        <li>What business credit is and why it's the missing piece in real estate education</li>
        <li>The true cost of using personal credit for business expenses (with real numbers)</li>
        <li>Why I waited over 10 years to discover this—and what it cost me</li>
        <li>The seven-step process to building business credit</li>
        <li>Why this isn't something you should try to figure out alone</li>
        <li>What the journey actually feels like (month by month)</li>
        <li>How to determine if this makes sense for YOUR specific situation</li>
      </ul>

      <SectionHeading>Who This Guide Is For</SectionHeading>
      <ul className="list-disc pl-6 space-y-2 text-base md:text-lg text-foreground/90 my-4">
        <li>Residential and commercial real estate agents</li>
        <li>Real estate brokers (solo and team leaders)</li>
        <li>Anyone who has business expenses related to their real estate practice</li>
        <li>Realtors who are tired of mixing personal and business finances</li>
        <li>Anyone who just closed a deal and is thinking about their financial future</li>
      </ul>

      <Callout variant="important">
        <h3 className="font-bold text-lg text-destructive mt-0 mb-3">Already Know You Need This?</h3>
        <Paragraph>Look, I'm a realtor too. I know some of us are "bottom-line" people. If you already know you need business credit and just want to talk through YOUR specific situation—skip the guide.</Paragraph>
        <Paragraph><strong>For a limited time, I'm offering one-on-one sessions.</strong> Just you and me, realtor to realtor. In our session together, we'll:</Paragraph>
        <ul className="list-disc pl-6 space-y-1 text-base text-foreground/90 mt-2">
          <li>How "Fundable" are you? We will run your "Fundability Scan" live together (takes about 5 minutes)</li>
          <li>Discuss YOUR current situation and what prompted you to reach out</li>
          <li>Outline customized next steps specifically for YOUR business</li>
        </ul>
        <Paragraph>No obligation. No pressure. Just a straightforward business conversation between two professionals. I guarantee it will be worthwhile.</Paragraph>
        <p className="mt-3 mb-0">
          <Link to="/get_started" className="font-bold text-primary hover:underline">Book your one-on-one session →</Link>
        </p>
        <p className="text-xs italic text-muted-foreground mt-3">For everyone else—keep reading. By the end of this guide, you'll understand exactly why this matters for your business.</p>
      </Callout>

      <SectionHeading>How to Use This Guide</SectionHeading>
      <Paragraph>You can read this guide straight through, or jump to the chapters most relevant to your situation.</Paragraph>
      <Paragraph>Throughout the guide, you'll find:</Paragraph>
      <ul className="list-disc pl-6 space-y-2 text-base md:text-lg text-foreground/90 my-4">
        <li><strong>Callout boxes</strong> highlighting key points</li>
        <li><strong>Real examples</strong> from my own experience</li>
        <li><strong>Action steps</strong> you can take</li>
        <li><strong>Key takeaways</strong> at the end of each chapter</li>
      </ul>
      <Paragraph>My goal isn't to sell you anything in this guide. My goal is to give you the information I wish I'd had 15 years ago, so you can make an informed decision about YOUR financial future.</Paragraph>
      <Paragraph>Let's get started.</Paragraph>
    </div>
  </section>
);

export default GuideIntroduction;
