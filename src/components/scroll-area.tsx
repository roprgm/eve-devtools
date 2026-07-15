import type { ComponentChildren } from "preact";

export function ScrollArea({ children }: { children: ComponentChildren }) {
  return (
    <div class="scroll min-h-0 flex-1 overflow-y-auto overscroll-contain">
      {children}
    </div>
  );
}
