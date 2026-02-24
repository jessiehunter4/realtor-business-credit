import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import PlanDocument, { type PlanData } from "@/components/plan/PlanDocument";

export default function PortalPlanView() {
  const { id } = useParams<{ id: string }>();
  const [planData, setPlanData] = useState<PlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-[#3eaf7c]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-6">
          <h1 className="text-2xl font-bold text-[#1e3a5f] mb-2">Plan Unavailable</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!planData) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <PlanDocument planData={planData} />
      </div>
    </div>
  );
}
