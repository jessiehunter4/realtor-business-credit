import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { useOnboardingStatus } from "@/hooks/useOnboardingStatus";
import { supabase } from "@/integrations/supabase/client";
import IntakePricingAndReadiness from "@/components/intake/IntakePricingAndReadiness";
import InlinePricingAccordion from "@/components/plan/InlinePricingAccordion";
import GoalStatement from "@/components/intake/GoalStatement";
import PlanPreviewCard from "@/components/intake/PlanPreviewCard";
import PlanGenerationLoader from "@/components/intake/PlanGenerationLoader";
import PlanSuccessCelebration from "@/components/intake/PlanSuccessCelebration";
import PostPlanAuthCard from "@/components/intake/PostPlanAuthCard";
import AuthedPlanHandoff from "@/components/intake/AuthedPlanHandoff";
import { useAuthRole } from "@/hooks/useAuthRole";
import { usePlanGeneration } from "@/hooks/usePlanGeneration";
import { beaconFunnelEvent, postFunnelEvent } from "@/lib/logFunnelEvent";
import SiteHeader from "@/components/shared/SiteHeader";
import SiteFooter from "@/components/shared/SiteFooter";
import StateEntityWidget from "@/components/shared/StateEntityWidget";
import PhoneInput from "@/components/shared/PhoneInput";
import Seo from "@/components/shared/Seo";
import StepVideoPlaceholder from "@/components/intake/StepVideoPlaceholder";
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

const MAX_GOALS = 3;
const MAX_PAINS = 3;
const AUTOSAVE_DEBOUNCE_MS = 1200;
const DRAFT_STORAGE_KEY = "rbc_intake_draft_v3";
const LEGACY_DRAFT_KEY = "rbc_intake_draft_v2";
const ENABLE_PROGRAM_FIT_STEP = false;

interface DraftEnvelope {
  intake_id?: string | null;
  access_token?: string | null;
  form: SurveyData;
}

const readDraft = (): DraftEnvelope | null => {
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as DraftEnvelope;
    const legacy = localStorage.getItem(LEGACY_DRAFT_KEY);
    if (legacy) return { form: JSON.parse(legacy) as SurveyData };
  } catch {
    // ignore
  }
  return null;
};

const writeDraft = (env: DraftEnvelope) => {
  try {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(env));
  } catch {
    // ignore
  }
};

export const COHORT_TIME_SLOTS = [
  "Monday 7:00 AM PT",
  "Monday 5:00 PM PT",
  "Wednesday 7:00 AM PT",
  "Wednesday 5:00 PM PT",
  "Friday 7:00 AM PT",
  "Friday 5:00 PM PT",
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
  business_street?: string;
  business_zip?: string;
  business_phone?: string;
  license_type?: string;
  license_type_other?: string;
  years_in_real_estate?: string;
  gci_last_12_months?: string;
  sides_closed_last_12_months?: string;
  // B — Goals (multi-select, top 3 each)
  primary_goals?: string[];
  financial_pains?: string[];
  primary_goals_other?: string;
  financial_pains_other?: string;
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
  preferred_cohort_time_1?: string;
  preferred_cohort_time_2?: string;
  investment_readiness?: string;
  additional_notes?: string;
}

function IntakeSurveyForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { contactId, email: identityEmail, firstName, lastName, leadId } = useContactIdentity();
  const { toast } = useToast();
  const { session, loading: authLoading } = useAuthRole();
  const mountLogged = useRef(false);
  const mountTime = useRef(Date.now());

  const isDirectMode = !token;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [intakeId, setIntakeId] = useState<string | null>(null);
  const [intakeToken, setIntakeToken] = useState<string | null>(token);
  const { state: planState, generate: generatePlan, reset: resetPlan } = usePlanGeneration();
  const [notFound, setNotFound] = useState(false);
  const [form, setForm] = useState<SurveyData>({});
  const [step, setStep] = useState(0);
  const [autosaveStatus, setAutosaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hydratedFromDraft = useRef(false);
  const planEventLogged = useRef(false);

  // Log plan generation outcome funnel events once per outcome.
  useEffect(() => {
    if (planState.status === "success" && !planEventLogged.current) {
      planEventLogged.current = true;
      void postFunnelEvent({
        contactId: contactId || undefined,
        eventType: "plan_generation_succeeded",
        metadata: { plan_id: planState.planId, source: "user" },
      }).catch(() => {});
      if (contactId) {
        supabase.functions
          .invoke("tag-ghl-contact", { body: { contactId, tags: ["f-plan-generated"] } })
          .catch(() => {});
      }
    }
    if (planState.status === "error") {
      void postFunnelEvent({
        contactId: contactId || undefined,
        eventType: "plan_generation_failed",
        metadata: { message: planState.message },
      }).catch(() => {});
    }
  }, [planState, contactId]);

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
      // Restore any locally saved draft first (server-persisted id + form)
      const env = readDraft();
      const localDraft: SurveyData = env?.form || {};
      hydratedFromDraft.current = !!Object.keys(localDraft).length;
      if (env?.intake_id) setIntakeId(env.intake_id);
      if (env?.access_token) setIntakeToken(env.access_token);
      setForm(prev => ({
        ...prev,
        ...localDraft,
        contact_name: localDraft.contact_name || prev.contact_name || defaultName || "",
        contact_email: localDraft.contact_email || prev.contact_email || identityEmail || "",
        first_name: localDraft.first_name || prev.first_name || firstName || "",
        last_name: localDraft.last_name || prev.last_name || lastName || "",
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

  const toggleLimitedArray = (key: "primary_goals" | "financial_pains", value: string, max: number) => {
    setForm(prev => {
      const arr = (prev[key] as string[] | undefined) || [];
      if (arr.includes(value)) return { ...prev, [key]: arr.filter(v => v !== value) };
      if (arr.length >= max) {
        toast({ title: `Pick up to ${max}`, description: "Uncheck one to change your selection." });
        return prev;
      }
      return { ...prev, [key]: [...arr, value] };
    });
  };

  // Auto-save: localStorage for direct mode; debounced server draft for token mode.
  useEffect(() => {
    if (loading || submitted) return;
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(async () => {
      if (isDirectMode) {
        try {
          writeDraft({ intake_id: intakeId, access_token: intakeToken, form });
          setAutosaveStatus("saved");
        } catch {
          // ignore quota errors
        }
        return;
      }
      if (!token) return;
      setAutosaveStatus("saving");
      try {
        await fetch(
          `${SUPABASE_URL}/functions/v1/intake-survey?token=${token}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY },
            body: JSON.stringify({ ...form, status: "in_progress" }),
          }
        );
        setAutosaveStatus("saved");
      } catch {
        setAutosaveStatus("idle");
      }
    }, AUTOSAVE_DEBOUNCE_MS);
    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
  }, [form, loading, submitted, isDirectMode, token, intakeId, intakeToken]);

  // Scroll to top on step change
  const isInitialStep = useRef(true);
  useEffect(() => {
    if (isInitialStep.current) {
      isInitialStep.current = false;
      return;
    }
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      window.scrollTo(0, 0);
    }
  }, [step]);

  // Server-side incremental save for direct mode. No-op if email missing or in token mode.
  const persistStep = async (opts?: { finalize?: boolean }): Promise<{ id: string; access_token: string } | null> => {
    if (!isDirectMode) return null;
    const email = form.contact_email?.trim();
    if (!email) return null;
    try {
      setAutosaveStatus("saving");
      const res = await fetch(
        `${SUPABASE_URL}/functions/v1/intake-survey?mode=direct-draft`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY },
          body: JSON.stringify({
            ...form,
            intake_id: intakeId || undefined,
            lead_id: leadId || undefined,
            finalize: !!opts?.finalize,
          }),
        }
      );
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      if (data?.id) {
        setIntakeId(data.id);
        if (data.access_token) setIntakeToken(data.access_token);
        writeDraft({ intake_id: data.id, access_token: data.access_token ?? intakeToken, form });
      }
      setAutosaveStatus("saved");
      return data;
    } catch (e) {
      setAutosaveStatus("idle");
      return null;
    }
  };

  const goNext = async () => {
    // Fire-and-forget server save; local draft is safety net
    void persistStep();
    setStep(s => s + 1);
  };

  const validateAllRequired = (): { ok: true } | { ok: false; step: number; message: string } => {
    if (isDirectMode) {
      if (!form.first_name?.trim()) return { ok: false, step: 0, message: "Please enter your first name." };
      if (!form.last_name?.trim()) return { ok: false, step: 0, message: "Please enter your last name." };
      const email = form.contact_email?.trim() || "";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, step: 0, message: "Please enter a valid email." };
    }
    if (form.license_type === "Other" && !form.license_type_other?.trim()) {
      return { ok: false, step: 0, message: "Please specify your license type." };
    }
    if (!form.primary_goals || form.primary_goals.length < 1) {
      return { ok: false, step: 1, message: "Pick at least one primary goal." };
    }
    if (form.primary_goals.includes("Other") && !form.primary_goals_other?.trim()) {
      return { ok: false, step: 1, message: "Please describe your other primary goal." };
    }
    return { ok: true };
  };

  const handleGenerate = async () => {
    const v = validateAllRequired();
    if (v.ok === false) {
      toast({ title: "Missing info", description: v.message, variant: "destructive" });
      setStep(v.step);
      return;
    }
    setSubmitting(true);
    try {
      let finalId = intakeId;
      let finalToken = intakeToken;
      if (isDirectMode) {
        const saved = await persistStep({ finalize: true });
        if (!saved?.id) throw new Error("Could not save your answers. Please try again.");
        finalId = saved.id;
        finalToken = saved.access_token || finalToken;
      } else {
        // Token mode: finalize via existing PUT
        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/intake-survey?token=${token}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY },
            body: JSON.stringify({ ...form, status: "submitted" }),
          }
        );
        if (!res.ok) {
          const d = await res.json().catch(() => null);
          throw new Error(d?.error || "Failed to submit");
        }
        if (form.id) finalId = form.id;
      }

      setIntakeId(finalId);
      setIntakeToken(finalToken);
      setSubmitted(true);
      if (isDirectMode) {
        try { localStorage.removeItem(DRAFT_STORAGE_KEY); localStorage.removeItem(LEGACY_DRAFT_KEY); } catch { /* ignore */ }
      }

      void postFunnelEvent({
        contactId: contactId || undefined,
        eventType: "intake_submitted",
      }).catch(() => {});
      if (contactId) {
        supabase.functions.invoke("tag-ghl-contact", { body: { contactId, tags: ["f-intake-submitted"] } }).catch(() => {});
      }

      // Immediately kick off plan generation
      if (finalId) {
        void postFunnelEvent({ contactId: contactId || undefined, eventType: "plan_generation_started" }).catch(() => {});
        generatePlan({ intakeSurveyId: finalId, intakeToken: finalToken, source: "user" });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
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
            body: JSON.stringify({ ...form, lead_id: leadId || undefined }),
          }
        );
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          errorMessage = data?.error || errorMessage;
          throw new Error(errorMessage);
        }
        const data = await res.json().catch(() => null);
        if (data?.id) setIntakeId(data.id);
        if (data?.access_token) setIntakeToken(data.access_token);
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
        // Token mode: use the survey id from the loaded form; token comes from URL.
        if (form.id) setIntakeId(form.id);
      }

      setSubmitted(true);
      // Clear direct-mode local draft on successful submit
      if (isDirectMode) {
        try { localStorage.removeItem(DRAFT_STORAGE_KEY); } catch { /* ignore */ }
      }

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
    // Post-submit flow: preview → generating → success (with confetti) → portal.
    const goToPortal = () => {
      if (planState.status !== "success") return;
      navigate(`/dashboard?firstLogin=1`);
    };

    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center p-4 md:p-8">
          {planState.status === "success" ? (
            <PlanSuccessCelebration
              planId={planState.planId}
              contactEmail={form.contact_email}
              hidePrimary
              subheading="Create your account below to unlock and save your personalized plan."
              footer={
                intakeId && intakeToken && form.contact_email ? (
                  <PostPlanAuthCard
                    intakeId={intakeId}
                    accessToken={intakeToken}
                    defaultEmail={form.contact_email}
                    firstName={form.first_name}
                    lastName={form.last_name}
                    phone={form.business_phone}
                    onAuthenticated={goToPortal}
                  />
                ) : null
              }
            />
          ) : planState.status === "generating" ? (
            <PlanGenerationLoader />
          ) : planState.status === "error" ? (
            <Card className="max-w-md w-full">
              <CardContent className="pt-6 text-center space-y-4">
                <h2 className="text-xl font-semibold text-foreground">We hit a snag</h2>
                <p className="text-muted-foreground text-sm">{planState.message}</p>
                {planState.retriable && intakeId && (
                  <Button
                    onClick={() => {
                      resetPlan();
                      generatePlan({ intakeSurveyId: intakeId, intakeToken, source: "user" });
                    }}
                  >
                    Try again
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <PlanPreviewCard
              disabled={!intakeId}
              onGenerate={() => {
                if (!intakeId) return;
                void postFunnelEvent({
                  contactId: contactId || undefined,
                  eventType: "plan_generation_started",
                }).catch(() => {});
                generatePlan({ intakeSurveyId: intakeId, intakeToken, source: "user" });
              }}
            />
          )}
        </div>
        <SiteFooter />
      </div>
    );
  }

  const steps = [
    { title: "Profile", key: "A" },
    { title: "Goals", key: "B" },
    { title: "Business Structure", key: "C" },
    { title: "Credit & Funding", key: "D" },
    ...(ENABLE_PROGRAM_FIT_STEP ? [{ title: "Program Fit", key: "E" }] : []),
  ];
  const isFinalStep = step === steps.length - 1;

  const stepVideoMeta: Record<number, { title: string; description: string }> = {
    0: { title: "Walkthrough: Profile", description: "Jessie explains what production and location details help us tailor your plan." },
    1: { title: "Walkthrough: Goals", description: "How to pick the goals and pain points that shape your custom 90-day plan." },
    2: { title: "Walkthrough: Business Structure", description: "The credibility signals lenders and bureaus look for in a real estate business." },
    3: { title: "Walkthrough: Credit & Funding", description: "How your current credit and funding mix maps to the right next steps." },
    4: { title: "Walkthrough: Program Fit", description: "How coaching, cohort, and self-paced tracks work — and how to pick." },
  };
  const activeVideo = stepVideoMeta[step] ?? stepVideoMeta[0];

  return (
    <div className="min-h-screen bg-muted/30 pb-24 pt-8 px-4">
      <SiteHeader />
      <Seo
        title="RE Pro Business Financial Needs Analysis"
        description="A short intake that generates your custom RE Pro business structure, finance & credit plan."
        path="/intake"
        noindex
      />
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-secondary">
            RE Pro Business Financial Needs Analysis
          </h1>
          <p className="text-muted-foreground">
            {form.contact_name ? `Welcome, ${form.contact_name}!` : "Welcome!"} Please complete the sections below to help us prepare for your session.
          </p>
        </div>

        <div className="space-y-6 max-w-3xl mx-auto">
          <StepVideoPlaceholder
            stepNumber={step + 1}
            title={activeVideo.title}
            description={activeVideo.description}
          />

          {/* Step indicator */}
          <div className="flex gap-1 max-w-2xl mx-auto w-full">
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
                ? "About 3–5 minutes total. Your answers save automatically in this browser."
                : `About ${Math.max(1, steps.length - step)} min left · Progress saves automatically as you type.`}
            </p>
            {autosaveStatus !== "idle" && (
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                {autosaveStatus === "saving" ? "Saving…" : "Saved"}
              </p>
            )}
          </div>

          <div className="space-y-6 min-w-0">
        {/* Step A */}
        {step === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Tell us about your real estate practice.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Name & Email fields (always shown in direct mode, read-only in token mode if pre-filled) */}
              {isDirectMode && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>First Name <span className="text-destructive">*</span></Label>
                    <Input
                      value={form.first_name || ""}
                      onChange={e => {
                        const first = e.target.value;
                        updateField("first_name", first);
                        const full = [first, form.last_name].filter(Boolean).join(" ");
                        updateField("full_name", full);
                        updateField("contact_name", full);
                      }}
                      placeholder="First name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name <span className="text-destructive">*</span></Label>
                    <Input
                      value={form.last_name || ""}
                      onChange={e => {
                        const last = e.target.value;
                        updateField("last_name", last);
                        const full = [form.first_name, last].filter(Boolean).join(" ");
                        updateField("full_name", full);
                        updateField("contact_name", full);
                      }}
                      placeholder="Last name"
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
                  <Label>Business Phone</Label>
                  <PhoneInput
                    value={form.business_phone || ""}
                    onChange={(digits) => updateField("business_phone", digits)}
                    placeholder="(555) 555-5555"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-base font-semibold">Business Address</Label>
                <Input
                  value={form.business_street || ""}
                  onChange={e => updateField("business_street", e.target.value)}
                  placeholder="Street address"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    value={form.city || ""}
                    onChange={e => updateField("city", e.target.value)}
                    placeholder="City"
                  />
                  <Select value={form.state || ""} onValueChange={v => updateField("state", v)}>
                    <SelectTrigger><SelectValue placeholder="State" /></SelectTrigger>
                    <SelectContent>
                      {US_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Input
                    value={form.business_zip || ""}
                    onChange={e => updateField("business_zip", e.target.value)}
                    placeholder="ZIP code"
                    inputMode="numeric"
                  />
                </div>
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
                {form.license_type === "Other" && (
                  <div className="pl-6 space-y-1">
                    <Label htmlFor="license_type_other" className="text-sm">
                      Please specify your license type <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="license_type_other"
                      value={form.license_type_other || ""}
                      onChange={e => updateField("license_type_other", e.target.value)}
                      placeholder="e.g. Associate Broker, Team Lead, Referral Agent"
                      maxLength={120}
                    />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="space-y-2">
                  <Label>Gross Commission (Last 12 Months)</Label>
                  <Select value={form.gci_last_12_months || ""} onValueChange={v => updateField("gci_last_12_months", v)}>
                    <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
                    <SelectContent>
                      {["Under $50K", "$50K–$100K", "$100K–$250K", "$250K–$500K", "$500K–$1M", "Over $1M"].map(r => (
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
              <CardDescription>Pick the goals and pain points that matter most — your live goal statement updates as you choose.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Primary Financial Goals (Top 3) <span className="text-red-600">*</span></Label>
                <p className="text-xs text-muted-foreground">
                  Selected {(form.primary_goals || []).length} of {MAX_GOALS} — pick the goals that matter most.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {GOAL_OPTIONS.map(opt => {
                    const checked = (form.primary_goals || []).includes(opt);
                    const disabled = !checked && (form.primary_goals || []).length >= MAX_GOALS;
                    return (
                      <div key={opt} className="flex items-start space-x-2">
                        <Checkbox
                          id={`pg-${opt}`}
                          checked={checked}
                          disabled={disabled}
                          onCheckedChange={() => toggleLimitedArray("primary_goals", opt, MAX_GOALS)}
                        />
                        <Label htmlFor={`pg-${opt}`} className={`font-normal ${disabled ? "opacity-50" : ""}`}>{opt}</Label>
                      </div>
                    );
                  })}
                </div>
                {(form.primary_goals || []).includes("Other") && (
                  <div className="pt-2 space-y-1">
                    <Label htmlFor="primary_goals_other" className="text-sm">Tell us about your other goal <span className="text-red-600">*</span></Label>
                    <Textarea
                      id="primary_goals_other"
                      value={form.primary_goals_other || ""}
                      onChange={e => updateField("primary_goals_other", e.target.value)}
                      rows={2}
                      placeholder="Describe the goal that matters most to you."
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Financial Pains (Up to 3)</Label>
                <p className="text-xs text-muted-foreground">
                  Selected {(form.financial_pains || []).length} of {MAX_PAINS} — what's holding you back right now?
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {PAIN_OPTIONS.map(opt => {
                    const checked = (form.financial_pains || []).includes(opt);
                    const disabled = !checked && (form.financial_pains || []).length >= MAX_PAINS;
                    return (
                      <div key={opt} className="flex items-start space-x-2">
                        <Checkbox
                          id={`pain-${opt}`}
                          checked={checked}
                          disabled={disabled}
                          onCheckedChange={() => toggleLimitedArray("financial_pains", opt, MAX_PAINS)}
                        />
                        <Label htmlFor={`pain-${opt}`} className={`font-normal ${disabled ? "opacity-50" : ""}`}>{opt}</Label>
                      </div>
                    );
                  })}
                </div>
                {(form.financial_pains || []).includes("Other") && (
                  <div className="pt-2 space-y-1">
                    <Label htmlFor="financial_pains_other" className="text-sm">Tell us about your other pain point</Label>
                    <Textarea
                      id="financial_pains_other"
                      value={form.financial_pains_other || ""}
                      onChange={e => updateField("financial_pains_other", e.target.value)}
                      rows={2}
                      placeholder="Describe what's holding you back right now."
                    />
                  </div>
                )}
              </div>

              <GoalStatement
                goals={form.primary_goals || []}
                pains={form.financial_pains || []}
                name={form.first_name || form.contact_name}
              />

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
                  {["Physical office", "Virtual office", "Home address", "No"].map(opt => (
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
                <Label>Approximate personal credit score range (Currently)</Label>
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

        {/* Step E — hidden from public flow; preserved for future/admin use */}
        {ENABLE_PROGRAM_FIT_STEP && step === 4 && (
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
                <Label>Preferred cohort session time</Label>
                <p className="text-xs text-muted-foreground">Cohorts meet Mon/Wed/Fri at 7:00 AM or 5:00 PM PT. Pick your 1st and 2nd choice.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-sm font-normal">1st choice</Label>
                    <Select
                      value={form.preferred_cohort_time_1 || ""}
                      onValueChange={(v) => {
                        setForm((prev) => ({
                          ...prev,
                          preferred_cohort_time_1: v,
                          preferred_cohort_days: [v, prev.preferred_cohort_time_2].filter(Boolean).join("; "),
                        }));
                      }}
                    >
                      <SelectTrigger><SelectValue placeholder="Select a time" /></SelectTrigger>
                      <SelectContent>
                        {COHORT_TIME_SLOTS.map((slot) => (
                          <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-normal">2nd choice</Label>
                    <Select
                      value={form.preferred_cohort_time_2 || ""}
                      onValueChange={(v) => {
                        setForm((prev) => ({
                          ...prev,
                          preferred_cohort_time_2: v,
                          preferred_cohort_days: [prev.preferred_cohort_time_1, v].filter(Boolean).join("; "),
                        }));
                      }}
                    >
                      <SelectTrigger><SelectValue placeholder="Select a time" /></SelectTrigger>
                      <SelectContent>
                        {COHORT_TIME_SLOTS.map((slot) => (
                          <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <InlinePricingAccordion
                headline="Take a look at our pricing"
                subhead="Tap any tier to expand — no need to leave this page."
              />

              <div className="space-y-2">
                <Label>Where are you right now with starting the program?</Label>
                <RadioGroup value={form.investment_readiness || ""} onValueChange={v => updateField("investment_readiness", v)}>
                  {[
                    "I'm ready to start now",
                    "I want to start within 30 days",
                    "I need more clarity first",
                    "I'm just exploring",
                  ].map(opt => (
                    <div key={opt} className="flex items-center space-x-2">
                      <RadioGroupItem value={opt} id={`ir-${opt}`} />
                      <Label htmlFor={`ir-${opt}`} className="font-normal">{opt}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <IntakePricingAndReadiness readiness={form.investment_readiness} />
              <div className="space-y-2">
                <Label>Anything else you want us to know before our session?</Label>
                <Textarea value={form.additional_notes || ""} onChange={e => updateField("additional_notes", e.target.value)} rows={4} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Final-step centered CTA */}
        {isFinalStep && (
          <div className="max-w-3xl mx-auto pt-2 pb-4 text-center space-y-3">
            <Button
              size="lg"
              onClick={handleGenerate}
              disabled={submitting}
              className="h-14 px-10 text-base font-semibold"
            >
              {submitting ? (
                <><Loader2 className="h-5 w-5 animate-spin mr-2" /> Preparing your plan…</>
              ) : (
                <>Generate My Plan →</>
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              We'll save your answers and generate your personalized plan in about 20–40 seconds.
            </p>
          </div>
        )}
          </div>
        </div>

        {/* Navigation — sticky bottom action bar */}
        <div className="sticky bottom-4 z-20 mx-auto flex max-w-3xl items-center justify-between gap-3 rounded-full border border-border bg-background/95 px-4 py-3 shadow-[var(--rbc-shadow)] backdrop-blur">
          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep(s => s - 1)}>Previous</Button>
            )}
          </div>
          <div className="hidden sm:block text-[11px] uppercase tracking-wide text-muted-foreground">
            {autosaveStatus === "saving" ? "Saving…" : autosaveStatus === "saved" ? "Saved" : `Step ${step + 1} of ${steps.length}`}
          </div>
          <div className="flex gap-2">
            {!isFinalStep && (
              <Button onClick={goNext}>Next</Button>
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

/**
 * Guard: signed-in users who already have a published plan never re-enter the
 * intake flow (which would create a duplicate survey + plan). They are sent to
 * the dashboard instead. Token links (coach-sent) always open the form.
 */
export default function IntakeSurveyPage() {
  const [searchParams] = useSearchParams();
  const hasToken = Boolean(searchParams.get("token"));
  const { loading, hasPlan } = useOnboardingStatus();
  const navigate = useNavigate();
  const redirected = useRef(false);

  const blocked = !hasToken && hasPlan;

  useEffect(() => {
    if (loading || !blocked || redirected.current) return;
    redirected.current = true;
    navigate("/dashboard?planExists=1", { replace: true });
  }, [loading, blocked, navigate]);

  if (!hasToken && (loading || blocked)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <IntakeSurveyForm />;
}
