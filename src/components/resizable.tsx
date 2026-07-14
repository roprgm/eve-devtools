import { cn } from "cnfast";
import type { ComponentChildren } from "preact";
import { useRef } from "preact/hooks";

type DragStart = { x: number; width: number };

function clampWidth(width: number, minWidth: number, maxWidth: number): number {
  return Math.min(maxWidth, Math.max(minWidth, width));
}

function resizedWidth(
  start: DragStart,
  event: PointerEvent,
  minWidth: number,
  maxWidth: number,
): number {
  const dx = start.x - event.clientX;
  return clampWidth(start.width + dx, minWidth, maxWidth);
}

export function Resizable(props: {
  width: number;
  minWidth: number;
  maxWidth: number;
  canResize: boolean;
  onResize: (width: number) => void;
  children: ComponentChildren;
}) {
  const dragStart = useRef<DragStart | null>(null);

  function onPointerDown(event: PointerEvent) {
    event.preventDefault();
    const handle = event.currentTarget as HTMLElement;
    handle.setPointerCapture(event.pointerId);
    dragStart.current = {
      x: event.clientX,
      width: props.width,
    };
  }

  function onPointerMove(event: PointerEvent) {
    if (dragStart.current === null) {
      return;
    }
    props.onResize(
      resizedWidth(dragStart.current, event, props.minWidth, props.maxWidth),
    );
  }

  function onPointerUp() {
    dragStart.current = null;
  }

  function onKeyDown(event: KeyboardEvent) {
    const step = event.shiftKey ? 32 : 8;
    let nextWidth = props.width;

    if (event.key === "ArrowLeft") {
      nextWidth += step;
    } else if (event.key === "ArrowRight") {
      nextWidth -= step;
    } else {
      return;
    }

    event.preventDefault();
    props.onResize(clampWidth(nextWidth, props.minWidth, props.maxWidth));
  }

  return (
    <div
      class="relative h-dvh"
      style={{
        width: `${props.width}px`,
      }}
    >
      {props.children}
      {props.canResize && (
        <hr
          aria-label="Resize eve devtools"
          aria-orientation="vertical"
          aria-valuemin={props.minWidth}
          aria-valuemax={props.maxWidth}
          aria-valuenow={props.width}
          tabIndex={0}
          class={cn(
            "absolute inset-y-0 -left-1 z-10 m-0 h-auto w-2 touch-none cursor-ew-resize border-0 p-0",
            "after:absolute after:inset-y-0 after:left-1 after:w-px after:bg-line-2",
            "hover:after:bg-line-3 focus-visible:after:bg-line-3 focus-visible:outline-none",
          )}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />
      )}
    </div>
  );
}
