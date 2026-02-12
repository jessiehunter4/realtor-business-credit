import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, CheckCircle, Clock, MessageSquare, Shield } from "lucide-react";

const GetStartedPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-secondary text-secondary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            Let's Talk About <span className="text-primary">Your</span> Business Credit
          </h1>
          <p className="text-lg md:text-xl text-secondary-foreground/80 max-w-2xl mx-auto">
            A free, no-pressure conversation between two real estate professionals. In 30 minutes, you'll know exactly where you stand and what your next steps should be.
          </p>
        </div>
      </section>

      {/* What Happens in the Session */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-secondary mb-10 text-center">
            Here's Exactly What Happens
          </h2>

          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-secondary mb-2">
                  First 5 Minutes: Your Fundability Scan
                </h3>
                <p className="text-muted-foreground text-lg">
                  We'll run your Fundability Scan together, live. This shows you exactly where your business stands right now for credit purposes — what's working, what's not, and what needs attention.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-secondary mb-2">
                  Next 10–15 Minutes: Your Situation
                </h3>
                <p className="text-muted-foreground text-lg">
                  We'll discuss what prompted you to look into business credit, your current business structure, your state's regulations, and your goals.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-secondary mb-2">
                  Final 10–15 Minutes: Your Customized Next Steps
                </h3>
                <p className="text-muted-foreground text-lg">
                  Based on your specific situation, I'll outline what business structure makes sense for you, what your timeline would look like, and what your next steps should be.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-secondary mb-8 text-center">
              If You Decide to Move Forward
            </h2>
            <p className="text-center text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
              You'll join the Credit Suite Business Credit Builder program with two dedicated coaches at your side. Here's what's included:
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-bold text-secondary mb-4 text-lg">Fundability</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex gap-2 items-start"><CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" /> 411 Credibility Listing</li>
                  <li className="flex gap-2 items-start"><CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" /> EIN & Entity Setup Assistance</li>
                  <li className="flex gap-2 items-start"><CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" /> Business Name Fundability Check™</li>
                  <li className="flex gap-2 items-start"><CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" /> Bank & Merchant Account Setup</li>
                  <li className="flex gap-2 items-start"><CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" /> Address Fundability Check™</li>
                  <li className="flex gap-2 items-start"><CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" /> Website & Email Check™</li>
                  <li className="flex gap-2 items-start"><CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" /> Business Phone Check™</li>
                </ul>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-bold text-secondary mb-4 text-lg">Funding Access</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex gap-2 items-start"><CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" /> Fix Damaged Business Credit</li>
                  <li className="flex gap-2 items-start"><CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" /> Credit & Score Training</li>
                  <li className="flex gap-2 items-start"><CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" /> D&B, Experian & Equifax Setup</li>
                  <li className="flex gap-2 items-start"><CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" /> High-Limit Store Credit Cards</li>
                  <li className="flex gap-2 items-start"><CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" /> Auto Vehicle Financing</li>
                  <li className="flex gap-2 items-start"><CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" /> Fleet Credit Cards</li>
                  <li className="flex gap-2 items-start"><CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" /> High-Limit Cash Credit Cards</li>
                  <li className="flex gap-2 items-start"><CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" /> Starter & Advanced Vendors</li>
                </ul>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-bold text-secondary mb-4 text-lg">Financing & Support</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex gap-2 items-start"><CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" /> 24/7 Mobile Access</li>
                  <li className="flex gap-2 items-start"><CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" /> Unsecured, No-Doc, 0% Financing</li>
                  <li className="flex gap-2 items-start"><CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" /> 12-Month Business Advisor Support</li>
                  <li className="flex gap-2 items-start"><CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" /> Auto Financing — No Personal Guarantee</li>
                  <li className="flex gap-2 items-start"><CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" /> Business Loans within 72 Hours</li>
                  <li className="flex gap-2 items-start"><CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" /> Loans at 5% and Less</li>
                  <li className="flex gap-2 items-start"><CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" /> 5-Year Finance Specialist Support</li>
                  <li className="flex gap-2 items-start"><CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" /> LexisNexis & ChexSystems Reports</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 bg-primary/10 border border-primary/30 rounded-xl p-6 text-center">
              <p className="text-lg font-semibold text-secondary mb-1">
                <Shield className="inline-block w-5 h-5 mr-2 text-primary" />
                Plus: Your Realtor Business Credit Coach (Included at No Extra Cost)
              </p>
              <p className="text-muted-foreground">
                A dedicated coach who understands real estate licensing, broker arrangements, and the unique financial needs of agents and brokers. That's me — Jessie Hunter.
              </p>
            </div>

            <p className="text-center text-muted-foreground mt-6">
              Single-pay and monthly payment options available. We'll discuss what works for your situation during our session.
            </p>
          </div>
        </div>
      </section>

      {/* Book CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-secondary mb-4">
            Book Your Free Session
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            5 minutes for the scan. 30 minutes for our conversation. Complete clarity on your path forward.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <a href="https://realtorbusinesscredit.com/get_started" target="_blank" rel="noopener noreferrer">
                <Calendar className="mr-2 h-5 w-5" />
                Schedule Your Session
              </a>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground italic">
            Limited availability. No obligation. No pressure. Just a straightforward business conversation between two real estate professionals.
          </p>

          <div className="mt-10 border-t border-border pt-8">
            <p className="text-muted-foreground mb-4">Haven't read the guide yet?</p>
            <Button asChild variant="outline" size="lg">
              <Link to="/guide">
                <BookOpen className="mr-2 h-5 w-5" />
                Read the Free Guide First
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Founder Note */}
      <section className="bg-secondary py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-secondary-foreground">
            <p className="text-lg italic mb-4 text-secondary-foreground/90">
              "I remember what it felt like to discover business credit at age 40, after 10+ years in real estate. I can't change my past. But I can help you avoid repeating it."
            </p>
            <p className="font-bold text-primary">
              — Jessie Hunter, Broker | California & Georgia
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GetStartedPage;
