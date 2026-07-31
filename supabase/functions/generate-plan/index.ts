import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { computeFundabilityItems } from "../_shared/fundability.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

    if (!lovableApiKey) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const body = await req.json().catch(() => ({}));
    const { intake_survey_id, intake_token, source } = body as {
      intake_survey_id?: string;
      intake_token?: string;
      source?: "user" | "admin";
    };

    // Authorize the request. Accept either:
    //   (a) an admin JWT via Authorization header, OR
    //   (b) a matching intake access_token (public user path).
    let userId: string | null = null;
    let isAdmin = false;
    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ") && !intake_token) {
      const userClient = createClient(supabaseUrl, supabaseKey, {
        global: { headers: { Authorization: authHeader } },
      });
      const token = authHeader.replace("Bearer ", "");
      const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(token);
      if (!claimsError && claimsData?.claims) {
        userId = claimsData.claims.sub as string;
        const { data: roleData } = await adminClient.rpc("has_role", { _user_id: userId, _role: "admin" });
        isAdmin = !!roleData;
      }
    }

    if (!intake_survey_id) {
      return new Response(JSON.stringify({ error: "intake_survey_id required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // If not an admin, require a valid intake access token that matches this survey.
    if (!isAdmin) {
      if (!intake_token) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const { data: tokenRow, error: tokenErr } = await adminClient
        .from("intake_surveys")
        .select("id, status")
        .eq("id", intake_survey_id)
        .eq("access_token", intake_token)
        .maybeSingle();
      if (tokenErr || !tokenRow) {
        return new Response(JSON.stringify({ error: "Invalid intake token" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (tokenRow.status !== "submitted") {
        return new Response(JSON.stringify({ error: "Survey must be submitted before generating a plan." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    const isUserGenerated = !isAdmin;

    // Idempotency: if a draft or published plan for this intake was created <60s ago, return it.
    {
      const { data: recent } = await adminClient
        .from("custom_plans")
        .select("id, created_at, status")
        .eq("intake_survey_id", intake_survey_id)
        .in("status", ["draft", "published"])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (recent?.created_at && Date.now() - new Date(recent.created_at).getTime() < 60_000) {
        return new Response(JSON.stringify({ plan_id: recent.id, superseded: false, idempotent: true }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
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
- Primary Financial Goals (up to 3, in the order picked; treat the first as the top priority): ${(survey.primary_goals || []).join(" | ") || "N/A"}
- Financial Pains (up to 3, in priority order): ${(survey.financial_pains || []).join(" | ") || "N/A"}
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
- Program Readiness: ${survey.investment_readiness || "N/A"}
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
                  goals: {
                    type: "array",
                    description: "Each of the agent's goals as a distinct, structured entry. Include the primary goal first (priority='primary') followed by every additional goal (priority='secondary'). Do NOT merge goals together.",
                    items: {
                      type: "object",
                      properties: {
                        label: { type: "string", description: "Short goal title, e.g. 'Grow marketing spend'." },
                        priority: { type: "string", enum: ["primary", "secondary"] },
                        horizon: { type: "string", description: "Time horizon if known, e.g. '0-3 months'. Empty string if unknown." },
                        target_amount: { type: "string", description: "Target funding amount if applicable, else empty string." },
                        why_it_matters: { type: "string", description: "1-2 sentence rationale tailored to this Realtor." },
                      },
                      required: ["label", "priority", "horizon", "target_amount", "why_it_matters"],
                      additionalProperties: false,
                    },
                  },
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
                 required: ["goals_snapshot_narrative", "goals", "fundability_narrative", "action_items", "milestones", "funding_items", "next_steps_narrative", "program_options"],
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
        goals_snapshot: { narrative: aiPlan.goals_snapshot_narrative, goals: aiPlan.goals || [] },
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
          ...(isUserGenerated ? { status: "published", published_at: new Date().toISOString() } : {}),
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
          status: isUserGenerated ? "published" : "draft",
          ...(isUserGenerated ? { published_at: new Date().toISOString() } : {}),
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
