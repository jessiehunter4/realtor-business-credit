import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
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

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub as string;

    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const { data: roleData } = await adminClient.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    if (!roleData) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { plan_id, program_slug, reasoning_bullets, clear } = await req.json();
    if (!plan_id) {
      return new Response(JSON.stringify({ error: "plan_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (clear === true) {
      const { error } = await adminClient
        .from("custom_plans")
        .update({
          recommendation_overridden_by: null,
          recommendation_overridden_at: null,
        })
        .eq("id", plan_id);
      if (error) throw error;
      return new Response(JSON.stringify({ ok: true, cleared: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!program_slug || typeof program_slug !== "string") {
      return new Response(JSON.stringify({ error: "program_slug required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: prog } = await adminClient
      .from("programs")
      .select("slug")
      .eq("slug", program_slug)
      .maybeSingle();
    if (!prog) {
      return new Response(JSON.stringify({ error: "Unknown program_slug" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const patch: Record<string, unknown> = {
      recommended_program_slug: program_slug,
      recommendation_overridden_by: userId,
      recommendation_overridden_at: new Date().toISOString(),
    };
    if (Array.isArray(reasoning_bullets)) {
      patch.recommendation_reasoning = {
        bullets: reasoning_bullets.map((b: any) =>
          typeof b === "string"
            ? { bullet: b, source_rule: "override" }
            : { bullet: String(b?.bullet || ""), source_rule: b?.source_rule || "override" },
        ),
        overridden: true,
      };
    }

    const { error } = await adminClient
      .from("custom_plans")
      .update(patch)
      .eq("id", plan_id);
    if (error) throw error;

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("override-recommendation error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});