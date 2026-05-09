import { useCallback, useEffect, useMemo, useState } from "react";
import { format, subDays } from "date-fns";
import { CalendarIcon, RefreshCw, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const SEO_FUNNEL = [
  { event: "comparison_page_view", label: "Comparison View" },
  { event: "comparison_page_click", label: "Comparison Click" },
  { event: "guide_view", label: "Guide View" },
  { event: "guide_download", label: "Guide Download" },
  { event: "one_on_one_visited", label: "1:1 Page Visit" },
  { event: "intake_submitted", label: "Intake Submit (Conversion)" },
] as const;

const BAR_COLORS = [
  "hsl(var(--chart-2))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--primary))",
];

const QUICK_RANGES: Array<{ label: string; days: number | null }> = [
  { label: "Last 7d", days: 7 },
  { label: "Last 30d", days: 30 },
  { label: "Last 90d", days: 90 },
  { label: "All Time", days: null },
];

type Counts = Record<string, number>;

const SeoFunnelTab = () => {
  const today = useMemo(() => new Date(), []);
  const [startDate, setStartDate] = useState<Date | undefined>(subDays(today, 30));
  const [endDate, setEndDate] = useState<Date | undefined>(today);
  const [counts, setCounts] = useState<Counts>({});
  const [loading, setLoading] = useState(false);

  const fetchCounts = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("funnel_events")
        .select("event_type, created_at")
        .in("event_type", SEO_FUNNEL.map((s) => s.event));

      if (startDate) {
        const s = new Date(startDate);
        s.setHours(0, 0, 0, 0);
        query = query.gte("created_at", s.toISOString());
      }
      if (endDate) {
        const e = new Date(endDate);
        e.setHours(23, 59, 59, 999);
        query = query.lte("created_at", e.toISOString());
      }

      const { data, error } = await query;
      if (error) {
        console.error("[SeoFunnel] fetch error:", error);
        return;
      }

      const next: Counts = {};
      for (const row of data || []) {
        next[row.event_type] = (next[row.event_type] || 0) + 1;
      }
      setCounts(next);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    void fetchCounts();
  }, [fetchCounts]);

  const applyQuickRange = (days: number | null) => {
    if (days === null) {
      setStartDate(undefined);
      setEndDate(undefined);
    } else {
      setStartDate(subDays(new Date(), days));
      setEndDate(new Date());
    }
  };

  const chartData = SEO_FUNNEL.map((s) => ({
    event_type: s.event,
    label: s.label,
    count: counts[s.event] || 0,
  }));

  const conversions = [
    { label: "Comparison View → Click", from: "comparison_page_view", to: "comparison_page_click" },
    { label: "Comparison Click → Guide", from: "comparison_page_click", to: "guide_view" },
    { label: "Guide View → Download", from: "guide_view", to: "guide_download" },
    { label: "Guide View → 1:1 Visit", from: "guide_view", to: "one_on_one_visited" },
    { label: "1:1 Visit → Intake Submit", from: "one_on_one_visited", to: "intake_submitted" },
    { label: "Comparison View → Conversion", from: "comparison_page_view", to: "intake_submitted" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-4 w-4" /> Date Range
          </CardTitle>
          <CardDescription>Filter the SEO-driven funnel by event date.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3">
            {QUICK_RANGES.map((r) => (
              <Button key={r.label} size="sm" variant="outline" onClick={() => applyQuickRange(r.days)}>
                {r.label}
              </Button>
            ))}
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn("justify-start text-left font-normal w-[150px]", !startDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                    {startDate ? format(startDate, "PPP") : "Start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              <span className="text-xs text-muted-foreground">to</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn("justify-start text-left font-normal w-[150px]", !endDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                    {endDate ? format(endDate, "PPP") : "End date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Button size="sm" variant="ghost" onClick={() => void fetchCounts()} disabled={loading} className="gap-2">
              <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO → Conversion Funnel</CardTitle>
          <CardDescription>
            From comparison page visit through guide engagement to a submitted intake.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="label"
                angle={-30}
                textAnchor="end"
                height={90}
                interval={0}
                className="text-xs fill-muted-foreground"
              />
              <YAxis allowDecimals={false} className="text-xs fill-muted-foreground" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i] || "hsl(var(--primary))"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
        {chartData.map((d) => (
          <Card key={d.event_type}>
            <CardHeader className="pb-1">
              <CardDescription className="text-xs leading-tight">{d.label}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{d.count}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Conversion Rates</CardTitle>
          <CardDescription>Step-to-step conversion across the SEO funnel.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {conversions.map(({ label, from, to }) => {
              const fromCount = counts[from] || 0;
              const toCount = counts[to] || 0;
              const rate = fromCount > 0 ? Math.round((toCount / fromCount) * 100) : 0;
              return (
                <div key={label} className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">{label}</p>
                  <p className="text-2xl font-bold">{rate}%</p>
                  <p className="text-xs text-muted-foreground">
                    {toCount} / {fromCount}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SeoFunnelTab;
