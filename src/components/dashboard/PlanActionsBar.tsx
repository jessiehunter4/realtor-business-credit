import { useCallback, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { Download, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import PlanPDF, { type PlanPrintItem } from "@/components/plan/PlanPDF";
import { supabase } from "@/integrations/supabase/client";
import type { PlanItem } from "@/lib/planItems";
import { useDashboardCtx } from "@/pages/dashboard/DashboardLayout";

const toPrint = (items: PlanItem[]): PlanPrintItem[] =>
  items.map((i) => ({
    title: i.title,
    detail: i.detail,
    meta: i.meta,
    status: i.status,
    custom: i.custom,
  }));

export default function PlanActionsBar() {
  const { plan, survey, planItems, refresh } = useDashboardCtx();
  const [downloading, setDownloading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!plan?.plan_data) return;
    setDownloading(true);
    try {
      const blob = await pdf(
        <PlanPDF
          planData={plan.plan_data}
          createdAt={plan.created_at}
          updatedAt={plan.updated_at}
          progress={{
            goals: toPrint(planItems.goals),
            actions: toPrint(planItems.actions),
            milestones: toPrint(planItems.milestones),
            funding: toPrint(planItems.funding),
          }}
        />,
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Business-Credit-Plan-${(plan.plan_data.contact_name || "Agent").replace(/\s+/g, "-")}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      toast.error("Could not build the PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  }, [plan, planItems]);

  const handleRegenerate = useCallback(async () => {
    const surveyId = survey?.id ?? plan?.intake_survey_id;
    if (!surveyId) {
      toast.error("We couldn't find your needs analysis to rebuild from.");
      return;
    }
    setRegenerating(true);
    const { error } = await supabase.functions.invoke("generate-plan", {
      body: { intake_survey_id: surveyId, source: "user", force: true },
    });
    setRegenerating(false);
    if (error) {
      console.error(error);
      toast.error("Could not regenerate your plan right now.");
      return;
    }
    toast.success("Your plan has been regenerated. Your edits and progress are kept.");
    await refresh();
  }, [survey?.id, plan?.intake_survey_id, refresh]);

  if (!plan?.plan_data) return null;

  return (
    <Card>
      <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-secondary">Your plan, your way</p>
          <p className="text-xs text-muted-foreground">
            Print the live version — including your edits, added items, and progress — or rebuild it from your
            latest needs analysis.
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="rounded-full" onClick={handleDownload} disabled={downloading}>
            {downloading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
            {downloading ? "Preparing..." : "Download / Print PDF"}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" className="rounded-full" disabled={regenerating}>
                {regenerating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Regenerate plan
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Regenerate your plan?</AlertDialogTitle>
                <AlertDialogDescription>
                  We'll rebuild your plan from your most recent needs analysis. Your added items, edits, and completed
                  progress stay with you — generated wording may change.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleRegenerate}>Regenerate</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}