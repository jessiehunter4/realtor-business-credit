import { Link } from "react-router-dom";

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
      Ready to put this into action? Book a free one-on-one. We'll walk through your RE Pro Business Financial Needs Analysis together and you'll leave with a custom plan.
    </p>
    <p className="mt-3 mb-0">
      <Link to="/one-on-one" data-analytics-id="cta-book-guide-inline" className="font-bold text-primary hover:underline">
        Book your free 1:1 →
      </Link>
    </p>
  </div>
);

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
