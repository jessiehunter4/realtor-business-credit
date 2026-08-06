import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

interface WorkflowPayload {
  first_name?: string;
  last_name?: string;
  email?: string;
  fico?: number;
  credit_utilization?: number;
  survey_id?: string;
  user_id?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  try {
    const body = (await req.json()) as WorkflowPayload;

    const fico = Number(body.fico);
    const creditUtilization = Number(body.credit_utilization);

    if (
      Number.isNaN(fico) ||
      Number.isNaN(creditUtilization) ||
      creditUtilization < 0 ||
      creditUtilization > 100
    ) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid FICO score or credit utilization.",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const qualified = fico >= 700 && creditUtilization < 35;
    const workflow = qualified ? "credit_card_stacking" : "personal_credit_improvement";
    const reason = qualified
      ? "User has a strong credit profile and qualifies for the Credit Card Stacking workflow."
      : "User should improve their personal credit before pursuing Credit Card Stacking.";

    console.log("Credit Card Utilization Workflow Evaluation:", {
      first_name: body.first_name ?? "",
      email: body.email ?? "",
      fico,
      credit_utilization: creditUtilization,
      workflow,
      qualified,
    });

    return new Response(
      JSON.stringify({
        success: true,
        qualified,
        workflow,
        reason,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    console.error("credit-card-utilization-workflow error:", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});

