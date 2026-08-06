import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const payload = {
  first_name: "John Paul",
  email: "jp@test.com",
  fico: 720,
  credit_utilization: 25,
};

const DevWorkflowTestPage = () => {
  const [result, setResult] = useState<unknown | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke(
        "credit-card-utilization-workflow",
        {
          body: payload,
        }
      );
      if (error) {
        throw error;
      }
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-2xl space-y-6 rounded-2xl border border-border bg-card p-8 shadow-card">
        <h1 className="text-2xl font-bold text-foreground">
          Dev: Credit Card Workflow Test
        </h1>
        <p className="text-muted-foreground">
          Temporary developer page to verify the{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-sm">
            credit-card-utilization-workflow
          </code>{" "}
          Edge Function responds correctly.
        </p>

        <div className="rounded-lg border border-border bg-muted p-4">
          <p className="mb-2 text-sm font-semibold text-foreground">Payload:</p>
          <pre className="overflow-auto text-xs text-muted-foreground">
            {JSON.stringify(payload, null, 2)}
          </pre>
        </div>

        <Button
          onClick={handleClick}
          disabled={loading}
          className="w-full sm:w-auto"
        >
          {loading ? "Sending…" : "Test Credit Card Workflow"}
        </Button>

        {error && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-destructive">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {result && (
          <div className="rounded-lg border border-border bg-muted p-4">
            <p className="mb-2 text-sm font-semibold text-foreground">Response:</p>
            <pre className="overflow-auto text-xs text-muted-foreground">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default DevWorkflowTestPage;
