import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Shield, Mail, CreditCard, Target } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    agentType: "",
    state: "",
    optIn: false,
    fundabilityScan: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.optIn) {
      toast.error("Please consent to be contacted to continue.");
      return;
    }

    // TODO: Integrate with backend and GoHighLevel
    toast.success("Thank you! Your guide is on the way!");
    navigate("/guide");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-6">
            <span className="text-2xl md:text-3xl font-bold text-navy">Realtor</span>
            <span className="text-2xl md:text-3xl font-bold text-primary"> Business Credit</span>
          </div>
          <p className="text-sm md:text-base text-muted-foreground mb-8">
            My Plan. My Progress. My Better Business Credit.
          </p>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-navy mb-6 leading-tight">
            Congratulations on Your Recent Closing!<br />
            <span className="text-primary">Now Is the Perfect Time to Build Your Business Credit</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            You just earned a commission. Don't let it all go to expenses on your personal credit. Discover how to separate your business finances and unlock growth capital.
          </p>
        </div>
      </section>

      {/* Timing Box */}
      <section className="bg-accent/10 border-l-4 border-accent py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-accent-foreground mb-4 flex items-center gap-2">
              ⏰ Why Right After a Closing Is THE Best Time
            </h2>
            <p className="text-lg text-accent-foreground/90">
              You have cash flow, momentum, and a fresh reminder of why you're building this business. Strike while the iron is hot—start building business credit that protects your personal finances and fuels your next level of success.
            </p>
          </div>
        </div>
      </section>

      {/* Truth Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
            Here's the Truth Most Realtors Don't Know
          </h2>
          <div className="space-y-4 text-lg text-foreground/80 mb-8">
            <p>
              In over a decade as a real estate broker completing hundreds of transactions, attending dozens of trainings, and even taking commission advances—<strong className="text-navy">not once did anyone tell me I could build separate business credit.</strong>
            </p>
            <p>
              I was using my personal credit for everything. Marketing. Technology. Staging. Putting my personal financial life at risk without realizing there was a better way.
            </p>
            <p className="text-xl font-semibold text-navy">
              You don't have to make the same mistake.
            </p>
          </div>
        </div>
      </section>

      {/* Problems Grid */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-navy text-center mb-12">
            The Problem: You're Leaving Money on the Table
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="bg-card p-8 rounded-xl shadow-sm border border-border">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-navy mb-3">Risk Your Personal Assets</h3>
              <p className="text-foreground/80">
                Every business expense on your personal credit puts your home, car, and family finances at risk.
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-xl shadow-sm border border-border">
              <div className="text-4xl mb-4">📉</div>
              <h3 className="text-xl font-bold text-navy mb-3">Damage Personal Credit</h3>
              <p className="text-foreground/80">
                High utilization from business expenses tanks your personal credit score—affecting everything you buy personally.
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-xl shadow-sm border border-border">
              <div className="text-4xl mb-4">🚫</div>
              <h3 className="text-xl font-bold text-navy mb-3">Limited Growth Capital</h3>
              <p className="text-foreground/80">
                Personal credit limits restrict how much you can invest in marketing, tools, and team—capping your income potential.
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-xl shadow-sm border border-border">
              <div className="text-4xl mb-4">💸</div>
              <h3 className="text-xl font-bold text-navy mb-3">Tax Nightmares</h3>
              <p className="text-foreground/80">
                Mixed personal and business expenses make accounting complicated, expensive, and audit-prone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What's Inside */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-8 flex items-center gap-2">
            📖 What's Inside Your Free Guide + Action Plan
          </h2>
          
          <ul className="space-y-4 text-lg">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl flex-shrink-0">✓</span>
              <span><strong>Why 90% of Realtors Don't Have Business Credit</strong> (and what it's costing them)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl flex-shrink-0">✓</span>
              <span><strong>7-Step Checklist to Build Business Credit</strong> – simplified for busy real estate professionals</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl flex-shrink-0">✓</span>
              <span><strong>The SSN vs. EIN Explained</strong> – how to structure your business properly based on your state</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl flex-shrink-0">✓</span>
              <span><strong>Timeline & Expectations</strong> – realistic timeframes (you can go faster or slower)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl flex-shrink-0">✓</span>
              <span><strong>Personal Founder Story</strong> – from California/Georgia broker Jessie Hunter who wish someone had told him this 10+ years ago</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl flex-shrink-0">✓</span>
              <span><strong>Action Plan Worksheet</strong> – step-by-step tasks you can complete this week</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl flex-shrink-0">✓</span>
              <span><strong>Access to Dual Coaching</strong> – Realtor Business Credit Coach + Credit Suite Coach</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl flex-shrink-0">✓</span>
              <span><strong>Free Fundability Scan</strong> – see exactly where your business stands right now</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Launch Special */}
      <section className="bg-accent/20 border-2 border-accent py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-accent-foreground mb-6">
              🎉 Launch Special - Be Among the First!
            </h2>
            <p className="text-xl mb-4">
              We're just launching this specialized program for residential and commercial real estate professionals.
            </p>
            <p className="text-lg mb-6">Early adopters who download the guide today receive:</p>
            
            <ul className="space-y-3 text-left max-w-2xl mx-auto text-lg">
              <li className="flex items-center gap-3">
                <span className="text-2xl">✓</span>
                <strong>Exclusive launch pricing</strong> (not available later)
              </li>
              <li className="flex items-center gap-3">
                <span className="text-2xl">✓</span>
                <strong>Priority coaching sessions</strong>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-2xl">✓</span>
                <strong>First access</strong> to our proven system
              </li>
              <li className="flex items-center gap-3">
                <span className="text-2xl">✓</span>
                <strong>Direct support</strong> from founder Jessie Hunter
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-navy text-center mb-4">
            Get Your Free Guide + Action Plan Now
          </h2>
          <p className="text-center text-muted-foreground mb-8">
            Download instantly + receive via email. No credit card required.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-xl shadow-lg border border-border">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="agentType">I am a: *</Label>
                <Select required value={formData.agentType} onValueChange={(value) => setFormData({ ...formData, agentType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential-agent">Residential Agent</SelectItem>
                    <SelectItem value="commercial-agent">Commercial Agent</SelectItem>
                    <SelectItem value="residential-broker">Residential Broker</SelectItem>
                    <SelectItem value="commercial-broker">Commercial Broker</SelectItem>
                    <SelectItem value="both">Both Residential & Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state">State of License *</Label>
                <Input
                  id="state"
                  required
                  placeholder="e.g., California, Georgia"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="optIn"
                  checked={formData.optIn}
                  onCheckedChange={(checked) => setFormData({ ...formData, optIn: checked as boolean })}
                  required
                />
                <label htmlFor="optIn" className="text-sm leading-relaxed cursor-pointer">
                  Yes! Send me the complete guide with action plan and information about the launch special. I consent to be contacted by My Better Business Credit via email, phone, or text message. *
                </label>
              </div>
              
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="fundabilityScan"
                  checked={formData.fundabilityScan}
                  onCheckedChange={(checked) => setFormData({ ...formData, fundabilityScan: checked as boolean })}
                />
                <label htmlFor="fundabilityScan" className="text-sm leading-relaxed cursor-pointer">
                  I also want a free fundability scan to see where my business stands right now.
                </label>
              </div>
            </div>
            
            <Button type="submit" size="lg" className="w-full text-lg">
              Download My Free Guide + Claim Launch Special →
            </Button>
          </form>
          
          {/* Trust Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="text-center">
              <Shield className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-sm font-medium">Secure & Private</div>
            </div>
            <div className="text-center">
              <Mail className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-sm font-medium">Instant Email Delivery</div>
            </div>
            <div className="text-center">
              <CreditCard className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-sm font-medium">No Credit Card</div>
            </div>
            <div className="text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-sm font-medium">Built for Realtors</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-navy py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Don't Wait Another 10 Years Like I Did
            </h2>
            <p className="text-lg md:text-xl italic mb-4">
              "I wish someone had told me about business credit when I got my license in 2010. It would have saved me tens of thousands of dollars and protected my family's financial security. That's why I created this guide—so you don't have to learn the hard way."
            </p>
            <p className="font-bold text-lg">
              — Jessie Hunter, Broker | California & Georgia
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
