import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MessageSquare, Mail, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SMS_CONSENT_TEXT } from "@/lib/messagingConsent";

interface LeadPrefs {
  id: string;
  email_consent: boolean;
  sms_consent: boolean;
}

/** Lets a signed-in visitor turn email and text messages on or off. */
const MessagePreferencesCard = () => {
  const [lead, setLead] = useState<LeadPrefs | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<"sms" | "email" | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("leads")
        .select("id, email_consent, sms_consent")
        .limit(1)
        .maybeSingle();
      if (!active) return;
      setLead((data as LeadPrefs | null) ?? null);
      setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  const update = async (field: "sms" | "email", value: boolean) => {
    if (!lead || saving) return;
    setSaving(field);
    const now = new Date().toISOString();
    const patch =
      field === "sms"
        ? value
          ? { sms_consent: true, sms_consent_at: now, sms_consent_source: "dashboard", sms_consent_text: SMS_CONSENT_TEXT, sms_eligible: true, sms_opted_out_at: null }
          : { sms_consent: false, sms_eligible: false, sms_opted_out_at: now }
        : { email_consent: value, email_consent_at: value ? now : null };

    const { error } = await supabase.from("leads").update(patch).eq("id", lead.id);
    setSaving(null);
    if (error) {
      toast.error("Couldn't save your preference. Please try again.", {
        id: `pref-${field}`,
      });
      return;
    }
    setLead({ ...lead, [field === "sms" ? "sms_consent" : "email_consent"]: value });
    const message =
      field === "email"
        ? value
          ? "Email preferences saved"
          : "Email updates turned off"
        : value
          ? "Text update preferences saved"
          : "Text updates turned off";
    toast.success(message, { id: `pref-${field}` });
  };

  if (loading || !lead) return null;

  return (
    <Card>
      <CardContent className="p-5 sm:p-6 space-y-5">
        <h2 className="text-lg font-semibold text-secondary">Message preferences</h2>

        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <Label htmlFor="emailPref" className="text-sm font-medium">Email updates</Label>
              <p className="text-xs text-muted-foreground">Your guide, plan updates, and program news.</p>
            </div>
          </div>
          <Switch
            id="emailPref"
            checked={lead.email_consent}
            disabled={saving === "email"}
            aria-busy={saving === "email"}
            onCheckedChange={(v) => update("email", v)}
          />
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <MessageSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <Label htmlFor="smsPref" className="text-sm font-medium">Text messages</Label>
              <p className="text-xs text-muted-foreground">
                Msg &amp; data rates may apply. You can also reply STOP to any text.
              </p>
            </div>
          </div>
          <Switch
            id="smsPref"
            checked={lead.sms_consent}
            disabled={saving === "sms"}
            aria-busy={saving === "sms"}
            onCheckedChange={(v) => update("sms", v)}
          />
        </div>

        <p aria-live="polite" className="text-xs text-muted-foreground flex items-center gap-2 min-h-4">
          {saving && (
            <>
              <Loader2 className="h-3 w-3 animate-spin" /> Saving…
            </>
          )}
        </p>
      </CardContent>
    </Card>
  );
};

export default MessagePreferencesCard;
