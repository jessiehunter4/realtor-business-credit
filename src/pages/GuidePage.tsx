import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Calendar } from "lucide-react";

const GuidePage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Sticky CTA Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-secondary/95 backdrop-blur-sm border-b border-border shadow-lg">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-secondary-foreground font-semibold text-sm md:text-base">
            Realtor Business Credit
          </span>
          <Button asChild size="sm" className="text-sm">
            <Link to="/get_started">
              <Calendar className="mr-2 h-4 w-4" />
              Book a One-on-One Session
            </Link>
          </Button>
        </div>
      </div>

      {/* Cover Section */}
      <section className="bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground pt-24 pb-20 md:pt-28 md:pb-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            What Every Realtor Should Know<br />
            <span className="text-primary">About Business Credit</span>
          </h1>
          <p className="text-lg md:text-xl mb-2 text-secondary-foreground/80 italic">
            And Why 90% Never Find Out
          </p>
          <p className="text-base text-secondary-foreground/70 mt-6">
            By Jessie Hunter | Real Estate Broker | California & Georgia<br />
            Founder, Realtor Business Credit
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-primary/10 border-l-4 border-primary p-8 rounded-lg mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-4">
              Congratulations on Your Recent Closing
            </h2>
            <div className="space-y-4 text-lg">
              <p>You just closed a deal. That commission check is hitting your account. It feels good, doesn't it?</p>
              <p>But let me ask you something: <strong>Where does that money actually go?</strong></p>
              <p>If you're like most real estate professionals, here's the reality of a $15,000 commission:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>$4,500 to taxes (30%)</li>
                <li>$2,250 to your broker split</li>
                <li>You're down to $8,250</li>
                <li>Then subtract: $2,000 marketing, $500 tech, $300 gas, $200 staging</li>
                <li><strong>You actually keep: $5,250</strong></li>
              </ul>
            </div>
          </div>

          <div className="bg-destructive/10 border-l-4 border-destructive p-8 rounded-lg mb-12">
            <p className="text-lg"><strong>You probably charged $3,000 or more of those business expenses on YOUR personal credit card this month.</strong></p>
            <p className="text-lg mt-3">Your credit utilization jumped 30%. Your personal credit score drops 20 points. This affects YOUR mortgage rate, YOUR car loan, YOUR ability to refinance—everything in YOUR personal financial life.</p>
            <p className="text-lg mt-3">Nobody told you there was a better way. <strong>Nobody told you about business credit.</strong></p>
          </div>
        </div>
      </section>

      {/* Chapter 1: My Story */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-8">
              Chapter 1: My Story — The $8,000 Mistake
            </h2>

            <div className="bg-card p-8 rounded-xl shadow-sm border border-border space-y-4 text-lg">
              <p>I'm Jessie Hunter. I've been a real estate broker since 2010, licensed in California and Georgia. Over 15+ years, through hundreds of transactions, countless trainings, and certifications — <strong>not once did anyone suggest building separate business credit for my real estate business.</strong></p>

              <p>When I started Good Tenants Services, Inc., I needed capital. Here's what I did:</p>

              <div className="bg-destructive/5 border border-destructive/20 p-6 rounded-lg my-4">
                <p><strong>First:</strong> Maxed out personal credit cards. Interest rates: 18–24%.</p>
                <p><strong>Then:</strong> Took out a personal loan at a higher rate (because my score had dropped).</p>
                <p><strong>Finally:</strong> Tapped my home equity.</p>
                <p className="mt-3 font-bold">Total unnecessary cost: $8,000+</p>
              </div>

              <p>If someone had told me about business credit in 2010, I could have spent 9–12 months building it, financed my business without touching personal credit, and kept my family's financial security intact.</p>

              <p className="italic text-secondary font-semibold">That's why I created this guide — so you don't have to learn the hard way.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 2: What Business Credit Is */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-8">
            Chapter 2: What Business Credit Actually Is
          </h2>

          <div className="space-y-4 text-lg">
            <p>Business credit is a credit profile for YOUR business that's completely separate from YOUR personal credit. Just like you have a personal FICO score based on your SSN, your business can have its own credit scores based on its EIN.</p>

            <p>The three major business credit bureaus are:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Dun & Bradstreet (D&B)</li>
              <li>Experian Business</li>
              <li>Equifax Small Business</li>
            </ul>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-primary mb-4">✅ With Business Credit</h3>
              <ul className="space-y-2 text-foreground">
                <li>• Business expenses go on business cards</li>
                <li>• Don't appear on personal credit report</li>
                <li>• Personal utilization stays low</li>
                <li>• Personal credit score stays protected</li>
                <li>• More capital with less personal risk</li>
              </ul>
            </div>
            <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-destructive mb-4">❌ Without Business Credit</h3>
              <ul className="space-y-2 text-foreground">
                <li>• All expenses on personal cards</li>
                <li>• Utilization spikes</li>
                <li>• Personal credit score drops</li>
                <li>• Affects mortgage, car loans, refinancing</li>
                <li>• Personal finances at risk</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 3: The True Cost */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-8">
              Chapter 3: The True Cost of Using Personal Credit
            </h2>

            <div className="space-y-4 text-lg">
              <p>Let's look at what it actually costs when you use personal credit for business:</p>

              <div className="bg-accent/10 border-l-4 border-accent p-6 rounded-lg">
                <h3 className="font-bold text-secondary mb-3">The $15,000 Commission Example</h3>
                <p>If you charge $3,000/month in business expenses to personal credit:</p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Credit utilization jumps 30%+</li>
                  <li>Credit score drops 20–50 points</li>
                  <li>Higher interest on your mortgage costs $200+/month more</li>
                  <li>Over a career: <strong>$50,000–$260,000+ in unnecessary costs</strong></li>
                </ul>
              </div>

              <p>Every month you wait to establish business credit is costing you real money — money that could be building wealth for your family.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 4: Common Questions */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-8">
            Chapter 4: Common Questions & Objections
          </h2>

          <div className="space-y-6">
            {[
              { q: '"But I\'m just an agent, not a business."', a: "If you earn commissions, spend money on marketing, technology, or travel for work — you ARE a business. You're an independent contractor running a business, whether you've formally structured it that way or not." },
              { q: '"My broker handles everything."', a: "Your broker provides a brand and maybe some support. But YOUR marketing costs, YOUR tech subscriptions, YOUR gas, YOUR staging — those are YOUR business expenses. And they're on YOUR personal credit right now." },
              { q: '"I\'ll do this when I\'m more established."', a: "Building business credit takes 9–12 months. Starting now means you'll have it when you need it. Waiting means you'll need it before you have it — just like I did." },
              { q: '"I can\'t afford it right now."', a: "You can't afford NOT to do it. Every month you wait costs you in higher personal interest rates, lower credit scores, and limited growth options. The investment pays for itself." },
            ].map((item, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-xl font-bold text-secondary mb-3">{item.q}</h3>
                <p className="text-lg text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chapter 5: The Seven-Step Process */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary text-center mb-4">
              Chapter 5: The Seven-Step Process
            </h2>
            <p className="text-center text-lg text-muted-foreground mb-12">
              Understanding what's involved — and why this isn't a DIY project.
            </p>

            <div className="space-y-6">
              {[
                { title: "Choose the Right Business Structure", desc: "LLC, S-Corp, or C-Corp depending on your state's regulations. Work with an attorney or tax professional." },
                { title: "Get Your EIN", desc: "Your business's Social Security number. Apply for free through the IRS — takes about 15 minutes." },
                { title: "Open a Business Bank Account", desc: "Run ALL business transactions through this account. This creates the paper trail you need." },
                { title: "Get a Business Phone & Address", desc: "Dedicated business line (Google Voice works) and consistent business address across all directories." },
                { title: "Build Your Business Credit Profile", desc: "Register with Dun & Bradstreet, Experian Business, and Equifax Small Business." },
                { title: "Establish Vendor Trade Lines", desc: "Start with vendors that report to business credit bureaus — Uline, Quill, Grainger, and others." },
                { title: "Apply for Business Credit Cards", desc: "Once you have 3–5 trade lines reporting, apply for cards that report to business bureaus." },
              ].map((step, i) => (
                <div key={i} className="bg-card p-6 rounded-xl shadow-sm border border-border">
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center text-primary font-bold text-sm">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-secondary mb-2">{step.title}</h3>
                      <p className="text-muted-foreground text-lg">{step.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-accent/10 border-l-4 border-accent p-6 rounded-lg">
              <p className="text-lg">
                <strong>Think of it like a real estate transaction:</strong> You COULD try to buy a house without an agent. But why would you? The process is complex, mistakes are expensive, and having a professional guide you through it saves time, money, and stress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 6: The Emotional Journey */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-8">
            Chapter 6: The Emotional Journey
          </h2>

          <div className="space-y-6">
            {[
              { month: "Month 1: The Relief Phase", desc: "You've made the decision. You've started the process. There's an immediate sense of relief — you're finally doing something about this." },
              { month: "Months 2–3: The Waiting Game", desc: "You've set everything up. Now you're waiting for trade lines to report and scores to build. It can feel slow. Your coaches keep you on track." },
              { month: "Months 4–5: The Momentum Shift", desc: "Your first business credit cards arrive. You start seeing real numbers. The separation between personal and business becomes tangible." },
              { month: "Month 6+: The Freedom Feeling", desc: "You're charging business expenses to business credit. Your personal utilization drops. Your personal score starts climbing. You have options you didn't have before." },
            ].map((phase, i) => (
              <div key={i} className="border-l-4 border-primary pl-6">
                <h3 className="text-xl font-bold text-secondary mb-2">{phase.month}</h3>
                <p className="text-lg text-muted-foreground">{phase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chapter 7: Why Professional Guidance */}
      <section className="bg-secondary text-secondary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Chapter 7: Why You Need Professional Guidance
            </h2>

            <div className="space-y-6 text-lg">
              <p><strong>The Dual Coach System:</strong></p>
              <p><strong className="text-primary">Realtor Business Credit Coach</strong> — Someone who understands licensing requirements, broker arrangements, and the unique financial needs of agents. That's me.</p>
              <p><strong className="text-primary">Credit Suite Coach</strong> — An expert in building business credit profiles, establishing tradelines, and navigating the credit system. They know exactly which vendors to use, which cards to apply for, and when.</p>
              <p>Together, we create a customized plan for YOUR specific situation — whether you're residential, commercial, or working in multiple states.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Your Choice */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-8 text-center">
            You Have a Choice
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-8">
              <h3 className="text-xl font-bold text-destructive mb-4">Path 1: Continue As Is</h3>
              <p className="text-muted-foreground mb-4">Keep using personal credit for business. Keep risking your score, your refinancing options, your family's financial security.</p>
              <p className="font-bold text-destructive">Cost: $5,000–$26,000 per year</p>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-xl p-8">
              <h3 className="text-xl font-bold text-primary mb-4">Path 2: Establish Business Credit</h3>
              <p className="text-muted-foreground mb-4">Take 9–12 months to build it properly. Separate finances. Protect personal credit. Access more capital.</p>
              <p className="font-bold text-primary">Investment: One-time. Payoff: Permanent.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-primary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
              Your Next Step
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              If you've read this far and thought, "This makes sense. I need to do this" — let's talk about YOUR specific situation. No obligation. No pressure. Just a realtor-to-realtor business conversation.
            </p>

            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/get_started">
                <Calendar className="mr-2 h-5 w-5" />
                Book Your Free One-on-One Session
              </Link>
            </Button>

            <p className="text-sm text-muted-foreground mt-6 italic">
              5 minutes for the scan. 30 minutes for our conversation. Complete clarity on your path forward.
            </p>

            <p className="mt-8 text-secondary font-semibold italic">
              "Don't wait another 10 years like I did."
              <br />
              <span className="text-primary">— Jessie Hunter, Broker | California & Georgia</span>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="bg-secondary py-8">
        <div className="container mx-auto px-4 text-center text-secondary-foreground/60 text-sm">
          <p>© 2026 RealtorBusinessCredit.com | All Rights Reserved</p>
          <p className="mt-2">This guide is provided for educational purposes. Consult with appropriate professionals before making business structure decisions.</p>
        </div>
      </section>
    </div>
  );
};

export default GuidePage;
