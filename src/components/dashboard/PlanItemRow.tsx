import { useState } from "react";
import { CheckCircle2, Circle, Loader2, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import type { PlanItem } from "@/lib/planItems";
import type { TaskStatus } from "@/lib/roadmap";
import HelpBubble from "./HelpBubble";

interface Props {
  item: PlanItem;
  saving: boolean;
  onStatusChange: (item: PlanItem, status: TaskStatus) => void;
  /** Enables the editable note field (used on goals). */
  onNoteSave?: (item: PlanItem, note: string) => void;
  labels?: { start: string; done: string; undo: string };
  help?: { title: string; sections: Array<{ label: string; body: string }> };
}

export default function PlanItemRow({ item, saving, onStatusChange, onNoteSave, labels, help }: Props) {
  const [note, setNote] = useState(item.note ?? "");
  const [editing, setEditing] = useState(false);
  const done = item.status === "completed";
  const l = labels ?? { start: "Start", done: "Done", undo: "Undo" };

  return (
    <div
      className={`rounded-lg border p-3 sm:p-4 transition-colors ${
        done ? "border-primary/30 bg-primary/5" : "border-border bg-card"
      }`}
    >
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
            <p className={`font-medium ${done ? "text-muted-foreground line-through" : "text-secondary"}`}>
              {item.title}
            </p>
            {help && <HelpBubble title={help.title} sections={help.sections} />}
            {item.status === "in_progress" && (
              <Badge variant="outline" className="text-[10px]">{l.start === "Start" ? "In progress" : l.start}</Badge>
            )}
          </div>
          {item.meta && <p className="text-xs text-muted-foreground mt-1">{item.meta}</p>}
          {item.detail && <p className="text-sm text-muted-foreground mt-1">{item.detail}</p>}

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
    </div>
  );
}