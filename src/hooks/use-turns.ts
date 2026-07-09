import { useEffect, useState } from "preact/hooks";
import type { Trace } from "@/trace/trace";
import type { Turn } from "@/trace/types";

export function useTurns(trace: Trace): Turn[] {
  const [turns, setTurns] = useState<Turn[]>([]);
  useEffect(() => trace.subscribe(setTurns), [trace]);
  return turns;
}
