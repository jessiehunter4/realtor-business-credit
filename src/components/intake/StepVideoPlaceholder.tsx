import { PlayCircle } from "lucide-react";

interface Props {
  stepNumber: number;
  title: string;
  description?: string;
  /** Optional supabase storage path for future video wiring. */
  storagePath?: string;
  className?: string;
}

/**
 * Reusable video slot for the intake survey steps.
 * Renders a branded 16:9 placeholder today; will delegate to a real
 * player (HeroVideo) once instructional videos are uploaded.
 */
const StepVideoPlaceholder = ({ stepNumber, title, description, className = "" }: Props) => {
  return (
    <figure
      className={`w-full ${className}`}
      aria-label={`Instructional video placeholder for step ${stepNumber}: ${title}`}
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-hero-grad shadow-[var(--rbc-shadow-soft)]">
        <div className="absolute left-3 top-3 z-10 flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-secondary/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-secondary-foreground">
            Step {stepNumber}
          </span>
          <span className="inline-flex items-center rounded-full bg-background/85 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground backdrop-blur">
            Video coming soon
          </span>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
          <PlayCircle
            className="h-16 w-16 text-primary drop-shadow-sm motion-safe:animate-pulse"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <p className="text-sm font-semibold text-secondary">{title}</p>
          {description && (
            <p className="max-w-xs text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
    </figure>
  );
};

export default StepVideoPlaceholder;