import {
  Callout,
  ChapterHeader,
  SectionHeading,
  SubHeading,
  Paragraph,
  JessieNote,
  PlanCTAButton,
} from "./GuideComponents";
import { BookOpen, ClipboardList, Rocket } from "lucide-react";

const GuideIntroduction = () => (
  <section id="introduction" className="scroll-mt-20 container mx-auto px-4 py-16">
    <div className="max-w-4xl mx-auto">
      <ChapterHeader title="Welcome from Jessie Hunter" />

      <SectionHeading>I learned this the hard way</SectionHeading>
      <Paragraph>I hate running out of money.</Paragraph>
      <Paragraph>It hasn't happened often during my 16+ years in real estate, but there have been a handful of times when the market changed quickly and my income slowed down. The 2008 financial crisis was one of those times. The pandemic was another.</Paragraph>
      <Paragraph>Each time, I survived by relying on my personal credit, personal savings, and personal assets. What surprises me most is that <strong>no one ever taught me another way.</strong></Paragraph>
      <Paragraph>I have taken courses on leads, listings, contracts, compliance, negotiation, marketing, and almost every other part of being a real estate professional. But no one sat me down and explained how to properly structure my real estate business, separate my finances, establish business credit, and build access to capital <em>before</em> I needed it.</Paragraph>
      <Paragraph>That's why I created RE Pro Business Credit.</Paragraph>

      <JessieNote title="My goal is simple">
        <p>I want thousands of real estate professionals across the United States to operate properly structured businesses with access to capital based increasingly on the financial success of those businesses — not only on the personal credit of the owner.</p>
      </JessieNote>

      <Paragraph>This guide is <strong>Step 1</strong>. It gives you the important information quickly, without burying you in technical language. I'll walk with you through the process, explain what matters, and help you decide what to do next.</Paragraph>

      <ChapterHeader number="THE PATH" title="Your Three-Step RE Pro Path" />

      <div className="grid md:grid-cols-3 gap-4 my-8">
        {[
          { icon: BookOpen, label: "Step 1", title: "Read the Guide", body: "You're here now. Easy to read, focused on real estate, practical, and free. You don't need to become a business-credit expert — just clear enough on the path to make better decisions." },
          { icon: ClipboardList, label: "Step 2", title: "Create Your Customized Plan", body: "A quick five-step interactive process. Your answers generate your own RE Pro Business Finance & Credit Plan and place it in your free private dashboard." },
          { icon: Rocket, label: "Step 3", title: "Implementation", body: "A plan is valuable — implementation creates results. Choose DIY, Cohort, or Cohort+ inside your dashboard when you're ready." },
        ].map((s) => (
          <div key={s.title} className="rounded-2xl bg-card border border-border p-5 shadow-[0_8px_18px_rgba(11,31,59,.06)]">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary">
                <s.icon className="h-4 w-4" />
              </span>
              <p className="m-0 text-xs uppercase tracking-widest text-primary font-bold">{s.label}</p>
            </div>
            <h4 className="font-bold text-secondary text-lg mb-2">{s.title}</h4>
            <p className="text-sm text-foreground/85 leading-relaxed m-0">{s.body}</p>
          </div>
        ))}
      </div>

      <Callout variant="info">
        <SubHeading>The RE Pro promise</SubHeading>
        <Paragraph className="m-0">
          The guide, customized plan, and basic dashboard are available <strong>at no cost</strong>. First we educate you. Then we help you understand your position. Only after that do you decide how you want to implement your plan.
        </Paragraph>
      </Callout>

      <SectionHeading>What this guide is — and is not</SectionHeading>
      <Paragraph>This is <strong>education and coaching guidance</strong>. It is not legal, tax, accounting, or investment advice. Entity selection, commission handling, and asset-protection strategy should always be confirmed with your broker, CPA, attorney, and state licensing board for your specific situation.</Paragraph>

      <div className="mt-8 flex flex-col items-center gap-2">
        <PlanCTAButton label="Skip Ahead: Create My Plan" />
        <p className="text-xs text-muted-foreground italic">Or keep reading — each chapter is a 2–3 minute read.</p>
      </div>
    </div>
  </section>
);

export default GuideIntroduction;
