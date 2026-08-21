import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";
import { Loader2, PlugZap, Eye, PlayCircle, RefreshCw, ShieldAlert } from "lucide-react";

interface Settings {
  id: string;
  automatic_ingestion_enabled: boolean;
  import_new_enabled: boolean;
  update_existing_enabled: boolean;
  page_size: number;
  request_timeout_ms: number;
  retry_attempts: number;
  timezone: string;
}

interface ZipGroup {
  id: string;
  label: string;
  county: string | null;
  enabled: boolean;
  note: string | null;
}

interface Job {
  id: string;
  name: string;
  enabled: boolean;
  zip_group_id: string | null;
  interval_hours: number;
  import_new: boolean;
  update_existing: boolean;
  daily_new_limit: number;
  watermark_committed: string | null;
  last_run_at: string | null;
  last_run_status: string | null;
  next_sync_at: string | null;
}

interface PolicyRow {
  id: string;
  raw_status: string;
  internal_status: string;
  action: string;
  needs_review: boolean;
}

interface Run {
  id: string;
  mode: string;
  trigger: string;
  status: string;
  created_at: string;
  records_fetched: number;
  records_created: number;
  records_updated: number;
  records_filtered: number;
  records_deferred: number;
  records_failed: number;
  error_message: string | null;
}

export default function AdminMlsAutomation() {
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [groups, setGroups] = useState<ZipGroup[]>([]);
  const [zipsByGroup, setZipsByGroup] = useState<Record<string, string[]>>({});
  const [jobs, setJobs] = useState<Job[]>([]);
  const [policy, setPolicy] = useState<PolicyRow[]>([]);
  const [runs, setRuns] = useState<Run[]>([]);
  const [preview, setPreview] = useState<any[] | null>(null);

  const [newGroupLabel, setNewGroupLabel] = useState("");
  const [newGroupZips, setNewGroupZips] = useState("");

  const load = useCallback(async () => {
    const [s, g, z, j, p, r] = await Promise.all([
      supabase.from("mls_settings").select("*").maybeSingle(),
      supabase.from("mls_zip_groups").select("*").order("label"),
      supabase.from("mls_zips").select("group_id, zip"),
      supabase.from("mls_import_jobs").select("*").order("created_at"),
      supabase.from("mls_status_policy").select("*").order("raw_status"),
      supabase.from("mls_import_runs").select("*").order("created_at", { ascending: false }).limit(25),
    ]);

    setSettings((s.data as Settings) ?? null);
    setGroups((g.data as ZipGroup[]) ?? []);
    const map: Record<string, string[]> = {};
    for (const row of (z.data as any[]) ?? []) {
      (map[row.group_id] ??= []).push(row.zip);
    }
    setZipsByGroup(map);
    setJobs((j.data as Job[]) ?? []);
    setPolicy((p.data as PolicyRow[]) ?? []);
    setRuns((r.data as Run[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function callSettings(action: string, payload: unknown) {
    const { data, error } = await supabase.functions.invoke("mls-admin-settings", {
      body: { action, payload },
    });
    if (error) throw error;
    if ((data as any)?.error) throw new Error((data as any).error);
    return data;
  }

  async function updateSetting(field: keyof Settings, value: boolean | number | string) {
    if (!settings) return;
    setSettings({ ...settings, [field]: value } as Settings);
    try {
      await callSettings("update_settings", { [field]: value });
      toast.success("Setting saved");
    } catch (err) {
      toast.error("Could not save that setting");
      load();
    }
  }

  async function runAction(mode: "preview" | "new" | "update" | "reconcile", jobId?: string) {
    setBusy(mode);
    setPreview(null);
    try {
      const { data, error } = await supabase.functions.invoke("trestle-ingest", {
        body: { mode, jobId: jobId ?? jobs[0]?.id ?? null, trigger: "manual" },
      });
      if (error) throw error;
      if ((data as any)?.skipped) {
        toast.info((data as any).reason);
      } else if ((data as any)?.error) {
        toast.error((data as any).error);
      } else {
        toast.success(`${mode} run ${(data as any).status}`);
        if (mode === "preview") setPreview((data as any).preview ?? []);
      }
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Run failed");
    } finally {
      setBusy(null);
    }
  }

  async function testConnection() {
    setBusy("test");
    try {
      const { data, error } = await supabase.functions.invoke("trestle-test-connection", { body: {} });
      if (error) throw error;
      if ((data as any)?.ok) toast.success((data as any).message);
      else toast.error((data as any)?.message ?? "Connection failed");
    } catch (err) {
      toast.error("Connection test failed");
    } finally {
      setBusy(null);
    }
  }

  async function addGroup() {
    if (!newGroupLabel.trim()) return;
    const zips = newGroupZips.split(/[\s,]+/).filter(Boolean);
    try {
      await callSettings("upsert_zip_group", { label: newGroupLabel.trim(), zips, enabled: false });
      setNewGroupLabel("");
      setNewGroupZips("");
      toast.success("ZIP group saved");
      load();
    } catch {
      toast.error("Could not save the ZIP group");
    }
  }

  async function addJob() {
    try {
      await callSettings("upsert_job", {
        name: `Job ${jobs.length + 1}`,
        interval_hours: 24,
        daily_new_limit: 25,
      });
      toast.success("Job created (disabled)");
      load();
    } catch {
      toast.error("Could not create the job");
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </main>
    );
  }

  const unmapped = policy.filter((p) => p.needs_review);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">MLS Automatic Import</h1>
          <p className="text-muted-foreground">
            Cotality Trestle feed. Manual CSV import remains available as a fallback.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/admin/mls-import">Manual CSV import</Link>
          </Button>
          <Button variant="outline" onClick={testConnection} disabled={busy === "test"}>
            <PlugZap className="mr-2 h-4 w-4" /> Test API connection
          </Button>
        </div>
      </header>

      <Card className="mb-6 border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-primary" /> Ingestion flow control
          </CardTitle>
          <CardDescription>
            These switches only start or stop data flowing in. Turning them off never removes
            configuration or previously imported records.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <label className="flex items-center justify-between gap-4 rounded-lg border p-4">
            <span className="text-sm font-medium">Automatic ingestion</span>
            <Switch
              checked={settings?.automatic_ingestion_enabled ?? false}
              onCheckedChange={(v) => updateSetting("automatic_ingestion_enabled", v)}
            />
          </label>
          <label className="flex items-center justify-between gap-4 rounded-lg border p-4">
            <span className="text-sm font-medium">Import new records</span>
            <Switch
              checked={settings?.import_new_enabled ?? false}
              onCheckedChange={(v) => updateSetting("import_new_enabled", v)}
            />
          </label>
          <label className="flex items-center justify-between gap-4 rounded-lg border p-4">
            <span className="text-sm font-medium">Update existing records</span>
            <Switch
              checked={settings?.update_existing_enabled ?? false}
              onCheckedChange={(v) => updateSetting("update_existing_enabled", v)}
            />
          </label>
        </CardContent>
      </Card>

      <Tabs defaultValue="jobs">
        <TabsList className="mb-4 flex-wrap">
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="zips">ZIP groups</TabsTrigger>
          <TabsTrigger value="status">Status policy</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => runAction("preview")} disabled={!!busy} variant="outline">
              <Eye className="mr-2 h-4 w-4" /> Preview next ingestion
            </Button>
            <Button onClick={() => runAction("new")} disabled={!!busy}>
              <PlayCircle className="mr-2 h-4 w-4" /> Import new records now
            </Button>
            <Button onClick={() => runAction("update")} disabled={!!busy} variant="secondary">
              <RefreshCw className="mr-2 h-4 w-4" /> Update existing records now
            </Button>
            <Button
              onClick={() => {
                if (confirm("Run a full reconciliation? This re-polls every listing in the enabled ZIP codes.")) {
                  runAction("reconcile");
                }
              }}
              disabled={!!busy}
              variant="outline"
            >
              Run full reconciliation
            </Button>
            <Button onClick={addJob} variant="ghost">
              Add job
            </Button>
          </div>

          {preview && (
            <Card>
              <CardHeader>
                <CardTitle>Preview ({preview.length} records, no writes)</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Listing</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Agent</TableHead>
                      <TableHead>Known?</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {preview.map((row) => (
                      <TableRow key={row.listingKey}>
                        <TableCell className="font-mono text-xs">{row.listingId}</TableCell>
                        <TableCell>
                          <Badge variant={row.needsReview ? "destructive" : "secondary"}>{row.status}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">{row.action}</TableCell>
                        <TableCell className="text-sm">
                          {row.address}, {row.city} {row.zip}
                        </TableCell>
                        <TableCell className="text-sm">
                          {row.listingAgent} {row.hasAgentContact ? "" : "(no contact)"}
                        </TableCell>
                        <TableCell>{row.exists ? "Existing" : "New"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {jobs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No jobs configured yet.</p>
          ) : (
            jobs.map((job) => (
              <Card key={job.id}>
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg">{job.name}</CardTitle>
                    <CardDescription>
                      Last run:{" "}
                      {job.last_run_at ? format(new Date(job.last_run_at), "PPp") : "never"} · Next run:{" "}
                      {job.next_sync_at ? format(new Date(job.next_sync_at), "PPp") : "not scheduled"}
                    </CardDescription>
                  </div>
                  <Switch
                    checked={job.enabled}
                    onCheckedChange={async (v) => {
                      await callSettings("upsert_job", { id: job.id, enabled: v });
                      load();
                    }}
                  />
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <Label htmlFor={`hours-${job.id}`}>Run every (hours)</Label>
                    <Input
                      id={`hours-${job.id}`}
                      type="number"
                      min={1}
                      max={168}
                      defaultValue={job.interval_hours}
                      onBlur={async (e) => {
                        await callSettings("upsert_job", {
                          id: job.id,
                          interval_hours: Number(e.target.value),
                        });
                        load();
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`limit-${job.id}`}>Max new records per day</Label>
                    <Input
                      id={`limit-${job.id}`}
                      type="number"
                      min={0}
                      defaultValue={job.daily_new_limit}
                      onBlur={async (e) => {
                        await callSettings("upsert_job", {
                          id: job.id,
                          daily_new_limit: Number(e.target.value),
                        });
                        load();
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`group-${job.id}`}>ZIP group</Label>
                    <Select
                      defaultValue={job.zip_group_id ?? undefined}
                      onValueChange={async (v) => {
                        await callSettings("upsert_job", { id: job.id, zip_group_id: v });
                        load();
                      }}
                    >
                      <SelectTrigger id={`group-${job.id}`}>
                        <SelectValue placeholder="All enabled groups" />
                      </SelectTrigger>
                      <SelectContent>
                        {groups.map((g) => (
                          <SelectItem key={g.id} value={g.id}>
                            {g.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <div className="font-medium text-foreground">Watermark</div>
                    {job.watermark_committed
                      ? format(new Date(job.watermark_committed), "PPp")
                      : "not set (first run fetches the full ZIP set)"}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="zips" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add a California location group</CardTitle>
              <CardDescription>Exact five-digit ZIP codes, separated by spaces or commas.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-[1fr_2fr_auto] sm:items-end">
              <div>
                <Label htmlFor="group-label">Town or city</Label>
                <Input
                  id="group-label"
                  value={newGroupLabel}
                  onChange={(e) => setNewGroupLabel(e.target.value)}
                  placeholder="Irvine"
                />
              </div>
              <div>
                <Label htmlFor="group-zips">ZIP codes</Label>
                <Input
                  id="group-zips"
                  value={newGroupZips}
                  onChange={(e) => setNewGroupZips(e.target.value)}
                  placeholder="92602, 92603"
                />
              </div>
              <Button onClick={addGroup}>Save group</Button>
            </CardContent>
          </Card>

          {groups.map((g) => (
            <Card key={g.id}>
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg">{g.label}</CardTitle>
                  <CardDescription>{(zipsByGroup[g.id] ?? []).join(", ") || "No ZIP codes"}</CardDescription>
                </div>
                <Switch
                  checked={g.enabled}
                  onCheckedChange={async (v) => {
                    await callSettings("upsert_zip_group", {
                      id: g.id,
                      label: g.label,
                      county: g.county,
                      note: g.note,
                      enabled: v,
                      zips: zipsByGroup[g.id] ?? [],
                    });
                    load();
                  }}
                />
              </CardHeader>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Status policy</CardTitle>
              <CardDescription>
                Every MLS status is imported. This table only decides what the app does next.
                {unmapped.length > 0 && ` ${unmapped.length} status value(s) need a decision.`}
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>MLS status</TableHead>
                    <TableHead>Internal status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {policy.map((p) => (
                    <TableRow key={p.id} className={p.needs_review ? "bg-destructive/5" : undefined}>
                      <TableCell className="font-medium">
                        {p.raw_status}
                        {p.needs_review && (
                          <Badge variant="destructive" className="ml-2">
                            Needs review
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{p.internal_status}</TableCell>
                      <TableCell>
                        <Select
                          defaultValue={p.action}
                          onValueChange={async (v) => {
                            await callSettings("update_status_policy", {
                              id: p.id,
                              internal_status: p.internal_status,
                              policyAction: v,
                            });
                            load();
                          }}
                        >
                          <SelectTrigger className="w-[190px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="lead_sync">Send agent to CRM</SelectItem>
                            <SelectItem value="store_only">Store only</SelectItem>
                            <SelectItem value="suppress">Suppress outreach</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent runs</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>When</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Trigger</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Fetched</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead>Filtered</TableHead>
                    <TableHead>Deferred</TableHead>
                    <TableHead>Failed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {runs.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="whitespace-nowrap text-sm">
                        {format(new Date(r.created_at), "PP p")}
                      </TableCell>
                      <TableCell>{r.mode}</TableCell>
                      <TableCell>{r.trigger}</TableCell>
                      <TableCell>
                        <Badge variant={r.status === "successful" ? "secondary" : "destructive"}>
                          {r.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{r.records_fetched}</TableCell>
                      <TableCell>{r.records_created}</TableCell>
                      <TableCell>{r.records_updated}</TableCell>
                      <TableCell>{r.records_filtered}</TableCell>
                      <TableCell>{r.records_deferred}</TableCell>
                      <TableCell>{r.records_failed}</TableCell>
                    </TableRow>
                  ))}
                  {runs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center text-muted-foreground">
                        No runs yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Provider request settings</CardTitle>
              <CardDescription>
                Keep these conservative until Cotality confirms official rate limits.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="page-size">Page size</Label>
                <Input
                  id="page-size"
                  type="number"
                  defaultValue={settings?.page_size}
                  onBlur={(e) => updateSetting("page_size", Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="timeout">Request timeout (ms)</Label>
                <Input
                  id="timeout"
                  type="number"
                  defaultValue={settings?.request_timeout_ms}
                  onBlur={(e) => updateSetting("request_timeout_ms", Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="retries">Retry attempts</Label>
                <Input
                  id="retries"
                  type="number"
                  defaultValue={settings?.retry_attempts}
                  onBlur={(e) => updateSetting("retry_attempts", Number(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
