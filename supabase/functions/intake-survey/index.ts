import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const EDITABLE_SURVEY_FIELDS = [
  "contact_name",
  "contact_email",
  "brokerage_name",
  "city",
  "state",
  "business_street",
  "business_zip",
  "business_phone",
  "license_type",
  "years_in_real_estate",
  "gci_last_12_months",
  "sides_closed_last_12_months",
  "primary_goals",
  "financial_pains",
  "draft_email",
  "first_name",
  "last_name",
  "full_name",
  "goals_notes",
  "has_business_entity",
  "entity_type",
  "has_business_address",
  "address_type",
  "has_business_phone",
  "has_business_email",
  "has_business_website",
  "has_business_bank_account",
  "uses_accounting_software",
  "accounting_software_name",
  "business_credit_cards",
  "vendor_tradelines",
  "credit_reporting_bureaus",
  "funding_gap_methods",
  "desired_funding_types",
  "personal_guarantee_comfort",
  "personal_credit_score_range",
  "preferred_support_format",
  "interest_in_cohort",
  "preferred_cohort_days",
  "preferred_cohort_time_1",
  "preferred_cohort_time_2",
  "investment_readiness",
  "additional_notes",
] as const;

const pickEditableSurveyFields = (body: Record<string, unknown>) => {
  const picked: Record<string, unknown> = {};

  for (const key of EDITABLE_SURVEY_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(body, key)) {
      picked[key] = body[key] ?? null;
    }
  }

  if (typeof picked.contact_email === "string") {
    picked.contact_email = picked.contact_email.trim();
  }

  if (typeof picked.contact_name === "string") {
    picked.contact_name = picked.contact_name.trim() || null;
  }

  return picked;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  try {
    // GET: Fetch survey by token (public)
    if (req.method === "GET" && token) {
      const { data, error } = await supabaseAdmin
        .from("intake_surveys")
        .select("*")
        .eq("access_token", token)
        .single();

      if (error || !data) {
        return new Response(
          JSON.stringify({ error: "Survey not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Don't expose the access_token back
      const { access_token: _, ...safeData } = data;
      return new Response(JSON.stringify(safeData), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // PUT: Submit/update survey by token (public)
    if (req.method === "PUT" && token) {
      const body = await req.json();

      // Verify token exists
      const { data: existing, error: fetchErr } = await supabaseAdmin
        .from("intake_surveys")
        .select("id, status")
        .eq("access_token", token)
        .single();

      if (fetchErr || !existing) {
        return new Response(
          JSON.stringify({ error: "Survey not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const updateFields = pickEditableSurveyFields(body);
      const nextStatus = body.status === "submitted" ? "submitted" : "in_progress";

      const { data, error } = await supabaseAdmin
        .from("intake_surveys")
        .update({
          ...updateFields,
          status: nextStatus,
          submitted_at: nextStatus === "submitted" ? new Date().toISOString() : null,
        })
        .eq("access_token", token)
        .select()
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(JSON.stringify({ success: true, id: data.id }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST: Create a new survey
    if (req.method === "POST") {
      const authHeader = req.headers.get("Authorization");
      const mode = url.searchParams.get("mode");

      // Public direct-submit mode (no auth required)
      if (mode === "direct") {
        const body = await req.json();

        if (!body.contact_email || !body.contact_email.trim()) {
          return new Response(
            JSON.stringify({ error: "Email is required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const surveyFields = pickEditableSurveyFields(body);

        const { data, error } = await supabaseAdmin
          .from("intake_surveys")
          .insert({
            ...surveyFields,
            contact_email: body.contact_email.trim(),
            contact_name: body.contact_name?.trim() || null,
            filled_by: "self",
            status: "submitted",
            submitted_at: new Date().toISOString(),
          })
          .select("id")
          .single();

        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(JSON.stringify({ success: true, id: data.id }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Admin mode (requires auth)
      if (!authHeader) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Verify admin role
      const supabaseUser = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        { global: { headers: { Authorization: authHeader } } }
      );

      const { data: { user }, error: userErr } = await supabaseUser.auth.getUser();
      if (userErr || !user) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { data: roleCheck } = await supabaseAdmin.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });

      if (!roleCheck) {
        return new Response(
          JSON.stringify({ error: "Forbidden" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const body = await req.json();
      const { data, error } = await supabaseAdmin
        .from("intake_surveys")
        .insert({
          agent_id: body.agent_id || null,
          lead_id: body.lead_id || null,
          contact_email: body.contact_email,
          contact_name: body.contact_name,
          filled_by: body.filled_by || "agent",
        })
        .select("id, access_token")
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
