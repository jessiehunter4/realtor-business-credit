import { Callout, KeyTakeaway, ChapterHeader, SectionHeading, Paragraph } from "./GuideComponents";

const GuideChapter5 = () => (
  <section id="chapter-5" className="scroll-mt-20 bg-muted/30 py-16">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <ChapterHeader number="CHAPTER 5" title="The Seven-Step Process: What's Actually Involved" />

        <Paragraph>Building business credit follows a proven, predictable process.</Paragraph>
        <Paragraph>It's not random. It's not mysterious. It follows specific steps in a specific order—much like a real estate transaction.</Paragraph>
        <Paragraph>But here's what nobody shows you: <strong>there are a LOT of moving parts, and each requires decisions that affect everything that comes after.</strong></Paragraph>

        <SectionHeading>The Real Estate Transaction Analogy</SectionHeading>
        <Paragraph>Think about a real estate transaction. You know exactly what happens:</Paragraph>
        <ol className="list-decimal pl-6 space-y-1 text-base md:text-lg text-foreground/90 my-4">
          <li>Offer & Acceptance</li>
          <li>Opening Escrow</li>
          <li>Inspection Period</li>
          <li>Appraisal</li>
          <li>Final Walkthrough</li>
          <li>Closing</li>
        </ol>
        <Paragraph>It's predictable. But could your client handle it alone? Technically yes. Should they? Absolutely not.</Paragraph>
        <Paragraph>Building business credit is the same.</Paragraph>

        <SectionHeading>The Seven Steps Overview</SectionHeading>
        <Paragraph>Here's what's involved in building business credit. I'm not giving you DIY instructions—I'm showing you what the process looks like so you understand why professional guidance matters.</Paragraph>

        {[
          {
            title: "Step 1: Choose the Right Business Structure",
            content: (
              <>
                <Paragraph>LLC, S-Corp, or C-Corp? The answer depends on YOUR state regulations, YOUR broker's requirements, YOUR income level, YOUR tax situation, and YOUR long-term goals.</Paragraph>
                <Callout variant="warning">
                  <h3 className="font-bold text-lg text-accent-foreground mt-0 mb-3">Why This Matters:</h3>
                  <Paragraph>Get this wrong and you'll have to dissolve the entity and start over. Or worse, you'll operate with a structure that doesn't protect you properly or costs you extra in taxes.</Paragraph>
                  <Paragraph>For example, in California, real estate licenses can be held under corporations but NOT LLCs. But you might be able to operate a separate entity for business expenses while keeping your license under your personal name or corporation.</Paragraph>
                  <Paragraph>Confused yet? This is exactly why consultation with professionals who understand real estate licensing is critical.</Paragraph>
                </Callout>
              </>
            ),
          },
          {
            title: "Step 2: Obtain Your EIN",
            content: <Paragraph>Your Employer Identification Number (EIN) is your business's Social Security Number. You apply through the IRS website. It's free and takes about 15 minutes. This seems simple—and it is—but it's the foundation for everything else. Any mistakes here create problems down the line.</Paragraph>,
          },
          {
            title: "Step 3: Open a Business Bank Account",
            content: (
              <>
                <Paragraph>Not all business bank accounts are created equal for credit-building purposes. Which bank? What fees? What documentation do you need? How do you set it up to actually help build credit?</Paragraph>
                <Paragraph>Most importantly: Once opened, ALL business transactions must go through this account. No exceptions. Mixing personal and business undermines the entire purpose.</Paragraph>
              </>
            ),
          },
          {
            title: "Step 4: Establish Business Phone & Address",
            content: <Paragraph>Your business needs a dedicated phone number (Google Voice works) and a physical address. Critical point: This information must be consistent across ALL registrations. Inconsistency causes reporting issues later.</Paragraph>,
          },
          {
            title: "Step 5: Register with Credit Bureaus",
            content: (
              <>
                <Paragraph>Three separate registrations: Dun & Bradstreet (for D-U-N-S Number), Experian Business, and Equifax Small Business.</Paragraph>
                <Paragraph>Your information must match perfectly across all three. Even small discrepancies (like "Street" vs "St") can cause reporting problems.</Paragraph>
              </>
            ),
          },
          {
            title: "Step 6: Establish Vendor Trade Lines",
            content: (
              <>
                <Paragraph>This is where most people get stuck. Which vendors actually report to business credit bureaus? Which report to all three vs. just one? What order should you apply? How long between applications?</Paragraph>
                <Paragraph>Getting vendor trade lines wrong can set you back months. The right guidance makes this step predictable and efficient.</Paragraph>
              </>
            ),
          },
          {
            title: "Step 7: Apply for Business Credit Cards",
            content: (
              <>
                <Paragraph>Once you have 3-5 trade lines reporting, you can start applying for business credit cards. But which ones? When? In what order?</Paragraph>
                <Paragraph>Apply for the wrong card too early and you get declined. Apply for the right card at the right time and you get approved—often with higher limits than personal cards.</Paragraph>
              </>
            ),
          },
        ].map((step, i) => (
          <div key={i} className="my-8">
            <h3 className="text-xl font-bold text-secondary mb-3">{step.title}</h3>
            {step.content}
          </div>
        ))}

        <SectionHeading>Why This Isn't a DIY Project</SectionHeading>
        <Callout>
          <Paragraph><strong>Think of it like a real estate transaction:</strong> You COULD try to buy a house without an agent. But why would you? The process is complex, mistakes are expensive, and having a professional guide you through it saves time, money, and stress.</Paragraph>
          <Paragraph>Building business credit is the same. You CAN do it yourself. But the risk of expensive mistakes, the time investment, and the complexity make professional guidance a smart investment.</Paragraph>
        </Callout>

        <KeyTakeaway>
          <h4 className="font-bold text-accent-foreground mt-0 mb-3">Key Takeaways from Chapter 5:</h4>
          <ul className="list-disc pl-6 space-y-1 text-base text-foreground/90">
            <li>Building business credit follows 7 specific steps in a specific order</li>
            <li>Each step requires decisions that affect everything after it</li>
            <li>The process is similar to a real estate transaction—predictable but complex</li>
            <li>Professional guidance prevents expensive mistakes and wasted time</li>
            <li>This is not a DIY project for the same reason buying a house isn't a DIY project</li>
          </ul>
        </KeyTakeaway>
      </div>
    </div>
  </section>
);

export default GuideChapter5;
