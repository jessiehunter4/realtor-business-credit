import { useState } from "react";
import { CheckCircle2, Circle, Loader2, MoreVertical, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PlanItem } from "@/lib/planItems";
import type { PlanItemPayload } from "@/lib/planItems";
import type { TaskStatus } from "@/lib/roadmap";
import HelpBubble from "./HelpBubble";

interface Props {
  item: PlanItem;
  saving: boolean;
  onStatusChange: (item: PlanItem, status: TaskStatus) => void;
  /** Enables the editable note field (used on goals). */
  onNoteSave?: (item: PlanItem, note: string) => void;
  /** Enables inline editing of the item text. */
  onUpdate?: (item: PlanItem, patch: PlanItemPayload) => void;
  onRemove?: (item: PlanItem) => void;
  onRevert?: (item: PlanItem) => void;
  /** Label for the editable meta field (horizon, window, target month). */
  metaLabel?: string;
  labels?: { start: string; done: string; undo: string };
  help?: { title: string; sections: Array<{ label: string; body: string }> };
}

export default function PlanItemRow({
  item,
  saving,
  onStatusChange,
  onNoteSave,
  onUpdate,
  onRemove,
  onRevert,
  metaLabel,
  labels,
  help,
}: Props) {
  const [note, setNote] = useState(item.note ?? "");
  const [editing, setEditing] = useState(false);
  const [textEditing, setTextEditing] = useState(false);
  const [draft, setDraft] = useState({ title: item.title, detail: item.detail ?? "", meta: item.meta ?? "" });
  const done = item.status === "completed";
  const l = labels ?? { start: "Start", done: "Done", undo: "Undo" };

  const openEditor = () => {
    setDraft({ title: item.title, detail: item.detail ?? "", meta: item.meta ?? "" });
    setTextEditing(true);
  };

  return (
    <div
      className={`rounded-lg border p-3 sm:p-4 transition-colors ${
        done ? "border-primary/30 bg-primary/5" : "border-border bg-card"
      }`}
    >
      {textEditing ? (
        <div className="space-y-2">
          <Input
            value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            placeholder="What is this step or goal?"
            className="text-sm"
          />
          {metaLabel && (
            <Input
              value={draft.meta}
              onChange={(e) => setDraft((d) => ({ ...d, meta: e.target.value }))}
              placeholder={metaLabel}
              className="text-sm"
            />
          )}
          <Textarea
            value={draft.detail}
            onChange={(e) => setDraft((d) => ({ ...d, detail: e.target.value }))}
            rows={2}
            placeholder="Optional detail"
            className="text-sm"
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              className="rounded-full text-xs"
              disabled={!draft.title.trim()}
              onClick={() => {
                onUpdate?.(item, {
                  title: draft.title.trim(),
                  detail: draft.detail.trim(),
                  meta: draft.meta.trim(),
                });
                setTextEditing(false);
              }}
            >
              Save
            </Button>
            <Button size="sm" variant="ghost" className="rounded-full text-xs" onClick={() => setTextEditing(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">
          {done ? (
            <CheckCircle2 className="h-5 w-5 text-primary" />
          ) : item.status === "in_progress" ? (
            <PlayCircle className="h-5 w-5 text-primary" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className={`font-semibold ${done ? "text-muted-foreground line-through" : "text-secondary"}`}>
              {item.title}
            </p>
            {help && <HelpBubble title={help.title} sections={help.sections} />}
            {item.status === "in_progress" && (
              <Badge variant="outline" className="text-[10px]">{l.start === "Start" ? "In progress" : l.start}</Badge>
            )}
            {item.custom && (
              <Badge variant="secondary" className="text-[10px]">Added by you</Badge>
            )}
            {item.edited && !item.custom && (
              <span className="text-[10px] text-secondary/70">edited</span>
            )}
          </div>
          {item.meta && <p className="text-xs text-secondary/80 mt-1">{item.meta}</p>}
          {item.detail && <p className="text-sm text-secondary/80 mt-1">{item.detail}</p>}

          {onNoteSave && (
            <div className="mt-2">
              {editing ? (
                <div className="space-y-2">
                  <Textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    placeholder="What's your plan for this goal? Where are you stuck?"
                    className="text-sm"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="rounded-full text-xs"
                      onClick={() => {
                        onNoteSave(item, note);
                        setEditing(false);
                      }}
                    >
                      Save note
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-full text-xs"
                      onClick={() => {
                        setNote(item.note ?? "");
                        setEditing(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="text-left text-xs text-muted-foreground hover:text-primary"
                >
                  {item.note ? `Note: ${item.note}` : "+ Add a note"}
                </button>
              )}
            </div>
          )}
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row gap-1.5">
          {onUpdate && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" aria-label="Item options">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={openEditor}>Edit</DropdownMenuItem>
                {item.edited && !item.custom && onRevert && (
                  <DropdownMenuItem onClick={() => onRevert(item)}>Revert to original</DropdownMenuItem>
                )}
                {onRemove && (
                  <DropdownMenuItem className="text-destructive" onClick={() => onRemove(item)}>
                    {item.custom ? "Delete" : "Hide from my plan"}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mt-2" />
          ) : done ? (
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full text-xs"
              onClick={() => onStatusChange(item, "not_started")}
            >
              {l.undo}
            </Button>
          ) : (
            <>
              {item.status !== "in_progress" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-xs"
                  onClick={() => onStatusChange(item, "in_progress")}
                >
                  {l.start}
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-xs"
                onClick={() => onStatusChange(item, "completed")}
              >
                {l.done}
              </Button>
            </>
          )}
        </div>
      </div>
      )}
    </div>
  );
}