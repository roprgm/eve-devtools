import { isTraceEvent } from "@/trace/events";
import { createProjector } from "@/trace/projector";
import type { Turn } from "@/trace/types";

export type Trace = {
  push: (event: unknown) => void;
  subscribe: (listener: (turns: Turn[]) => void) => () => void;
};

// Receives the events the host app hands over — e.g. from useEveAgent's
// onEvent callback — and projects them into turns for the panel.
export function createTrace(): Trace {
  const listeners = new Set<(turns: Turn[]) => void>();
  let turns: Turn[] = [];
  const projector = createProjector(notify);

  function notify(next: Turn[]) {
    turns = next;
    for (const listener of listeners) {
      listener(turns);
    }
  }

  function push(event: unknown) {
    if (isTraceEvent(event)) {
      projector.push(event);
    }
  }

  function subscribe(listener: (turns: Turn[]) => void) {
    listeners.add(listener);
    listener(turns);
    return () => {
      listeners.delete(listener);
    };
  }

  return { push, subscribe };
}
