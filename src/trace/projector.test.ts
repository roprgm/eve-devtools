import { describe, expect, test } from "bun:test";
import type { TraceEvent } from "@/trace/events";
import { createProjector } from "@/trace/projector";
import { summarizeTurn } from "@/trace/summary";
import type { Turn } from "@/trace/types";

describe("createProjector", () => {
  test("presents ask_question calls as questions", () => {
    let turns: Turn[] = [];
    const projector = createProjector((nextTurns) => {
      turns = nextTurns;
    });
    const events: TraceEvent[] = [
      { type: "turn.started", data: { turnId: "turn-1" } },
      {
        type: "message.appended",
        data: { turnId: "turn-1", stepIndex: 0, messageSoFar: " \n " },
      },
      {
        type: "message.completed",
        data: { turnId: "turn-1", stepIndex: 0, message: "\n" },
      },
      {
        type: "input.requested",
        data: {
          turnId: "turn-1",
          stepIndex: 0,
          requests: [
            {
              requestId: "request-1",
              prompt: "Which city?",
              options: [
                { id: "tokyo", label: "Tokyo" },
                { id: "paris", label: "Paris" },
              ],
              action: {
                callId: "question-1",
                toolName: "ask_question",
                input: { prompt: "Which city?" },
              },
            },
          ],
        },
      },
      {
        type: "client.input.responded",
        data: {
          responses: [{ requestId: "request-1", optionId: "paris" }],
        },
      },
    ];

    for (const event of events) {
      projector.push(event);
    }

    const turn = turns[0];
    if (turn === undefined) {
      throw new Error("Expected the projected turn.");
    }
    expect(turn.steps[0]?.actions[0]?.question).toEqual({
      requestId: "request-1",
      prompt: "Which city?",
      options: [
        { id: "tokyo", label: "Tokyo" },
        { id: "paris", label: "Paris" },
      ],
      answer: "Paris",
    });
    expect(turn.steps[0]?.response).toBeUndefined();
    expect(summarizeTurn(turn).tools).toBe(0);
  });
});
