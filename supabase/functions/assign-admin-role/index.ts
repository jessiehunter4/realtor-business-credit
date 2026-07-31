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

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
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