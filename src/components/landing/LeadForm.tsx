import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Mail, CreditCard, Target } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import PhoneInput from "@/components/shared/PhoneInput";
import { mergeContactIdentity } from "@/lib/contactIdentityStore";
import SmsConsentCheckbox from "@/components/shared/SmsConsentCheckbox";
import { SMS_CONSENT_TEXT } from "@/lib/messagingConsent";

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
  const formRef = useRef<HTMLFormElement>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: defaultValues.firstName,
    lastName: defaultValues.lastName,
    email: defaultValues.email,
    phone: defaultValues.phone,
    agentType: "residential-agent",
    state: defaultValues.state,
    optIn: false,
    fundabilityScan: false,
    smsConsent: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.optIn) {
      setFormError("Please confirm you consent to be contacted before submitting the form.");
      toast.error("Please consent to be contacted to continue.");
      formRef.current?.querySelector<HTMLElement>("#optIn")?.focus();
      return;
    }
    setFormError(null);
    try {
      const { data, error } = await supabase.functions.invoke("submit-lead", {
        body: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          agentType: formData.agentType,
          state: formData.state,
          wantsFundabilityScan: formData.fundabilityScan,
          ghlContactId: defaultValues.contactId || undefined,
          emailConsent: formData.optIn,
          smsConsent: formData.smsConsent,
          smsConsentText: formData.smsConsent ? SMS_CONSENT_TEXT : undefined,
          smsConsentSource: "LandingPageLeadForm",
        },
      });
      if (error) {
        console.error("Error submitting lead:", error);
        setFormError("We couldn't submit your form. Please check your details and try again.");
        toast.error("Failed to submit form. Please try again.");
        return;
      }
      mergeContactIdentity({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        contactId: (data?.ghlContactId as string) || defaultValues.contactId || "",
        leadId: (data?.leadId as string) || "",
      });
      toast.success("Thank you! Your guide is on the way!");
      navigate("/guide");
    } catch (error) {
      console.error("Error:", error);
      setFormError("Something went wrong while submitting your form. Please try again.");
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

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate={false}
          aria-describedby="leadFormInstructions"
          className="space-y-6 bg-card p-8 rounded-xl shadow-lg border border-border"
        >
          <p id="leadFormInstructions" className="text-sm text-muted-foreground">
            Fields marked with an asterisk (*) are required.
          </p>
          <div aria-live="assertive" role="alert">
            {formError && (
              <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
                {formError}
              </p>
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input id="firstName" required aria-required="true" autoComplete="given-name" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input id="lastName" required aria-required="true" autoComplete="family-name" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input id="email" type="email" required aria-required="true" autoComplete="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <PhoneInput
              id="phone"
              required
              aria-required="true"
              aria-describedby="phoneHint"
              value={formData.phone}
              onChange={(digits) => setFormData({ ...formData, phone: digits })}
            />
            <p id="phoneHint" className="text-xs text-muted-foreground">
              10-digit US mobile number, formatted automatically as you type.
            </p>
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
              <Input id="state" required aria-required="true" placeholder="e.g., California, Georgia" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="optIn"
                checked={formData.optIn}
                onCheckedChange={(checked) => setFormData({ ...formData, optIn: checked as boolean })}
                required
                aria-required="true"
                aria-invalid={formError ? true : undefined}
              />
              <label htmlFor="optIn" className="text-sm leading-relaxed cursor-pointer">
                Yes! Email me the complete guide with action plan and information about the launch special. I can unsubscribe anytime. *
              </label>
            </div>
            <SmsConsentCheckbox
              phone={formData.phone}
              checked={formData.smsConsent}
              onCheckedChange={(checked) => setFormData({ ...formData, smsConsent: checked })}
            />
            <div className="flex items-start space-x-3">
              <Checkbox id="fundabilityScan" checked={formData.fundabilityScan} onCheckedChange={(checked) => setFormData({ ...formData, fundabilityScan: checked as boolean })} />
              <label htmlFor="fundabilityScan" className="text-sm leading-relaxed cursor-pointer">
                I'd also like to complete the RE Pro Business Financial Needs Analysis and get my custom plan.
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
