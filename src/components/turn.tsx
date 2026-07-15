import {
  CircleAlert,
  CircleHelp,
  Clock,
  CornerDownRight,
  MessageSquare,
} from "lucide-preact";
import { useState } from "preact/hooks";
import { DisclosureChevron } from "@/components/disclosure-chevron";
import { Entry } from "@/components/entry";
import { Metric } from "@/components/metric";
import { Reasoning } from "@/components/reasoning";
import { StatusDot } from "@/components/status-dot";
import { SummaryMetrics } from "@/components/summary-metrics";
import { ToolCall } from "@/components/tool-call";
import { useNow } from "@/hooks/use-now";
import { formatDuration, formatTime } from "@/trace/format";
import { summarizeTurn } from "@/trace/summary";
import type { Action, Step, Turn as TurnData } from "@/trace/types";

// A completed turn has its final duration; a running one measures from its
// start to the ticking clock.
function elapsedMs(turn: TurnData, now: number): number {
  if (turn.durationMs !== undefined) {
    return turn.durationMs;
  }
  if (turn.startedAt === undefined) {
    return 0;
  }
  return Math.max(0, now - Date.parse(turn.startedAt));
}

function TurnHeader({ index, turn }: { index: number; turn: TurnData }) {
  const summary = summarizeTurn(turn);
  const now = useNow(turn.status === "running");
  let startedAt: string | undefined;
  if (turn.startedAt !== undefined) {
    startedAt = `Started at ${formatTime(turn.startedAt)}`;
  }

  return (
    <summary class="disclosure-summary flex h-6 cursor-pointer items-center gap-3 whitespace-nowrap border-b border-line-1 bg-surface-2 pl-3 pr-2">
      <span class="flex shrink-0 items-center gap-2">
        <StatusDot tone={turn.status} />
        <span title={startedAt} class="text-xs font-medium text-foreground/80">
          Turn {index}
        </span>
      </span>
      <span class="ml-auto flex min-w-0 items-center justify-end gap-2 overflow-hidden">
        <SummaryMetrics summary={summary} />
        <span class="flex shrink-0 items-center gap-1">
          <Metric label="Duration" icon={<Clock />}>
            {formatDuration(elapsedMs(turn, now))}
          </Metric>
          <DisclosureChevron className="group-open/turn:-rotate-90" />
        </span>
      </span>
    </summary>
  );
}

function ActionEntry({ action }: { action: Action }) {
  if (action.question !== undefined) {
    return (
      <Entry icon={<CircleHelp />}>
        <div class="flex flex-col gap-0.5">
          <p>{action.question.prompt}</p>
          {action.question.options.length > 0 && (
            <ul class="list-disc pl-4 text-xs text-foreground/50">
              {action.question.options.map((option) => (
                <li key={option.id}>{option.label}</li>
              ))}
            </ul>
          )}
          {action.question.answer !== undefined && (
            <p class="text-xs text-foreground/70">
              Answer: {action.question.answer}
            </p>
          )}
        </div>
      </Entry>
    );
  }
  return <ToolCall action={action} />;
}

function StepEntries({ step }: { step: Step }) {
  return (
    <>
      {step.reasoning !== undefined && <Reasoning text={step.reasoning} />}
      {step.actions.map((action) => (
        <ActionEntry key={action.callId} action={action} />
      ))}
      {step.response !== undefined && (
        <Entry icon={<CornerDownRight />}>
          <p>{step.response}</p>
        </Entry>
      )}
    </>
  );
}

function TurnError({ error }: { error: NonNullable<TurnData["error"]> }) {
  return (
    <Entry icon={<CircleAlert class="text-red-400" />}>
      <div class="flex min-w-0 flex-col gap-0.5">
        <p class="text-xs text-red-400">{error.message}</p>
        <span class="font-mono text-[10px] text-foreground/30">
          {error.code}
        </span>
      </div>
    </Entry>
  );
}

export function Turn({ turn, index }: { turn: TurnData; index: number }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <section>
      <details
        open={expanded}
        class="group/turn"
        onToggle={(event) => setExpanded(event.currentTarget.open)}
      >
        <TurnHeader index={index} turn={turn} />
        <div class="flex flex-col px-3 py-1 gap-0.5">
          {turn.prompt !== undefined && (
            <Entry icon={<MessageSquare />}>
              <p>{turn.prompt}</p>
            </Entry>
          )}
          {turn.steps.map((step) => (
            <StepEntries key={step.index} step={step} />
          ))}
          {turn.error !== undefined && <TurnError error={turn.error} />}
        </div>
      </details>
    </section>
  );
}
