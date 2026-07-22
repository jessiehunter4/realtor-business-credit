import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Local typed wrapper for the beta supabase.auth.oauth namespace.
type OAuthResult = {
  data: {
    client?: { name?: string; redirect_uri?: string } | null;
    scope?: string;
    redirect_url?: string;
    redirect_to?: string;
  } | null;
  error: { message: string } | null;
};
type SupabaseOAuth = {
  getAuthorizationDetails: (id: string) => Promise<OAuthResult>;
  approveAuthorization: (id: string) => Promise<OAuthResult>;
  denyAuthorization: (id: string) => Promise<OAuthResult>;
};

function oauthClient(): SupabaseOAuth {
  return (supabase.auth as unknown as { oauth: SupabaseOAuth }).oauth;
}

function isSameOriginPath(p: string | null): p is string {
  return !!p && p.startsWith("/") && !p.startsWith("//");
}

export default function OAuthConsentPage() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<OAuthResult["data"] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError("Missing authorization_id");
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/auth?next=" + encodeURIComponent(next);
        return;
      }
      setUserEmail(sess.session.user.email ?? null);
      try {
        const { data, error } = await oauthClient().getAuthorizationDetails(authorizationId);
        if (!active) return;
        if (error) {
          setError(error.message);
          return;
        }
        const immediate = data?.redirect_url ?? data?.redirect_to;
        if (immediate && !data?.client) {
          window.location.href = immediate;
          return;
        }
        setDetails(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load authorization");
      }
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    try {
      const { data, error } = approve
        ? await oauthClient().approveAuthorization(authorizationId)
        : await oauthClient().denyAuthorization(authorizationId);
      if (error) {
        setError(error.message);
        setBusy(false);
        return;
      }
      const target = data?.redirect_url ?? data?.redirect_to;
      if (!target) {
        setError("No redirect returned by the authorization server.");
        setBusy(false);
        return;
      }
      window.location.href = target;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Authorization failed");
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Connect an app</CardTitle>
          <CardDescription>
            {userEmail ? `Signed in as ${userEmail}` : "Reviewing authorization request"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="text-sm text-destructive">
              Could not load this authorization request: {error}
            </div>
          )}
          {!error && !details && <div className="text-sm text-muted-foreground">Loading…</div>}
          {details && (
            <>
              <div>
                <p className="text-sm">
                  <span className="font-semibold">{details.client?.name ?? "An external app"}</span>{" "}
                  is requesting access to RE Pro Business Credit on your behalf.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  This lets it call this app's enabled tools while you are signed in. It does not
                  bypass this app's permissions or backend policies.
                </p>
                {details.scope && (
                  <p className="text-xs text-muted-foreground mt-3">
                    Requested scope: {details.scope}
                  </p>
                )}
              </div>
              <div className="flex gap-2 pt-2">
                <Button onClick={() => decide(true)} disabled={busy} className="flex-1">
                  {busy ? "Working…" : "Approve"}
                </Button>
                <Button
                  onClick={() => decide(false)}
                  disabled={busy}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export { isSameOriginPath };