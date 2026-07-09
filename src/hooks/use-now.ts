import { useEffect, useState } from "preact/hooks";

const tickMs = 100;

// Current time, re-rendering on every tick while active.
export function useNow(active: boolean): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!active) {
      return;
    }
    const timer = setInterval(() => setNow(Date.now()), tickMs);
    return () => clearInterval(timer);
  }, [active]);

  return now;
}
