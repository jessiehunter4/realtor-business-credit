import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Loader2 } from "lucide-react";
import { useContactIdentity } from "@/hooks/useContactIdentity";
import { supabase } from "@/integrations/supabase/client";
import { beaconFunnelEvent, postFunnelEvent } from "@/lib/logFunnelEvent";
import SiteHeader from "@/components/shared/SiteHeader";
import SiteFooter from "@/components/shared/SiteFooter";
import StateEntityWidget from "@/components/shared/StateEntityWidget";
import Seo from "@/components/shared/Seo";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware",
  "Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky",
  "Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi",
  "Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico",
  "New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania",
  "Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
  "Virginia","Washington","West Virginia","Wisconsin","Wyoming","District of Columbia"
];

const GOAL_OPTIONS = [
  "Cover overhead between closings",
  "Grow marketing spend",
  "Hire admin, ISA, or team members",
  "Build reserves / emergency fund",
  "Buy an investment property",
  "Fund brokerage transition or expansion",
  "Reduce reliance on personal credit",
  "Prepare for a slow season",
  "Other",
];

const PAIN_OPTIONS = [
  "Cash flow gap between commissions",
  "High personal credit card balances",
  "No access to business credit",
  "Inconsistent income planning",
  "Debt payoff",
  "Tax bill / quarterly estimates",
  "Other",
];

const HORIZON_OPTIONS = ["0–3 months", "3–6 months", "6–12 months", "12–24 months"];

const FUNDING_AMOUNT_OPTIONS = [
  "Under $10K",
  "$10K–$25K",
  "$25K–$50K",
  "$50K–$100K",
  "$100K–$250K",
  "$250K+",
  "Not sure",
];

const CREDIT_CAPACITY_OPTIONS = [
  "Under $5K",
  "$5K–$10K",
  "$10K–$25K",
  "$25K–$50K",
  "$50K–$100K",
  "$100K+",
  "Not sure",
];

interface SurveyData {
  id?: string;
  status?: string;
  contact_name?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  contact_email?: string;
  // A
  brokerage_name?: string;
  city?: string;
  state?: string;
  license_type?: string;
  years_in_real_estate?: string;
  gci_last_12_months?: string;
  sides_closed_last_12_months?: string;
  // B
  top_financial_goal?: string;
  top_financial_need?: string;
  desired_monthly_credit_capacity?: string;
  primary_goal?: string;
  additional_goals?: string[];
  top_financial_pain?: string;
  goal_time_horizon?: string;
  target_funding_amount?: string;
  goals_notes?: string;
  // C
  has_business_entity?: string;
  entity_type?: string;
  has_business_address?: string;
  address_type?: string;
  has_business_phone?: boolean;
  has_business_email?: boolean;
  has_business_website?: boolean;
  has_business_bank_account?: string;
  uses_accounting_software?: string;
  accounting_software_name?: string;
  // D
  business_credit_cards?: string;
  vendor_tradelines?: string;
  credit_reporting_bureaus?: string[];
  funding_gap_methods?: string[];
  desired_funding_types?: string[];
  personal_guarantee_comfort?: string;
  personal_credit_score_range?: string;
  // E
  preferred_support_format?: string;
  interest_in_cohort?: string;
  preferred_cohort_days?: string;
  investment_readiness?: string;
  additional_notes?: string;
}

export default function IntakeSurveyPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { contactId, email: identityEmail, firstName, lastName } = useContactIdentity();
  const { toast } = useToast();
  const mountLogged = useRef(false);
  const mountTime = useRef(Date.now());

  const isDirectMode = !token;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [form, setForm] = useState<SurveyData>({});
  const [step, setStep] = useState(0);

  // Log intake_started on mount
  useEffect(() => {
    if (mountLogged.current) return;
    mountLogged.current = true;

    void postFunnelEvent({
      contactId: contactId || undefined,
      eventType: "intake_started",
    }).catch((e) => console.error("Failed to log intake_started:", e));

    if (contactId) {
      supabase.functions
        .invoke("tag-ghl-contact", {
          body: { contactId, tags: ["f-intake-started"] },
        })
        .catch((e) => console.error("Failed to tag intake start:", e));
    }

    // Log session on unmount
    return () => {
      const seconds = Math.round((Date.now() - mountTime.current) / 1000);
      const payload = {
        contactId: contactId || undefined,
        eventType: "intake_session",
        metadata: { time_on_page_seconds: seconds },
      };
      const sent = beaconFunnelEvent(payload);
      if (!sent) {
        void postFunnelEvent(payload, { keepalive: true }).catch(() => {});
      }
    };
  }, [contactId]);

  useEffect(() => {
    if (isDirectMode) {
      // Pre-populate from contact identity
      const defaultName = [firstName, lastName].filter(Boolean).join(" ");
      setForm(prev => ({
        ...prev,
        contact_name: prev.contact_name || defaultName || "",
        contact_email: prev.contact_email || identityEmail || "",
      }));
      setLoading(false);
      return;
    }
    fetchSurvey();
  }, [token, isDirectMode, identityEmail, firstName, lastName]);

  const fetchSurvey = async () => {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/functions/v1/intake-survey?token=${token}`,
        { headers: { apikey: SUPABASE_KEY } }
      );
      if (!res.ok) { setNotFound(true); setLoading(false); return; }
      const data = await res.json();
      setForm(data);
      if (data.status === "submitted") setSubmitted(true);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (key: keyof SurveyData, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayField = (key: keyof SurveyData, value: string) => {
    setForm(prev => {
      const arr = (prev[key] as string[] | undefined) || [];
      return { ...prev, [key]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] };
    });
  };

  const handleSubmit = async () => {
    if (isDirectMode && (!form.contact_email || !form.contact_email.trim())) {
      toast({ title: "Email Required", description: "Please enter your email address.", variant: "destructive" });
      setStep(0);
      return;
    }

    setSubmitting(true);
    try {
      let errorMessage = "Failed to submit";

      if (isDirectMode) {
        // Public direct submit
        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/intake-survey?mode=direct`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY },
            body: JSON.stringify(form),
          }
        );
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          errorMessage = data?.error || errorMessage;
          throw new Error(errorMessage);
        }
      } else {
        // Token-based submit
        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/intake-survey?token=${token}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY },
            body: JSON.stringify({ ...form, status: "submitted" }),
          }
        );
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          errorMessage = data?.error || errorMessage;
          throw new Error(errorMessage);
        }
      }

      setSubmitted(true);

      // Log intake_submitted event + tag
      void postFunnelEvent({
        contactId: contactId || undefined,
        eventType: "intake_submitted",
      }).catch((err) => console.error("Failed to log intake_submitted:", err));
      if (contactId) {
        supabase.functions
          .invoke("tag-ghl-contact", {
            body: { contactId, tags: ["f-intake-submitted"] },
          })
          .catch((err) => console.error("Failed to tag intake submit:", err));
      }

      toast({ title: "Survey Submitted", description: "Thank you! We'll review your answers before our session." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const saveDraft = async () => {
    if (isDirectMode) return; // No draft saving in direct mode
    try {
      const res = await fetch(
        `${SUPABASE_URL}/functions/v1/intake-survey?token=${token}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY },
          body: JSON.stringify({ ...form, status: "in_progress" }),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Could not save progress.");
      }

      toast({ title: "Progress Saved", description: "You can return to this link to finish later." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not save progress.";
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound && !isDirectMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2">Survey Not Found</h2>
            <p className="text-muted-foreground">This link may have expired or is invalid. Please contact us for a new link.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-primary mx-auto" />
            <h2 className="text-2xl font-semibold text-foreground">Thank You!</h2>
            <p className="text-muted-foreground">
              Your RE Pro Business Financial Needs Analysis has been submitted. 
              We'll review your answers before our session together.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const steps = [
    { title: "Profile & Production", key: "A" },
    { title: "Goals", key: "B" },
    { title: "Business Structure", key: "C" },
    { title: "Credit & Funding", key: "D" },
    { title: "Program Fit", key: "E" },
  ];

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <SiteHeader />
      <Seo
        title="RE Pro Business Financial Needs Analysis"
        description="A short intake to prepare for your one-on-one business credit session."
        path="/intake"
        noindex
      />
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-secondary">
            RE Pro Business Financial Needs Analysis
          </h1>
          <p className="text-muted-foreground">
            {form.contact_name ? `Welcome, ${form.contact_name}!` : "Welcome!"} Please complete the sections below to help us prepare for your session.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex gap-1">
          {steps.map((s, i) => (
            <button
              key={s.key}
              onClick={() => setStep(i)}
              className={`flex-1 h-2 rounded-full transition-colors ${
                i <= step ? "bg-primary" : "bg-border"
              }`}
              aria-label={s.title}
            />
          ))}
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-foreground">
            Step {step + 1} of {steps.length}: {steps[step].title}
          </p>
          <p className="text-xs text-muted-foreground">
            {isDirectMode
              ? "About 3–5 minutes total. Your answers save when you submit at the end."
              : `About ${Math.max(1, steps.length - step)} min left · Progress saves automatically when you click Save Draft.`}
          </p>
        </div>

        {/* Step A */}
        {step === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Profile & Production</CardTitle>
              <CardDescription>Tell us about your real estate practice.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Name & Email fields (always shown in direct mode, read-only in token mode if pre-filled) */}
              {isDirectMode && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name <span className="text-destructive">*</span></Label>
                    <Input
                      value={form.contact_name || ""}
                      onChange={e => updateField("contact_name", e.target.value)}
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email <span className="text-destructive">*</span></Label>
                    <Input
                      type="email"
                      value={form.contact_email || ""}
                      onChange={e => updateField("contact_email", e.target.value)}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Brokerage / Team Name</Label>
                  <Input value={form.brokerage_name || ""} onChange={e => updateField("brokerage_name", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input value={form.city || ""} onChange={e => updateField("city", e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Select value={form.state || ""} onValueChange={v => updateField("state", v)}>
                  <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                  <SelectContent>
                    {US_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>License Type</Label>
                <RadioGroup value={form.license_type || ""} onValueChange={v => updateField("license_type", v)}>
                  {["Residential Agent", "Commercial Agent", "Residential Broker", "Commercial Broker", "Other"].map(opt => (
                    <div key={opt} className="flex items-center space-x-2">
                      <RadioGroupItem value={opt} id={`lt-${opt}`} />
                      <Label htmlFor={`lt-${opt}`} className="font-normal">{opt}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label>Years in Real Estate</Label>
                <Select value={form.years_in_real_estate || ""} onValueChange={v => updateField("years_in_real_estate", v)}>
                  <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
                  <SelectContent>
                    {["Less than 1 year", "1–3 years", "3–5 years", "5–10 years", "10–15 years", "15+ years"].map(r => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Gross Commission Income (Last 12 Months)</Label>
                  <Select value={form.gci_last_12_months || ""} onValueChange={v => updateField("gci_last_12_months", v)}>
                    <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
                    <SelectContent>
                      {["Under $50K", "$50K–$100K", "$100K–$250K", "$250K–$500K", "$500K–$1M", "Over $1M"].map(r => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Sides Closed (Last 12 Months)</Label>
                  <Select value={form.sides_closed_last_12_months || ""} onValueChange={v => updateField("sides_closed_last_12_months", v)}>
                    <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
                    <SelectContent>
                      {["0–5", "6–12", "13–24", "25–50", "50+"].map(r => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step B */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Goals</CardTitle>
              <CardDescription>Tell us what you want your business to do — pick each goal separately so your plan can be tailored.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Primary financial goal <span className="text-red-600">*</span></Label>
                <p className="text-xs text-muted-foreground">Pick the one goal that matters most right now.</p>
                <RadioGroup value={form.primary_goal || ""} onValueChange={v => {
                  updateField("primary_goal", v);
                  // keep it out of "additional goals"
                  const extras = (form.additional_goals || []).filter(g => g !== v);
                  updateField("additional_goals", extras);
                  // mirror to legacy field for backward compat
                  updateField("top_financial_goal", v);
                }}>
                  {GOAL_OPTIONS.map(opt => (
                    <div key={opt} className="flex items-center space-x-2">
                      <RadioGroupItem value={opt} id={`pg-${opt}`} />
                      <Label htmlFor={`pg-${opt}`} className="font-normal">{opt}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Additional goals (optional)</Label>
                <p className="text-xs text-muted-foreground">Select any other goals that also matter to you.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {GOAL_OPTIONS.filter(o => o !== form.primary_goal).map(opt => {
                    const checked = (form.additional_goals || []).includes(opt);
                    return (
                      <div key={opt} className="flex items-start space-x-2">
                        <Checkbox
                          id={`ag-${opt}`}
                          checked={checked}
                          onCheckedChange={() => {
                            const cur = form.additional_goals || [];
                            const next = cur.includes(opt) ? cur.filter(v => v !== opt) : [...cur, opt];
                            updateField("additional_goals", next);
                          }}
                        />
                        <Label htmlFor={`ag-${opt}`} className="font-normal">{opt}</Label>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Top financial pain right now</Label>
                <RadioGroup value={form.top_financial_pain || ""} onValueChange={v => {
                  updateField("top_financial_pain", v);
                  updateField("top_financial_need", v);
                }}>
                  {PAIN_OPTIONS.map(opt => (
                    <div key={opt} className="flex items-center space-x-2">
                      <RadioGroupItem value={opt} id={`pain-${opt}`} />
                      <Label htmlFor={`pain-${opt}`} className="font-normal">{opt}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Time horizon for the primary goal</Label>
                  <Select value={form.goal_time_horizon || ""} onValueChange={v => updateField("goal_time_horizon", v)}>
                    <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
                    <SelectContent>
                      {HORIZON_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Target funding amount for the primary goal</Label>
                  <Select value={form.target_funding_amount || ""} onValueChange={v => updateField("target_funding_amount", v)}>
                    <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
                    <SelectContent>
                      {FUNDING_AMOUNT_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Desired monthly business credit capacity</Label>
                <Select value={form.desired_monthly_credit_capacity || ""} onValueChange={v => updateField("desired_monthly_credit_capacity", v)}>
                  <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
                  <SelectContent>
                    {CREDIT_CAPACITY_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Anything else about your goals? (optional)</Label>
                <Textarea value={form.goals_notes || ""} onChange={e => updateField("goals_notes", e.target.value)} rows={3} placeholder="Context, numbers, or details you'd like your coach to know." />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step C */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Business Structure & Credibility</CardTitle>
              <CardDescription>Current state of your business foundation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>Do you have a separate business entity?</Label>
                <RadioGroup value={form.has_business_entity || ""} onValueChange={v => updateField("has_business_entity", v)}>
                  {["Corporation", "LLC", "Partnership", "Sole Proprietor", "Not sure"].map(opt => (
                    <div key={opt} className="flex items-center space-x-2">
                      <RadioGroupItem value={opt} id={`be-${opt}`} />
                      <Label htmlFor={`be-${opt}`} className="font-normal">{opt}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label>Do you have a separate business address (non P.O. Box)?</Label>
                <RadioGroup value={form.has_business_address || ""} onValueChange={v => updateField("has_business_address", v)}>
                  {["Physical office", "Virtual office", "Home address", "No / Other"].map(opt => (
                    <div key={opt} className="flex items-center space-x-2">
                      <RadioGroupItem value={opt} id={`ba-${opt}`} />
                      <Label htmlFor={`ba-${opt}`} className="font-normal">{opt}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox checked={form.has_business_phone || false} onCheckedChange={v => updateField("has_business_phone", !!v)} id="bp" />
                  <Label htmlFor="bp" className="font-normal">Business phone in directories</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox checked={form.has_business_email || false} onCheckedChange={v => updateField("has_business_email", !!v)} id="bemail" />
                  <Label htmlFor="bemail" className="font-normal">Business email (custom domain)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox checked={form.has_business_website || false} onCheckedChange={v => updateField("has_business_website", !!v)} id="bw" />
                  <Label htmlFor="bw" className="font-normal">Business website</Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Separate business bank account?</Label>
                <RadioGroup value={form.has_business_bank_account || ""} onValueChange={v => updateField("has_business_bank_account", v)}>
                  {["Fully separate", "Partially mixed", "Personal only"].map(opt => (
                    <div key={opt} className="flex items-center space-x-2">
                      <RadioGroupItem value={opt} id={`bb-${opt}`} />
                      <Label htmlFor={`bb-${opt}`} className="font-normal">{opt}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label>Bookkeeping / accounting software?</Label>
                <RadioGroup value={form.uses_accounting_software || ""} onValueChange={v => updateField("uses_accounting_software", v)}>
                  {["QuickBooks", "Xero", "Spreadsheet", "None"].map(opt => (
                    <div key={opt} className="flex items-center space-x-2">
                      <RadioGroupItem value={opt} id={`as-${opt}`} />
                      <Label htmlFor={`as-${opt}`} className="font-normal">{opt}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="pt-4 border-t border-border/50">
                <StateEntityWidget initialState={form.state} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step D */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Business Credit & Funding</CardTitle>
              <CardDescription>Your current credit and funding situation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>Business credit cards</Label>
                <RadioGroup value={form.business_credit_cards || ""} onValueChange={v => updateField("business_credit_cards", v)}>
                  {["None", "Cards with personal guarantee", "EIN-only cards"].map(opt => (
                    <div key={opt} className="flex items-center space-x-2">
                      <RadioGroupItem value={opt} id={`bcc-${opt}`} />
                      <Label htmlFor={`bcc-${opt}`} className="font-normal">{opt}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label>Vendor / trade lines reporting to business bureaus</Label>
                <RadioGroup value={form.vendor_tradelines || ""} onValueChange={v => updateField("vendor_tradelines", v)}>
                  {["3+ reporting", "1–2 reporting", "None / Not sure"].map(opt => (
                    <div key={opt} className="flex items-center space-x-2">
                      <RadioGroupItem value={opt} id={`vt-${opt}`} />
                      <Label htmlFor={`vt-${opt}`} className="font-normal">{opt}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label>Which bureaus is your business reporting to? (Select all)</Label>
                {["Dun & Bradstreet", "Experian Business", "Equifax Small Business", "Not sure"].map(opt => (
                  <div key={opt} className="flex items-center space-x-2">
                    <Checkbox
                      checked={(form.credit_reporting_bureaus || []).includes(opt)}
                      onCheckedChange={() => toggleArrayField("credit_reporting_bureaus", opt)}
                      id={`crb-${opt}`}
                    />
                    <Label htmlFor={`crb-${opt}`} className="font-normal">{opt}</Label>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Label>How do you fund gaps between closings? (Select all)</Label>
                {["Personal credit cards", "Savings", "Commission advances", "Personal loans / HELOC", "Business LOC / card", "Other"].map(opt => (
                  <div key={opt} className="flex items-center space-x-2">
                    <Checkbox
                      checked={(form.funding_gap_methods || []).includes(opt)}
                      onCheckedChange={() => toggleArrayField("funding_gap_methods", opt)}
                      id={`fgm-${opt}`}
                    />
                    <Label htmlFor={`fgm-${opt}`} className="font-normal">{opt}</Label>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Label>Desired funding types in the next 12–24 months (Select all)</Label>
                {["Higher-limit business cards", "Business line of credit", "Term loan", "Vehicle / equipment financing", "Short-term bridge funds"].map(opt => (
                  <div key={opt} className="flex items-center space-x-2">
                    <Checkbox
                      checked={(form.desired_funding_types || []).includes(opt)}
                      onCheckedChange={() => toggleArrayField("desired_funding_types", opt)}
                      id={`dft-${opt}`}
                    />
                    <Label htmlFor={`dft-${opt}`} className="font-normal">{opt}</Label>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Label>Comfort with personal guarantees</Label>
                <RadioGroup value={form.personal_guarantee_comfort || ""} onValueChange={v => updateField("personal_guarantee_comfort", v)}>
                  {["Want to reduce PGs", "Okay with PGs for now", "Want options to compare"].map(opt => (
                    <div key={opt} className="flex items-center space-x-2">
                      <RadioGroupItem value={opt} id={`pgc-${opt}`} />
                      <Label htmlFor={`pgc-${opt}`} className="font-normal">{opt}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label>Approximate personal credit score range (optional)</Label>
                <Select value={form.personal_credit_score_range || ""} onValueChange={v => updateField("personal_credit_score_range", v)}>
                  <SelectTrigger><SelectValue placeholder="Select range (optional)" /></SelectTrigger>
                  <SelectContent>
                    {["Prefer not to say", "Below 600", "600–649", "650–699", "700–749", "750–799", "800+"].map(r => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step E */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Program Fit & Support Preferences</CardTitle>
              <CardDescription>Help us understand how you'd like to work together.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Preferred support format</Label>
                <RadioGroup value={form.preferred_support_format || ""} onValueChange={v => updateField("preferred_support_format", v)}>
                  {["One-on-one coaching", "Small cohort (5–10 Realtors)", "Self-paced with check-ins"].map(opt => (
                    <div key={opt} className="flex items-center space-x-2">
                      <RadioGroupItem value={opt} id={`psf-${opt}`} />
                      <Label htmlFor={`psf-${opt}`} className="font-normal">{opt}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label>Interest in joining a 90-day cohort?</Label>
                <RadioGroup value={form.interest_in_cohort || ""} onValueChange={v => updateField("interest_in_cohort", v)}>
                  {["Yes", "Maybe", "Not right now"].map(opt => (
                    <div key={opt} className="flex items-center space-x-2">
                      <RadioGroupItem value={opt} id={`ic-${opt}`} />
                      <Label htmlFor={`ic-${opt}`} className="font-normal">{opt}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label>Preferred days/times for cohort sessions</Label>
                <Input value={form.preferred_cohort_days || ""} onChange={e => updateField("preferred_cohort_days", e.target.value)} placeholder="e.g. Tuesdays at 12pm PT" />
              </div>
              <div className="space-y-2">
                <Label>Investment readiness</Label>
                <RadioGroup value={form.investment_readiness || ""} onValueChange={v => updateField("investment_readiness", v)}>
                  {["Ready now", "Within 30 days", "Need more clarity first", "Just exploring"].map(opt => (
                    <div key={opt} className="flex items-center space-x-2">
                      <RadioGroupItem value={opt} id={`ir-${opt}`} />
                      <Label htmlFor={`ir-${opt}`} className="font-normal">{opt}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label>Anything else you want us to know before our session?</Label>
                <Textarea value={form.additional_notes || ""} onChange={e => updateField("additional_notes", e.target.value)} rows={4} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep(s => s - 1)}>Previous</Button>
            )}
          </div>
          <div className="flex gap-2">
            {!isDirectMode && <Button variant="ghost" onClick={saveDraft}>Save Progress</Button>}
            {step < steps.length - 1 ? (
              <Button onClick={() => setStep(s => s + 1)}>Next</Button>
            ) : (
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Submitting...</> : "Submit"}
              </Button>
            )}
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          This is not legal, tax, or financial advice. Consult your attorney, CPA, and state licensing board for your specific situation.
        </p>
      </div>
    </div>
  );
}
