import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function computeFundabilityItems(survey: any) {
  const items: { label: string; status: string; detail: string }[] = [];

  // Entity
  const entity = survey.has_business_entity;
  if (entity === "Corporation" || entity === "LLC") {
    items.push({ label: `Business Entity (${entity})`, status: "strong", detail: `Registered as ${entity}` });
  } else if (entity === "Sole Proprietor" || entity === "Partnership") {
    items.push({ label: `Business Entity (${entity})`, status: "warning", detail: `Operating as ${entity} — consider forming an LLC or Corp` });
  } else {
    items.push({ label: "Business Entity", status: "missing", detail: "No formal business entity established" });
  }

  // EIN — inferred from entity
  if (entity === "Corporation" || entity === "LLC") {
    items.push({ label: "EIN on File", status: "strong", detail: "Likely obtained with entity formation" });
  } else if (entity === "Sole Proprietor" || entity === "Partnership") {
    items.push({ label: "EIN on File", status: "warning", detail: "May or may not have a separate EIN" });
  } else {
    items.push({ label: "EIN on File", status: "missing", detail: "No EIN without a business entity" });
  }

  // Bank account
  const bank = survey.has_business_bank_account;
  if (bank === "Fully separate") {
    items.push({ label: "Separate Business Bank Account", status: "strong", detail: "Fully separate from personal" });
  } else if (bank === "Partially mixed") {
    items.push({ label: "Business Bank Account", status: "warning", detail: "Partially mixed with personal funds" });
  } else {
    items.push({ label: "Business Bank Account", status: "missing", detail: "Using personal account only" });
  }

  // Address
  const addr = survey.has_business_address;
  if (addr === "Physical office") {
    items.push({ label: "Business Address", status: "strong", detail: "Physical office address" });
  } else if (addr === "Virtual office" || addr === "Home address") {
    items.push({ label: "Business Address", status: "warning", detail: `Using ${addr?.toLowerCase()}` });
  } else {
    items.push({ label: "Business Address", status: "missing", detail: "No dedicated business address" });
  }

  // Phone
  items.push({
    label: "Business Phone in Directories",
    status: survey.has_business_phone ? "strong" : "missing",
    detail: survey.has_business_phone ? "Listed in directories" : "No separate business phone",
  });

  // Email
  items.push({
    label: "Business Email on Custom Domain",
    status: survey.has_business_email ? "strong" : "missing",
    detail: survey.has_business_email ? "Custom domain email" : "No custom domain email",
  });

  // Website
  items.push({
    label: "Business Website",
    status: survey.has_business_website ? "strong" : "missing",
    detail: survey.has_business_website ? "Has business website" : "No business website",
  });

  // Tradelines
  const tl = survey.vendor_tradelines;
  if (tl === "3+ reporting") {
    items.push({ label: "Vendor Tradelines Reporting", status: "strong", detail: "3+ tradelines reporting to bureaus" });
  } else if (tl === "1–2 reporting") {
    items.push({ label: "Vendor Tradelines Reporting", status: "warning", detail: "1–2 tradelines — need more" });
  } else {
    items.push({ label: "Vendor Tradelines Reporting", status: "missing", detail: "No tradelines reporting" });
  }

  // Credit bureaus
  const bureaus = survey.credit_reporting_bureaus || [];
  const realBureaus = bureaus.filter((b: string) => b !== "Not sure");
  if (realBureaus.length >= 2) {
    items.push({ label: "Business Credit Bureau Profiles", status: "strong", detail: `Reporting to ${realBureaus.join(", ")}` });
  } else if (realBureaus.length === 1) {
    items.push({ label: "Business Credit Bureau Profiles", status: "warning", detail: `Only reporting to ${realBureaus[0]}` });
  } else {
    items.push({ label: "Business Credit Bureau Profiles", status: "missing", detail: "Not reporting to any business credit bureau" });
  }

  return items;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

    if (!lovableApiKey) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Verify admin
    const userClient = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const userId = claimsData.claims.sub as string;

    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const { data: roleData } = await adminClient.rpc("has_role", { _user_id: userId, _role: "admin" });
    if (!roleData) {
      return new Response(JSON.stringify({ error: "Admin access required" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { intake_survey_id } = await req.json();
    if (!intake_survey_id) {
      return new Response(JSON.stringify({ error: "intake_survey_id required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Fetch survey + notes
    const [surveyRes, notesRes] = await Promise.all([
      adminClient.from("intake_surveys").select("*").eq("id", intake_survey_id).single(),
      adminClient.from("intake_coach_notes").select("*").eq("intake_survey_id", intake_survey_id).order("created_at"),
    ]);

    if (surveyRes.error || !surveyRes.data) {
      return new Response(JSON.stringify({ error: "Survey not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const survey = surveyRes.data;
    const coachNotes = notesRes.data || [];

    // Compute fundability items
    const fundabilityItems = computeFundabilityItems(survey);

    // Build prompt
    const notesText = coachNotes.length > 0
      ? `\n\nCoach Notes:\n${coachNotes.map((n: any) => `[${n.section}] ${n.note}`).join("\n")}`
      : "";

    const prompt = `You are a business credit advisor creating a personalized Realtor Business Credit Plan.

Here is the intake survey data for ${survey.contact_name || "this agent"}:

Profile:
- Name: ${survey.contact_name || "N/A"}
- Email: ${survey.contact_email || "N/A"}
- Brokerage: ${survey.brokerage_name || "N/A"}
- City/State: ${survey.city || "N/A"}, ${survey.state || "N/A"}
- License Type: ${survey.license_type || "N/A"}
- Years in Real Estate: ${survey.years_in_real_estate || "N/A"}
- Gross Commission Income (Last 12 Months): ${survey.gci_last_12_months || "N/A"}
- Sides Closed: ${survey.sides_closed_last_12_months || "N/A"}

Goals:
- Primary Goal: ${survey.primary_goal || survey.top_financial_goal || "N/A"}
- Additional Goals: ${(survey.additional_goals || []).join(", ") || "None"}
- Top Financial Pain: ${survey.top_financial_pain || survey.top_financial_need || "N/A"}
- Time Horizon for Primary Goal: ${survey.goal_time_horizon || "N/A"}
- Target Funding Amount for Primary Goal: ${survey.target_funding_amount || "N/A"}
- Desired Monthly Credit Capacity: ${survey.desired_monthly_credit_capacity || "N/A"}
- Goals Notes: ${survey.goals_notes || "N/A"}

Business Structure:
- Entity: ${survey.has_business_entity || "N/A"}
- Address: ${survey.has_business_address || "N/A"}
- Business Phone: ${survey.has_business_phone ? "Yes" : "No"}
- Business Email: ${survey.has_business_email ? "Yes" : "No"}
- Business Website: ${survey.has_business_website ? "Yes" : "No"}
- Bank Account: ${survey.has_business_bank_account || "N/A"}
- Accounting: ${survey.uses_accounting_software || "N/A"}

Credit & Funding:
- Business Credit Cards: ${survey.business_credit_cards || "N/A"}
- Vendor Tradelines: ${survey.vendor_tradelines || "N/A"}
- Credit Bureaus: ${(survey.credit_reporting_bureaus || []).join(", ") || "None"}
- Gap Funding Methods: ${(survey.funding_gap_methods || []).join(", ") || "N/A"}
- Desired Funding Types: ${(survey.desired_funding_types || []).join(", ") || "N/A"}
- PG Comfort: ${survey.personal_guarantee_comfort || "N/A"}
- Personal Credit Range: ${survey.personal_credit_score_range || "N/A"}

Program Preferences:
- Support Format: ${survey.preferred_support_format || "N/A"}
- Cohort Interest: ${survey.interest_in_cohort || "N/A"}
- Investment Readiness: ${survey.investment_readiness || "N/A"}
- Additional Notes: ${survey.additional_notes || "None"}${notesText}

Generate a personalized plan using the generate_plan tool. Be specific, actionable, and tie recommendations back to their stated goals and production level. Avoid generic advice. Do NOT provide legal, tax, or financial advice — this is education and coaching only.`;

    // Call AI with tool calling
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a business credit planning expert for real estate professionals. Generate detailed, personalized plans." },
          { role: "user", content: prompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_plan",
              description: "Generate a structured Realtor Business Credit Plan with 6 sections.",
              parameters: {
                type: "object",
                properties: {
                  goals_snapshot_narrative: { type: "string", description: "2-3 paragraph narrative summarizing the agent's goals, production level, and why business credit matters for their situation." },
                  fundability_narrative: { type: "string", description: "1-2 paragraph assessment of their current business structure and fundability readiness." },
                  action_items: {
                    type: "array",
                    description: "8-12 prioritized 90-day action items.",
                    items: {
                      type: "object",
                      properties: {
                        step: { type: "number" },
                        text: { type: "string", description: "Clear, actionable description of the step." },
                        effort: { type: "string", description: "Estimated effort: '30 min', '1-2 hours', '1-2 days', etc." },
                      },
                      required: ["step", "text", "effort"],
                      additionalProperties: false,
                    },
                  },
                  milestones: {
                    type: "array",
                    description: "4-6 milestones for the 6-12 month roadmap.",
                    items: {
                      type: "object",
                      properties: {
                        month: { type: "string", description: "e.g. 'Month 1-2', 'Month 3-4'" },
                        description: { type: "string" },
                      },
                      required: ["month", "description"],
                      additionalProperties: false,
                    },
                  },
                  funding_items: {
                    type: "array",
                    description: "3-5 funding opportunity types relevant to this agent.",
                    items: {
                      type: "object",
                      properties: {
                        type: { type: "string" },
                        description: { type: "string" },
                      },
                      required: ["type", "description"],
                      additionalProperties: false,
                    },
                  },
                  next_steps_narrative: { type: "string", description: "1-2 paragraph closing narrative with encouragement and clear next steps." },
                  program_options: {
                    type: "array",
                    description: "3-4 program options.",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        description: { type: "string" },
                      },
                      required: ["name", "description"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["goals_snapshot_narrative", "fundability_narrative", "action_items", "milestones", "funding_items", "next_steps_narrative", "program_options"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_plan" } },
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errText);
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "AI rate limit reached. Wait a moment and try again." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Add credits to your Lovable workspace to continue." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (aiResponse.status === 403) {
        return new Response(JSON.stringify({ error: "AI credit limit reached for this workspace. Ask the workspace owner to raise the limit." }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      return new Response(JSON.stringify({ error: `AI gateway error (${aiResponse.status}). Please retry.` }), { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      console.error("AI response missing tool_call:", JSON.stringify(aiData).slice(0, 500));
      return new Response(JSON.stringify({ error: "AI returned no plan structure. Please retry." }), { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    let aiPlan: any;
    try {
      aiPlan = JSON.parse(toolCall.function.arguments);
    } catch (parseErr) {
      console.error("Failed to parse AI arguments:", parseErr, toolCall.function.arguments?.slice(0, 500));
      return new Response(JSON.stringify({ error: "AI returned malformed plan data. Please retry." }), { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Build plan_data
    const planData = {
      contact_name: survey.contact_name,
      contact_email: survey.contact_email,
      city: survey.city,
      state: survey.state,
      license_type: survey.license_type,
      sections: {
        goals_snapshot: { narrative: aiPlan.goals_snapshot_narrative },
        fundability: { items: fundabilityItems, narrative: aiPlan.fundability_narrative },
        action_plan_90day: { items: aiPlan.action_items },
        roadmap: { milestones: aiPlan.milestones },
        funding_opportunities: { items: aiPlan.funding_items },
        next_steps: { narrative: aiPlan.next_steps_narrative, program_options: aiPlan.program_options },
      },
    };

    // Supersede logic: if an existing draft exists for this intake, update it in place.
    // Otherwise, archive any prior published/draft rows and insert a fresh draft.
    const { data: existingDraft, error: draftLookupErr } = await adminClient
      .from("custom_plans")
      .select("id")
      .eq("intake_survey_id", intake_survey_id)
      .eq("status", "draft")
      .maybeSingle();

    if (draftLookupErr) {
      console.error("Draft lookup error:", draftLookupErr);
      return new Response(JSON.stringify({ error: "Failed to look up existing plan." }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    let planId: string;

    if (existingDraft) {
      const { data: updated, error: updateErr } = await adminClient
        .from("custom_plans")
        .update({
          plan_data: planData,
          contact_name: survey.contact_name,
          contact_email: survey.contact_email,
          agent_id: survey.agent_id,
          lead_id: survey.lead_id,
          created_by: userId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingDraft.id)
        .select("id")
        .single();
      if (updateErr || !updated) {
        console.error("Update draft error:", updateErr);
        return new Response(JSON.stringify({ error: "Failed to update existing draft plan." }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      planId = updated.id;
    } else {
      // Archive any prior published rows so there is a single source of truth.
      const { error: archiveErr } = await adminClient
        .from("custom_plans")
        .update({ status: "archived" })
        .eq("intake_survey_id", intake_survey_id)
        .eq("status", "published");
      if (archiveErr) {
        console.error("Archive prior plans error:", archiveErr);
        return new Response(JSON.stringify({ error: "Failed to archive prior plans." }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const { data: inserted, error: insertError } = await adminClient
        .from("custom_plans")
        .insert({
          intake_survey_id,
          agent_id: survey.agent_id,
          lead_id: survey.lead_id,
          contact_name: survey.contact_name,
          contact_email: survey.contact_email,
          plan_data: planData,
          status: "draft",
          created_by: userId,
        })
        .select("id")
        .single();

      if (insertError || !inserted) {
        console.error("Insert error:", insertError);
        return new Response(JSON.stringify({ error: "Failed to save plan." }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      planId = inserted.id;
    }

    return new Response(JSON.stringify({ plan_id: planId, superseded: !!existingDraft }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-plan error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
