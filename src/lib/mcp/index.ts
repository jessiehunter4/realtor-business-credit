import { auth, defineMcp } from "@lovable.dev/mcp-js";
import whoamiTool from "./tools/whoami";
import listAgentsTool from "./tools/list-agents";

// Build the OAuth issuer from the Supabase project ref (Vite inlines this at
// build time). Never derive it from SUPABASE_URL — on Lovable Cloud that host
// is the `.lovable.cloud` proxy and mcp-js rejects tokens whose configured
// issuer doesn't match the direct `supabase.co` issuer discovery advertises.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "realtor-business-credit-mcp",
  title: "Realtor Business Credit",
  version: "0.1.0",
  instructions:
    "Tools for the Realtor Business Credit coaching app. `whoami` reports the signed-in user. `list_agents` reads agents from the app database, respecting the caller's row-level security.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [whoamiTool, listAgentsTool],
});