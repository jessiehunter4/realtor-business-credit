import { ChapterHeader, SectionHeading, Paragraph, ChapterTakeaway, JessieNote, GoodNugget } from "../GuideComponents";

const decisionTree = [
  { activity: "Residential or commercial agent / broker", code: "531210", desc: "Offices of Real Estate Agents and Brokers" },
  { activity: "Residential property management", code: "531311", desc: "Residential Property Managers" },
  { activity: "Non-residential property management", code: "531312", desc: "Nonresidential Property Managers" },
  { activity: "Property ownership entity", code: "varies", desc: "Based on property type and activity" },
  { activity: "Administrative / financial operations entity", code: "based on primary activity", desc: "Reflects legitimate primary services performed" },
];

const Ch07 = () => (
  <section id="chapter-7" className="scroll-mt-20 container mx-auto px-4 py-16">
    <div className="max-w-4xl mx-auto">
      <ChapterHeader number="CHAPTER 7" title="The NAICS code question" />

      <Paragraph>Your NAICS code should describe what your business <em>actually does</em>. Sounds obvious. But this is one of the most common places real estate professionals get pushed toward bad advice.</Paragraph>

      <SectionHeading>Common Realtor NAICS codes</SectionHeading>
      <div className="my-6 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_8px_18px_rgba(11,31,59,.06)]">
        <table className="w-full text-sm md:text-base">
          <thead className="bg-primary/5 text-secondary">
            <tr>
              <th className="text-left font-semibold px-4 py-3">Activity</th>
              <th className="text-left font-semibold px-4 py-3 w-28">NAICS</th>
              <th className="text-left font-semibold px-4 py-3 hidden md:table-cell">Description</th>
            </tr>
          </thead>
          <tbody>
            {decisionTree.map((row) => (
              <tr key={row.activity} className="border-t border-border">
                <td className="px-4 py-3 text-foreground/90">{row.activity}</td>
                <td className="px-4 py-3 font-mono text-primary font-semibold">{row.code}</td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{row.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <JessieNote>
        <p>You'll hear "just use a code that avoids industry restrictions" from people in online forums. Don't. If the code doesn't match what you actually do, it can invalidate accounts and trigger denials down the road. Some lenders <em>do</em> restrict real estate — the answer is the right lender, not the wrong code.</p>
      </JessieNote>

      <SectionHeading>The RE Pro approach</SectionHeading>
      <ul className="list-disc pl-6 space-y-1 text-base md:text-lg text-foreground/90 my-4">
        <li>Use the proper code that reflects your actual activity.</li>
        <li>Maintain accurate records.</li>
        <li>Explain the business structure clearly.</li>
        <li>Work with lenders who understand real estate professionals.</li>
        <li>Match the business with compatible financial partners.</li>
      </ul>

      <GoodNugget>
        The answer to an industry restriction is not an inaccurate NAICS code. The answer is the right lender for the accurately classified business.
      </GoodNugget>

      <ChapterTakeaway>
        Classify your business honestly. Then choose lenders who fund businesses like yours.
      </ChapterTakeaway>
    </div>
  </section>
);

export default Ch07;