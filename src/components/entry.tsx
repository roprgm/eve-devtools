import type { ComponentChildren } from "preact";

// A transcript line: a leading icon in a fixed gutter, then its content.
export function Entry({
  icon,
  children,
}: {
  icon: ComponentChildren;
  children: ComponentChildren;
}) {
  return (
    <div class="flex gap-2.5 py-1">
      <span class="mt-0.5 shrink-0 text-neutral-400">{icon}</span>
      <div class="min-w-0 flex-1">{children}</div>
    </div>
  );
}
