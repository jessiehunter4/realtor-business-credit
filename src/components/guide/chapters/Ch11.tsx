import { ChapterHeader, SectionHeading, Paragraph, KeyTakeaway } from "../GuideComponents";
import { GuideFAQ } from "../GuideMedia";

const Ch11 = () => (
  <section id="chapter-11" className="scroll-mt-20 container mx-auto px-4 py-16">
    <div className="max-w-4xl mx-auto">
      <ChapterHeader number="CHAPTER 11" title="Common mistakes that block approvals" />

      <Paragraph>If applications are getting declined or limits are coming in low, it's almost always one of these. Pattern-match yours below.</Paragraph>

      <div className="grid md:grid-cols-2 gap-4 my-8">
        {[
          "Mixing personal and business expenses",
          "Inconsistent address across applications and directories",
          "No discoverable business phone or online footprint",
          "Applying too early — no bureau presence, no tradelines",
          "Entity / licensing / brokerage identity mismatch",
          "No reserves, frequent overdrafts, or chaotic statements",
        ].map((m) => (
          <div key={m} className="p-4 rounded-2xl bg-card border border-border text-foreground/90 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-destructive/15 text-[hsl(var(--coral))] font-bold flex items-center justify-center text-sm flex-none">✕</span>
            <span className="text-base">{m}</span>
          </div>
        ))}
      </div>

      <SectionHeading>The objections we hear most often</SectionHeading>
      <GuideFAQ
        items={[
          {
            q: '"I\'m just an agent, not a real business."',
            a: "If you have business expenses — marketing, gas, technology, staging — you ARE a business owner. The IRS already treats you that way for self-employment tax. The protection should match.",
          },
          {
            q: '"My broker handles everything."',
            a: "Your broker doesn't pay your CRM, your ads, your gas, or your photography. Those are your business expenses — and mixing them with personal spending damages your credit, not your broker's.",
          },
          {
            q: '"I don\'t make enough to worry about this yet."',
            a: "That's exactly why it matters now. When margins are tight, you can't afford for business expenses to keep dragging down your personal score and your access to capital.",
          },
          {
            q: '"This sounds complicated and expensive."',
            a: "Setup is usually $50–$300 in filing fees plus a small amount of time. That's less than a month of Zillow — and orders of magnitude less than the carrying cost of doing nothing.",
          },
          {
            q: '"I\'ll do this when I\'m more established."',
            a: "The credit ladder takes months to climb either way. The Realtors who win are the ones who started before they needed it — not the ones who waited for an emergency.",
          },
          {
            q: '"I need perfect personal credit first."',
            a: "You don't. Business credit is separate. Early steps may consider personal credit, but the long arc is to build a business profile that stands on its own.",
          },
        ]}
      />

      <KeyTakeaway>
        <h4 className="font-bold text-secondary mt-0 mb-3">Chapter 11 takeaways</h4>
        <ul className="list-disc pl-6 space-y-1 text-base text-foreground/90">
          <li>Most declines are identity, timing, and consistency problems — not credit problems.</li>
          <li>Common objections collapse once you see the math and the timeline.</li>
          <li>The cost of doing nothing is always higher than the cost of starting.</li>
        </ul>
      </KeyTakeaway>
    </div>
  </section>
);

export default Ch11;