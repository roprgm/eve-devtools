import type { Turn } from "@/trace/types";

export type TurnSummary = {
  tools: number;
  inputTokens: number;
  outputTokens: number;
};

export function summarizeTurn(turn: Turn): TurnSummary {
  let tools = 0;
  let inputTokens = 0;
  let outputTokens = 0;
  for (const step of turn.steps) {
    for (const action of step.actions) {
      if (action.question === undefined) {
        tools += 1;
      }
    }
    inputTokens += step.usage?.inputTokens ?? 0;
    outputTokens += step.usage?.outputTokens ?? 0;
  }
  return {
    tools,
    inputTokens,
    outputTokens,
  };
}
