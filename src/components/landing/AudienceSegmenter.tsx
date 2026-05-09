import { User, Users, Sparkles } from "lucide-react";

const audiences = [
  {
    icon: User,
    title: "Solo Agent",
    blurb: "You handle every closing yourself and float marketing on personal cards.",
    fit: "Best fit: build separate business credit before utilization hurts your scores.",
    anchor: "#problems",
  },
  {
    icon: Users,
    title: "Team Lead or Broker",
    blurb: "You're paying for staff, tools, and lead gen — and the business needs its own balance sheet.",
    fit: "Best fit: structure entity, scale tradelines, unlock higher business limits.",
    anchor: "#guide-contents",
  },
  {
    icon: Sparkles,
    title: "Newer Agent (under 2 years)",
    blurb: "You're early enough to set this up the right way from day one.",
    fit: "Best fit: get your foundation right before you owe yourself thousands in cleanup.",
    anchor: "#cta",
  },
];

const AudienceSegmenter = () => (
  <section className="container mx-auto px-4 py-12 md:py-16">
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold text-secondary text-center mb-3">
        Is this for me?
      </h2>
      <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
        Pick the description that sounds most like you. The path is the same — the
        urgency is different.
      </p>
      <div className="grid md:grid-cols-3 gap-6">
        {audiences.map(({ icon: Icon, title, blurb, fit, anchor }) => (
          <a
            key={title}
            href={anchor}
            className="group bg-card border border-border rounded-xl p-6 hover:border-primary hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-secondary mb-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-foreground/80 mb-3 leading-relaxed">{blurb}</p>
            <p className="text-sm text-primary font-medium">{fit}</p>
          </a>
        ))}
      </div>
    </div>
  </section>
);

export default AudienceSegmenter;