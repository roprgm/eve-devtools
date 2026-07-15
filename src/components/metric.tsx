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

// A compact labeled value, optionally paired with an icon.
export function Metric({
  icon,
  label,
  tabularNumbers = false,
  tone = "neutral",
  children,
}: {
  icon?: ComponentChildren;
  label: string;
  tabularNumbers?: boolean;
  tone?: MetricTone;
  children: ComponentChildren;
}) {
  return (
    <span
      title={label}
      class={cn(
        "flex shrink-0 items-center text-xs leading-none [&>svg]:size-3.5",
        gapClass[tone],
        tabularNumbers && "tabular-nums",
        toneClass[tone],
      )}
    >
      <span class="sr-only">{label}: </span>
      {icon}
      {children}
    </span>
  );
}
