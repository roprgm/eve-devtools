import { ArrowDown, ArrowUp, Wrench } from "lucide-preact";
import { Metric } from "@/components/metric";
import { formatTokens } from "@/trace/format";
import type { TurnSummary } from "@/trace/summary";

export function SummaryMetrics({ summary }: { summary: TurnSummary }) {
  return (
    <>
      <Metric label="Input tokens" tone="input" icon={<ArrowUp />}>
        {formatTokens(summary.inputTokens)}
      </Metric>
      <Metric label="Output tokens" tone="output" icon={<ArrowDown />}>
        {formatTokens(summary.outputTokens)}
      </Metric>
      <Metric label="Tool calls" icon={<Wrench />}>
        {summary.tools}
      </Metric>
    </>
  );
}
