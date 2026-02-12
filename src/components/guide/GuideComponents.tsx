import { Link } from "react-router-dom";

interface CalloutProps {
  variant?: "default" | "warning" | "important";
  children: React.ReactNode;
}

export const Callout = ({ variant = "default", children }: CalloutProps) => {
  const styles = {
    default: "bg-primary/10 border-l-4 border-primary",
    warning: "bg-accent/10 border-l-4 border-accent",
    important: "bg-destructive/10 border-l-4 border-destructive",
  };

  return (
    <div className={`${styles[variant]} p-5 md:p-6 my-6 rounded-r-lg break-inside-avoid`}>
      {children}
    </div>
  );
};

interface StoryBoxProps {
  children: React.ReactNode;
}

export const StoryBox = ({ children }: StoryBoxProps) => (
  <div className="bg-primary/5 border-2 border-primary rounded-xl p-5 md:p-6 my-6 break-inside-avoid">
    {children}
  </div>
);

interface KeyTakeawayProps {
  children: React.ReactNode;
}

export const KeyTakeaway = ({ children }: KeyTakeawayProps) => (
  <div className="bg-accent/10 border-2 border-accent rounded-xl p-5 md:p-6 my-8 break-inside-avoid">
    {children}
  </div>
);

interface ActionStepProps {
  children: React.ReactNode;
}

export const ActionStep = ({ children }: ActionStepProps) => (
  <div className="bg-muted border-l-4 border-ring p-5 md:p-6 my-4 rounded-r-lg break-inside-avoid">
    {children}
  </div>
);

interface QuoteBlockProps {
  attribution?: string;
  children: React.ReactNode;
}

export const QuoteBlock = ({ attribution, children }: QuoteBlockProps) => (
  <blockquote className="italic p-5 md:p-6 my-6 mx-4 md:mx-8 border-l-[3px] border-primary bg-muted/50 rounded-r-lg">
    {children}
    {attribution && (
      <p className="not-italic font-bold mt-3 text-secondary">{attribution}</p>
    )}
  </blockquote>
);

export const BookSessionCTA = () => (
  <div className="mt-8 p-5 md:p-6 bg-primary/10 border-l-4 border-primary rounded-r-lg">
    <p className="m-0 italic text-foreground">
      Want to discuss YOUR specific situation? Book a one-on-one session — realtor to realtor, no pressure.
    </p>
    <p className="mt-3 mb-0">
      <Link to="/get_started" className="font-bold text-primary hover:underline">
        Book your session →
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
    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-secondary border-b-[3px] border-primary pb-4">
      {title}
    </h2>
  </div>
);

export const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xl md:text-2xl font-bold text-secondary mt-8 mb-4">
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
