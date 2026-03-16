import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar } from "lucide-react";

interface CTASectionProps {
  guideLink?: string;
}

const CTASection = ({ guideLink = "/guide" }: CTASectionProps) => {
  return (
    <section className="bg-primary/10 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
            Ready to Protect Your Personal Credit?
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Read the free guide — no sign-up required. Or, if you already know you need this, book a one-on-one session with Jessie to discuss your specific situation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link to={guideLink}>
                <BookOpen className="mr-2 h-5 w-5" />
                Read the Free Guide
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground">
              <Link to="/one-on-one">
                <Calendar className="mr-2 h-5 w-5" />
                Free One-On-One Business Credit Session
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
