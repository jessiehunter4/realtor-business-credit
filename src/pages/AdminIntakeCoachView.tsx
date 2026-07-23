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
  { key: "profile", label: "Profile & Production", icon: User },
  { key: "goals", label: "Goals", icon: Target },
  { key: "structure", label: "Business Structure", icon: Building },
  { key: "credit", label: "Credit & Funding", icon: CreditCard },
  { key: "program", label: "Program Fit", icon: Handshake },
] as const;

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
const FUNDING_AMOUNT_OPTIONS = ["Under $10K","$10K–$25K","$25K–$50K","$50K–$100K","$100K–$250K","$250K+","Not sure"];
const CREDIT_CAPACITY_OPTIONS = ["Under $5K","$5K–$10K","$10K–$25K","$25K–$50K","$50K–$100K","$100K+","Not sure"];

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
  const [existingPlanId, setExistingPlanId] = useState<string | null>(null);
  const [existingPlanStatus, setExistingPlanStatus] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [programs, setPrograms] = useState<Array<{ slug: string; name: string; tagline?: string | null }>>([]);
  const [planRec, setPlanRec] = useState<{
    slug: string | null;
    reasoning: any;
    score: any;
    overriddenAt: string | null;
  }>({ slug: null, reasoning: null, score: null, overriddenAt: null });
  const [overrideSlug, setOverrideSlug] = useState<string>("");
  const [savingOverride, setSavingOverride] = useState(false);

  const fetchData = useCallback(async () => {
    if (!id) return;
    const [surveyRes, notesRes, planRes] = await Promise.all([
      supabase.from("intake_surveys").select("*").eq("id", id).single(),
      supabase.from("intake_coach_notes").select("*").eq("intake_survey_id", id).order("created_at", { ascending: false }),
      supabase
        .from("custom_plans")
        .select("id, status, recommended_program_slug, recommendation_reasoning, recommendation_score, recommendation_overridden_at")
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
    const plan = planRes.data?.[0];
    setExistingPlanId(plan?.id || null);
    setExistingPlanStatus(plan?.status || null);
    setPlanRec({
      slug: plan?.recommended_program_slug || null,
      reasoning: plan?.recommendation_reasoning || null,
      score: plan?.recommendation_score || null,
      overriddenAt: plan?.recommendation_overridden_at || null,
    });
    setOverrideSlug(plan?.recommended_program_slug || "");
    setLoading(false);
  }, [id, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("programs")
        .select("slug, name, tagline")
        .eq("active", true)
        .order("sort_order", { ascending: true });
      setPrograms((data as any[]) || []);
    })();
  }, []);

  const handleSaveOverride = async () => {
    if (!existingPlanId || !overrideSlug) return;
    setSavingOverride(true);
    try {
      const { data, error } = await supabase.functions.invoke("override-recommendation", {
        body: { plan_id: existingPlanId, program_slug: overrideSlug },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success("Recommendation overridden");
      fetchData();
    } catch (e: any) {
      toast.error(e.message || "Failed to override");
    }
    setSavingOverride(false);
  };

  const handleClearOverride = async () => {
    if (!existingPlanId) return;
    setSavingOverride(true);
    try {
      const { data, error } = await supabase.functions.invoke("override-recommendation", {
        body: { plan_id: existingPlanId, clear: true },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success("Override cleared — regenerate plan to refresh AI recommendation");
      fetchData();
    } catch (e: any) {
      toast.error(e.message || "Failed to clear override");
    }
    setSavingOverride(false);
  };

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
      "top_financial_goal", "top_financial_need",
      "desired_monthly_credit_capacity", "has_business_entity", "entity_type",
      "primary_goal", "additional_goals", "top_financial_pain",
      "goal_time_horizon", "target_funding_amount", "goals_notes",
      "has_business_address", "address_type", "has_business_phone",
      "has_business_email", "has_business_website", "has_business_bank_account",
      "uses_accounting_software", "accounting_software_name",
      "business_credit_cards", "vendor_tradelines", "credit_reporting_bureaus",
      "funding_gap_methods", "desired_funding_types", "personal_guarantee_comfort",
      "personal_credit_score_range", "preferred_support_format",
      "interest_in_cohort", "preferred_cohort_days", "investment_readiness",
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
    try {
      const { data, error } = await supabase.functions.invoke("generate-plan", {
        body: { intake_survey_id: id },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success(data?.superseded ? "Plan updated (existing draft refreshed)" : "Plan generated!");
      navigate(`/admin/plan/${data.plan_id}`);
    } catch (e: any) {
      toast.error(e.message || "Failed to generate plan");
    }
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
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin/intake")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">{survey.contact_name || "Unnamed"}</h1>
                {statusBadge}
              </div>
              <p className="text-sm text-muted-foreground">{survey.contact_email}</p>
            </div>
          </div>
          <div className="flex gap-2">
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
                <Button variant="outline" onClick={() => navigate(`/admin/plan/${existingPlanId}`)}>
                  <FileText className="h-4 w-4 mr-1" /> View Plan
                </Button>
                {existingPlanStatus === "draft" && (
                  <Button onClick={handleQuickPublish} disabled={publishing}>
                    {publishing ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Send className="h-4 w-4 mr-1" />}
                    Publish
                  </Button>
                )}
              </>
            )}
            <Button
              variant="secondary"
              onClick={handleGeneratePlan}
              disabled={generatingPlan}
            >
              {generatingPlan ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Sparkles className="h-4 w-4 mr-1" />}
              {existingPlanId ? "Regenerate Plan" : "Generate Plan"}
            </Button>
            {survey.status === "submitted" && (
              <Button variant="outline" onClick={handleMarkReviewed}>
                <CheckCircle className="h-4 w-4 mr-1" /> Mark Reviewed
              </Button>
            )}
            <Button onClick={handleSaveProxy} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
              Save Changes
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 flex-wrap h-auto gap-1">
            {SECTIONS.map((s) => (
              <TabsTrigger key={s.key} value={s.key} className="gap-1.5">
                <s.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{s.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Profile & Production */}
          <TabsContent value="profile">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile & Production</CardTitle>
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
                        <Label>City</Label>
                        <Input value={form.city || ""} onChange={(e) => updateField("city", e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>State</Label>
                      <Select value={form.state || ""} onValueChange={(v) => updateField("state", v)}>
                        <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                        <SelectContent>
                          {US_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
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
                        <Label>Gross Commission Income (Last 12 Months)</Label>
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
                    <div className="space-y-2">
                      <Label>Primary financial goal</Label>
                      <RadioGroup value={form.primary_goal || ""} onValueChange={(v) => {
                        updateField("primary_goal", v);
                        updateField("top_financial_goal", v);
                        const extras = ((form.additional_goals as string[] | null) || []).filter((g) => g !== v);
                        updateField("additional_goals", extras);
                      }}>
                        {GOAL_OPTIONS.map((opt) => (
                          <div key={opt} className="flex items-center space-x-2">
                            <RadioGroupItem value={opt} id={`cv-pg-${opt}`} />
                            <Label htmlFor={`cv-pg-${opt}`} className="font-normal">{opt}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label>Additional goals</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {GOAL_OPTIONS.filter((o) => o !== form.primary_goal).map((opt) => {
                          const arr = (form.additional_goals as string[] | null) || [];
                          const checked = arr.includes(opt);
                          return (
                            <div key={opt} className="flex items-start space-x-2">
                              <Checkbox
                                id={`cv-ag-${opt}`}
                                checked={checked}
                                onCheckedChange={() => {
                                  const next = checked ? arr.filter((v) => v !== opt) : [...arr, opt];
                                  updateField("additional_goals", next);
                                }}
                              />
                              <Label htmlFor={`cv-ag-${opt}`} className="font-normal">{opt}</Label>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Top financial pain right now</Label>
                      <RadioGroup value={form.top_financial_pain || ""} onValueChange={(v) => {
                        updateField("top_financial_pain", v);
                        updateField("top_financial_need", v);
                      }}>
                        {PAIN_OPTIONS.map((opt) => (
                          <div key={opt} className="flex items-center space-x-2">
                            <RadioGroupItem value={opt} id={`cv-pain-${opt}`} />
                            <Label htmlFor={`cv-pain-${opt}`} className="font-normal">{opt}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Time horizon</Label>
                        <Select value={form.goal_time_horizon || ""} onValueChange={(v) => updateField("goal_time_horizon", v)}>
                          <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
                          <SelectContent>
                            {HORIZON_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Target funding amount</Label>
                        <Select value={form.target_funding_amount || ""} onValueChange={(v) => updateField("target_funding_amount", v)}>
                          <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
                          <SelectContent>
                            {FUNDING_AMOUNT_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Desired monthly credit capacity</Label>
                      <Select value={form.desired_monthly_credit_capacity || ""} onValueChange={(v) => updateField("desired_monthly_credit_capacity", v)}>
                        <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
                        <SelectContent>
                          {CREDIT_CAPACITY_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Goals notes</Label>
                      <Textarea value={form.goals_notes || ""} onChange={(e) => updateField("goals_notes", e.target.value)} rows={3} />
                    </div>

                    {(form.top_financial_goal || form.top_financial_need) && !form.primary_goal && !form.top_financial_pain ? (
                      <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 space-y-1">
                        <div className="font-medium">Legacy free-text goal responses:</div>
                        {form.top_financial_goal ? <div><span className="font-semibold">Goal:</span> {form.top_financial_goal}</div> : null}
                        {form.top_financial_need ? <div><span className="font-semibold">Need:</span> {form.top_financial_need}</div> : null}
                      </div>
                    ) : null}
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
                      <Label>Personal credit score range (right now or currently)</Label>
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
            {existingPlanId && (
              <Card className="mb-6 border-primary/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Program Recommendation
                    {planRec.overriddenAt && (
                      <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800">
                        Coach override
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {planRec.slug ? (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Current: </span>
                      <span className="font-semibold">
                        {programs.find((p) => p.slug === planRec.slug)?.name || planRec.slug}
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No recommendation yet. Regenerate the plan to compute one.
                    </p>
                  )}

                  {Array.isArray(planRec.reasoning?.bullets) && planRec.reasoning.bullets.length > 0 && (
                    <div>
                      <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                        Why this fits
                      </Label>
                      <ul className="mt-1.5 space-y-1 text-sm">
                        {planRec.reasoning.bullets.map((b: any, i: number) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-primary">•</span>
                            <span>{b.bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {planRec.score?.scores && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                        Score breakdown
                      </summary>
                      <div className="mt-2 space-y-1 font-mono">
                        {Object.entries(planRec.score.scores).map(([slug, s]: any) => (
                          <div key={slug} className="flex justify-between border-b border-dashed py-0.5">
                            <span>{slug}</span>
                            <span className="font-bold">{String(s)}</span>
                          </div>
                        ))}
                      </div>
                    </details>
                  )}

                  <div className="pt-3 border-t space-y-2">
                    <Label>Override recommendation</Label>
                    <div className="flex gap-2">
                      <select
                        value={overrideSlug}
                        onChange={(e) => setOverrideSlug(e.target.value)}
                        className="flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm"
                      >
                        <option value="">Select a program…</option>
                        {programs.map((p) => (
                          <option key={p.slug} value={p.slug}>{p.name}</option>
                        ))}
                      </select>
                      <Button
                        onClick={handleSaveOverride}
                        disabled={savingOverride || !overrideSlug || overrideSlug === planRec.slug}
                      >
                        {savingOverride ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save override"}
                      </Button>
                      {planRec.overriddenAt && (
                        <Button variant="outline" onClick={handleClearOverride} disabled={savingOverride}>
                          Clear
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Overrides persist through plan regeneration. Clear the override to let the engine recompute on the next regeneration.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

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
                      <Label>Preferred days/times for cohort</Label>
                      <Input value={form.preferred_cohort_days || ""} onChange={(e) => updateField("preferred_cohort_days", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Investment readiness</Label>
                      <RadioGroup value={form.investment_readiness || ""} onValueChange={(v) => updateField("investment_readiness", v)}>
                        {["Ready now", "Within 30 days", "Need more clarity", "Just exploring"].map((opt) => (
                          <div key={opt} className="flex items-center space-x-2">
                            <RadioGroupItem value={opt} id={`cv-ir-${opt}`} />
                            <Label htmlFor={`cv-ir-${opt}`} className="font-normal">{opt}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
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
