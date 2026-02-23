import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
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

      // Remove fields that shouldn't be set by the public user
      const { id, access_token, created_at, created_by, ...updateFields } = body;

      const { data, error } = await supabaseAdmin
        .from("intake_surveys")
        .update({
          ...updateFields,
          status: body.status || "submitted",
          submitted_at: body.status === "submitted" ? new Date().toISOString() : undefined,
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

    // POST: Create a new survey (admin only)
    if (req.method === "POST") {
      const authHeader = req.headers.get("Authorization");
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
