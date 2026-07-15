import { Wrench } from "lucide-preact";
import { DisclosureChevron } from "@/components/disclosure-chevron";
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
      <summary class="disclosure-summary -mx-2 flex h-6 cursor-pointer items-center gap-2 rounded-md pl-2 pr-1.5 transition-colors hover:bg-foreground/5">
        <Wrench class="size-3.5 shrink-0 text-neutral-400" />
        <span class="min-w-0 truncate font-mono text-xs text-foreground/90">
          {action.name}
        </span>
        <StatusDot tone={statusTone[action.status]} />
        {action.durationMs !== undefined && (
          <Metric label="Duration">{formatDuration(action.durationMs)}</Metric>
        )}
        <span class="ml-auto flex shrink-0 items-center">
          <DisclosureChevron className="group-open/tool:-rotate-90" />
        </span>
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
