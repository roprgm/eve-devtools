export type TurnStatus = "running" | "completed" | "failed";

export type ActionStatus =
  | "running"
  | "completed"
  | "failed"
  | "rejected"
  | "aborted";

// Token usage, as eve reports it on each `step.completed` event.
export type Usage = {
  inputTokens?: number;
  outputTokens?: number;
};

export type TraceError = {
  code: string;
  message: string;
  details?: unknown;
};

export type Question = {
  requestId: string;
  prompt: string;
  options: readonly {
    id: string;
    label: string;
  }[];
  answer?: string;
};

export type Action = {
  callId: string;
  name: string;
  status: ActionStatus;
  question?: Question;
  startedAt?: string; // ISO timestamp, from the event's `meta.at`
  durationMs?: number;
  input?: unknown;
  output?: unknown;
};

export type Step = {
  index: number;
  reasoning?: string;
  response?: string;
  usage?: Usage;
  actions: Action[];
};

export type Turn = {
  id: string;
  status: TurnStatus;
  error?: TraceError;
  prompt?: string;
  startedAt?: string; // ISO timestamp, from the event's `meta.at`
  durationMs?: number;
  steps: Step[];
};
