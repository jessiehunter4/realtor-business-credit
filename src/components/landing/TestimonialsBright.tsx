import { Quote } from "lucide-react";

const quotes = [
  {
    text: "I had no idea I could even build separate business credit for my real estate practice. The 1:1 made it click in 30 minutes.",
    name: "Residential Agent",
    where: "California",
    tone: "bg-primary/10 text-primary",
  },
  {
    text: "Finally a plan that respects how Realtors actually get paid. The Needs Analysis showed me exactly what to fix first.",
    name: "Team Lead",
    where: "Georgia",
    tone: "bg-sky/15 text-sky",
  },
  {
    text: "Jessie isn't selling anything on the call. He just walks through your situation. I left with a real plan, not a pitch.",
    name: "New Broker",
    where: "Texas",
    tone: "bg-accent/20 text-accent-foreground",
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
          <figcaption className="mt-4 text-sm text-muted-foreground border-t border-border pt-3">
            <span className="font-semibold text-secondary">{q.name}</span> · {q.where}
          </figcaption>
        </figure>
      ))}
    </div>
  </section>
);

export default TestimonialsBright;