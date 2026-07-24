import { ChapterHeader, SectionHeading, Paragraph, ChapterTakeaway, JessieNote, GoodNugget, PlanCTAButton } from "../GuideComponents";

const paths = [
  {
    tag: "Free · Freemium",
    title: "Do It Yourself",
    body: "Use the guide, the customized plan, and the RE Pro dashboard to implement at your own pace with limited resources.",
    fit: "Best if you already have time, discipline, and confidence with financial systems.",
  },
  {
    tag: "Paid · Group",
    title: "Cohort",
    body: "Join a small group of fellow real estate pros. Weekly guided implementation, financial-partner introductions, and shared accountability.",
    fit: "Best if you want structure, peer support, and access to vetted resources.",
  },
  {
    tag: "Paid · Premium",
    title: "Cohort + One-on-One Coach",
    body: "Everything in the Cohort plus regular one-on-one sessions with a coach and expanded access to advanced resources and lender relationships.",
    fit: "Best if you want the fastest path with dedicated guidance and expanded resources.",
  },
];

const Ch13 = () => (
  <section id="chapter-13" className="scroll-mt-20 container mx-auto px-4 py-16">
    <div className="max-w-4xl mx-auto">
      <ChapterHeader number="CHAPTER 13" title="Your three implementation options" />

      <Paragraph>Everything in this guide points to one moment: choosing <em>how</em> you'll implement. Reading is step one. Planning is step two. Implementation is where results actually happen — and there are three supported ways to move.</Paragraph>

      <div className="grid md:grid-cols-3 gap-5 my-8">
        {paths.map((p, i) => (
          <div
            key={p.title}
            className={`rounded-2xl border p-6 shadow-[0_8px_20px_rgba(11,31,59,.07)] flex flex-col ${
              i === 1 ? "bg-primary/5 border-primary/40" : "bg-card border-border"
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">{p.tag}</span>
            <h4 className="mt-0 mb-2 text-secondary font-extrabold text-lg">{p.title}</h4>
            <p className="m-0 mb-3 text-sm text-foreground/85 leading-relaxed">{p.body}</p>
            <p className="mt-auto mb-0 text-xs text-muted-foreground italic">{p.fit}</p>
          </div>
        ))}
      </div>

      <SectionHeading>The freemium promise</SectionHeading>
      <Paragraph>The guide is free. The customized plan is free. The RE Pro dashboard is free. My goal is not to gate the foundation — it's to make sure thousands of real estate pros across the country finally have a properly structured business with real access to capital. Everything paid comes <em>after</em> that foundation is in place, and only if you decide a supported path is right for you.</Paragraph>

      <JessieNote>
        <p>I built this because I wish someone had built it for me in 2010. If you take nothing else from this guide, take this: your business deserves the same financial care and structure you give to your clients' transactions. Start with the plan. Everything else follows from there.</p>
      </JessieNote>

      <GoodNugget>
        The best time to build access to capital is <em>before</em> your business urgently needs it. The second-best time is today.
      </GoodNugget>

      <div className="my-10 text-center">
        <PlanCTAButton />
        <p className="mt-3 text-xs text-muted-foreground">Free · 5 quick steps · Your custom plan generates instantly</p>
      </div>

      <ChapterTakeaway>
        Guide. Plan. Implement. You've read the guide — the next step is your plan. Everything else follows.
      </ChapterTakeaway>
    </div>
  </section>
);

export default Ch13;