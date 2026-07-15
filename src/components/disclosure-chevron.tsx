import { cn } from "cnfast";
import { ChevronLeft } from "lucide-preact";

export function DisclosureChevron({ className }: { className?: string }) {
  return (
    <ChevronLeft
      class={cn("size-3.5 text-neutral-500 transition-transform", className)}
    />
  );
}
