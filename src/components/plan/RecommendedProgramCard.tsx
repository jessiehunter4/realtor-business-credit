import { ArrowRight, Sparkles, Lock } from "lucide-react";

export interface RecommendationReasoningBullet {
  bullet: string;
  source_rule?: string;
}

export interface RecommendedProgram {
  slug: string;
  name: string;
  tagline?: string | null;
  price_display?: string | null;
  cadence?: string | null;
  cta_label: string;
  cta_href?: string | null;
}

interface Props {
  program: RecommendedProgram;
  bullets: RecommendationReasoningBullet[];
  overridden?: boolean;
  needsMoreInfo?: boolean;
}

export default function RecommendedProgramCard({
  program,
  bullets,
  overridden,
  needsMoreInfo,
}: Props) {
  const href = program.cta_href || "/pricing";
  return (
    <div className="rounded-lg border-2 border-[#3eaf7c] bg-gradient-to-br from-[#3eaf7c]/5 to-white shadow-sm overflow-hidden print:shadow-none">
      <div className="px-6 sm:px-8 py-5">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-[#3eaf7c]" />
          <p className="text-[10px] sm:text-xs tracking-[0.2em] uppercase font-semibold text-[#3eaf7c] font-sans">
            Recommended Next Step
          </p>
          {overridden && (
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-[#1e3a5f]/60">
              <Lock className="w-3 h-3" /> Coach-selected
            </span>
          )}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#0d1b2a] font-serif leading-tight">
              {program.name}
            </h3>
            {program.tagline && (
              <p className="text-sm text-gray-600 mt-1">{program.tagline}</p>
            )}
          </div>
          {program.price_display && (
            <div className="text-right sm:text-right shrink-0">
              <p className="text-lg font-bold text-[#1e3a5f] font-sans">{program.price_display}</p>
              {program.cadence && (
                <p className="text-[10px] uppercase tracking-wider text-gray-500">
                  {program.cadence}
                </p>
              )}
            </div>
          )}
        </div>

        {bullets.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-semibold text-[#1e3a5f] uppercase tracking-wider mb-2">
              Why this fits you
            </p>
            <ul className="space-y-1.5">
              {bullets.map((b, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700 leading-snug">
                  <span className="text-[#3eaf7c] mt-0.5">•</span>
                  <span>{b.bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {needsMoreInfo && (
          <p className="mt-3 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">
            We'd love more detail on your goals and readiness — a free 1:1 session is the fastest way to sharpen this recommendation.
          </p>
        )}

        <a
          href={href}
          className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-full bg-[#3eaf7c] hover:bg-[#369968] text-white font-semibold text-sm transition-colors no-underline print:hidden"
        >
          {program.cta_label}
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}