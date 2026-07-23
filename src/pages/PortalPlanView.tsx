import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Download, FileText, ListChecks } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PlanDocument, { type PlanData } from "@/components/plan/PlanDocument";
import PlanPDF from "@/components/plan/PlanPDF";
import PlanTaskChecklist from "@/components/plan/PlanTaskChecklist";
import NextStepPanel, { type ReadinessId } from "@/components/plan/NextStepPanel";
import { useContactIdentity } from "@/hooks/useContactIdentity";

export default function PortalPlanView() {
  const { id } = useParams<{ id: string }>();
  const { contactId } = useContactIdentity();
  const [planData, setPlanData] = useState<PlanData | null>(null);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [readiness, setReadiness] = useState<ReadinessId | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    async function fetchPlan() {
      if (!id) return;
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
  }, [id]);

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
            <Button onClick={handleDownload} disabled={generating} size="sm">
              {generating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              {generating ? "Generating..." : "Download PDF"}
            </Button>
          </div>
          <TabsContent value="plan">
            <PlanDocument planData={planData} createdAt={createdAt} updatedAt={updatedAt} />
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
      </div>
    </div>
  );
}
