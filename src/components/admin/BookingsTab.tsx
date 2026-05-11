import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { CalendarClock, RefreshCw, ExternalLink, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface GhlAppointment {
  id: string;
  title?: string;
  appointmentStatus?: string;
  startTime?: string;
  endTime?: string;
  calendarId?: string;
  contactId?: string;
  assignedUserId?: string;
  notes?: string;
}

interface ApiResponse {
  appointments: GhlAppointment[];
  calendars: Record<string, string>;
  window: { startTime: number; endTime: number };
  errors?: Array<{ calendarId: string; status: number; body: string }>;
  error?: string;
}

const GHL_CONTACT_URL_PREFIX = "https://app.everycatch.com/v2/location/zcT6eHcjb9quBLB8dUdw/contacts/detail/";

const RANGES: Array<{ label: string; pastDays: number; futureDays: number }> = [
  { label: "Next 30d", pastDays: 0, futureDays: 30 },
  { label: "Next 90d", pastDays: 0, futureDays: 90 },
  { label: "Past 30d", pastDays: 30, futureDays: 0 },
  { label: "Past 90d", pastDays: 90, futureDays: 0 },
  { label: "All (±60d)", pastDays: 60, futureDays: 60 },
];

const statusVariant = (s?: string): "default" | "secondary" | "outline" | "destructive" => {
  const v = (s || "").toLowerCase();
  if (v === "confirmed" || v === "showed") return "default";
  if (v === "noshow" || v === "cancelled") return "destructive";
  return "secondary";
};

const BookingsTab = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rangeIdx, setRangeIdx] = useState(4); // default ±60d

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = RANGES[rangeIdx];
      const now = Date.now();
      const startTime = now - r.pastDays * 86400_000;
      const endTime = now + r.futureDays * 86400_000;
      const fnUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/list-ghl-appointments?startTime=${startTime}&endTime=${endTime}`;
      const session = (await supabase.auth.getSession()).data.session;
      const token = session?.access_token;
      const res = await fetch(fnUrl, {
        headers: {
          Authorization: `Bearer ${token ?? ""}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
      });
      const payload = (await res.json()) as ApiResponse;
      if (!res.ok) {
        setError(payload.error || `Request failed (${res.status})`);
        setData(null);
      } else {
        setData(payload);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }, [rangeIdx]);

  useEffect(() => {
    void fetchAppointments();
  }, [fetchAppointments]);

  const { upcoming, past } = useMemo(() => {
    const list = data?.appointments || [];
    const now = Date.now();
    const up: GhlAppointment[] = [];
    const ps: GhlAppointment[] = [];
    for (const a of list) {
      const t = a.startTime ? new Date(a.startTime).getTime() : 0;
      if (t >= now) up.push(a);
      else ps.push(a);
    }
    up.sort((a, b) => new Date(a.startTime || 0).getTime() - new Date(b.startTime || 0).getTime());
    return { upcoming: up, past: ps };
  }, [data]);

  const renderRow = (a: GhlAppointment) => {
    const start = a.startTime ? new Date(a.startTime) : null;
    const calName = a.calendarId ? data?.calendars[a.calendarId] || a.calendarId : "—";
    return (
      <tr key={a.id} className="border-b">
        <td className="py-2 pr-3 text-sm whitespace-nowrap">
          {start ? format(start, "MMM d, yyyy h:mm a") : "—"}
        </td>
        <td className="py-2 pr-3 text-sm">
          <Badge variant={statusVariant(a.appointmentStatus)}>
            {a.appointmentStatus || "—"}
          </Badge>
        </td>
        <td className="py-2 pr-3 text-sm truncate max-w-[200px]" title={a.title}>{a.title || "—"}</td>
        <td className="py-2 pr-3 text-sm text-muted-foreground">{calName}</td>
        <td className="py-2 pr-3 text-sm">
          {a.contactId ? (
            <a
              href={`${GHL_CONTACT_URL_PREFIX}${a.contactId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              View <ExternalLink className="h-3 w-3" />
            </a>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </td>
      </tr>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarClock className="h-4 w-4" /> One-On-One Bookings
          </CardTitle>
          <CardDescription>
            Appointments pulled live from EveryCatch (GoHighLevel) calendars.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2">
            {RANGES.map((r, i) => (
              <Button
                key={r.label}
                size="sm"
                variant={rangeIdx === i ? "default" : "outline"}
                onClick={() => setRangeIdx(i)}
              >
                {r.label}
              </Button>
            ))}
            <Button size="sm" variant="ghost" onClick={() => void fetchAppointments()} disabled={loading} className="gap-2">
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/30 rounded text-sm text-destructive flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {data?.errors && data.errors.length > 0 && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900">
              <p className="font-medium mb-1">Some calendars failed to load:</p>
              <ul className="list-disc pl-5">
                {data.errors.map((e, i) => (
                  <li key={i}>Calendar {e.calendarId.substring(0, 8)}…: {e.status}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-1"><CardDescription className="text-xs">Total in window</CardDescription></CardHeader>
          <CardContent><p className="text-2xl font-bold">{data?.appointments.length ?? 0}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1"><CardDescription className="text-xs">Upcoming</CardDescription></CardHeader>
          <CardContent><p className="text-2xl font-bold text-primary">{upcoming.length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1"><CardDescription className="text-xs">Past</CardDescription></CardHeader>
          <CardContent><p className="text-2xl font-bold">{past.length}</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upcoming ({upcoming.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {upcoming.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-3 text-xs font-medium text-muted-foreground">When</th>
                    <th className="text-left py-2 pr-3 text-xs font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-2 pr-3 text-xs font-medium text-muted-foreground">Title</th>
                    <th className="text-left py-2 pr-3 text-xs font-medium text-muted-foreground">Calendar</th>
                    <th className="text-left py-2 pr-3 text-xs font-medium text-muted-foreground">Contact</th>
                  </tr>
                </thead>
                <tbody>{upcoming.map(renderRow)}</tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm py-6 text-center">No upcoming bookings in this window.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Past ({past.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {past.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-3 text-xs font-medium text-muted-foreground">When</th>
                    <th className="text-left py-2 pr-3 text-xs font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-2 pr-3 text-xs font-medium text-muted-foreground">Title</th>
                    <th className="text-left py-2 pr-3 text-xs font-medium text-muted-foreground">Calendar</th>
                    <th className="text-left py-2 pr-3 text-xs font-medium text-muted-foreground">Contact</th>
                  </tr>
                </thead>
                <tbody>{past.map(renderRow)}</tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm py-6 text-center">No past bookings in this window.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingsTab;