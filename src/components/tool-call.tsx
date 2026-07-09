import { ChevronRight, Clock, Wrench } from "lucide-preact";
import { JsonView } from "@/components/json-view";
import { Metric } from "@/components/metric";
import { StatusDot, type StatusTone } from "@/components/status-dot";
import { formatDuration } from "@/trace/format";
import type { Action, ActionStatus } from "@/trace/types";

const statusTone: Record<ActionStatus, StatusTone> = {
  running: "running",
  completed: "completed",
  failed: "failed",
  rejected: "failed",
  aborted: "failed",
};

function Field({ label, value }: { label: string; value: unknown }) {
  return (
    <div class="flex flex-col gap-1">
      <span class="text-[10px] font-medium uppercase tracking-wider text-foreground/30">
        {label}
      </span>
      <JsonView value={value} />
    </div>
  );
}

export function ToolCall({ action }: { action: Action }) {
  return (
    <details class="group/tool">
      <summary class="-mx-2 flex cursor-pointer list-none h-6 items-center gap-2 rounded-md px-2 transition-colors hover:bg-foreground/5 [&::-webkit-details-marker]:hidden">
        <ChevronRight class="text-neutral-500 transition-transform group-open/tool:rotate-90" />
        <Wrench class="text-neutral-400" />
        <StatusDot tone={statusTone[action.status]} />
        <span class="font-mono text-xs text-foreground/90">{action.name}</span>
        {action.durationMs !== undefined && (
          <span class="ml-auto pl-2">
            <Metric icon={<Clock />}>
              {formatDuration(action.durationMs)}
            </Metric>
          </span>
        )}
      </summary>
      <div class="flex flex-col gap-2 pt-1 pb-2 pl-6">
        {action.input !== undefined && (
          <Field label="Input" value={action.input} />
        )}
        {action.output !== undefined && (
          <Field label="Output" value={action.output} />
        )}
      </div>
    </details>
  );
}
