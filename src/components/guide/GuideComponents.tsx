import { Link } from "react-router-dom";
import { useContactIdentity } from "@/hooks/useContactIdentity";
import { ArrowRight, Lightbulb, Compass, Sparkles } from "lucide-react";

interface CalloutProps {
  variant?: "default" | "warning" | "important" | "info";
  children: React.ReactNode;
}

export const Callout = ({ variant = "default", children }: CalloutProps) => {
  const styles = {
    default: "bg-primary/8 border-l-4 border-primary",
    warning: "bg-accent/15 border-l-4 border-accent",
    important: "bg-destructive/10 border-l-4 border-destructive",
    info: "bg-[hsl(var(--sky)/0.1)] border-l-4 border-[hsl(var(--sky))]",
  };

  return (
    <div className={`${styles[variant]} p-5 md:p-6 my-6 rounded-r-2xl break-inside-avoid`}>
      {children}
    </div>
  );
};

interface StoryBoxProps {
  children: React.ReactNode;
}

export const StoryBox = ({ children }: StoryBoxProps) => (
  <div className="bg-card border border-border rounded-2xl p-5 md:p-6 my-6 shadow-[0_8px_18px_rgba(11,31,59,.06)] break-inside-avoid">
    {children}
  </div>
);

interface KeyTakeawayProps {
  children: React.ReactNode;
}

export const KeyTakeaway = ({ children }: KeyTakeawayProps) => (
  <div className="bg-primary/8 border-2 border-primary/30 rounded-2xl p-5 md:p-6 my-8 break-inside-avoid">
    {children}
  </div>
);

interface ActionStepProps {
  children: React.ReactNode;
}

export const ActionStep = ({ children }: ActionStepProps) => (
  <div className="bg-card border border-border p-5 md:p-6 my-4 rounded-2xl shadow-[0_4px_14px_rgba(11,31,59,.05)] break-inside-avoid">
    {children}
  </div>
);

interface QuoteBlockProps {
  attribution?: string;
  children: React.ReactNode;
}

export const QuoteBlock = ({ attribution, children }: QuoteBlockProps) => (
  <blockquote className="italic p-5 md:p-6 my-6 mx-4 md:mx-8 border-l-[3px] border-primary bg-card rounded-r-2xl shadow-[0_4px_14px_rgba(11,31,59,.05)]">
    {children}
    {attribution && (
      <p className="not-italic font-bold mt-3 text-secondary">{attribution}</p>
    )}
  </blockquote>
);

export const BookSessionCTA = () => (
  <div className="mt-8 p-5 md:p-6 bg-primary/8 border-l-4 border-primary rounded-r-2xl">
    <p className="m-0 italic text-foreground">
      Ready to put this into action? Create your free Customized Plan in about five minutes and it lands in your private RE Pro dashboard.
    </p>
    <p className="mt-3 mb-0">
      <Link to="/intake" data-analytics-id="cta-plan-guide-inline" className="font-bold text-primary hover:underline">
        Create My Free Customized Plan →
      </Link>
    </p>
  </div>
);

/* ============================================================
 * Jessie's Real-World Note — first-person aside
 * ============================================================ */
export const JessieNote = ({
  title = "Jessie's real-world note",
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) => (
  <div className="my-6 rounded-2xl border border-primary/25 bg-primary/5 p-5 md:p-6 break-inside-avoid">
    <div className="flex items-center gap-2 mb-2">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary">
        <Compass className="h-4 w-4" />
      </span>
      <p className="m-0 text-xs uppercase tracking-widest text-primary font-bold">
        {title}
      </p>
    </div>
    <div className="text-base md:text-lg leading-relaxed text-foreground/90 [&>p]:my-2">
      {children}
    </div>
  </div>
);

/* ============================================================
 * Good Nugget — a memorable insight worth saving
 * ============================================================ */
export const GoodNugget = ({ children }: { children: React.ReactNode }) => (
  <div className="my-6 rounded-2xl border-l-4 border-[hsl(var(--accent))] bg-[hsl(var(--accent)/0.12)] p-5 md:p-6 break-inside-avoid">
    <div className="flex items-center gap-2 mb-2">
      <Lightbulb className="h-4 w-4 text-[hsl(var(--accent))]" />
      <p className="m-0 text-xs uppercase tracking-widest text-[hsl(var(--accent))] font-bold">
        Good nugget
      </p>
    </div>
    <p className="m-0 text-base md:text-lg leading-relaxed text-foreground">
      {children}
    </p>
  </div>
);

/* ============================================================
 * Your Next Move — one immediate action
 * ============================================================ */
export const NextMove = ({ children }: { children: React.ReactNode }) => (
  <div className="my-6 rounded-2xl border border-[hsl(var(--sky)/0.35)] bg-[hsl(var(--sky)/0.08)] p-5 md:p-6 break-inside-avoid">
    <div className="flex items-center gap-2 mb-2">
      <Sparkles className="h-4 w-4 text-[hsl(var(--sky))]" />
      <p className="m-0 text-xs uppercase tracking-widest text-[hsl(var(--sky))] font-bold">
        Your next move
      </p>
    </div>
    <div className="text-base md:text-lg leading-relaxed text-foreground [&>p]:my-2">
      {children}
    </div>
  </div>
);

/* ============================================================
 * ChapterTakeaway — one-sentence chapter summary
 * ============================================================ */
export const ChapterTakeaway = ({ children }: { children: React.ReactNode }) => (
  <div className="my-8 rounded-2xl border-2 border-primary/40 bg-primary/8 p-5 md:p-6 break-inside-avoid">
    <p className="m-0 text-xs uppercase tracking-widest text-primary font-bold mb-2">
      Chapter takeaway
    </p>
    <p className="m-0 text-base md:text-lg leading-relaxed text-foreground font-medium">
      {children}
    </p>
  </div>
);

/* ============================================================
 * PlanCTAButton — link into /intake with identity forwarded
 * ============================================================ */
export const PlanCTAButton = ({
  label = "Create My Free Customized Plan",
  className = "",
  href: overrideHref,
}: {
  label?: string;
  className?: string;
  href?: string;
}) => {
  const { buildForwardParams } = useContactIdentity();
  const params = buildForwardParams();
  const href = overrideHref ?? `/intake${params ? `?${params}` : ""}`;
  return (
    <Link
      to={href}
      className={`inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm md:text-base font-semibold text-primary-foreground shadow-lg transition-colors hover:bg-primary/90 ${className}`}
    >
      {label}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
};

export const ChapterHeader = ({ number, title }: { number?: string; title: string }) => (
  <div className="mb-8 md:mb-10">
    {number && (
      <p className="text-sm md:text-base font-bold text-primary tracking-widest uppercase mb-2">
        {number}
      </p>
    )}
    <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-secondary leading-tight">
      {title}
    </h2>
    <div className="mt-3 h-1 w-20 bg-primary rounded-full" />
  </div>
);

export const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xl md:text-2xl font-bold text-secondary mt-10 mb-4">
    {children}
  </h3>
);

export const SubHeading = ({ children }: { children: React.ReactNode }) => (
  <h4 className="text-lg font-bold text-foreground mt-5 mb-3">
    {children}
  </h4>
);

export const Paragraph = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <p className={`my-3 text-base md:text-lg leading-relaxed text-foreground/90 ${className}`}>
    {children}
  </p>
);
