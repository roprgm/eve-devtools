import type { ComponentChildren } from "preact";

// An icon paired with a compact value, e.g. a token count or a duration.
export function Metric({
  icon,
  children,
}: {
  icon: ComponentChildren;
  children: ComponentChildren;
}) {
  return (
    <span class="flex items-center gap-1 text-xs tabular-nums text-neutral-400">
      {icon}
      {children}
    </span>
  );
}
