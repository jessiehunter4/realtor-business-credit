import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Mail, CreditCard, Target } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import PhoneInput from "@/components/shared/PhoneInput";

interface LeadFormProps {
  defaultValues: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    state: string;
    contactId: string;
  };
}

const LeadForm = ({ defaultValues }: LeadFormProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: defaultValues.firstName,
    lastName: defaultValues.lastName,
    email: defaultValues.email,
    phone: defaultValues.phone,
    agentType: "residential-agent",
    state: defaultValues.state,
    optIn: false,
    fundabilityScan: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.optIn) {
      toast.error("Please consent to be contacted to continue.");
      return;
    }
    try {
      const { error } = await supabase.functions.invoke("submit-lead", {
        body: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          agentType: formData.agentType,
          state: formData.state,
          wantsFundabilityScan: formData.fundabilityScan,
          ghlContactId: defaultValues.contactId || undefined,
        },
      });
      if (error) {
        console.error("Error submitting lead:", error);
        toast.error("Failed to submit form. Please try again.");
        return;
      }
      toast.success("Thank you! Your guide is on the way!");
      navigate("/guide");
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-secondary text-center mb-4">
          Get Your Free Guide + Action Plan Now
        </h2>
        <p className="text-center text-muted-foreground mb-8">
          Download instantly + receive via email. No credit card required.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-xl shadow-lg border border-border">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input id="firstName" required value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input id="lastName" required value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input id="email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <PhoneInput id="phone" required value={formData.phone} onChange={(digits) => setFormData({ ...formData, phone: digits })} />
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
              <Input id="state" required placeholder="e.g., California, Georgia" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox id="optIn" checked={formData.optIn} onCheckedChange={(checked) => setFormData({ ...formData, optIn: checked as boolean })} required />
              <label htmlFor="optIn" className="text-sm leading-relaxed cursor-pointer">
                Yes! Send me the complete guide with action plan and information about the launch special. I consent to be contacted by My Better Business Credit via email, phone, or text message. *
              </label>
            </div>
            <div className="flex items-start space-x-3">
              <Checkbox id="fundabilityScan" checked={formData.fundabilityScan} onCheckedChange={(checked) => setFormData({ ...formData, fundabilityScan: checked as boolean })} />
              <label htmlFor="fundabilityScan" className="text-sm leading-relaxed cursor-pointer">
                I'd also like to book a free 1:1 to complete the Realtor Business Financial Needs Analysis and get my custom plan.
              </label>
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full text-lg">
            Download My Free Guide + Claim Launch Special →
          </Button>
        </form>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[
            { icon: Shield, label: "Secure & Private" },
            { icon: Mail, label: "Instant Email Delivery" },
            { icon: CreditCard, label: "No Credit Card" },
            { icon: Target, label: "Built for Realtors" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="text-center">
              <Icon className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-sm font-medium">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeadForm;
