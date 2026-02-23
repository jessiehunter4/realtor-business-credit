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
  User, Target, Building, CreditCard, Handshake,
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

  const fetchData = useCallback(async () => {
    if (!id) return;
    const [surveyRes, notesRes] = await Promise.all([
      supabase.from("intake_surveys").select("*").eq("id", id).single(),
      supabase.from("intake_coach_notes").select("*").eq("intake_survey_id", id).order("created_at", { ascending: false }),
    ]);

    if (surveyRes.error) {
      toast.error("Survey not found");
      navigate("/admin/intake");
      return;
    }

    setSurvey(surveyRes.data);
    setForm(surveyRes.data);
    setNotes(notesRes.data || []);
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
    const { id: _id, access_token, created_at, ...updateFields } = form as any;
    const { error } = await supabase.from("intake_surveys").update(updateFields).eq("id", id);
    if (error) {
      toast.error("Failed to save");
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
      toast.error("Failed to update status");
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
      toast.error("Failed to save note");
    } else {
      toast.success("Note saved");
      setNoteTexts((prev) => ({ ...prev, [section]: "" }));
      fetchData();
    }
    setSavingNote(null);
  };

  const sectionNotes = (section: string) => notes.filter((n) => n.section === section);

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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Contact Name</Label>
                        <Input value={form.contact_name || ""} onChange={(e) => updateField("contact_name", e.target.value)} />
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        <Label>GCI (12 mo)</Label>
                        <Select value={form.gci_last_12_months || ""} onValueChange={(v) => updateField("gci_last_12_months", v)}>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            {["Under $50K", "$50K–$100K", "$100K–$250K", "$250K–$500K", "$500K–$1M", "Over $1M"].map((r) => (
                              <SelectItem key={r} value={r}>{r}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Sides (12 mo)</Label>
                        <Select value={form.sides_closed_last_12_months || ""} onValueChange={(v) => updateField("sides_closed_last_12_months", v)}>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            {["0–5", "6–12", "13–24", "25–50", "50+"].map((r) => (
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
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Top financial goal (12–24 months)</Label>
                      <Textarea value={form.top_financial_goal || ""} onChange={(e) => updateField("top_financial_goal", e.target.value)} rows={3} />
                    </div>
                    <div className="space-y-2">
                      <Label>Most important financial need right now</Label>
                      <Textarea value={form.top_financial_need || ""} onChange={(e) => updateField("top_financial_need", e.target.value)} rows={3} />
                    </div>
                    <div className="space-y-2">
                      <Label>Desired monthly business credit capacity</Label>
                      <Input value={form.desired_monthly_credit_capacity || ""} onChange={(e) => updateField("desired_monthly_credit_capacity", e.target.value)} />
                    </div>
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
                      <Label>Personal credit score range (optional)</Label>
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
