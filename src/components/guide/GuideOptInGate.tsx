import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PhoneInput from "@/components/shared/PhoneInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { mergeContactIdentity } from "@/lib/contactIdentityStore";

interface GuideOptInGateProps {
  onAccessGranted: (contactId: string) => void;
}

const GuideOptInGate = ({ onAccessGranted }: GuideOptInGateProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("submit-lead", {
        body: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          agentType: "unknown",
          state: "unknown",
          wantsFundabilityScan: false,
          source: "GuideOptIn",
        },
      });

      if (error) throw error;

      const returnedContactId = data?.ghlContactId || "";
      const returnedLeadId = data?.leadId || "";

      // Tag with c-clicked-rbc-guide if we got a contactId back
      if (returnedContactId) {
        try {
          await supabase.functions.invoke("tag-ghl-contact", {
            body: { contactId: returnedContactId, tags: ["c-clicked-rbc-guide"] },
          });
        } catch (tagErr) {
          console.error("Failed to tag guide opt-in visitor:", tagErr);
        }
      }

      try {
        localStorage.setItem("rbc_guide_optin_completed", "true");
      } catch {
        // ignore storage errors
      }

      // Persist identity + leadId so the Intake page can prefill and link
      // the survey back to this Lead.
      mergeContactIdentity({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        contactId: returnedContactId,
        leadId: returnedLeadId,
      });

      // Unlock the guide in place. The "Create My Customized Plan" CTA
      // takes them to /intake when they're ready.
      onAccessGranted(returnedContactId);
    } catch (err) {
      console.error("Opt-in submission failed:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md border-primary/20">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <BookOpen className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-2xl text-secondary">
            Read the Free Guide
          </CardTitle>
          <p className="text-muted-foreground text-sm mt-2">
            Enter your info below to get instant access to the complete RE Pro Business Credit Guide &amp; Action Plan.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Mobile Phone</Label>
              <PhoneInput
                id="phone"
                value={phone}
                onChange={(digits) => setPhone(digits)}
                required
              />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                "Get Instant Access"
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">
              We respect your privacy. No spam, ever.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuideOptInGate;
