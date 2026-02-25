import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Download } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import PlanDocument, { type PlanData } from "@/components/plan/PlanDocument";
import PlanPDF from "@/components/plan/PlanPDF";

export default function PortalPlanView() {
  const { id } = useParams<{ id: string }>();
  const [planData, setPlanData] = useState<PlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    async function fetchPlan() {
      if (!id) return;
      const { data, error: fetchError } = await supabase
        .from("custom_plans")
        .select("plan_data, status")
        .eq("id", id)
        .single();

      if (fetchError || !data) {
        setError("Plan not found.");
        setLoading(false);
        return;
      }

      if (data.status !== "published") {
        setError("This plan is not yet available. Please check back later.");
        setLoading(false);
        return;
      }

      setPlanData(data.plan_data as unknown as PlanData);
      setLoading(false);
    }
    fetchPlan();
  }, [id]);

  const handleDownload = useCallback(async () => {
    if (!planData) return;
    setGenerating(true);
    try {
      const blob = await pdf(<PlanPDF planData={planData} />).toBlob();
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
  }, [planData]);

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
        <div className="flex justify-end mb-4">
          <Button onClick={handleDownload} disabled={generating} size="sm">
            {generating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            {generating ? "Generating..." : "Download PDF"}
          </Button>
        </div>
        <PlanDocument planData={planData} />
      </div>
    </div>
  );
}
