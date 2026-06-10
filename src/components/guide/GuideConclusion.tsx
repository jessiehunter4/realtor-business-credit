import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Callout, StoryBox, ActionStep, QuoteBlock, ChapterHeader, SectionHeading, Paragraph } from "./GuideComponents";

const GuideConclusion = () => (
  <section id="conclusion" className="scroll-mt-20 container mx-auto px-4 py-16">
    <div className="max-w-4xl mx-auto">
      <ChapterHeader number="CONCLUSION" title="Your Next Steps" />

      <Paragraph>If you've read this far, congratulations.</Paragraph>
      <Paragraph>You now understand something that 90% of real estate professionals don't:</Paragraph>
      <Paragraph><strong>Business credit exists. It's accessible. And it can protect your financial future.</strong></Paragraph>
      <Paragraph>More importantly, you understand that every month you wait is costing you money—real money that could be in your pocket, building your wealth, protecting your family.</Paragraph>

      <SectionHeading>You Have a Choice</SectionHeading>
      <Paragraph>You're at a decision point. And honestly, there are really only two paths forward:</Paragraph>

      <div className="grid md:grid-cols-2 gap-6 my-8">
        <StoryBox>
          <h3 className="font-bold text-lg text-destructive mt-0 mb-3">Path 1: Continue As Is</h3>
          <Paragraph>Keep mixing personal and business finances. Keep using personal credit for business expenses. Keep risking your personal credit score, your refinancing options, your family's financial security.</Paragraph>
          <Paragraph>You now know what it's costing you: <strong>$5,000-26,000 per year. $50,000-260,000+ over a career.</strong></Paragraph>
        </StoryBox>

        <StoryBox>
          <h3 className="font-bold text-lg text-primary mt-0 mb-3">Path 2: Establish Business Credit</h3>
          <Paragraph>Take 9-12 months to build business credit properly. Separate your business and personal finances. Protect your personal credit. Access more capital with less personal risk.</Paragraph>
          <Paragraph><strong>Investment: One-time. Payoff: Permanent.</strong></Paragraph>
        </StoryBox>
      </div>

      <Paragraph>The choice is yours. But please—make it an INFORMED choice.</Paragraph>

      <SectionHeading>If You're Ready for Path 2</SectionHeading>
      <Paragraph>If you've read this guide and thought, "This makes sense. I need to do this"—then let's talk about YOUR specific situation.</Paragraph>
      <ul className="list-disc pl-6 space-y-2 text-base md:text-lg text-foreground/90 my-4">
        <li>Different states have different regulations</li>
        <li>Different broker arrangements have different implications</li>
        <li>Different business goals require different strategies</li>
        <li>Different financial situations need different approaches</li>
      </ul>
      <Paragraph>There's no one-size-fits-all solution. That's why I'm offering something specific:</Paragraph>

      <Callout variant="important">
        <h3 className="font-bold text-lg text-destructive mt-0 mb-3">Limited One-on-One Sessions</h3>
        <Paragraph><strong>For a limited time,</strong> I'm personally offering one-on-one sessions with realtors who are serious about establishing business credit.</Paragraph>
        <Paragraph>This isn't a sales call. This isn't a pitch. This is a realtor-to-realtor business conversation.</Paragraph>

        <p className="font-bold mt-4 text-foreground">First 5 Minutes: Your Needs Analysis</p>
        <Paragraph>We'll run your Needs Analysis together. This shows you exactly where YOUR business stands right now for credit purposes.</Paragraph>

        <p className="font-bold mt-4 text-foreground">Next 10-15 Minutes: Your Situation</p>
        <ul className="list-disc pl-6 space-y-1 text-base text-foreground/90 mt-2">
          <li>Why you booked this session—what's your current situation?</li>
          <li>What prompted you to look into business credit?</li>
          <li>What are your goals for your real estate business?</li>
          <li>What state you're in and how that affects your options</li>
          <li>What your broker arrangement looks like</li>
        </ul>

        <p className="font-bold mt-4 text-foreground">Final 10-15 Minutes: Your Customized Next Steps</p>
        <ul className="list-disc pl-6 space-y-1 text-base text-foreground/90 mt-2">
          <li>What business structure makes sense for YOU</li>
          <li>What YOUR timeline would look like</li>
          <li>What YOUR specific challenges might be</li>
          <li>What YOUR next steps should be</li>
        </ul>

        <Paragraph className="mt-4"><strong>No obligation. No pressure. No hard sell.</strong></Paragraph>
        <Paragraph>At the end of our conversation, you'll know whether establishing business credit makes sense for YOUR situation. And if it does, you'll know exactly what to do next.</Paragraph>
      </Callout>

      <SectionHeading>How to Book Your Session</SectionHeading>
      <ActionStep>
        <h4 className="font-bold text-foreground mt-0 mb-2">Step 1: Schedule Your One-on-One Session</h4>
        <Paragraph>Schedule a time to talk with me directly.</Paragraph>
        <p className="mt-2"><Link to="/one-on-one" className="font-bold text-primary hover:underline">Book your session →</Link></p>
      </ActionStep>
      <ActionStep>
        <h4 className="font-bold text-foreground mt-0 mb-2">Step 2: Complete Your Free Needs Analysis</h4>
        <Paragraph>Done during the session, it takes about 5 minutes. It's a simple assessment that shows where your business stands for credit purposes.</Paragraph>
      </ActionStep>
      <ActionStep>
        <h4 className="font-bold text-foreground mt-0 mb-2">Step 3: Show Up Ready to Talk</h4>
        <Paragraph>Come prepared to discuss your current business structure, your state and broker arrangement, your goals, and any concerns.</Paragraph>
      </ActionStep>

      <SectionHeading>One Year from Now</SectionHeading>
      <div className="grid md:grid-cols-2 gap-6 my-8">
        <StoryBox>
          <h3 className="font-bold text-lg text-destructive mt-0 mb-3">Scenario A: You Didn't Act</h3>
          <Paragraph>You're still using personal credit for business expenses. You just got declined for a mortgage refinance. Your spouse is worried about your maxed-out credit cards.</Paragraph>
          <Paragraph><strong>Cost this year: $5,000-10,000+</strong></Paragraph>
        </StoryBox>
        <StoryBox>
          <h3 className="font-bold text-lg text-primary mt-0 mb-3">Scenario B: You Took Action</h3>
          <Paragraph>You now have business credit cards with $25,000+ in available credit. Your personal credit score has INCREASED. You just got approved for that investment property loan.</Paragraph>
          <Paragraph><strong>Investment: $1,500-3,000 (one-time)</strong></Paragraph>
        </StoryBox>
      </div>

      <Paragraph>Which scenario do you want?</Paragraph>

      <SectionHeading>The Final Word</SectionHeading>
      <QuoteBlock>
        <p>Ten years from now, you'll look back on this moment.</p>
        <p className="mt-3">If you take action today, you'll think: "That was one of the smartest business decisions I ever made."</p>
        <p className="mt-3">If you don't take action, you'll think: "Why didn't I do that when I first learned about it?"</p>
        <p className="mt-3">I know which thought I'd rather have.</p>
      </QuoteBlock>

      <Paragraph>Don't wait another 10 years like I did.</Paragraph>
      <Paragraph><strong>Take action today.</strong></Paragraph>

      <div className="text-center mt-12">
        <Button asChild size="lg" className="text-lg px-8 py-6">
          <Link to="/one-on-one">
            <Calendar className="mr-2 h-5 w-5" />
            Book Your Free One-on-One Session
          </Link>
        </Button>
        <p className="text-sm text-muted-foreground mt-4 italic">
          5 minutes for the scan. 30 minutes for our conversation. Complete clarity on YOUR path forward.
        </p>
        <p className="mt-6 text-secondary font-semibold italic">
          "Don't wait another 10 years like I did."
          <br />
          <span className="text-primary">— Jessie Hunter, Broker | California & Georgia</span>
        </p>
        <p className="text-xs text-muted-foreground mt-4">
          P.S. Remember: These one-on-one sessions are offered for a limited time. If this resonates with you, book your session now while it's available.
        </p>
      </div>
    </div>
  </section>
);

export default GuideConclusion;
