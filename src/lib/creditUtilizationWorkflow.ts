import { supabase } from "@/integrations/supabase/client";

/** Maps the intake survey credit-score range label to a representative FICO number. */
export function ficoFromRange(range?: string | null): number | null {
  if (!range) return null;
  const nums = range.match(/\d+/g);
  if (!nums || nums.length === 0) return null;
  if (nums.length === 1) {
    // "Below 600" -> just under, "800+" -> the floor
    return /below/i.test(range) ? Number(nums[0]) - 1 : Number(nums[0]);
  }
  return Math.round((Number(nums[0]) + Number(nums[1])) / 2);
}

export interface CreditUtilizationWorkflowInput {
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  personal_credit_score_range?: string | null;
  credit_utilization_percent?: number | null;
  survey_id?: string | null;
  user_id?: string | null;
}

/**
 * Fire-and-forget invocation of the credit-card-utilization-workflow edge function.
 * Never throws — failures are logged only and must not block the intake flow.
 */
export async function invokeCreditUtilizationWorkflow(
  input: CreditUtilizationWorkflowInput,
): Promise<void> {
  try {
    let userId = input.user_id ?? null;
    if (!userId) {
      const { data } = await supabase.auth.getSession();
      userId = data.session?.user?.id ?? null;
    }

    const { error } = await supabase.functions.invoke("credit-card-utilization-workflow", {
      body: {
        first_name: input.first_name ?? null,
        last_name: input.last_name ?? null,
        email: input.email ?? null,
        fico: ficoFromRange(input.personal_credit_score_range),
        credit_utilization: input.credit_utilization_percent ?? null,
        survey_id: input.survey_id ?? null,
        user_id: userId,
      },
    });
    if (error) console.error("credit-card-utilization-workflow failed:", error);
  } catch (err) {
    console.error("credit-card-utilization-workflow failed:", err);
  }
}
