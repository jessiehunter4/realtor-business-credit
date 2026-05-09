import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Loader2, ListChecks } from "lucide-react";
import { toast } from "sonner";
import type { PlanData } from "./PlanDocument";

interface Props {
  planId: string;
  planData: PlanData;
}

type ProgressRow = { task_key: string; completed: boolean };

const taskKey = (step: number, text: string) =>
  `action_${step}_${text.slice(0, 40).toLowerCase().replace(/[^a-z0-9]+/g, "_")}`;

export default function PlanTaskChecklist({ planId, planData }: Props) {
  const tasks = useMemo(
    () =>
      planData.sections.action_plan_90day.items.map((item) => ({
        key: taskKey(item.step, item.text),
        step: item.step,
        text: item.text,
        effort: item.effort,
      })),
    [planData],
  );

  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("plan_task_progress")
        .select("task_key, completed")
        .eq("plan_id", planId);
      if (!active) return;
      if (error) {
        console.error("Failed to load checklist", error);
      } else {
        const map: Record<string, boolean> = {};
        (data as ProgressRow[] | null)?.forEach((r) => (map[r.task_key] = r.completed));
        setProgress(map);
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [planId]);

  const completedCount = tasks.filter((t) => progress[t.key]).length;
  const pct = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  const toggle = async (task: { key: string; text: string }) => {
    const next = !progress[task.key];
    setProgress((p) => ({ ...p, [task.key]: next }));
    setSavingKey(task.key);
    const { error } = await supabase
      .from("plan_task_progress")
      .upsert(
        {
          plan_id: planId,
          task_key: task.key,
          task_label: task.text,
          completed: next,
          completed_at: next ? new Date().toISOString() : null,
        },
        { onConflict: "plan_id,task_key" },
      );
    setSavingKey(null);
    if (error) {
      setProgress((p) => ({ ...p, [task.key]: !next }));
      toast.error("Could not save your progress. Try again.");
      console.error(error);
    }
  };

  return (
    <div className="w-full bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden mb-6">
      <div className="bg-[#1e3a5f] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListChecks className="w-5 h-5 text-[#3eaf7c]" />
          <h3 className="text-white font-bold text-base">Your 90-Day Action Checklist</h3>
        </div>
        <span className="text-white/80 text-xs font-semibold">
          {completedCount} / {tasks.length} complete
        </span>
      </div>
      <div className="px-6 pt-4">
        <Progress value={pct} className="h-2" />
        <p className="text-xs text-gray-500 mt-2">
          {pct === 100
            ? "You've completed every action — bring this to your next coaching call."
            : "Check off each step as you complete it. Progress saves automatically."}
        </p>
      </div>
      <div className="px-6 py-4 space-y-3">
        {loading ? (
          <div className="flex items-center gap-2 text-gray-500 text-sm py-4">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading checklist…
          </div>
        ) : (
          tasks.map((task) => {
            const done = !!progress[task.key];
            return (
              <label
                key={task.key}
                className={`flex gap-3 items-start p-3 rounded-md border cursor-pointer transition-colors ${
                  done ? "bg-[#3eaf7c]/5 border-[#3eaf7c]/30" : "bg-white border-gray-200 hover:border-[#3eaf7c]/40"
                }`}
              >
                <Checkbox
                  checked={done}
                  onCheckedChange={() => toggle(task)}
                  disabled={savingKey === task.key}
                  className="mt-0.5 data-[state=checked]:bg-[#3eaf7c] data-[state=checked]:border-[#3eaf7c]"
                />
                <div className="flex-1">
                  <p className={`text-sm leading-snug ${done ? "text-gray-500 line-through" : "text-gray-800"}`}>
                    <span className="font-semibold mr-1">Step {task.step}.</span>
                    {task.text}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Est. effort: {task.effort}</p>
                </div>
              </label>
            );
          })
        )}
      </div>
    </div>
  );
}