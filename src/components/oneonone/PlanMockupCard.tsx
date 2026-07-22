import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

const PlanMockupCard = () => {
  return (
    <div className="w-full bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden text-gray-800 text-[11px] sm:text-xs">
      {/* Header */}
      <div className="bg-[#0d1b2a] px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <div>
          <p className="text-[#3eaf7c] text-[8px] sm:text-[10px] tracking-[0.2em] uppercase font-sans font-semibold mb-0.5">
            RE Pro Business Credit
          </p>
          <p className="text-white text-sm sm:text-base font-bold leading-snug font-serif">
            Your Custom Business Credit Plan
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-white/70 text-[9px] font-sans">Prepared for</p>
          <p className="text-white font-bold text-[11px]">Sarah Mitchell</p>
          <p className="text-white/50 text-[9px] font-sans">Sacramento, CA · Residential Broker</p>
        </div>
      </div>

      {/* Section 1 */}
      <div className="px-4 sm:px-6 pt-4 pb-2">
        <h3 className="text-[#1e3a5f] text-xs sm:text-sm font-bold border-b border-[#3eaf7c] pb-0.5 mb-2 font-sans">
          1. Your Goals &amp; Snapshot
        </h3>
        <p className="leading-relaxed text-gray-600">
          Sarah's primary goal is to <strong className="text-gray-800">secure $25,000–$50,000
          in dedicated business credit</strong> to invest in marketing and hire a
          transaction coordinator without impacting her personal credit.
        </p>
      </div>

      {/* Section 2 */}
      <div className="px-4 sm:px-6 pt-2 pb-2">
        <h3 className="text-[#1e3a5f] text-xs sm:text-sm font-bold border-b border-[#3eaf7c] pb-0.5 mb-2 font-sans">
          2. Business Structure &amp; Fundability
        </h3>
        <div className="space-y-1">
          {[
            { label: "Business Entity (S-Corp)", status: "strong" as const },
            { label: "EIN on File", status: "strong" as const },
            { label: "Separate Business Bank Account", status: "strong" as const },
            { label: "Business Phone in Directories", status: "warning" as const },
            { label: "D-U-N-S Number Registered", status: "missing" as const },
            { label: "Vendor Tradelines Reporting", status: "missing" as const },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              {item.status === "strong" && <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />}
              {item.status === "warning" && <AlertTriangle className="w-3 h-3 text-amber-500 flex-shrink-0" />}
              {item.status === "missing" && <XCircle className="w-3 h-3 text-red-500 flex-shrink-0" />}
              <span className="text-gray-600">{item.label}</span>
              <span className={`ml-auto font-sans font-semibold text-[10px] ${
                item.status === "strong" ? "text-green-600" :
                item.status === "warning" ? "text-amber-500" : "text-red-500"
              }`}>
                {item.status === "strong" ? "Strong" :
                 item.status === "warning" ? "Needs Attention" : "Missing"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3 */}
      <div className="px-4 sm:px-6 pt-2 pb-3">
        <h3 className="text-[#1e3a5f] text-xs sm:text-sm font-bold border-b border-[#3eaf7c] pb-0.5 mb-2 font-sans">
          3. 90-Day Action Plan
        </h3>
        <div className="space-y-1.5">
          {[
            { step: 1, text: "Register for a D-U-N-S Number with Dun & Bradstreet." },
            { step: 2, text: "Set up a dedicated business phone listed in directories." },
            { step: 3, text: "Open 3–5 starter vendor tradeline accounts." },
          ].map((item) => (
            <div key={item.step} className="flex gap-2 items-start">
              <div className="w-4 h-4 rounded-full bg-[#3eaf7c] text-white flex items-center justify-center text-[9px] font-bold flex-shrink-0 font-sans">
                {item.step}
              </div>
              <p className="text-gray-600 leading-snug">{item.text}</p>
            </div>
          ))}
          <p className="text-gray-400 italic text-[10px] pl-6">… and 3 more action items</p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#0d1b2a] px-4 sm:px-6 py-2 flex items-center justify-between">
        <p className="text-white/40 text-[9px] font-sans">© 2026 RealtorBusinessCredit.com</p>
        <p className="text-white/40 text-[9px] font-sans">Page 1 of 4</p>
      </div>
    </div>
  );
};

export default PlanMockupCard;
