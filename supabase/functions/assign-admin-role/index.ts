import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

/** Constant-time-ish comparison to avoid trivially leaking the code length. */
function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const adminCode = Deno.env.get("ADMIN_SIGNUP_CODE") ?? "";
    if (!adminCode) {
      console.error("ADMIN_SIGNUP_CODE is not configured");
      return json({ error: "Admin signup is not available" }, 500);
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Unauthorized" }, 401);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", ""),
    );
    if (userError || !user) return json({ error: "Unauthorized" }, 401);

    let code = "";
    try {
      const body = await req.json();
      code = typeof body?.code === "string" ? body.code.trim() : "";
    } catch {
      code = "";
    }

    if (!code || !safeEqual(code, adminCode)) {
      console.warn(`Rejected admin signup for ${user.email}: invalid access code`);
      return json({ error: "Invalid admin access code" }, 403);
    }

    const { error: insertError } = await supabase
      .from("user_roles")
      .upsert({ user_id: user.id, role: "admin" }, {
        onConflict: "user_id,role",
        ignoreDuplicates: true,
      });

    if (insertError && insertError.code !== "23505") {
      console.error("Error assigning admin role:", insertError);
      return json({ error: "Failed to assign admin role" }, 500);
    }

    console.log(`Admin role assigned to ${user.email}`);
    return json({ message: "Admin role assigned", role: "admin" });
  } catch (error) {
    console.error("assign-admin-role error:", error);
    return json({ error: "Internal server error" }, 500);
  }
});