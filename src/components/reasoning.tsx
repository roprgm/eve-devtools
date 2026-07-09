import { cn } from "cnfast";
import { Brain } from "lucide-preact";
import { useState } from "preact/hooks";
import { Entry } from "@/components/entry";

// Reasoning longer than this starts collapsed to a two-line preview.
const clampThreshold = 200;

export function Reasoning({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > clampThreshold;

  let toggleLabel = "Show more";
  if (expanded) {
    toggleLabel = "Show less";
  }

  return (
    <Entry icon={<Brain />}>
      <p
        class={cn(
          "italic text-foreground/50",
          isLong && !expanded && "line-clamp-2",
        )}
      >
        {text}
      </p>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          class="mt-0.5 cursor-pointer text-xs font-medium text-foreground/40 transition-colors hover:text-foreground/70"
        >
          {toggleLabel}
        </button>
      )}
    </Entry>
  );
}
