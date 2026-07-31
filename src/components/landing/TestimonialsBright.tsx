import { Quote } from "lucide-react";
import t1 from "@/assets/guide/testimonial-1.jpg";
import t2 from "@/assets/guide/testimonial-2.jpg";
import t3 from "@/assets/landing/testimonial-3.jpg";

const quotes = [
  {
    text: "I stopped putting marketing on my personal Visa. The business has its own line now — and my FICO finally stopped bouncing around.",
    name: "Residential Agent",
    where: "California",
    tone: "bg-primary/10 text-primary",
    avatar: t1,
  },
  {
    text: "I had cash ready when a coaching opportunity came up mid-month. That never used to happen — I always had to wait on the next closing.",
    name: "Team Lead",
    where: "Georgia",
    tone: "bg-sky/15 text-sky",
    avatar: t2,
  },
  {
    text: "Walked away with a written plan. Not a pitch — a plan. I knew exactly what to do Monday morning.",
    name: "New Broker",
    where: "Texas",
    tone: "bg-accent/20 text-accent-foreground",
    avatar: t3,
  },
];

const TestimonialsBright = () => (
  <section className="container mx-auto px-4 py-16 md:py-20">
    <div className="max-w-3xl mx-auto text-center mb-10">
      <h2 className="text-3xl md:text-4xl font-bold text-secondary">What Realtors are saying</h2>
      <p className="mt-3 text-muted-foreground">Early feedback from agents in our program.</p>
    </div>
    <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
      {quotes.map((q) => (
        <figure
          key={q.name + q.where}
          className="bg-card border border-border rounded-2xl p-6 shadow-card flex flex-col"
        >
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${q.tone}`}>
            <Quote className="h-5 w-5" />
          </div>
          <blockquote className="mt-4 text-secondary leading-relaxed flex-1">"{q.text}"</blockquote>
          <figcaption className="mt-4 text-sm text-muted-foreground border-t border-border pt-3 flex items-center gap-3">
            <img
              src={q.avatar}
              alt={`${q.name} headshot`}
              loading="lazy"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover border border-border"
            />
            <span>
              <span className="font-semibold text-secondary">{q.name}</span> · {q.where}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  </section>
);

export default TestimonialsBright;