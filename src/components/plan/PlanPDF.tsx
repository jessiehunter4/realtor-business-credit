import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { PlanData } from "./PlanDocument";
import { formatPlanDate, isMeaningfullyUpdated } from "@/lib/utils";

const s = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    paddingTop: 56,
    paddingBottom: 72,
    paddingHorizontal: 56,
    fontSize: 10,
    lineHeight: 1.7,
    fontFamily: "Helvetica",
  },
  coverPage: {
    backgroundColor: "#0d1b2a",
    color: "#FFFFFF",
    padding: 56,
    flexDirection: "column",
    justifyContent: "space-between",
    fontFamily: "Helvetica",
  },
  coverBrand: { fontSize: 9, color: "#3eaf7c", letterSpacing: 3, fontFamily: "Helvetica-Bold", textTransform: "uppercase" },
  coverDivider: { height: 3, width: 60, backgroundColor: "#3eaf7c", marginTop: 24, marginBottom: 24 },
  coverTitle: { fontSize: 32, color: "#FFFFFF", fontFamily: "Helvetica-Bold", lineHeight: 1.2 },
  coverSubtitle: { fontSize: 13, color: "#cbd5e1", marginTop: 14, lineHeight: 1.5 },
  coverPreparedLabel: { fontSize: 8, color: "#94a3b8", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 },
  coverPreparedName: { fontSize: 18, color: "#FFFFFF", fontFamily: "Helvetica-Bold" },
  coverPreparedMeta: { fontSize: 10, color: "#cbd5e1", marginTop: 4 },
  coverFooter: { fontSize: 8, color: "#64748b", borderTopWidth: 1, borderTopColor: "#1e3a5f", paddingTop: 12 },
  runningHeader: {
    position: "absolute",
    top: 24,
    left: 56,
    right: 56,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: "#94a3b8",
    paddingBottom: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e2e8f0",
  },
  runningHeaderBrand: { color: "#1e3a5f", fontFamily: "Helvetica-Bold" },
  header: {
    backgroundColor: "#0d1b2a",
    marginHorizontal: -56,
    marginTop: -56,
    paddingHorizontal: 56,
    paddingVertical: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerBrand: { fontSize: 8, color: "#3eaf7c", letterSpacing: 2, fontFamily: "Helvetica-Bold", textTransform: "uppercase", marginBottom: 4 },
  headerTitle: { fontSize: 16, color: "#FFFFFF", fontFamily: "Helvetica-Bold" },
  headerLabel: { fontSize: 7, color: "#999999" },
  headerName: { fontSize: 11, color: "#FFFFFF", fontFamily: "Helvetica-Bold" },
  headerMeta: { fontSize: 8, color: "#999999" },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#1e3a5f",
    borderBottomWidth: 2,
    borderBottomColor: "#3eaf7c",
    paddingBottom: 4,
    marginBottom: 10,
    marginTop: 18,
  },
  sectionEyebrow: { fontSize: 7, letterSpacing: 1.5, color: "#3eaf7c", fontFamily: "Helvetica-Bold", textTransform: "uppercase", marginTop: 18 },
  narrative: { fontSize: 10, color: "#444444", lineHeight: 1.7, marginBottom: 8 },
  fundRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  fundIcon: { width: 12, height: 12, borderRadius: 6, marginRight: 6, justifyContent: "center", alignItems: "center" },
  fundLabel: { fontSize: 10, color: "#333333", flex: 1 },
  fundStatus: { fontSize: 8, fontFamily: "Helvetica-Bold" },
  actionRow: { flexDirection: "row", marginBottom: 10, alignItems: "flex-start" },
  actionCheckbox: {
    width: 14, height: 14, borderRadius: 2, borderWidth: 1, borderColor: "#3eaf7c",
    marginRight: 8, marginTop: 2,
  },
  actionBadge: {
    width: 16, height: 16, borderRadius: 8, backgroundColor: "#3eaf7c",
    justifyContent: "center", alignItems: "center", marginRight: 8, marginTop: 1,
  },
  actionNum: { fontSize: 8, color: "#FFFFFF", fontFamily: "Helvetica-Bold" },
  actionText: { fontSize: 10, color: "#333333", flex: 1, fontFamily: "Helvetica-Bold" },
  actionEffort: { fontSize: 8, color: "#999999", marginTop: 2 },
  milestoneRow: { flexDirection: "row", marginBottom: 8, alignItems: "flex-start" },
  milestoneBadge: {
    backgroundColor: "#1e3a5f", paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 3, marginRight: 8, minWidth: 60,
  },
  milestoneMonth: { fontSize: 8, color: "#FFFFFF", fontFamily: "Helvetica-Bold", textAlign: "center" },
  milestoneDesc: { fontSize: 10, color: "#333333", flex: 1 },
  fundingItem: { borderLeftWidth: 2, borderLeftColor: "#3eaf7c", paddingLeft: 10, marginBottom: 8 },
  fundingType: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#1e3a5f" },
  fundingDesc: { fontSize: 9, color: "#555555" },
  goalCard: { borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 4, padding: 8, marginBottom: 6 },
  goalCardPrimary: { borderColor: "#3eaf7c", backgroundColor: "#3eaf7c14" },
  goalHeader: { flexDirection: "row", alignItems: "center", marginBottom: 3 },
  goalBadge: { fontSize: 7, fontFamily: "Helvetica-Bold", color: "#FFFFFF", backgroundColor: "#3eaf7c", paddingHorizontal: 5, paddingVertical: 2, borderRadius: 2, marginRight: 6, textTransform: "uppercase", letterSpacing: 0.5 },
  goalBadgeSecondary: { backgroundColor: "#94a3b8" },
  goalLabel: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#1e3a5f" },
  goalMeta: { fontSize: 8, color: "#64748b", marginBottom: 2 },
  goalWhy: { fontSize: 9, color: "#333333" },
  programCard: {
    borderWidth: 1, borderColor: "#dddddd", borderRadius: 4,
    padding: 8, marginBottom: 6, width: "48%",
  },
  programName: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#1e3a5f" },
  programDesc: { fontSize: 8, color: "#666666", marginTop: 2 },
  programGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  disclaimer: { fontSize: 7, color: "#999999", fontStyle: "italic", marginTop: 10 },
  pageFooter: {
    position: "absolute",
    bottom: 24,
    left: 56,
    right: 56,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: "#e2e8f0",
  },
  footerText: { fontSize: 7, color: "#94a3b8" },
  pageNumber: { fontSize: 7, color: "#94a3b8" },
});

const statusColor = (status: string) =>
  status === "strong" ? "#16a34a" : status === "warning" ? "#d97706" : "#dc2626";

const statusLabel = (status: string) =>
  status === "strong" ? "Strong" : status === "warning" ? "Needs Attention" : "Missing";

const statusSymbol = (status: string) =>
  status === "strong" ? "✓" : status === "warning" ? "⚠" : "✕";

/** Printable progress markers for tracked plan items. */
export interface PlanPrintItem {
  title: string;
  detail?: string;
  meta?: string;
  status: "not_started" | "in_progress" | "completed" | string;
  custom?: boolean;
}

export interface PlanPrintProgress {
  goals?: PlanPrintItem[];
  actions?: PlanPrintItem[];
  milestones?: PlanPrintItem[];
  funding?: PlanPrintItem[];
}

const progressLabel = (status: string) =>
  status === "completed" ? "Done" : status === "in_progress" ? "In progress" : "Not started";

function Chrome({ name }: { name: string }) {
  return (
    <>
      <View style={s.runningHeader} fixed>
        <Text style={s.runningHeaderBrand}>RE Pro Business Credit Plan</Text>
        <Text>{name}</Text>
      </View>
      <View style={s.pageFooter} fixed>
        <Text style={s.footerText}>© 2026 RealtorBusinessCredit.com</Text>
        <Text
          style={s.pageNumber}
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
        />
      </View>
    </>
  );
}

export default function PlanPDF({
  planData,
  createdAt,
  updatedAt,
  progress,
}: {
  planData: PlanData;
  createdAt?: string | null;
  updatedAt?: string | null;
  /** Live dashboard items (edits, custom items, statuses) to print instead of the raw plan. */
  progress?: PlanPrintProgress;
}) {
  const sections = (planData?.sections ?? {}) as Partial<PlanData["sections"]>;
  const goalsNarrative = sections.goals_snapshot?.narrative ?? "";
  const fundabilityItems = sections.fundability?.items ?? [];
  const fundabilityNarrative = sections.fundability?.narrative ?? "";
  const nextStepsNarrative = sections.next_steps?.narrative ?? "";
  const programOptions = sections.next_steps?.program_options ?? [];

  const goalsList: PlanPrintItem[] =
    progress?.goals ??
    (sections.goals_snapshot?.goals ?? []).map((g) => ({
      title: g.label,
      detail: g.why_it_matters,
      meta: [g.priority ? `${g.priority} goal` : null, g.horizon, g.target_amount].filter(Boolean).join(" · "),
      status: "not_started",
    }));
  const actionItems: PlanPrintItem[] =
    progress?.actions ??
    (sections.action_plan_90day?.items ?? []).map((a) => ({
      title: a.text,
      meta: a.effort ? `Est. effort: ${a.effort}` : undefined,
      status: "not_started",
    }));
  const milestones: PlanPrintItem[] =
    progress?.milestones ??
    (sections.roadmap?.milestones ?? []).map((m) => ({ title: m.description, meta: m.month, status: "not_started" }));
  const fundingItems: PlanPrintItem[] =
    progress?.funding ??
    (sections.funding_opportunities?.items ?? []).map((f) => ({
      title: f.type,
      detail: f.description,
      status: "not_started",
    }));

  const draftedLabel = formatPlanDate(createdAt);
  const updatedLabel = isMeaningfullyUpdated(createdAt, updatedAt) ? formatPlanDate(updatedAt) : null;
  const preparedFallback = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const locationLine = [planData.city, planData.state].filter(Boolean).join(", ");

  return (
    <Document title={`Business Credit Plan – ${planData.contact_name || "Agent"}`}>
      {/* Cover Page */}
      <Page size="LETTER" style={s.coverPage}>
        <View>
          <Text style={s.coverBrand}>RE Pro Business Credit</Text>
          <View style={s.coverDivider} />
          <Text style={s.coverTitle}>Your Custom{"\n"}Business Credit Plan</Text>
          <Text style={s.coverSubtitle}>
            A Realtor-specific roadmap to build separate business credit, protect your personal finances, and unlock funding capacity for your real estate business.
          </Text>
        </View>
        <View>
          <Text style={s.coverPreparedLabel}>Prepared for</Text>
          <Text style={s.coverPreparedName}>{planData.contact_name || "Agent"}</Text>
          <Text style={s.coverPreparedMeta}>
            {locationLine}
            {planData.license_type ? ` · ${planData.license_type}` : ""}
          </Text>
          {draftedLabel ? (
            <>
              <Text style={[s.coverPreparedMeta, { marginTop: 2 }]}>Drafted: {draftedLabel}</Text>
              {updatedLabel && (
                <Text style={s.coverPreparedMeta}>Last updated: {updatedLabel}</Text>
              )}
            </>
          ) : (
            <Text style={[s.coverPreparedMeta, { marginTop: 2 }]}>Prepared {preparedFallback}</Text>
          )}
        </View>
        <Text style={s.coverFooter}>
          My Better Business Credit · RealtorBusinessCredit.com{"\n"}
          Educational only — not legal, tax, or financial advice.
        </Text>
      </Page>

      <Page size="LETTER" style={s.page}>
        {/* Running header */}
        <View style={s.runningHeader} fixed>
          <Text style={s.runningHeaderBrand}>RE Pro Business Credit Plan</Text>
          <Text>{planData.contact_name || "Agent"}</Text>
        </View>

        {/* Page footer with page numbers */}
        <View style={s.pageFooter} fixed>
          <Text style={s.footerText}>© 2026 RealtorBusinessCredit.com</Text>
          <Text
            style={s.pageNumber}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          />
        </View>

        {/* Header band */}
        <View style={s.header}>
          <View>
            <Text style={s.headerBrand}>RE Pro Business Credit</Text>
            <Text style={s.headerTitle}>Your Custom Business Credit Plan</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={s.headerLabel}>Prepared for</Text>
            <Text style={s.headerName}>{planData.contact_name || "Agent"}</Text>
            <Text style={s.headerMeta}>
              {locationLine}
              {planData.license_type ? ` · ${planData.license_type}` : ""}
            </Text>
            {draftedLabel && (
              <Text style={s.headerMeta}>Drafted: {draftedLabel}</Text>
            )}
            {updatedLabel && (
              <Text style={s.headerMeta}>Last updated: {updatedLabel}</Text>
            )}
          </View>
        </View>

        {/* Section 1 */}
        <Text style={s.sectionEyebrow}>Section 01</Text>
        <Text style={s.sectionTitle}>Your Goals & Snapshot</Text>
        {goalsList.map((g, i) => {
          const isPrimary = g.priority === "primary";
          return (
            <View key={i} style={[s.goalCard, isPrimary ? s.goalCardPrimary : {}]} wrap={false}>
              <View style={s.goalHeader}>
                <Text style={[s.goalBadge, isPrimary ? {} : s.goalBadgeSecondary]}>
                  {isPrimary ? "Primary Goal" : `Goal ${i + 1}`}
                </Text>
                <Text style={s.goalLabel}>{g.label}</Text>
              </View>
              {(g.horizon || g.target_amount) ? (
                <Text style={s.goalMeta}>
                  {g.horizon ? `Horizon: ${g.horizon}` : ""}
                  {g.horizon && g.target_amount ? " · " : ""}
                  {g.target_amount ? `Target: ${g.target_amount}` : ""}
                </Text>
              ) : null}
              {g.why_it_matters ? <Text style={s.goalWhy}>{g.why_it_matters}</Text> : null}
            </View>
          );
        })}
        <Text style={s.narrative}>{goalsNarrative}</Text>

        {/* Section 2 */}
        <Text style={s.sectionEyebrow}>Section 02</Text>
        <Text style={s.sectionTitle}>Business Structure & Fundability</Text>
        {fundabilityItems.map((item, i) => (
          <View key={i} style={s.fundRow}>
            <View style={[s.fundIcon, { backgroundColor: statusColor(item.status) + "22" }]}>
              <Text style={{ fontSize: 8, color: statusColor(item.status) }}>{statusSymbol(item.status)}</Text>
            </View>
            <Text style={s.fundLabel}>{item.label}</Text>
            <Text style={[s.fundStatus, { color: statusColor(item.status) }]}>{statusLabel(item.status)}</Text>
          </View>
        ))}
        <Text style={[s.narrative, { marginTop: 8 }]}>{fundabilityNarrative}</Text>

        {/* Section 3 */}
        <Text style={s.sectionEyebrow}>Section 03</Text>
        <Text style={s.sectionTitle}>90-Day Action Plan</Text>
        <Text style={[s.narrative, { fontSize: 9, color: "#666666", marginBottom: 10 }]}>
          Check each box as you complete it. Your portal also tracks progress automatically.
        </Text>
        {actionItems.map((item, i) => (
          <View key={i} style={s.actionRow} wrap={false}>
            <View style={s.actionCheckbox} />
            <View style={s.actionBadge}>
              <Text style={s.actionNum}>{item.step}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.actionText}>{item.text}</Text>
              <Text style={s.actionEffort}>Est. effort: {item.effort}</Text>
            </View>
          </View>
        ))}

        {/* Section 4 */}
        <Text style={s.sectionEyebrow}>Section 04</Text>
        <Text style={s.sectionTitle}>6–12 Month Roadmap</Text>
        {milestones.map((m, i) => (
          <View key={i} style={s.milestoneRow} wrap={false}>
            <View style={s.milestoneBadge}>
              <Text style={s.milestoneMonth}>{m.month}</Text>
            </View>
            <Text style={s.milestoneDesc}>{m.description}</Text>
          </View>
        ))}

        {/* Section 5 */}
        <Text style={s.sectionEyebrow}>Section 05</Text>
        <Text style={s.sectionTitle}>Credit & Funding Opportunities</Text>
        {fundingItems.map((f, i) => (
          <View key={i} style={s.fundingItem} wrap={false}>
            <Text style={s.fundingType}>{f.type}</Text>
            <Text style={s.fundingDesc}>{f.description}</Text>
          </View>
        ))}
        <Text style={s.disclaimer}>
          This is educational information, not a guarantee of approval or specific terms. Consult your attorney, CPA, and financial advisor.
        </Text>

        {/* Section 6 */}
        <Text style={s.sectionEyebrow}>Section 06</Text>
        <Text style={s.sectionTitle}>Program Options & Next Steps</Text>
        <Text style={s.narrative}>{nextStepsNarrative}</Text>
        <View style={s.programGrid}>
          {programOptions.map((opt, i) => (
            <View key={i} style={s.programCard} wrap={false}>
              <Text style={s.programName}>{opt.name}</Text>
              <Text style={s.programDesc}>{opt.description}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
