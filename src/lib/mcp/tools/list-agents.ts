import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

// The MCP entry is bundled into a Deno edge function at build time; `process.env`
// is provided by Deno's Node-compat shim there. Declare it locally so the
// browser tsconfig doesn't need @types/node.
declare const process: { env: Record<string, string | undefined> };

function supabaseForUser(ctx: ToolContext) {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY!,
    {
      global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}

export default defineTool({
  name: "list_agents",
  title: "List agents",
  description:
    "List real estate agents in the Realtor Business Credit database. Respects the caller's row-level security permissions.",
  inputSchema: {
    limit: z.number().int().min(1).max(100).optional().describe("Max rows to return (default 25)."),
    search: z
      .string()
      .trim()
      .min(1)
      .optional()
      .describe("Optional case-insensitive match against name, email, or phone."),
  },
  annotations: { readOnlyHint: true, openWorldHint: false },
  handler: async ({ limit, search }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("agents")
      .select("id, first_name, last_name, full_name, email, phone, type, source, property_city, property_state, property_close_date, created_at")
      .order("created_at", { ascending: false })
      .limit(limit ?? 25);

    if (search) {
      const s = `%${search}%`;
      query = query.or(
        `full_name.ilike.${s},first_name.ilike.${s},last_name.ilike.${s},email.ilike.${s},phone.ilike.${s}`,
      );
    }

    const { data, error } = await query;
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { agents: data ?? [] },
    };
  },
});