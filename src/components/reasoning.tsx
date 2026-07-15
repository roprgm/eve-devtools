import { cn } from "cnfast";
import { Brain } from "lucide-preact";
import { useEffect, useRef, useState } from "preact/hooks";
import { DisclosureChevron } from "@/components/disclosure-chevron";
import { Entry } from "@/components/entry";

export function Reasoning({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const [collapsible, setCollapsible] = useState(false);
  const contentRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = contentRef.current;
    if (element === null || expanded) {
      return;
    }

    const update = () => {
      if (!element.classList.contains("line-clamp-5")) {
        return;
      }
      setCollapsible(element.scrollHeight > element.clientHeight);
    };
    let frame: number | undefined;
    const scheduleUpdate = () => {
      if (frame !== undefined) {
        cancelAnimationFrame(frame);
      }
      frame = requestAnimationFrame(() => {
        frame = undefined;
        update();
      });
    };

    update();
    const resizeObserver = new ResizeObserver(scheduleUpdate);
    const mutationObserver = new MutationObserver(scheduleUpdate);
    resizeObserver.observe(element);
    mutationObserver.observe(element, {
      childList: true,
      characterData: true,
      subtree: true,
    });
    return () => {
      if (frame !== undefined) {
        cancelAnimationFrame(frame);
      }
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [expanded]);

  function toggle() {
    setExpanded((value) => !value);
  }

  let toggleLabel = "Expand reasoning";
  if (expanded) {
    toggleLabel = "Collapse reasoning";
  }

  const content = (
    <span
      ref={contentRef}
      class={cn(
        "min-w-0 flex-1 italic text-foreground/50",
        !expanded && "line-clamp-5",
        collapsible && "pr-5",
      )}
    >
      {text}
    </span>
  );

  return (
    <Entry icon={<Brain />}>
      <div class="relative flex w-full items-start text-left">
        {content}
        {collapsible && (
          <>
            <button
              type="button"
              aria-label={toggleLabel}
              aria-expanded={expanded}
              title={toggleLabel}
              onClick={toggle}
              class="reasoning-toggle absolute inset-0 cursor-pointer bg-transparent"
            />
            <span
              aria-hidden="true"
              class="pointer-events-none absolute top-0 right-0 flex h-[1lh] w-4 items-center justify-end"
            >
              <DisclosureChevron className={cn(expanded && "-rotate-90")} />
            </span>
          </>
        )}
      </div>
    </Entry>
  );
}
