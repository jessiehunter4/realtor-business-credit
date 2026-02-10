import roadmapImage from "@/assets/seven-step-roadmap.jpg";

const guideItems = [
  { bold: "Why 90% of Realtors Don't Have Business Credit", rest: " (and what it's costing them)" },
  { bold: "7-Step Checklist to Build Business Credit", rest: " – simplified for busy real estate professionals" },
  { bold: "The SSN vs. EIN Explained", rest: " – how to structure your business properly based on your state" },
  { bold: "Timeline & Expectations", rest: " – realistic timeframes (you can go faster or slower)" },
  { bold: "Personal Founder Story", rest: " – from California/Georgia broker Jessie Hunter who wish someone had told him this 10+ years ago" },
  { bold: "Action Plan Worksheet", rest: " – step-by-step tasks you can complete this week" },
  { bold: "Access to Dual Coaching", rest: " – Realtor Business Credit Coach + Credit Suite Coach" },
  { bold: "Free Fundability Scan", rest: " – see exactly where your business stands right now" },
];

const GuideContentsSection = () => {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-8 flex items-center gap-2">
          📖 What's Inside Your Free Guide + Action Plan
        </h2>

        <ul className="space-y-4 text-lg mb-12">
          {guideItems.map((item) => (
            <li key={item.bold} className="flex items-start gap-3">
              <span className="text-primary text-xl flex-shrink-0">✓</span>
              <span>
                <strong>{item.bold}</strong>{item.rest}
              </span>
            </li>
          ))}
        </ul>

        {/* 7-Step Roadmap Visual */}
        <div className="rounded-xl overflow-hidden shadow-lg">
          <img
            src={roadmapImage}
            alt="7-Step Roadmap to build business credit: Form Entity, Get EIN, Business Bank Account, Business Phone and Address, Credit Profile, Trade Lines, Business Credit Cards"
            className="w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default GuideContentsSection;
