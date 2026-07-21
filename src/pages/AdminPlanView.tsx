import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Send, Eye, Pencil } from "lucide-react";
import PlanDocument, { type PlanData } from "@/components/plan/PlanDocument";
import type { Json } from "@/integrations/supabase/types";

export default function AdminPlanView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [plan, setPlan] = useState<any>(null);
  const [planData, setPlanData] = useState<PlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchPlan = useCallback(async () => {
    if (!id) return;
    const { data, error } = await supabase.from("custom_plans").select("*").eq("id", id).single();
    if (error || !data) {
      toast.error("Plan not found");
      navigate("/admin/intake");
      return;
    }
    setPlan(data);
    setPlanData(data.plan_data as unknown as PlanData);
    setLoading(false);
  }, [id, navigate]);

  useEffect(() => { fetchPlan(); }, [fetchPlan]);

  const handleEditSection = (section: string, value: string) => {
    if (!planData) return;
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
  };

  const handleSave = async () => {
    if (!id || !planData) return;
    setSaving(true);
    const { error } = await supabase
      .from("custom_plans")
      .update({ plan_data: planData as unknown as Json })
      .eq("id", id);
    if (error) {
      toast.error("Failed to save changes");
    } else {
      toast.success("Plan saved");
      setEditMode(false);
    }
    setSaving(false);
  };

  const handlePublish = async () => {
    if (!id || !planData) return;
    setPublishing(true);
    const { error } = await supabase
      .from("custom_plans")
      .update({
        status: "published",
        published_at: new Date().toISOString(),
        plan_data: planData as unknown as Json,
      })
      .eq("id", id);
    if (error) {
      toast.error("Failed to publish");
    } else {
      toast.success("Plan published! The agent can now view it.");
      fetchPlan();
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

  if (!plan || !planData) return null;

  const portalUrl = `${window.location.origin}/portal/plan/${id}`;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">Plan: {planData.contact_name || "Agent"}</h1>
                <Badge variant="outline" className={plan.status === "published" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}>
                  {plan.status}
                </Badge>
              </div>
              {plan.status === "published" && (
                <button
                  onClick={() => { navigator.clipboard.writeText(portalUrl); toast.success("Portal link copied!"); }}
                  className="text-sm text-primary hover:underline"
                >
                  Copy agent portal link
                </button>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {editMode ? (
              <>
                <Button variant="outline" onClick={() => { setEditMode(false); fetchPlan(); }}>Cancel</Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                  Save
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setEditMode(true)}>
                  <Pencil className="h-4 w-4 mr-1" /> Edit
                </Button>
                {plan.status === "draft" && (
                  <Button onClick={handlePublish} disabled={publishing}>
                    {publishing ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Send className="h-4 w-4 mr-1" />}
                    Publish
                  </Button>
                )}
                {plan.status === "published" && (
                  <Button variant="outline" onClick={() => window.open(portalUrl, "_blank")}>
                    <Eye className="h-4 w-4 mr-1" /> View Portal
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <PlanDocument
          planData={planData}
          editMode={editMode}
          onEditSection={handleEditSection}
          createdAt={plan.created_at}
          updatedAt={plan.updated_at}
        />
      </main>
    </div>
  );
}
