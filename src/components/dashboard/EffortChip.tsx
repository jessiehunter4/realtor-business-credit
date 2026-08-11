import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  effort: string;
  /** Include the "Est. effort:" prefix (used in the Your next step card). */
  withLabel?: boolean;
  className?: string;
}

/** Compact pill showing the estimated effort for a roadmap task. */
export default function EffortChip({ effort, withLabel = false, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-2.5 py-1 text-xs font-medium leading-none text-secondary",
        className
      )}
    >
      <Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
      <span className="sr-only">Estimated effort:</span>
      <span>
        {withLabel ? `Est. effort: ${effort}` : effort}
      </span>
    </span>
  );
}