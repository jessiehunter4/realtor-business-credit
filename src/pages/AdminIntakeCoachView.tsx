import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  ArrowLeft, Loader2, Save, StickyNote, CheckCircle, AlertCircle,
  User, Target, Building, CreditCard, Handshake, Sparkles, FileText, Send,
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import { COHORT_TIME_SLOTS } from "./IntakeSurveyPage";
import IntakePricingAndReadiness from "@/components/intake/IntakePricingAndReadiness";
import InlinePricingAccordion from "@/components/plan/InlinePricingAccordion";
import PhoneInput from "@/components/shared/PhoneInput";
import GoalStatement from "@/components/intake/GoalStatement";
import StepVideoPlaceholder from "@/components/intake/StepVideoPlaceholder";
import { usePlanGeneration } from "@/hooks/usePlanGeneration";

type IntakeSurvey = Tables<"intake_surveys">;
type CoachNote = Tables<"intake_coach_notes">;

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware",
  "Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky",
  "Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi",
  "Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico",
  "New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania",
  "Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
  "Virginia","Washington","West Virginia","Wisconsin","Wyoming","District of Columbia"
];

const SECTIONS = [
  { key: "profile", label: "Profile", icon: User },
  { key: "goals", label: "Goals", icon: Target },
  { key: "structure", label: "Business Structure", icon: Building },
  { key: "credit", label: "Credit & Funding", icon: CreditCard },
  { key: "program", label: "Program Fit", icon: Handshake },
] as const;

const SECTION_VIDEO_META: Record<SectionKey, { step: number; title: string; description: string }> = {
  profile: {
    step: 1,
    title: "Profile & Production",
    description: "Who the agent is, where they work, and what their business looks like today.",
  },
  goals: {
    step: 2,
    title: "Goals & Financial Needs",
    description: "The money moments that matter most and the gaps they need to close.",
  },
  structure: {
    step: 3,
    title: "Business Structure & Fundability",
    description: "Entity, address, phone, banking, and the credibility pieces lenders see.",
  },
  credit: {
    step: 4,
    title: "Credit & Funding",
    description: "Current business credit profile, funding habits, and comfort with guarantees.",
  },
  program: {
    step: 5,
    title: "Program Fit",
    description: "Preferred support style, cohort timing, and readiness to get started.",
  },
};

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

type SectionKey = typeof SECTIONS[number]["key"];

export default function AdminIntakeCoachView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [survey, setSurvey] = useState<IntakeSurvey | null>(null);
  const [notes, setNotes] = useState<CoachNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<IntakeSurvey>>({});
  const [activeTab, setActiveTab] = useState<string>("profile");

  // Notes state per section
  const [noteTexts, setNoteTexts] = useState<Record<string, string>>({});
  const [savingNote, setSavingNote] = useState<string | null>(null);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const planGen = usePlanGeneration();

  // Surface generation outcome as admin toast + auto-nav.
  useEffect(() => {
    if (planGen.state.status === "success") {
      const s = planGen.state;
      toast.success(s.superseded ? "Plan updated (existing draft refreshed)" : "Plan generated!");
      navigate(`/admin/plan/${s.planId}`);
      planGen.reset();
    } else if (planGen.state.status === "error") {
      toast.error(planGen.state.message);
      planGen.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planGen.state]);
  const [existingPlanId, setExistingPlanId] = useState<string | null>(null);
  const [existingPlanStatus, setExistingPlanStatus] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);

  const fetchData = useCallback(async () => {
    if (!id) return;
    const [surveyRes, notesRes, planRes] = await Promise.all([
      supabase.from("intake_surveys").select("*").eq("id", id).single(),
      supabase.from("intake_coach_notes").select("*").eq("intake_survey_id", id).order("created_at", { ascending: false }),
      supabase
        .from("custom_plans")
        .select("id, status")
        .eq("intake_survey_id", id)
        .in("status", ["draft", "published"])
        .order("created_at", { ascending: false })
        .limit(1),
    ]);

    if (surveyRes.error) {
      toast.error("Survey not found");
      navigate("/admin/intake");
      return;
    }

    setSurvey(surveyRes.data);
    setForm(surveyRes.data);
    setNotes(notesRes.data || []);
    setExistingPlanId(planRes.data?.[0]?.id || null);
    setExistingPlanStatus(planRes.data?.[0]?.status || null);
    setLoading(false);
  }, [id, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateField = (key: keyof IntakeSurvey, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleArrayField = (key: keyof IntakeSurvey, value: string) => {
    setForm((prev) => {
      const arr = (prev[key] as string[] | undefined) || [];
      return { ...prev, [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] };
    });
  };

  const handleSaveProxy = async () => {
    if (!id) return;
    setSaving(true);
    const editableKeys: (keyof IntakeSurvey)[] = [
      "contact_name", "contact_email", "brokerage_name", "city", "state",
      "license_type", "years_in_real_estate", "gci_last_12_months",
      "has_business_entity", "entity_type",
      "primary_goals", "financial_pains", "goals_notes",
      "has_business_address", "address_type", "has_business_phone",
      "has_business_email", "has_business_website", "has_business_bank_account",
      "uses_accounting_software", "accounting_software_name",
      "business_credit_cards", "vendor_tradelines", "credit_reporting_bureaus",
      "funding_gap_methods", "desired_funding_types", "personal_guarantee_comfort",
      "personal_credit_score_range", "preferred_support_format",
      "interest_in_cohort", "preferred_cohort_days",
      "preferred_cohort_time_1", "preferred_cohort_time_2",
      "investment_readiness",
      "additional_notes",
    ];
    const updateFields: Record<string, any> = {};
    for (const k of editableKeys) {
      if (k in form) updateFields[k as string] = (form as any)[k] ?? null;
    }
    const { error } = await supabase.from("intake_surveys").update(updateFields).eq("id", id);
    if (error) {
      console.error("intake save error", error);
      toast.error(`Failed to save: ${error.message}`);
    } else {
      toast.success("Survey updated");
      fetchData();
    }
    setSaving(false);
  };

  const handleMarkReviewed = async () => {
    if (!id) return;
    const { error } = await supabase.from("intake_surveys").update({ status: "reviewed" }).eq("id", id);
    if (error) {
      console.error("intake status error", error);
      toast.error(`Failed to update status: ${error.message}`);
    } else {
      toast.success("Marked as reviewed");
      fetchData();
    }
  };

  const handleSaveNote = async (section: string) => {
    const text = noteTexts[section]?.trim();
    if (!text || !id) return;
    setSavingNote(section);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("intake_coach_notes").insert({
      intake_survey_id: id,
      section,
      note: text,
      created_by: user.id,
    });

    if (error) {
      console.error("intake note error", error);
      toast.error(`Failed to save note: ${error.message}`);
    } else {
      toast.success("Note saved");
      setNoteTexts((prev) => ({ ...prev, [section]: "" }));
      fetchData();
    }
    setSavingNote(null);
  };

  const sectionNotes = (section: string) => notes.filter((n) => n.section === section);

  const handleGeneratePlan = async () => {
    if (!id) return;
    setGeneratingPlan(true);
    await planGen.generate({ intakeSurveyId: id, source: "admin" });
    setGeneratingPlan(false);
  };

  const handleQuickPublish = async () => {
    if (!existingPlanId) return;
    setPublishing(true);
    const { error } = await supabase
      .from("custom_plans")
      .update({ status: "published", published_at: new Date().toISOString() })
      .eq("id", existingPlanId);
    if (error) {
      toast.error(`Failed to publish: ${error.message}`);
    } else {
      toast.success("Plan published — the agent can now view it.");
      fetchData();
    }
    setPublishing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!survey) return null;

  const statusBadge = (
    <Badge
      variant="outline"
      className={
        survey.status === "submitted"
          ? "bg-primary/10 text-primary"
          : survey.status === "reviewed"
          ? "bg-blue-100 text-blue-800"
          : "bg-muted text-muted-foreground"
      }
    >
      {survey.status}
    </Badge>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin/intake")} className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold break-words">{survey.contact_name || "Unnamed"}</h1>
                {statusBadge}
              </div>
              <p className="text-sm text-muted-foreground break-all">{survey.contact_email}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {existingPlanId && (
              <>
                <Badge
                  variant="outline"
                  className={
                    existingPlanStatus === "published"
                      ? "bg-primary/10 text-primary self-center"
                      : "bg-amber-100 text-amber-800 self-center"
                  }
                >
                  Plan: {existingPlanStatus}
                </Badge>
                <Button variant="outline" size="sm" onClick={() => navigate(`/admin/plan/${existingPlanId}`)}>
                  <FileText className="h-4 w-4 mr-1" /> View Plan
                </Button>
                {existingPlanStatus === "draft" && (
                  <Button size="sm" onClick={handleQuickPublish} disabled={publishing}>
                    {publishing ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Send className="h-4 w-4 mr-1" />}
                    Publish
                  </Button>
                )}
              </>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={handleGeneratePlan}
              disabled={generatingPlan}
            >
              {generatingPlan ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Sparkles className="h-4 w-4 mr-1" />}
              {existingPlanId ? "Regenerate Plan" : "Generate Plan"}
            </Button>
            {survey.status === "submitted" && (
              <Button variant="outline" size="sm" onClick={handleMarkReviewed}>
                <CheckCircle className="h-4 w-4 mr-1" /> Mark Reviewed
              </Button>
            )}
            <Button size="sm" onClick={handleSaveProxy} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
              Save Changes
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="max-w-3xl mx-auto mb-6">
          <StepVideoPlaceholder
            stepNumber={SECTION_VIDEO_META[activeTab as SectionKey].step}
            title={SECTION_VIDEO_META[activeTab as SectionKey].title}
            description={SECTION_VIDEO_META[activeTab as SectionKey].description}
          />
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="mb-6 -mx-4 px-4 overflow-x-auto">
            <TabsList className="inline-flex w-max h-auto gap-1">
              {SECTIONS.map((s) => (
                <TabsTrigger key={s.key} value={s.key} className="gap-1.5 whitespace-nowrap">
                  <s.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{s.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Profile & Production */}
          <TabsContent value="profile">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>You can edit (proxy-fill) any field on behalf of the agent.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       <div className="space-y-2">
                         <Label>First Name</Label>
                         <Input
                           value={form.first_name || ""}
                           onChange={(e) => {
                             const first = e.target.value;
                             updateField("first_name", first);
                             const full = [first, form.last_name].filter(Boolean).join(" ");
                             updateField("full_name", full);
                             updateField("contact_name", full);
                           }}
                         />
                       </div>
                       <div className="space-y-2">
                         <Label>Last Name</Label>
                         <Input
                           value={form.last_name || ""}
                           onChange={(e) => {
                             const last = e.target.value;
                             updateField("last_name", last);
                             const full = [form.first_name, last].filter(Boolean).join(" ");
                             updateField("full_name", full);
                             updateField("contact_name", full);
                           }}
                         />
                       </div>
                       <div className="space-y-2">
                         <Label>Contact Email</Label>
                         <Input value={form.contact_email || ""} onChange={(e) => updateField("contact_email", e.target.value)} />
                       </div>
                     </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Brokerage / Team</Label>
                        <Input value={form.brokerage_name || ""} onChange={(e) => updateField("brokerage_name", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Business Phone</Label>
                        <PhoneInput
                          value={form.business_phone || ""}
                          onChange={(raw) => updateField("business_phone", raw)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-base font-semibold">Business Address</Label>
                       <div className="space-y-2">
                         <Label htmlFor="cv-street" className="text-sm font-normal text-muted-foreground">Street</Label>
                         <Input
                           id="cv-street"
                           value={form.business_street || ""}
                           onChange={(e) => updateField("business_street", e.target.value)}
                           placeholder="123 Main St"
                         />
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <div className="space-y-2">
                           <Label htmlFor="cv-city" className="text-sm font-normal text-muted-foreground">City</Label>
                           <Input
                             id="cv-city"
                             value={form.city || ""}
                             onChange={(e) => updateField("city", e.target.value)}
                             placeholder="City"
                           />
                         </div>
                         <div className="space-y-2">
                           <Label className="text-sm font-normal text-muted-foreground">State</Label>
                           <Select value={form.state || ""} onValueChange={(v) => updateField("state", v)}>
                             <SelectTrigger><SelectValue placeholder="State" /></SelectTrigger>
                             <SelectContent>
                               {US_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                             </SelectContent>
                           </Select>
                         </div>
                         <div className="space-y-2">
                           <Label htmlFor="cv-zip" className="text-sm font-normal text-muted-foreground">ZIP Code</Label>
                           <Input
                             id="cv-zip"
                             value={form.business_zip || ""}
                             onChange={(e) => updateField("business_zip", e.target.value)}
                             placeholder="12345"
                             inputMode="numeric"
                           />
                         </div>
                       </div>
                    </div>
                    <div className="space-y-2">
                      <Label>License Type</Label>
                      <RadioGroup value={form.license_type || ""} onValueChange={(v) => updateField("license_type", v)}>
                        {["Residential Agent", "Commercial Agent", "Residential Broker", "Commercial Broker", "Other"].map((opt) => (
                          <div key={opt} className="flex items-center space-x-2">
                            <RadioGroupItem value={opt} id={`cv-lt-${opt}`} />
                            <Label htmlFor={`cv-lt-${opt}`} className="font-normal">{opt}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                      {form.license_type === "Other" && (
                        <div className="pl-6 space-y-1">
                          <Label htmlFor="cv-license_type_other" className="text-sm">
                            Please specify <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="cv-license_type_other"
                            value={form.license_type_other || ""}
                            onChange={(e) => updateField("license_type_other", e.target.value)}
                            placeholder="e.g. Associate Broker, Team Lead, Referral Agent"
                            maxLength={120}
                          />
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Years in RE</Label>
                        <Select value={form.years_in_real_estate || ""} onValueChange={(v) => updateField("years_in_real_estate", v)}>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            {["Less than 1 year", "1–3 years", "3–5 years", "5–10 years", "10–15 years", "15+ years"].map((r) => (
                              <SelectItem key={r} value={r}>{r}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Gross Commission (Last 12 Months)</Label>
                        <Select value={form.gci_last_12_months || ""} onValueChange={(v) => updateField("gci_last_12_months", v)}>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            {["Under $50K", "$50K–$100K", "$100K–$250K", "$250K–$500K", "$500K–$1M", "Over $1M"].map((r) => (
                              <SelectItem key={r} value={r}>{r}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <CoachNotesPanel
                section="profile"
                notes={sectionNotes("profile")}
                noteText={noteTexts.profile || ""}
                onNoteChange={(v) => setNoteTexts((p) => ({ ...p, profile: v }))}
                onSave={() => handleSaveNote("profile")}
                saving={savingNote === "profile"}
              />
            </div>
          </TabsContent>

          {/* Goals */}
          <TabsContent value="goals">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Goals</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {(() => {
                      const goals = (form.primary_goals as string[] | null) || [];
                      const pains = (form.financial_pains as string[] | null) || [];
                      const toggle = (key: "primary_goals" | "financial_pains", opt: string, max: number) => {
                        const arr = (form[key] as string[] | null) || [];
                        if (arr.includes(opt)) {
                          updateField(key, arr.filter((v) => v !== opt));
                        } else if (arr.length < max) {
                          updateField(key, [...arr, opt]);
                        } else {
                          toast.error(`Pick up to ${max}. Uncheck one to change your selection.`);
                        }
                      };
                      return (
                        <>
                          <div className="space-y-2">
                            <Label>Primary Financial Goals (Top 3)</Label>
                            <p className="text-xs text-muted-foreground">Selected {goals.length} of {MAX_GOALS}.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {GOAL_OPTIONS.map((opt) => {
                                const checked = goals.includes(opt);
                                const disabled = !checked && goals.length >= MAX_GOALS;
                                return (
                                  <div key={opt} className="flex items-start space-x-2">
                                    <Checkbox
                                      id={`cv-pg-${opt}`}
                                      checked={checked}
                                      disabled={disabled}
                                      onCheckedChange={() => toggle("primary_goals", opt, MAX_GOALS)}
                                    />
                                    <Label htmlFor={`cv-pg-${opt}`} className={`font-normal ${disabled ? "opacity-50" : ""}`}>{opt}</Label>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Financial Pains (Up to 3)</Label>
                            <p className="text-xs text-muted-foreground">Selected {pains.length} of {MAX_PAINS}.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {PAIN_OPTIONS.map((opt) => {
                                const checked = pains.includes(opt);
                                const disabled = !checked && pains.length >= MAX_PAINS;
                                return (
                                  <div key={opt} className="flex items-start space-x-2">
                                    <Checkbox
                                      id={`cv-pain-${opt}`}
                                      checked={checked}
                                      disabled={disabled}
                                      onCheckedChange={() => toggle("financial_pains", opt, MAX_PAINS)}
                                    />
                                    <Label htmlFor={`cv-pain-${opt}`} className={`font-normal ${disabled ? "opacity-50" : ""}`}>{opt}</Label>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <GoalStatement goals={goals} pains={pains} name={form.first_name || form.contact_name} />

                          <div className="space-y-2">
                            <Label>Goals notes</Label>
                            <Textarea value={form.goals_notes || ""} onChange={(e) => updateField("goals_notes", e.target.value)} rows={3} />
                          </div>
                        </>
                      );
                    })()}
                  </CardContent>
                </Card>
              </div>
              <CoachNotesPanel
                section="goals"
                notes={sectionNotes("goals")}
                noteText={noteTexts.goals || ""}
                onNoteChange={(v) => setNoteTexts((p) => ({ ...p, goals: v }))}
                onSave={() => handleSaveNote("goals")}
                saving={savingNote === "goals"}
              />
            </div>
          </TabsContent>

          {/* Business Structure */}
          <TabsContent value="structure">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Business Structure & Credibility</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-2">
                      <Label>Business entity</Label>
                      <RadioGroup value={form.has_business_entity || ""} onValueChange={(v) => updateField("has_business_entity", v)}>
                        {["Corporation", "LLC", "Partnership", "Sole Proprietor", "Not sure"].map((opt) => (
                          <div key={opt} className="flex items-center space-x-2">
                            <RadioGroupItem value={opt} id={`cv-be-${opt}`} />
                            <Label htmlFor={`cv-be-${opt}`} className="font-normal">{opt}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="space-y-2">
                      <Label>Business address</Label>
                      <RadioGroup value={form.has_business_address || ""} onValueChange={(v) => updateField("has_business_address", v)}>
                        {["Physical office", "Virtual office", "Home address", "No / Other"].map((opt) => (
                          <div key={opt} className="flex items-center space-x-2">
                            <RadioGroupItem value={opt} id={`cv-ba-${opt}`} />
                            <Label htmlFor={`cv-ba-${opt}`} className="font-normal">{opt}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox checked={form.has_business_phone || false} onCheckedChange={(v) => updateField("has_business_phone", !!v)} id="cv-bp" />
                        <Label htmlFor="cv-bp" className="font-normal">Business phone</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox checked={form.has_business_email || false} onCheckedChange={(v) => updateField("has_business_email", !!v)} id="cv-be" />
                        <Label htmlFor="cv-be" className="font-normal">Business email</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox checked={form.has_business_website || false} onCheckedChange={(v) => updateField("has_business_website", !!v)} id="cv-bw" />
                        <Label htmlFor="cv-bw" className="font-normal">Business website</Label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Business bank account</Label>
                      <RadioGroup value={form.has_business_bank_account || ""} onValueChange={(v) => updateField("has_business_bank_account", v)}>
                        {["Fully separate", "Partially mixed", "Personal only"].map((opt) => (
                          <div key={opt} className="flex items-center space-x-2">
                            <RadioGroupItem value={opt} id={`cv-bb-${opt}`} />
                            <Label htmlFor={`cv-bb-${opt}`} className="font-normal">{opt}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="space-y-2">
                      <Label>Accounting software</Label>
                      <RadioGroup value={form.uses_accounting_software || ""} onValueChange={(v) => updateField("uses_accounting_software", v)}>
                        {["QuickBooks", "Xero", "Spreadsheet", "None"].map((opt) => (
                          <div key={opt} className="flex items-center space-x-2">
                            <RadioGroupItem value={opt} id={`cv-as-${opt}`} />
                            <Label htmlFor={`cv-as-${opt}`} className="font-normal">{opt}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <CoachNotesPanel
                section="structure"
                notes={sectionNotes("structure")}
                noteText={noteTexts.structure || ""}
                onNoteChange={(v) => setNoteTexts((p) => ({ ...p, structure: v }))}
                onSave={() => handleSaveNote("structure")}
                saving={savingNote === "structure"}
              />
            </div>
          </TabsContent>

          {/* Credit & Funding */}
          <TabsContent value="credit">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Business Credit & Funding</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-2">
                      <Label>Business credit cards</Label>
                      <RadioGroup value={form.business_credit_cards || ""} onValueChange={(v) => updateField("business_credit_cards", v)}>
                        {["None", "Cards with personal guarantee", "EIN-only cards"].map((opt) => (
                          <div key={opt} className="flex items-center space-x-2">
                            <RadioGroupItem value={opt} id={`cv-cc-${opt}`} />
                            <Label htmlFor={`cv-cc-${opt}`} className="font-normal">{opt}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="space-y-2">
                      <Label>Vendor tradelines</Label>
                      <RadioGroup value={form.vendor_tradelines || ""} onValueChange={(v) => updateField("vendor_tradelines", v)}>
                        {["3+ reporting", "1–2 reporting", "None / Not sure"].map((opt) => (
                          <div key={opt} className="flex items-center space-x-2">
                            <RadioGroupItem value={opt} id={`cv-vt-${opt}`} />
                            <Label htmlFor={`cv-vt-${opt}`} className="font-normal">{opt}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="space-y-2">
                      <Label>Credit reporting bureaus</Label>
                      {["Dun & Bradstreet", "Experian Business", "Equifax Small Business", "Not sure"].map((opt) => (
                        <div key={opt} className="flex items-center space-x-2">
                          <Checkbox
                            checked={(form.credit_reporting_bureaus || []).includes(opt)}
                            onCheckedChange={() => toggleArrayField("credit_reporting_bureaus", opt)}
                            id={`cv-crb-${opt}`}
                          />
                          <Label htmlFor={`cv-crb-${opt}`} className="font-normal">{opt}</Label>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Label>How do you fund gaps between closings?</Label>
                      {["Personal credit cards", "Savings", "Commission advances", "Personal loans/HELOC", "Business LOC/card", "Other"].map((opt) => (
                        <div key={opt} className="flex items-center space-x-2">
                          <Checkbox
                            checked={(form.funding_gap_methods || []).includes(opt)}
                            onCheckedChange={() => toggleArrayField("funding_gap_methods", opt)}
                            id={`cv-fgm-${opt}`}
                          />
                          <Label htmlFor={`cv-fgm-${opt}`} className="font-normal">{opt}</Label>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Label>Desired funding types (12–24 months)</Label>
                      {["Higher-limit business cards", "Business LOC", "Term loan", "Vehicle/equipment financing", "Short-term bridge funds"].map((opt) => (
                        <div key={opt} className="flex items-center space-x-2">
                          <Checkbox
                            checked={(form.desired_funding_types || []).includes(opt)}
                            onCheckedChange={() => toggleArrayField("desired_funding_types", opt)}
                            id={`cv-dft-${opt}`}
                          />
                          <Label htmlFor={`cv-dft-${opt}`} className="font-normal">{opt}</Label>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Label>Personal guarantee comfort</Label>
                      <RadioGroup value={form.personal_guarantee_comfort || ""} onValueChange={(v) => updateField("personal_guarantee_comfort", v)}>
                        {["Want to reduce PGs", "OK with PGs", "Want options"].map((opt) => (
                          <div key={opt} className="flex items-center space-x-2">
                            <RadioGroupItem value={opt} id={`cv-pgc-${opt}`} />
                            <Label htmlFor={`cv-pgc-${opt}`} className="font-normal">{opt}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="space-y-2">
                      <Label>Personal credit score range (Currently)</Label>
                      <Select value={form.personal_credit_score_range || ""} onValueChange={(v) => updateField("personal_credit_score_range", v)}>
                        <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
                        <SelectContent>
                          {["Below 600", "600–649", "650–699", "700–749", "750–799", "800+", "Prefer not to say"].map((r) => (
                            <SelectItem key={r} value={r}>{r}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <CoachNotesPanel
                section="credit"
                notes={sectionNotes("credit")}
                noteText={noteTexts.credit || ""}
                onNoteChange={(v) => setNoteTexts((p) => ({ ...p, credit: v }))}
                onSave={() => handleSaveNote("credit")}
                saving={savingNote === "credit"}
              />
            </div>
          </TabsContent>

          {/* Program Fit */}
          <TabsContent value="program">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Program Fit & Support Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-2">
                      <Label>Preferred support format</Label>
                      <RadioGroup value={form.preferred_support_format || ""} onValueChange={(v) => updateField("preferred_support_format", v)}>
                        {["One-on-one coaching", "Small cohort (5–10)", "Self-paced with check-ins"].map((opt) => (
                          <div key={opt} className="flex items-center space-x-2">
                            <RadioGroupItem value={opt} id={`cv-psf-${opt}`} />
                            <Label htmlFor={`cv-psf-${opt}`} className="font-normal">{opt}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="space-y-2">
                      <Label>Interest in 90-day cohort</Label>
                      <RadioGroup value={form.interest_in_cohort || ""} onValueChange={(v) => updateField("interest_in_cohort", v)}>
                        {["Yes", "Maybe", "Not now"].map((opt) => (
                          <div key={opt} className="flex items-center space-x-2">
                            <RadioGroupItem value={opt} id={`cv-ic-${opt}`} />
                            <Label htmlFor={`cv-ic-${opt}`} className="font-normal">{opt}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="space-y-2">
                      <Label>Preferred cohort session time</Label>
                      <p className="text-xs text-muted-foreground">Cohorts meet Mon/Wed/Fri at 7:00 AM or 5:00 PM PT.</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-sm font-normal">1st choice</Label>
                          <Select
                            value={(form as any).preferred_cohort_time_1 || ""}
                            onValueChange={(v) => {
                              const second = (form as any).preferred_cohort_time_2 || "";
                              updateField("preferred_cohort_time_1" as any, v);
                              updateField("preferred_cohort_days", [v, second].filter(Boolean).join("; "));
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
                            value={(form as any).preferred_cohort_time_2 || ""}
                            onValueChange={(v) => {
                              const first = (form as any).preferred_cohort_time_1 || "";
                              updateField("preferred_cohort_time_2" as any, v);
                              updateField("preferred_cohort_days", [first, v].filter(Boolean).join("; "));
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
                      <Label>Ready to get started?</Label>
                      <RadioGroup value={form.investment_readiness || ""} onValueChange={(v) => updateField("investment_readiness", v)}>
                        {[
                          "I'm ready to start now",
                          "I want to start within 30 days",
                          "I need more clarity first",
                          "I'm just exploring",
                        ].map((opt) => (
                          <div key={opt} className="flex items-center space-x-2">
                            <RadioGroupItem value={opt} id={`cv-ir-${opt}`} />
                            <Label htmlFor={`cv-ir-${opt}`} className="font-normal">{opt}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <IntakePricingAndReadiness readiness={form.investment_readiness} />
                    <div className="space-y-2">
                      <Label>Anything else you want us to know?</Label>
                      <Textarea value={form.additional_notes || ""} onChange={(e) => updateField("additional_notes", e.target.value)} rows={4} />
                    </div>
                  </CardContent>
                </Card>
              </div>
              <CoachNotesPanel
                section="program"
                notes={sectionNotes("program")}
                noteText={noteTexts.program || ""}
                onNoteChange={(v) => setNoteTexts((p) => ({ ...p, program: v }))}
                onSave={() => handleSaveNote("program")}
                saving={savingNote === "program"}
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// Private Coach Notes Panel
function CoachNotesPanel({
  section,
  notes,
  noteText,
  onNoteChange,
  onSave,
  saving,
}: {
  section: string;
  notes: CoachNote[];
  noteText: string;
  onNoteChange: (v: string) => void;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <Card className="border-dashed border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <StickyNote className="h-4 w-4 text-amber-600" />
          Coach Notes
        </CardTitle>
        <CardDescription className="text-xs">
          Private — only visible to coaches, not the agent.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          value={noteText}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="Add a private note about this section..."
          rows={3}
          className="text-sm"
        />
        <Button
          size="sm"
          variant="outline"
          onClick={onSave}
          disabled={saving || !noteText?.trim()}
          className="w-full"
        >
          {saving ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Save className="h-3 w-3 mr-1" />}
          Save Note
        </Button>
        {notes.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {notes.map((n) => (
                <div key={n.id} className="p-2 bg-background rounded text-sm">
                  <p>{n.note}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(n.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
