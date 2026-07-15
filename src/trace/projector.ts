import type { ActionRequest, TraceEvent } from "@/trace/events";
import type { Action, Question, Step, Turn } from "@/trace/types";

export type Projector = {
  push: (event: TraceEvent) => void;
};

function actionName(request: ActionRequest): string {
  return request.toolName ?? request.name ?? request.kind ?? "action";
}

function millisBetween(
  start: string | undefined,
  end: string | undefined,
): number | undefined {
  if (start === undefined || end === undefined) {
    return undefined;
  }
  return Date.parse(end) - Date.parse(start);
}

function answerFor(
  question: Question,
  response: { optionId?: string; text?: string },
): string | undefined {
  const text = response.text?.trim();
  if (text !== undefined && text !== "") {
    return text;
  }
  if (response.optionId === undefined) {
    return undefined;
  }
  return (
    question.options.find((option) => option.id === response.optionId)?.label ??
    response.optionId
  );
}

// Folds eve stream events into the Turn tree, calling onChange with a fresh
// snapshot after every event. The wire only reports completed, failed, and
// rejected action results; running and aborted are synthesized here.
export function createProjector(onChange: (turns: Turn[]) => void): Projector {
  const turns: Turn[] = [];
  const actionsByCallId = new Map<string, Action>();
  const questionsByRequestId = new Map<string, Action>();

  function turnById(turnId: string): Turn | undefined {
    return turns.find((turn) => turn.id === turnId);
  }

  function stepAt(turnId: string, stepIndex: number): Step | undefined {
    const turn = turnById(turnId);
    if (turn === undefined) {
      return undefined;
    }
    let step = turn.steps.find((candidate) => candidate.index === stepIndex);
    if (step === undefined) {
      step = { index: stepIndex, actions: [] };
      turn.steps.push(step);
    }
    return step;
  }

  function abortRunningActions() {
    for (const action of actionsByCallId.values()) {
      if (action.status === "running") {
        action.status = "aborted";
      }
    }
  }

  function apply(event: TraceEvent) {
    switch (event.type) {
      case "turn.started": {
        turns.push({
          id: event.data.turnId,
          status: "running",
          startedAt: event.meta?.at,
          steps: [],
        });
        return;
      }
      case "message.received": {
        const turn = turnById(event.data.turnId);
        if (turn !== undefined) {
          turn.prompt = event.data.message;
        }
        return;
      }
      case "step.started": {
        stepAt(event.data.turnId, event.data.stepIndex);
        return;
      }
      case "reasoning.appended": {
        if (event.data.reasoningSoFar === "") {
          return;
        }
        const step = stepAt(event.data.turnId, event.data.stepIndex);
        if (step !== undefined) {
          step.reasoning = event.data.reasoningSoFar;
        }
        return;
      }
      case "reasoning.completed": {
        const step = stepAt(event.data.turnId, event.data.stepIndex);
        if (step !== undefined) {
          step.reasoning = event.data.reasoning;
        }
        return;
      }
      case "message.appended": {
        if (event.data.messageSoFar.trim() === "") {
          return;
        }
        const step = stepAt(event.data.turnId, event.data.stepIndex);
        if (step !== undefined) {
          step.response = event.data.messageSoFar;
        }
        return;
      }
      case "message.completed": {
        if (event.data.message === null || event.data.message.trim() === "") {
          return;
        }
        const step = stepAt(event.data.turnId, event.data.stepIndex);
        if (step !== undefined) {
          step.response = event.data.message;
        }
        return;
      }
      case "step.completed": {
        const step = stepAt(event.data.turnId, event.data.stepIndex);
        if (step !== undefined) {
          step.usage = event.data.usage;
        }
        return;
      }
      case "actions.requested": {
        const step = stepAt(event.data.turnId, event.data.stepIndex);
        if (step === undefined) {
          return;
        }
        for (const request of event.data.actions) {
          const action: Action = {
            callId: request.callId,
            name: actionName(request),
            status: "running",
            startedAt: event.meta?.at,
            input: request.input,
          };
          actionsByCallId.set(request.callId, action);
          step.actions.push(action);
        }
        return;
      }
      case "input.requested": {
        for (const request of event.data.requests) {
          if (request.action.toolName !== "ask_question") {
            continue;
          }
          let action = actionsByCallId.get(request.action.callId);
          if (action === undefined) {
            const step = stepAt(event.data.turnId, event.data.stepIndex);
            if (step === undefined) {
              continue;
            }
            action = {
              callId: request.action.callId,
              name: request.action.toolName,
              status: "running",
              startedAt: event.meta?.at,
              input: request.action.input,
            };
            actionsByCallId.set(action.callId, action);
            step.actions.push(action);
          }
          action.question = {
            requestId: request.requestId,
            prompt: request.prompt,
            options: request.options ?? [],
          };
          questionsByRequestId.set(request.requestId, action);
        }
        return;
      }
      case "client.input.responded": {
        for (const response of event.data.responses) {
          const action = questionsByRequestId.get(response.requestId);
          if (action?.question === undefined) {
            continue;
          }
          action.question.answer = answerFor(action.question, response);
        }
        return;
      }
      case "action.result": {
        const action = actionsByCallId.get(event.data.result.callId);
        if (action === undefined) {
          return;
        }
        action.status = event.data.status;
        action.durationMs = millisBetween(action.startedAt, event.meta?.at);
        if (event.data.result.output !== undefined) {
          action.output = event.data.result.output;
        } else if (event.data.error !== undefined) {
          action.output = event.data.error;
        }
        return;
      }
      case "turn.completed": {
        const turn = turnById(event.data.turnId);
        if (turn !== undefined) {
          turn.status = "completed";
          turn.durationMs = millisBetween(turn.startedAt, event.meta?.at);
        }
        return;
      }
      case "turn.failed": {
        const turn = turnById(event.data.turnId);
        if (turn !== undefined) {
          turn.status = "failed";
          turn.error = {
            code: event.data.code,
            message: event.data.message,
            details: event.data.details,
          };
          turn.durationMs = millisBetween(turn.startedAt, event.meta?.at);
        }
        abortRunningActions();
        return;
      }
      // A new session, or a stream replayed from the start, rebuilds the
      // trace from scratch.
      case "session.started": {
        turns.length = 0;
        actionsByCallId.clear();
        questionsByRequestId.clear();
        return;
      }
      case "session.completed":
      case "session.failed": {
        abortRunningActions();
        return;
      }
    }
  }

  return {
    push(event) {
      apply(event);
      onChange([...turns]);
    },
  };
}
