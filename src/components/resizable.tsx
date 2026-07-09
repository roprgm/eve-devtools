import { cn } from "cnfast";
import type { ComponentChildren } from "preact";
import { useRef } from "preact/hooks";

export type Size = { width: number; height: number };

type Edge = "left" | "top" | "corner";

type DragStart = { x: number; y: number; size: Size };

function resizeFrom(
  start: DragStart,
  edge: Edge,
  event: PointerEvent,
  minSize: Size,
): Size {
  const dx = start.x - event.clientX;
  const dy = start.y - event.clientY;
  const size = { ...start.size };
  if (edge !== "top") {
    size.width = Math.max(minSize.width, start.size.width + dx);
  }
  if (edge !== "left") {
    size.height = Math.max(minSize.height, start.size.height + dy);
  }
  return size;
}

const handleClass = "absolute hidden touch-none group-open:block";

const handles: { edge: Edge; class: string }[] = [
  { edge: "left", class: "inset-y-3 -left-0.75 w-1.5 cursor-ew-resize" },
  { edge: "top", class: "inset-x-3 -top-0.75 h-1.5 cursor-ns-resize" },
  { edge: "corner", class: "-top-0.75 -left-0.75 size-3 cursor-nwse-resize" },
];

// The wrapper div is intentionally not positioned, so the absolute handles
// anchor to the panel edges (the nearest positioned ancestor) while the
// width and height styles apply to the content area only.
export function Resizable(props: {
  size: Size;
  minSize: Size;
  onResize: (size: Size) => void;
  children: ComponentChildren;
}) {
  const dragStart = useRef<DragStart | null>(null);

  function onPointerDown(event: PointerEvent) {
    event.preventDefault();
    const handle = event.currentTarget as HTMLElement;
    handle.setPointerCapture(event.pointerId);
    dragStart.current = {
      x: event.clientX,
      y: event.clientY,
      size: props.size,
    };
  }

  function onPointerMove(event: PointerEvent, edge: Edge) {
    if (dragStart.current === null) {
      return;
    }
    props.onResize(resizeFrom(dragStart.current, edge, event, props.minSize));
  }

  function onPointerUp() {
    dragStart.current = null;
  }

  return (
    <div
      style={{
        width: `${props.size.width}px`,
        height: `${props.size.height}px`,
      }}
    >
      {props.children}
      {handles.map((handle) => (
        <div
          key={handle.edge}
          class={cn(handleClass, handle.class)}
          onPointerDown={onPointerDown}
          onPointerMove={(event) => onPointerMove(event, handle.edge)}
          onPointerUp={onPointerUp}
        />
      ))}
    </div>
  );
}
