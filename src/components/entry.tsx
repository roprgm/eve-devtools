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
    <div class="flex gap-2 py-1">
      <span class="flex h-[1lh] w-3.5 shrink-0 items-center justify-center text-neutral-400 [&>svg]:size-3.5">
        {icon}
      </span>
      <div class="min-w-0 flex-1">{children}</div>
    </div>
  );
}
