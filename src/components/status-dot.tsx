import { cn } from "cnfast";

export type StatusTone = "running" | "completed" | "failed";

const toneClass: Record<StatusTone, string> = {
  running: "bg-blue-500",
  completed: "bg-green-500",
  failed: "bg-red-500",
};

export function StatusDot({ tone }: { tone: StatusTone }) {
  return <span class={cn("size-1.5 shrink-0 rounded-full", toneClass[tone])} />;
}
