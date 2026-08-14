import { useEffect, useState, useCallback } from "react";
import { Link, useParams, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Download, FileText, ListChecks, ArrowLeft, Pencil, Save } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PlanDocument, { type PlanData } from "@/components/plan/PlanDocument";
import PlanPDF from "@/components/plan/PlanPDF";
import PlanTaskChecklist from "@/components/plan/PlanTaskChecklist";
import NextStepPanel, { type ReadinessId } from "@/components/plan/NextStepPanel";
import { useContactIdentity } from "@/hooks/useContactIdentity";
import type { Json } from "@/integrations/supabase/types";

export default function PortalPlanView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { contactId } = useContactIdentity();
  const [planData, setPlanData] = useState<PlanData | null>(null);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [readiness, setReadiness] = useState<ReadinessId | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [editMode, setEditMode] = useState(searchParams.get("edit") === "1");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchPlan() {
      if (!id) return;
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        navigate(`/login?next=${encodeURIComponent(location.pathname)}`, { replace: true });
        return;
      }
      const { data, error: fetchError } = await supabase
        .from("custom_plans")
        .select("plan_data, status, created_at, updated_at, readiness_selection")
        .eq("id", id)
        .maybeSingle();

      if (fetchError) {
        setError("We couldn't load this plan. Please try again in a moment.");
        setLoading(false);
        return;
      }
      if (!data) {
        setError("This plan link isn't valid. Please contact your coach for an updated link.");
        setLoading(false);
        return;
      }
      if (data.status === "draft") {
        setError("Your plan is still being finalized by your coach. You'll be notified as soon as it's ready to view.");
        setLoading(false);
        return;
      }
      if (data.status === "archived") {
        setError("This version of your plan has been replaced by a newer one. Please contact your coach for the current plan link.");
        setLoading(false);
        return;
      }
      if (data.status !== "published") {
        setError("This plan is not currently available. Please contact your coach.");
        setLoading(false);
        return;
      }

      setPlanData(data.plan_data as unknown as PlanData);
      setCreatedAt(data.created_at ?? null);
      setUpdatedAt(data.updated_at ?? null);
      setReadiness((data.readiness_selection as ReadinessId | null) ?? null);
      setLoading(false);
    }
    fetchPlan();
  }, [id, navigate, location.pathname]);

  const handleDownload = useCallback(async () => {
    if (!planData) return;
    setGenerating(true);
    try {
      const blob = await pdf(
        <PlanPDF planData={planData} createdAt={createdAt} updatedAt={updatedAt} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Business-Credit-Plan-${(planData.contact_name || "Agent").replace(/\s+/g, "-")}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("PDF generation failed:", e);
    } finally {
      setGenerating(false);
    }
  }, [planData, createdAt, updatedAt]);

  const handleEditSection = useCallback((section: string, value: string) => {
    setPlanData((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, sections: { ...prev.sections } };
      if (section === "goals_snapshot") {
        updated.sections.goals_snapshot = { narrative: value };
      } else if (section === "fundability") {
        updated.sections.fundability = { ...updated.sections.fundability, narrative: value };
      } else if (section === "next_steps") {
        updated.sections.next_steps = { ...updated.sections.next_steps, narrative: value };
      }
      return updated;
    });
  }, []);

  const exitEdit = useCallback(() => {
    setEditMode(false);
    const next = new URLSearchParams(searchParams);
    next.delete("edit");
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  const handleSave = useCallback(async () => {
    if (!id || !planData) return;
    setSaving(true);
    const { error: saveError } = await supabase
      .from("custom_plans")
      .update({ plan_data: planData as unknown as Json })
      .eq("id", id);
    setSaving(false);
    if (saveError) {
      console.error(saveError);
      toast.error("Could not save your changes. Please try again.");
      return;
    }
    toast.success("Your plan has been updated.");
    exitEdit();
  }, [id, planData, exitEdit]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center max-w-md px-6">
          <h1 className="text-2xl font-bold text-secondary mb-2">Plan Unavailable</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!planData) return null;

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="rounded-full">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
            </Button>
          </Link>
        </div>
        <Tabs defaultValue="plan" className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <TabsList>
              <TabsTrigger value="plan" className="gap-2">
                <FileText className="w-4 h-4" /> Plan
              </TabsTrigger>
              <TabsTrigger value="checklist" className="gap-2">
                <ListChecks className="w-4 h-4" /> Checklist
              </TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              {editMode ? (
                <>
                  <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save changes
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
                  <Pencil className="mr-2 h-4 w-4" /> Edit Plan
                </Button>
              )}
              <Button onClick={handleDownload} disabled={generating} size="sm">
                {generating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                {generating ? "Generating..." : "Download PDF"}
              </Button>
            </div>
          </div>
          <TabsContent value="plan">
            <PlanDocument
              planData={planData}
              createdAt={createdAt}
              updatedAt={updatedAt}
              editMode={editMode}
              onEditSection={handleEditSection}
            />
            <NextStepPanel
              planId={id}
              contactId={contactId || undefined}
              initialSelection={readiness}
            />
          </TabsContent>
          <TabsContent value="checklist">
            {id && <PlanTaskChecklist planId={id} planData={planData} />}
          </TabsContent>
        </Tabs>
        <div className="mt-8 flex justify-center">
          <Link to="/dashboard">
            <Button variant="outline" className="rounded-full">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
