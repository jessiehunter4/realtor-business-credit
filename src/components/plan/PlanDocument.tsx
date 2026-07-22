import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { formatPlanDate, isMeaningfullyUpdated } from "@/lib/utils";

interface FundabilityItem {
  label: string;
  status: string;
  detail: string;
}

interface ActionItem {
  step: number;
  text: string;
  effort: string;
}

interface Milestone {
  month: string;
  description: string;
}

interface FundingItem {
  type: string;
  description: string;
}

interface ProgramOption {
  name: string;
  description: string;
}

export interface PlanData {
  contact_name: string;
  contact_email: string;
  city: string;
  state: string;
  license_type: string;
  sections: {
    goals_snapshot: { narrative: string };
    fundability: { items: FundabilityItem[]; narrative: string };
    action_plan_90day: { items: ActionItem[] };
    roadmap: { milestones: Milestone[] };
    funding_opportunities: { items: FundingItem[] };
    next_steps: { narrative: string; program_options: ProgramOption[] };
  };
}

interface PlanDocumentProps {
  planData: PlanData;
  editMode?: boolean;
  onEditSection?: (section: string, value: string) => void;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export default function PlanDocument({ planData, editMode, onEditSection, createdAt, updatedAt }: PlanDocumentProps) {
  const sections = (planData?.sections ?? {}) as Partial<PlanData["sections"]>;
  const goalsNarrative = sections.goals_snapshot?.narrative ?? "";
  const fundabilityItems = sections.fundability?.items ?? [];
  const fundabilityNarrative = sections.fundability?.narrative ?? "";
  const actionItems = sections.action_plan_90day?.items ?? [];
  const milestones = sections.roadmap?.milestones ?? [];
  const fundingItems = sections.funding_opportunities?.items ?? [];
  const nextStepsNarrative = sections.next_steps?.narrative ?? "";
  const programOptions = sections.next_steps?.program_options ?? [];
  const draftedLabel = formatPlanDate(createdAt);
  const updatedLabel = isMeaningfullyUpdated(createdAt, updatedAt) ? formatPlanDate(updatedAt) : null;

  const EditableText = ({ section, value, rows = 4 }: { section: string; value: string; rows?: number }) => {
    if (!editMode) return <p className="leading-relaxed text-gray-600 whitespace-pre-wrap">{value}</p>;
    return (
      <textarea
        className="w-full border border-gray-300 rounded p-2 text-sm text-gray-700 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#3eaf7c]/50"
        value={value}
        rows={rows}
        onChange={(e) => onEditSection?.(section, e.target.value)}
      />
    );
  };

  return (
    <div className="w-full bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden text-gray-800 text-sm print:shadow-none print:border-0">
      {/* Header */}
      <div className="bg-[#0d1b2a] px-6 sm:px-8 py-5 sm:py-6 flex items-center justify-between">
        <div>
          <p className="text-[#3eaf7c] text-[10px] sm:text-xs tracking-[0.2em] uppercase font-sans font-semibold mb-1">
            RE Pro Business Credit
          </p>
          <p className="text-white text-lg sm:text-xl font-bold leading-snug font-serif">
            Your Custom Business Credit Plan
          </p>
        </div>
        <div className="text-right">
          <p className="text-white/70 text-[10px] font-sans">Prepared for</p>
          <p className="text-white font-bold text-sm">{planData.contact_name || "Agent"}</p>
          <p className="text-white/50 text-[10px] font-sans">
            {[planData.city, planData.state].filter(Boolean).join(", ")}
            {planData.license_type ? ` · ${planData.license_type}` : ""}
          </p>
          {draftedLabel && (
            <p className="text-white/50 text-[10px] font-sans mt-1">Drafted: {draftedLabel}</p>
          )}
          {updatedLabel && (
            <p className="text-white/50 text-[10px] font-sans">Last updated: {updatedLabel}</p>
          )}
        </div>
      </div>

      {/* Section 1 - Goals & Snapshot */}
      <div className="px-6 sm:px-8 pt-6 pb-4">
        <h3 className="text-[#1e3a5f] text-base font-bold border-b-2 border-[#3eaf7c] pb-1 mb-3 font-sans">
          1. Your Goals &amp; Snapshot
        </h3>
        <EditableText section="goals_snapshot" value={goalsNarrative} />
      </div>

      {/* Section 2 - Fundability */}
      <div className="px-6 sm:px-8 pt-2 pb-4">
        <h3 className="text-[#1e3a5f] text-base font-bold border-b-2 border-[#3eaf7c] pb-1 mb-3 font-sans">
          2. Business Structure &amp; Fundability
        </h3>
        <div className="space-y-1.5 mb-4">
          {fundabilityItems.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              {item.status === "strong" && <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />}
              {item.status === "warning" && <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />}
              {item.status === "missing" && <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
              <span className="text-gray-700">{item.label}</span>
              <span className="text-gray-400 text-xs ml-1 hidden sm:inline">— {item.detail}</span>
              <span className={`ml-auto font-sans font-semibold text-xs ${
                item.status === "strong" ? "text-green-600" :
                item.status === "warning" ? "text-amber-500" : "text-red-500"
              }`}>
                {item.status === "strong" ? "Strong" : item.status === "warning" ? "Needs Attention" : "Missing"}
              </span>
            </div>
          ))}
        </div>
        <EditableText section="fundability" value={fundabilityNarrative} rows={3} />
      </div>

      {/* Section 3 - 90-Day Action Plan */}
      <div className="px-6 sm:px-8 pt-2 pb-4">
        <h3 className="text-[#1e3a5f] text-base font-bold border-b-2 border-[#3eaf7c] pb-1 mb-3 font-sans">
          3. 90-Day Action Plan
        </h3>
        <div className="space-y-2.5">
          {actionItems.map((item, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-[#3eaf7c] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 font-sans mt-0.5">
                {item.step}
              </div>
              <div className="flex-1">
                <p className="text-gray-700 leading-snug">{item.text}</p>
                <p className="text-xs text-gray-400 mt-0.5">Est. effort: {item.effort}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4 - Roadmap */}
      <div className="px-6 sm:px-8 pt-2 pb-4">
        <h3 className="text-[#1e3a5f] text-base font-bold border-b-2 border-[#3eaf7c] pb-1 mb-3 font-sans">
          4. 6–12 Month Roadmap
        </h3>
        <div className="space-y-3">
          {milestones.map((m, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="bg-[#1e3a5f] text-white text-xs font-bold px-2 py-1 rounded font-sans flex-shrink-0 min-w-[80px] text-center">
                {m.month}
              </div>
              <p className="text-gray-700 leading-snug">{m.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 5 - Funding Opportunities */}
      <div className="px-6 sm:px-8 pt-2 pb-4">
        <h3 className="text-[#1e3a5f] text-base font-bold border-b-2 border-[#3eaf7c] pb-1 mb-3 font-sans">
          5. Credit &amp; Funding Opportunities
        </h3>
        <div className="space-y-2">
          {fundingItems.map((f, i) => (
            <div key={i} className="border-l-2 border-[#3eaf7c] pl-3">
              <p className="font-semibold text-[#1e3a5f] text-sm">{f.type}</p>
              <p className="text-gray-600 text-sm">{f.description}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 italic mt-3">
          This is educational information, not a guarantee of approval or specific terms. Consult your attorney, CPA, and financial advisor.
        </p>
      </div>

      {/* Section 6 - Next Steps */}
      <div className="px-6 sm:px-8 pt-2 pb-4">
        <h3 className="text-[#1e3a5f] text-base font-bold border-b-2 border-[#3eaf7c] pb-1 mb-3 font-sans">
          6. Program Options &amp; Next Steps
        </h3>
        <EditableText section="next_steps" value={nextStepsNarrative} rows={3} />
        <div className="grid sm:grid-cols-2 gap-3 mt-4">
          {programOptions.map((opt, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-3">
              <p className="font-semibold text-[#1e3a5f] text-sm">{opt.name}</p>
              <p className="text-gray-600 text-xs mt-1">{opt.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#0d1b2a] px-6 sm:px-8 py-3 flex items-center justify-between">
        <p className="text-white/40 text-[10px] font-sans">© 2026 RealtorBusinessCredit.com · My Better Business Credit</p>
        <p className="text-white/40 text-[10px] font-sans">
          This plan is for educational purposes only. Not legal, tax, or financial advice.
        </p>
      </div>
    </div>
  );
}
