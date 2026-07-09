import {
  ArrowDownToLine,
  ArrowUpToLine,
  Clock,
  CornerDownRight,
  MessageSquare,
  Wrench,
} from "lucide-preact";
import { Entry } from "@/components/entry";
import { Metric } from "@/components/metric";
import { Reasoning } from "@/components/reasoning";
import { StatusDot } from "@/components/status-dot";
import { ToolCall } from "@/components/tool-call";
import { useNow } from "@/hooks/use-now";
import { formatDuration, formatTime, formatTokens } from "@/trace/format";
import { summarizeTurn } from "@/trace/summary";
import type { Step, Turn as TurnData } from "@/trace/types";

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
  return (
    <header class="flex h-6 flex-wrap items-center gap-x-3 border-y border-line-1 bg-surface-2 px-3">
      <div class="flex items-center gap-2">
        <StatusDot tone={turn.status} />
        <span class="text-xs font-medium text-foreground/80">Turn {index}</span>
        {turn.startedAt !== undefined && (
          <span class="text-xs tabular-nums text-foreground/30">
            {formatTime(turn.startedAt)}
          </span>
        )}
      </div>
      <div class="ml-auto flex items-center gap-3">
        <Metric icon={<Wrench />}>{summary.tools}</Metric>
        <Metric icon={<ArrowDownToLine />}>
          {formatTokens(summary.inputTokens)}
        </Metric>
        <Metric icon={<ArrowUpToLine />}>
          {formatTokens(summary.outputTokens)}
        </Metric>
        <Metric icon={<Clock />}>{formatDuration(elapsedMs(turn, now))}</Metric>
      </div>
    </header>
  );
}

function StepEntries({ step }: { step: Step }) {
  return (
    <>
      {step.reasoning !== undefined && <Reasoning text={step.reasoning} />}
      {step.actions.map((action) => (
        <ToolCall key={action.callId} action={action} />
      ))}
      {step.response !== undefined && (
        <Entry icon={<CornerDownRight />}>
          <p>{step.response}</p>
        </Entry>
      )}
    </>
  );
}

export function Turn({ turn, index }: { turn: TurnData; index: number }) {
  return (
    <section>
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
      </div>
    </section>
  );
}
