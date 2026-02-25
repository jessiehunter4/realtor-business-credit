import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { PlanData } from "./PlanDocument";

const s = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    paddingTop: 48,
    paddingBottom: 64,
    paddingHorizontal: 56,
    fontSize: 10,
    lineHeight: 1.7,
    fontFamily: "Helvetica",
  },
  header: {
    backgroundColor: "#0d1b2a",
    marginHorizontal: -56,
    marginTop: -48,
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
  narrative: { fontSize: 10, color: "#444444", lineHeight: 1.7, marginBottom: 8 },
  fundRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  fundIcon: { width: 12, height: 12, borderRadius: 6, marginRight: 6, justifyContent: "center", alignItems: "center" },
  fundLabel: { fontSize: 10, color: "#333333", flex: 1 },
  fundStatus: { fontSize: 8, fontFamily: "Helvetica-Bold" },
  actionRow: { flexDirection: "row", marginBottom: 8, alignItems: "flex-start" },
  actionBadge: {
    width: 18, height: 18, borderRadius: 9, backgroundColor: "#3eaf7c",
    justifyContent: "center", alignItems: "center", marginRight: 8, marginTop: 1,
  },
  actionNum: { fontSize: 8, color: "#FFFFFF", fontFamily: "Helvetica-Bold" },
  actionText: { fontSize: 10, color: "#333333", flex: 1 },
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
  programCard: {
    borderWidth: 1, borderColor: "#dddddd", borderRadius: 4,
    padding: 8, marginBottom: 6, width: "48%",
  },
  programName: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#1e3a5f" },
  programDesc: { fontSize: 8, color: "#666666", marginTop: 2 },
  programGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  disclaimer: { fontSize: 7, color: "#999999", fontStyle: "italic", marginTop: 10 },
  footer: {
    backgroundColor: "#0d1b2a",
    marginHorizontal: -56,
    marginBottom: -64,
    paddingHorizontal: 56,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
  },
  footerText: { fontSize: 7, color: "#666666" },
});

const statusColor = (status: string) =>
  status === "strong" ? "#16a34a" : status === "warning" ? "#d97706" : "#dc2626";

const statusLabel = (status: string) =>
  status === "strong" ? "Strong" : status === "warning" ? "Needs Attention" : "Missing";

const statusSymbol = (status: string) =>
  status === "strong" ? "✓" : status === "warning" ? "⚠" : "✕";

export default function PlanPDF({ planData }: { planData: PlanData }) {
  const { sections } = planData;

  return (
    <Document title={`Business Credit Plan – ${planData.contact_name || "Agent"}`}>
      <Page size="LETTER" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.headerBrand}>Realtor Business Credit</Text>
            <Text style={s.headerTitle}>Your Custom Business Credit Plan</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={s.headerLabel}>Prepared for</Text>
            <Text style={s.headerName}>{planData.contact_name || "Agent"}</Text>
            <Text style={s.headerMeta}>
              {[planData.city, planData.state].filter(Boolean).join(", ")}
              {planData.license_type ? ` · ${planData.license_type}` : ""}
            </Text>
          </View>
        </View>

        {/* Section 1 */}
        <Text style={s.sectionTitle}>1. Your Goals & Snapshot</Text>
        <Text style={s.narrative}>{sections.goals_snapshot.narrative}</Text>

        {/* Section 2 */}
        <Text style={s.sectionTitle}>2. Business Structure & Fundability</Text>
        {sections.fundability.items.map((item, i) => (
          <View key={i} style={s.fundRow}>
            <View style={[s.fundIcon, { backgroundColor: statusColor(item.status) + "22" }]}>
              <Text style={{ fontSize: 8, color: statusColor(item.status) }}>{statusSymbol(item.status)}</Text>
            </View>
            <Text style={s.fundLabel}>{item.label}</Text>
            <Text style={[s.fundStatus, { color: statusColor(item.status) }]}>{statusLabel(item.status)}</Text>
          </View>
        ))}
        <Text style={[s.narrative, { marginTop: 8 }]}>{sections.fundability.narrative}</Text>

        {/* Section 3 */}
        <Text style={s.sectionTitle}>3. 90-Day Action Plan</Text>
        {sections.action_plan_90day.items.map((item, i) => (
          <View key={i} style={s.actionRow}>
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
        <Text style={s.sectionTitle}>4. 6–12 Month Roadmap</Text>
        {sections.roadmap.milestones.map((m, i) => (
          <View key={i} style={s.milestoneRow}>
            <View style={s.milestoneBadge}>
              <Text style={s.milestoneMonth}>{m.month}</Text>
            </View>
            <Text style={s.milestoneDesc}>{m.description}</Text>
          </View>
        ))}

        {/* Section 5 */}
        <Text style={s.sectionTitle}>5. Credit & Funding Opportunities</Text>
        {sections.funding_opportunities.items.map((f, i) => (
          <View key={i} style={s.fundingItem}>
            <Text style={s.fundingType}>{f.type}</Text>
            <Text style={s.fundingDesc}>{f.description}</Text>
          </View>
        ))}
        <Text style={s.disclaimer}>
          This is educational information, not a guarantee of approval or specific terms. Consult your attorney, CPA, and financial advisor.
        </Text>

        {/* Section 6 */}
        <Text style={s.sectionTitle}>6. Program Options & Next Steps</Text>
        <Text style={s.narrative}>{sections.next_steps.narrative}</Text>
        <View style={s.programGrid}>
          {sections.next_steps.program_options.map((opt, i) => (
            <View key={i} style={s.programCard}>
              <Text style={s.programName}>{opt.name}</Text>
              <Text style={s.programDesc}>{opt.description}</Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={s.footer}>
          <Text style={s.footerText}>© 2026 RealtorBusinessCredit.com · My Better Business Credit</Text>
          <Text style={s.footerText}>This plan is for educational purposes only. Not legal, tax, or financial advice.</Text>
        </View>
      </Page>
    </Document>
  );
}
