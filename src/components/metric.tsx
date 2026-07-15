import { cn } from "cnfast";
import type { ComponentChildren } from "preact";

type MetricTone = "neutral" | "input" | "output";

const toneClass: Record<MetricTone, string> = {
  neutral: "text-neutral-300",
  input: "text-metric-input",
  output: "text-metric-output",
};

const gapClass: Record<MetricTone, string> = {
  neutral: "gap-[3px]",
  input: "gap-0.5",
  output: "gap-0.5",
};

// An icon paired with a compact value, e.g. a token count or a duration.
export function Metric({
  icon,
  label,
  tone = "neutral",
  children,
}: {
  icon: ComponentChildren;
  label: string;
  tone?: MetricTone;
  children: ComponentChildren;
}) {
  return (
    <span
      title={label}
      class={cn(
        "flex shrink-0 items-center text-xs leading-none [&>svg]:size-3.5",
        gapClass[tone],
        toneClass[tone],
      )}
    >
      <span class="sr-only">{label}: </span>
      {icon}
      {children}
    </span>
  );
}
