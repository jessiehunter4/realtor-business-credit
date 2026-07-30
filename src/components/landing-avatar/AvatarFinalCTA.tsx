import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

const AvatarFinalCTA = () => (
  <section className="container mx-auto px-4 pb-16 md:pb-24">
    <div className="relative overflow-hidden bg-hero-grad border border-border rounded-3xl shadow-card text-center px-6 py-14 md:py-20">
      <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-sky/15 blur-3xl pointer-events-none" />
      <div className="relative">
        <h2 className="text-3xl md:text-5xl font-bold text-secondary tracking-tight">
          Start with Step 1.
        </h2>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Read the free guide today. Then build your customized plan and put it into action.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/guide"
            data-analytics-id="avatar-cta-guide-final"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-8 py-4 text-base font-semibold shadow-card hover:shadow-card-hover hover:bg-primary/90 transition-all"
          >
            <BookOpen className="h-5 w-5" />
            Read the Guide
          </Link>
          <Link
            to="/one-on-one"
            data-analytics-id="avatar-cta-book-final"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-sky text-sky-foreground px-8 py-4 text-base font-semibold shadow-card hover:shadow-card-hover hover:bg-sky/90 transition-all"
          >
            <Calendar className="h-5 w-5" />
            Book Free 1:1
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default AvatarFinalCTA;