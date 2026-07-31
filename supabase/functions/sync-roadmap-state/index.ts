import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PHASE_TAGS: Record<string, string> = {
  foundation: "RBC_Phase_Foundation",
  credibility: "RBC_Phase_Credibility",
  bureaus: "RBC_Phase_Bureaus",
  tradelines: "RBC_Phase_Tradelines",
  funding: "RBC_Phase_Funding",
};

/**
 * Pushes the user's current roadmap state to GHL so email/SMS workflows
 * reinforce exactly what the dashboard shows as the next step.
 * Best-effort: never blocks the UI, always returns 200 on downstream failure.
 */
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Unauthorized" }, 401);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userData.user) return json({ error: "Unauthorized" }, 401);
    const userId = userData.user.id;

    const { plan_id, next_task_key, next_task_label, phase, completion_pct } = await req.json();
    if (!plan_id) return json({ error: "plan_id is required" }, 400);

    // Ownership check — a user may only sync their own plan.
    const { data: plan } = await supabase
      .from("custom_plans")
      .select("id, user_id")
      .eq("id", plan_id)
      .maybeSingle();
    if (!plan || plan.user_id !== userId) return json({ error: "Forbidden" }, 403);

    const { data: profile } = await supabase
      .from("profiles")
      .select("ghl_contact_id")
      .eq("user_id", userId)
      .maybeSingle();

    const contactId = profile?.ghl_contact_id;
    if (!contactId) {
      console.log("No GHL contact linked for user; skipping roadmap sync");
      return json({ ok: true, synced: false, reason: "no_ghl_contact" });
    }

    const ghlApiKey = Deno.env.get("GHL_API_KEY");
    if (!ghlApiKey) {
      console.error("GHL_API_KEY not configured");
      return json({ ok: true, synced: false, reason: "not_configured" });
    }

    const headers = {
      Authorization: `Bearer ${ghlApiKey}`,
      "Content-Type": "application/json",
      Version: "2021-07-28",
    };

    // 1) Update custom fields (upsert-style contact update).
    const updateRes = await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        customFields: [
          { key: "roadmap_next_task", field_value: next_task_label ?? "" },
          { key: "roadmap_next_task_key", field_value: next_task_key ?? "" },
          { key: "roadmap_phase", field_value: phase ?? "complete" },
          { key: "roadmap_completion_pct", field_value: String(completion_pct ?? 0) },
        ],
      }),
    });
    if (!updateRes.ok) {
      console.error("GHL contact update failed:", updateRes.status, await updateRes.text());
    }

    // 2) Apply the phase tag in a SEPARATE call (avoids duplicate-phone errors).
    const addTag = phase ? PHASE_TAGS[phase] : "RBC_Roadmap_Complete";
    const removeTags = Object.values(PHASE_TAGS)
      .concat("RBC_Roadmap_Complete")
      .filter((t) => t !== addTag);

    await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/tags`, {
      method: "DELETE",
      headers,
      body: JSON.stringify({ tags: removeTags }),
    }).catch((e) => console.error("Tag removal failed", e));

    if (addTag) {
      const tagRes = await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/tags`, {
        method: "POST",
        headers,
        body: JSON.stringify({ tags: [addTag] }),
      });
      if (!tagRes.ok) {
        console.error("GHL tag add failed:", tagRes.status, await tagRes.text());
      }
    }

    return json({ ok: true, synced: true });
  } catch (e) {
    console.error("sync-roadmap-state error:", e);
    return json({ ok: false, error: "unexpected_error" });
  }
});