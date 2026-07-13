import type { TraceError, Usage } from "@/trace/types";

// Structural types for the eve stream events the devtools consume, declared
// locally so the package does not depend on eve itself and tolerates fields
// added in newer stream versions. Events of any other type are ignored.

export type EventMeta = {
  at?: string;
};

export type ActionRequest = {
  callId: string;
  kind?: string;
  name?: string;
  toolName?: string;
  input?: unknown;
};

type TraceEventBody =
  | { type: "turn.started"; data: { turnId: string } }
  | { type: "turn.completed"; data: { turnId: string } }
  | { type: "turn.failed"; data: { turnId: string } & TraceError }
  | { type: "message.received"; data: { turnId: string; message: string } }
  | { type: "step.started"; data: { turnId: string; stepIndex: number } }
  | {
      type: "step.completed";
      data: { turnId: string; stepIndex: number; usage?: Usage };
    }
  | {
      type: "reasoning.appended";
      data: { turnId: string; stepIndex: number; reasoningSoFar: string };
    }
  | {
      type: "reasoning.completed";
      data: { turnId: string; stepIndex: number; reasoning: string };
    }
  | {
      type: "message.appended";
      data: { turnId: string; stepIndex: number; messageSoFar: string };
    }
  | {
      type: "message.completed";
      data: { turnId: string; stepIndex: number; message: string | null };
    }
  | {
      type: "actions.requested";
      data: {
        turnId: string;
        stepIndex: number;
        actions: readonly ActionRequest[];
      };
    }
  | {
      type: "action.result";
      data: {
        turnId: string;
        stepIndex: number;
        status: "completed" | "failed" | "rejected";
        result: { callId: string; output?: unknown };
        error?: { code: string; message: string };
      };
    }
  | { type: "session.started" }
  | { type: "session.completed" }
  | { type: "session.failed" };

export type TraceEvent = TraceEventBody & { meta?: EventMeta };

export function isTraceEvent(value: unknown): value is TraceEvent {
  return (
    value !== null &&
    typeof value === "object" &&
    "type" in value &&
    typeof value.type === "string"
  );
}
