import { PlayCircle } from "lucide-react";

interface Props {
  stepNumber: number;
  title: string;
  description?: string;
  /** Optional supabase storage path for future video wiring. */
  storagePath?: string;
  className?: string;
  /** When false, removes the viewport height clamp. Defaults to true. */
  compact?: boolean;
}

/**
 * Reusable video slot for the intake survey steps.
 * Renders a branded 16:9 placeholder today; will delegate to a real
 * player (HeroVideo) once instructional videos are uploaded.
 */
const StepVideoPlaceholder = ({ stepNumber, title, description, className = "", compact = true }: Props) => {
  return (
    <figure
      className={`w-full ${className}`}
      aria-label={`Instructional video placeholder for step ${stepNumber}: ${title}`}
    >
      <div
        className={`relative mx-auto aspect-video w-full overflow-hidden rounded-2xl border border-border bg-hero-grad shadow-[var(--rbc-shadow-soft)] ${
          compact
            ? "max-h-[38vh] sm:max-h-[40vh] lg:max-h-[42vh] max-w-[560px] lg:max-w-[620px]"
            : ""
        }`}
      >
        <div className="absolute left-3 top-3 z-10 flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-secondary/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-secondary-foreground">
            Step {stepNumber}
          </span>
          <span className="inline-flex items-center rounded-full bg-background/85 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground backdrop-blur">
            Video coming soon
          </span>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center sm:gap-3">
          <PlayCircle
            className="h-12 w-12 text-primary drop-shadow-sm motion-safe:animate-pulse sm:h-16 sm:w-16"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <p className="text-sm font-semibold text-secondary">{title}</p>
          {description && (
            <p className="line-clamp-2 max-w-xs text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
    </figure>
  );
};

export default StepVideoPlaceholder;