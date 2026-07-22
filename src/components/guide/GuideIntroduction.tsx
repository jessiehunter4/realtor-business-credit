import { Link } from "react-router-dom";
import { Callout, ChapterHeader, SectionHeading, Paragraph } from "./GuideComponents";

const GuideIntroduction = () => (
  <section id="introduction" className="scroll-mt-20 container mx-auto px-4 py-16">
    <div className="max-w-4xl mx-auto">
      <ChapterHeader title="Introduction: Who this guide is for" />

      <Paragraph>This guide exists for one reason — to help you have <strong>money when you need it</strong> in your real estate business. Between closings. Before your next client. The day an opportunity shows up that you'd kick yourself for missing.</Paragraph>

      <Paragraph>It's for Realtors and brokers who want to:</Paragraph>
      <ul className="list-disc pl-6 space-y-2 text-base md:text-lg text-foreground/90 my-4">
        <li>Stop funding business growth with personal credit.</li>
        <li>Build a legitimate business structure that matches their state and brokerage rules.</li>
        <li>Set up bank accounts and money flows that make lenders confident.</li>
        <li>Establish and grow business credit capacity — cards, LOCs, and funding — tied to real production goals.</li>
      </ul>

      <Paragraph>It works for every Realtor. It's especially powerful right after a closing, when you have momentum and recent income.</Paragraph>

      <SectionHeading>What this guide is — and is not</SectionHeading>
      <Paragraph>This guide is <strong>education and coaching guidance</strong>. It is not legal, tax, or investment advice. Entity selection, commission handling, and asset-protection strategy should always be confirmed with your broker, CPA, and attorney for your state and your facts.</Paragraph>

      <Callout variant="info">
        <Paragraph className="m-0">There's no cost for the guide or the 1:1. We discuss and complete the <strong>RE Pro Business Financial Needs Analysis</strong> together during your free 1:1 — and from it we generate your custom RE Pro Business Structure, Finance &amp; Credit Plan.</Paragraph>
      </Callout>

      <SectionHeading>How to read this</SectionHeading>
      <Paragraph>Read top to bottom or jump to the chapter that fits your situation. Each chapter ends with a short "Takeaways" block. Callouts, charts, and the credit ladder give you visual anchors so you can come back later and find what you need.</Paragraph>
      <p className="mt-6 text-sm">
        Already know you want help? <Link to="/one-on-one" className="font-bold text-primary hover:underline">Book your free 1:1 →</Link>
      </p>
    </div>
  </section>
);

export default GuideIntroduction;
