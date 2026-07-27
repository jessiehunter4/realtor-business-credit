import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims?.sub) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub as string;

    const { intake_id, access_token } = await req.json().catch(() => ({}));
    if (!intake_id || !access_token) {
      return new Response(JSON.stringify({ error: "intake_id and access_token are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: survey, error: fetchError } = await admin
      .from("intake_surveys")
      .select("id, access_token, user_id, contact_email, lead_id")
      .eq("id", intake_id)
      .maybeSingle();

    if (fetchError || !survey) {
      return new Response(JSON.stringify({ error: "Intake not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (survey.access_token !== access_token) {
      return new Response(JSON.stringify({ error: "Invalid access token" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Idempotent: if already linked to this user, still succeed.
    if (survey.user_id && survey.user_id !== userId) {
      return new Response(JSON.stringify({ error: "Intake already linked to a different account" }), {
        status: 409,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error: intakeUpdateError } = await admin
      .from("intake_surveys")
      .update({ user_id: userId })
      .eq("id", intake_id);
    if (intakeUpdateError) throw intakeUpdateError;

    const { error: planUpdateError } = await admin
      .from("custom_plans")
      .update({ user_id: userId })
      .eq("intake_survey_id", intake_id);
    if (planUpdateError) throw planUpdateError;

    // Also link the originating lead (by explicit lead_id, else by email match)
    // so the visitor can see their lead record in their dashboard.
    try {
      if (survey.lead_id) {
        await admin
          .from("leads")
          .update({ user_id: userId })
          .eq("id", survey.lead_id)
          .is("user_id", null);
      } else if (survey.contact_email) {
        await admin
          .from("leads")
          .update({ user_id: userId })
          .ilike("email", survey.contact_email)
          .is("user_id", null);
      }
    } catch (linkLeadErr) {
      console.error("Failed to link lead to user (non-fatal):", linkLeadErr);
    }

    return new Response(JSON.stringify({ ok: true, user_id: userId }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unexpected error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});