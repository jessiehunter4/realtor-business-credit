import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PlanItemGroup, PlanItemPayload } from "@/lib/planItems";

interface Props {
  group: PlanItemGroup;
  addLabel: string;
  titlePlaceholder: string;
  /** Fixed set of choices for the meta field (90-day windows). */
  metaOptions?: string[];
  /** Free-text meta field label (target month, horizon). */
  metaPlaceholder?: string;
  onAdd: (group: PlanItemGroup, payload: PlanItemPayload) => void;
}

export default function AddPlanItemForm({
  group,
  addLabel,
  titlePlaceholder,
  metaOptions,
  metaPlaceholder,
  onAdd,
}: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [meta, setMeta] = useState(metaOptions?.[0] ?? "");

  const reset = () => {
    setTitle("");
    setDetail("");
    setMeta(metaOptions?.[0] ?? "");
    setOpen(false);
  };

  if (!open) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="rounded-full text-xs border-primary/40 text-primary hover:bg-primary/10 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring min-h-11 min-w-[132px]"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-4 w-4 mr-1.5" /> {addLabel}
      </Button>
    );
  }

  return (
    <div className="rounded-lg border border-dashed border-primary/40 bg-card p-3 sm:p-4 space-y-2">
      <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={titlePlaceholder} className="text-sm" />
      {metaOptions ? (
        <Select value={meta} onValueChange={setMeta}>
          <SelectTrigger className="text-sm">
            <SelectValue placeholder="When" />
          </SelectTrigger>
          <SelectContent>
            {metaOptions.map((o) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : metaPlaceholder ? (
        <Input value={meta} onChange={(e) => setMeta(e.target.value)} placeholder={metaPlaceholder} className="text-sm" />
      ) : null}
      <Textarea
        value={detail}
        onChange={(e) => setDetail(e.target.value)}
        rows={2}
        placeholder="Optional detail — why this matters or what done looks like"
        className="text-sm"
      />
      <div className="flex gap-2">
        <Button
          size="sm"
          className="rounded-full text-xs"
          disabled={!title.trim()}
          onClick={() => {
            onAdd(group, { title: title.trim(), detail: detail.trim(), meta: meta.trim() });
            reset();
          }}
        >
          Add
        </Button>
        <Button size="sm" variant="ghost" className="rounded-full text-xs" onClick={reset}>
          Cancel
        </Button>
      </div>
    </div>
  );
}