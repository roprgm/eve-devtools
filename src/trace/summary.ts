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
    tools += step.actions.length;
    inputTokens += step.usage?.inputTokens ?? 0;
    outputTokens += step.usage?.outputTokens ?? 0;
  }
  return {
    tools,
    inputTokens,
    outputTokens,
  };
}

export function summarizeTurns(turns: Turn[]): TurnSummary {
  const total = { tools: 0, inputTokens: 0, outputTokens: 0 };
  for (const turn of turns) {
    const summary = summarizeTurn(turn);
    total.tools += summary.tools;
    total.inputTokens += summary.inputTokens;
    total.outputTokens += summary.outputTokens;
  }
  return total;
}
