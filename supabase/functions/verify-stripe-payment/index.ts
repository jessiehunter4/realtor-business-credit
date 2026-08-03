import { createClient } from "npm:@supabase/supabase-js@2";
import {
  fetchCheckoutSession,
  recordPaymentFromSession,
} from "../_shared/recordPayment.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);
    const token = authHeader.replace("Bearer ", "");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: claimsData, error: claimsErr } = await supabase.auth.getClaims(token);
    if (claimsErr || !claimsData?.claims) return json({ error: "Unauthorized" }, 401);
    const userId = claimsData.claims.sub as string;

    let body: { session_id?: string; sessionId?: string } = {};
    try {
      body = await req.json();
    } catch {
      return json({ error: "Invalid JSON body" }, 400);
    }

    const sessionId = body.session_id ?? body.sessionId;
    if (!sessionId || typeof sessionId !== "string" || !sessionId.startsWith("cs_")) {
      return json({ error: "Missing or invalid session_id" }, 400);
    }

    const session = await fetchCheckoutSession(sessionId);
    const result = await recordPaymentFromSession(session, userId);

    if (!result.success) {
      return json(
        { success: false, status: result.status, error: "Payment not completed" },
        402,
      );
    }

    return json(result);
  } catch (err) {
    console.error("verify-stripe-payment error:", err);
    return json({ success: false, error: (err as Error).message || "Internal error" }, 500);
  }
});