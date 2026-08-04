import { Link } from "react-router-dom";
import { logRoadmapEvent, PHASE_HELP, PHASE_LABELS, type RoadmapTask, type TaskPhase } from "@/lib/roadmap";
import HelpBubble from "./HelpBubble";

/** "?" bubble for a single roadmap task. */
export function TaskHelpBubble({
  task,
  planId,
  size = "sm",
}: {
  task: RoadmapTask;
  planId?: string | null;
  size?: "sm" | "md";
}) {
  const help = task.help;

  const sections = [
    {
      label: "What this means",
      body:
        help?.what ??
        (task.custom
          ? "This step came from your personalized 90-day plan, based on the answers you gave in your Needs Analysis."
          : task.explanation),
    },
    ...(help?.why ? [{ label: "Why it matters", body: help.why }] : []),
    ...(help?.doneLooksLike
      ? [{ label: "What done looks like", body: help.doneLooksLike }]
      : task.custom
        ? []
        : [{ label: "What done looks like", body: task.nextAction }]),
    ...(help?.mistakes?.length
      ? [
          {
            label: "Common mistakes",
            body: (
              <ul className="list-disc pl-4 space-y-1">
                {help.mistakes.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            ),
          },
        ]
      : []),
    { label: "Typical effort", body: task.effort },
  ];

  return (
    <HelpBubble
      title={task.title}
      size={size}
      sections={sections}
      footer={
        task.actionHref ? (
          <Link to={task.actionHref} className="text-primary hover:underline">
            {task.actionLabel ?? "Learn more in the guide"} →
          </Link>
        ) : (
          <span>Educational only — confirm entity and tax questions with your attorney and CPA.</span>
        )
      }
      onOpen={() => logRoadmapEvent("task_help_opened", { planId, task })}
    />
  );
}

/** "?" bubble for a roadmap stage / milestone. */
export function PhaseHelpBubble({ phase, planId }: { phase: TaskPhase; planId?: string | null }) {
  const help = PHASE_HELP[phase];
  return (
    <HelpBubble
      title={`Stage: ${PHASE_LABELS[phase]}`}
      sections={[
        { label: "What this stage is", body: help.what },
        { label: "Why it matters", body: help.why },
        { label: "Typical timeline", body: help.typicalTime },
      ]}
      onOpen={() => logRoadmapEvent("task_help_opened", { planId, phase })}
    />
  );
}
