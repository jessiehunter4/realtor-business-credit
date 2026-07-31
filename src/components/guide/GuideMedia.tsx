import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import testimonial1 from "@/assets/guide/testimonial-1.jpg";
import testimonial2 from "@/assets/guide/testimonial-2.jpg";

/* ============================================================
 * GuideImage — bright editorial figure card
 * ============================================================ */
export const GuideImage = ({
  src,
  alt,
  caption,
  priority = false,
}: {
  src: string;
  alt: string;
  caption?: string;
  priority?: boolean;
}) => (
  <figure className="my-8 break-inside-avoid">
    <div className="rounded-2xl overflow-hidden border border-border shadow-[0_10px_30px_rgba(11,31,59,.08)]">
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        className="w-full h-auto block"
      />
    </div>
    {caption && (
      <figcaption className="mt-3 text-sm text-muted-foreground italic text-center">
        {caption}
      </figcaption>
    )}
  </figure>
);

/* ============================================================
 * GuideChartUtilization — bar comparison
 * ============================================================ */
export const GuideChartUtilization = () => (
  <figure className="my-8 p-6 md:p-8 bg-card border border-border rounded-2xl shadow-[0_8px_18px_rgba(11,31,59,.06)] break-inside-avoid">
    <p className="text-xs uppercase tracking-widest text-primary font-bold mb-1">Personal credit impact</p>
    <h4 className="text-lg md:text-xl font-bold text-secondary mb-6">
      How $3,000 of business expenses moves your personal utilization
    </h4>

    <div className="space-y-5">
      {[
        { label: "Before charges (healthy)", pct: 18, color: "hsl(var(--primary))" },
        { label: "After $3,000 on personal card", pct: 48, color: "hsl(var(--coral))" },
        { label: "If paid via business card (no impact)", pct: 18, color: "hsl(var(--sky))" },
      ].map((row) => (
        <div key={row.label}>
          <div className="flex justify-between text-sm font-semibold text-foreground mb-1.5">
            <span>{row.label}</span>
            <span className="tabular-nums">{row.pct}%</span>
          </div>
          <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${row.pct}%`, background: row.color }}
            />
          </div>
        </div>
      ))}
    </div>

    <p className="mt-6 text-xs text-muted-foreground">
      Illustrative. Above ~30% utilization, FICO models typically deduct points; the swing varies by profile.
    </p>
  </figure>
);

/* ============================================================
 * GuideChartCashFlow — lumpy income vs steady expenses (inline SVG)
 * ============================================================ */
export const GuideChartCashFlow = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const income = [0, 0, 8, 14, 2, 18, 0, 6, 22, 0, 4, 12];
  const expenses = months.map(() => 4.5);
  const W = 720;
  const H = 240;
  const PADX = 36;
  const PADY = 24;
  const max = 24;
  const innerW = W - PADX * 2;
  const innerH = H - PADY * 2;
  const stepX = innerW / (months.length - 1);
  const yFor = (v: number) => PADY + innerH - (v / max) * innerH;

  const incomePath = income.map((v, i) => `${i === 0 ? "M" : "L"} ${PADX + i * stepX} ${yFor(v)}`).join(" ");
  const expensePath = expenses.map((v, i) => `${i === 0 ? "M" : "L"} ${PADX + i * stepX} ${yFor(v)}`).join(" ");

  return (
    <figure className="my-8 p-6 md:p-8 bg-card border border-border rounded-2xl shadow-[0_8px_18px_rgba(11,31,59,.06)] break-inside-avoid">
      <p className="text-xs uppercase tracking-widest text-primary font-bold mb-1">The Realtor cash-flow shape</p>
      <h4 className="text-lg md:text-xl font-bold text-secondary mb-4">
        Lumpy commissions. Steady expenses. Every month.
      </h4>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Lumpy commissions versus steady expenses over twelve months">
        {[0, 6, 12, 18, 24].map((v) => (
          <g key={v}>
            <line x1={PADX} x2={W - PADX} y1={yFor(v)} y2={yFor(v)} stroke="hsl(var(--border))" strokeWidth="1" />
            <text x={PADX - 6} y={yFor(v) + 4} textAnchor="end" fontSize="10" fill="hsl(var(--muted-foreground))">${v}k</text>
          </g>
        ))}

        {/* income bars */}
        {income.map((v, i) => (
          <rect
            key={i}
            x={PADX + i * stepX - 10}
            y={yFor(v)}
            width={20}
            height={Math.max(0, yFor(0) - yFor(v))}
            fill="hsl(var(--primary))"
            rx={4}
            opacity={v === 0 ? 0.15 : 0.9}
          />
        ))}

        {/* expense line */}
        <path d={expensePath} fill="none" stroke="hsl(var(--coral))" strokeWidth="2.5" strokeDasharray="6 4" />

        {/* month labels */}
        {months.map((m, i) => (
          <text key={m} x={PADX + i * stepX} y={H - 6} textAnchor="middle" fontSize="10" fill="hsl(var(--muted-foreground))">{m}</text>
        ))}
      </svg>

      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-primary" /> Commission income</span>
        <span className="flex items-center gap-2"><span className="w-6 h-[2px] bg-[hsl(var(--coral))]" /> Monthly business expenses</span>
      </div>
    </figure>
  );
};

/* ============================================================
 * GuideThreeAccountDiagram — Operating / Tax / Opportunity
 * ============================================================ */
export const GuideThreeAccountDiagram = () => {
  const accounts = [
    {
      label: "Operating Checking",
      role: "All income in. All business expenses out.",
      share: "60%",
      tint: "hsl(var(--primary))",
    },
    {
      label: "Tax Reserve Savings",
      role: "Auto-transfer a tax % from every commission.",
      share: "25–30%",
      tint: "hsl(var(--accent))",
    },
    {
      label: "Opportunity Reserve",
      role: "Runway, marketing pushes, hiring, growth.",
      share: "10–15%",
      tint: "hsl(var(--sky))",
    },
  ];

  return (
    <figure className="my-8 p-6 md:p-8 bg-card border border-border rounded-2xl shadow-[0_8px_18px_rgba(11,31,59,.06)] break-inside-avoid">
      <p className="text-xs uppercase tracking-widest text-primary font-bold mb-1">The 3-Account Foundation</p>
      <h4 className="text-lg md:text-xl font-bold text-secondary mb-6">Where every commission goes the moment it lands</h4>

      <div className="relative">
        <div className="text-center mb-6">
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
            Commission deposit
          </span>
          <div className="mx-auto w-px h-6 bg-border" aria-hidden />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {accounts.map((a) => (
            <div key={a.label} className="rounded-2xl border border-border p-5 bg-background">
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md text-white"
                  style={{ background: a.tint }}
                >
                  {a.share}
                </span>
              </div>
              <h5 className="font-bold text-secondary text-base mb-1">{a.label}</h5>
              <p className="text-sm text-muted-foreground leading-relaxed">{a.role}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Percentages are starting points to discuss with your CPA. Your structure may add Owner Pay, Marketing, or Payroll reserves later.
      </p>
    </figure>
  );
};

/* ============================================================
 * GuideCreditLadder — 5 stage progression
 * ============================================================ */
export const GuideCreditLadder = () => {
  const stages = [
    { n: 1, label: "Foundation", sub: "Entity • EIN • Banking • Identity" },
    { n: 2, label: "Bureau Presence", sub: "D-U-N-S • Experian • Equifax" },
    { n: 3, label: "Tradelines", sub: "Vendor accounts reporting on time" },
    { n: 4, label: "Revolving Credit", sub: "Business cards aligned to your goals" },
    { n: 5, label: "Growth Funding", sub: "LOCs • Term funding • Equipment" },
  ];

  return (
    <figure className="my-8 p-6 md:p-8 bg-card border border-border rounded-2xl shadow-[0_8px_18px_rgba(11,31,59,.06)] break-inside-avoid">
      <p className="text-xs uppercase tracking-widest text-primary font-bold mb-1">The Realtor Credit Ladder</p>
      <h4 className="text-lg md:text-xl font-bold text-secondary mb-6">Each rung unlocks the next. No skipping steps.</h4>

      <ol className="space-y-3">
        {stages.map((s) => (
          <li
            key={s.n}
            className="flex items-center gap-4 p-4 rounded-2xl bg-background border border-border"
          >
            <span className="flex-none w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-base">
              {s.n}
            </span>
            <div className="min-w-0">
              <div className="font-bold text-secondary">{s.label}</div>
              <div className="text-sm text-muted-foreground">{s.sub}</div>
            </div>
          </li>
        ))}
      </ol>
    </figure>
  );
};

/* ============================================================
 * Guide306090Timeline
 * ============================================================ */
export const Guide306090Timeline = () => {
  const cols = [
    {
      header: "First 30 Days",
      tint: "hsl(var(--primary))",
      items: [
        "Confirm entity pathway with CPA / attorney",
        "Open the 3-account banking foundation",
        "Clean up address, phone, email, website consistency",
        "Complete your free Needs Analysis",
      ],
    },
    {
      header: "Days 31–60",
      tint: "hsl(var(--sky))",
      items: [
        "Establish D-U-N-S and business bureau presence",
        "Begin starter vendor tradelines",
        "Implement bookkeeping categories + reserve auto-transfers",
      ],
    },
    {
      header: "Days 61–90",
      tint: "hsl(var(--accent))",
      items: [
        "Expand reporting tradelines",
        "Prepare for first revolving business card",
        "Review utilization, payment cadence, and next funding step",
      ],
    },
  ];

  return (
    <figure className="my-8 break-inside-avoid">
      <div className="grid md:grid-cols-3 gap-4">
        {cols.map((c) => (
          <div key={c.header} className="rounded-2xl bg-card border border-border p-6 shadow-[0_8px_18px_rgba(11,31,59,.06)]">
            <div
              className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white mb-3"
              style={{ background: c.tint }}
            >
              {c.header}
            </div>
            <ul className="space-y-2.5">
              {c.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-foreground/90">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-none text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </figure>
  );
};

/* ============================================================
 * GuideChecklist — interactive-looking fundability checklist
 * ============================================================ */
export const GuideChecklist = ({
  title,
  items,
}: {
  title: string;
  items: string[];
}) => (
  <figure className="my-8 p-6 md:p-8 bg-card border border-border rounded-2xl shadow-[0_8px_18px_rgba(11,31,59,.06)] break-inside-avoid">
    <h4 className="text-lg md:text-xl font-bold text-secondary mb-5">{title}</h4>
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span className="flex-none mt-0.5 w-5 h-5 rounded-md border-2 border-primary/50 bg-primary/10" aria-hidden />
          <span className="text-base text-foreground/90">{item}</span>
        </li>
      ))}
    </ul>
  </figure>
);

/* ============================================================
 * StatusItem — Strong / Watch / Missing label
 * ============================================================ */
export const StatusItem = ({
  status,
  label,
}: {
  status: "strong" | "watch" | "missing";
  label: string;
}) => {
  const map = {
    strong: { Icon: CheckCircle2, color: "text-primary", bg: "bg-primary/10", label: "Strong" },
    watch: { Icon: AlertTriangle, color: "text-[hsl(var(--accent))]", bg: "bg-accent/15", label: "Watch" },
    missing: { Icon: XCircle, color: "text-[hsl(var(--coral))]", bg: "bg-destructive/10", label: "Missing" },
  } as const;
  const { Icon, color, bg, label: status_label } = map[status];
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
      <span className={`flex-none w-8 h-8 rounded-full ${bg} flex items-center justify-center`}>
        <Icon className={`w-4 h-4 ${color}`} />
      </span>
      <span className="font-medium text-foreground/90 flex-1">{label}</span>
      <span className={`text-xs font-bold uppercase tracking-wider ${color}`}>{status_label}</span>
    </div>
  );
};

/* ============================================================
 * GuideQuoteCard — placeholder testimonial
 * ============================================================ */
export const GuideQuoteCard = ({
  quote,
  name,
  role,
  imageIndex = 1,
}: {
  quote: string;
  name: string;
  role: string;
  imageIndex?: 1 | 2;
}) => {
  const img = imageIndex === 1 ? testimonial1 : testimonial2;
  return (
    <div className="rounded-2xl bg-card border border-border p-6 shadow-[0_8px_18px_rgba(11,31,59,.06)] h-full flex flex-col">
      <p className="text-base md:text-lg text-foreground/90 italic leading-relaxed flex-1">"{quote}"</p>
      <div className="mt-5 flex items-center gap-3">
        <img src={img} alt="" loading="lazy" className="w-12 h-12 rounded-full object-cover" />
        <div>
          <div className="font-bold text-secondary text-sm">{name}</div>
          <div className="text-xs text-muted-foreground">{role}</div>
        </div>
      </div>
      <p className="mt-2 text-[10px] uppercase tracking-wider text-muted-foreground">Illustrative example</p>
    </div>
  );
};

/* ============================================================
 * GuideFAQ — accordion-style Q/A list
 * ============================================================ */
export const GuideFAQ = ({
  items,
}: {
  items: { q: string; a: React.ReactNode }[];
}) => (
  <div className="my-8 space-y-3 break-inside-avoid">
    {items.map((it, i) => (
      <details
        key={i}
        className="group rounded-2xl bg-card border border-border p-5 shadow-[0_4px_14px_rgba(11,31,59,.05)] open:shadow-[0_8px_18px_rgba(11,31,59,.08)]"
      >
        <summary className="font-bold text-secondary text-base md:text-lg cursor-pointer list-none flex items-center justify-between gap-4">
          <span>{it.q}</span>
          <span className="flex-none w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg leading-none group-open:rotate-45 transition-transform" aria-hidden>+</span>
        </summary>
        <div className="mt-3 text-foreground/90 leading-relaxed text-base">{it.a}</div>
      </details>
    ))}
  </div>
);

/* ============================================================
 * BrokerCPADisclaimer — recurring reminder
 * ============================================================ */
export const BrokerCPADisclaimer = () => (
  <div className="my-6 p-4 rounded-2xl bg-accent/15 border border-accent/30 text-sm text-foreground/90">
    <strong className="text-secondary">Not legal, tax, or investment advice.</strong>{" "}
    Confirm entity choice, commission handling, and asset-protection strategy with your state licensing board, broker, attorney, and CPA. This guide and the program provide education and coaching.
  </div>
);