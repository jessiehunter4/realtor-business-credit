import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface ChapterCheckboxProps {
  /** Unique per TOC instance so ids never collide across the three TOCs. */
  idPrefix: string;
  sectionId: string;
  label: string;
  checked: boolean;
  onToggle: (next: boolean) => void;
  className?: string;
}

const ChapterCheckbox = ({
  idPrefix,
  sectionId,
  label,
  checked,
  onToggle,
  className,
}: ChapterCheckboxProps) => (
  <span
    className={cn("inline-flex shrink-0 items-center justify-center p-1", className)}
    onClick={(e) => e.stopPropagation()}
  >
    <Checkbox
      id={`${idPrefix}-${sectionId}`}
      checked={checked}
      onCheckedChange={(v) => onToggle(v === true)}
      aria-label={
        checked ? `Mark "${label}" as not completed` : `Mark "${label}" as completed`
      }
      className="h-5 w-5"
    />
  </span>
);

export default ChapterCheckbox;