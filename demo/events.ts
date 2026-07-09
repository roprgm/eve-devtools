import type { EventMeta, TraceEvent } from "@/trace/events";

// Timestamps are offsets from page load so the replay reads as a live
// session; the spacing within each turn fixes the durations the panel shows.
const base = Date.now();

function at(offsetMs: number): EventMeta {
  return { at: new Date(base + offsetMs).toISOString() };
}

export const demoEvents: TraceEvent[] = [
  { type: "session.started", meta: at(0) },
  { type: "turn.started", data: { turnId: "turn-1" }, meta: at(0) },
  {
    type: "message.received",
    data: {
      turnId: "turn-1",
      message: "What's the weather in Tokyo and should I pack an umbrella?",
    },
    meta: at(0),
  },
  {
    type: "step.started",
    data: { turnId: "turn-1", stepIndex: 0 },
    meta: at(180),
  },
  {
    type: "reasoning.completed",
    data: {
      turnId: "turn-1",
      stepIndex: 0,
      reasoning:
        "The user wants current conditions for Tokyo plus a recommendation. I'll geocode the city first to get precise coordinates, then fetch the hourly forecast for the next twelve hours. Once I have precipitation probabilities I can weigh whether an umbrella is worth carrying: anything above roughly sixty percent during the evening commute deserves a clear yes. I'll keep the final answer short and actionable.",
    },
    meta: at(780),
  },
  {
    type: "actions.requested",
    data: {
      turnId: "turn-1",
      stepIndex: 0,
      actions: [
        {
          callId: "call_geocode_1",
          kind: "tool-call",
          toolName: "geocode",
          input: { query: "Tokyo, Japan" },
        },
        {
          callId: "call_forecast_1",
          kind: "tool-call",
          toolName: "get_forecast",
          input: { lat: 35.6762, lon: 139.6503, units: "metric", hours: 12 },
        },
      ],
    },
    meta: at(920),
  },
  {
    type: "action.result",
    data: {
      turnId: "turn-1",
      stepIndex: 0,
      status: "completed",
      result: {
        callId: "call_geocode_1",
        output: { lat: 35.6762, lon: 139.6503, timezone: "Asia/Tokyo" },
      },
    },
    meta: at(1820),
  },
  {
    type: "action.result",
    data: {
      turnId: "turn-1",
      stepIndex: 0,
      status: "completed",
      result: {
        callId: "call_forecast_1",
        output: {
          current: { tempC: 18, condition: "Cloudy" },
          hourly: [
            { time: "18:00", precipitation: 0.64 },
            { time: "19:00", precipitation: 0.71 },
          ],
        },
      },
    },
    meta: at(2320),
  },
  {
    type: "step.completed",
    data: {
      turnId: "turn-1",
      stepIndex: 0,
      usage: { inputTokens: 8210, outputTokens: 128 },
    },
    meta: at(2380),
  },
  {
    type: "step.started",
    data: { turnId: "turn-1", stepIndex: 1 },
    meta: at(2480),
  },
  {
    type: "reasoning.completed",
    data: {
      turnId: "turn-1",
      stepIndex: 1,
      reasoning:
        "Precipitation is above 60% this evening, so an umbrella is warranted. I'll keep the answer concise.",
    },
    meta: at(3280),
  },
  {
    type: "message.completed",
    data: {
      turnId: "turn-1",
      stepIndex: 1,
      message:
        "It's 18°C and cloudy in Tokyo right now. Rain is likely tonight (60–70% chance from 18:00), so yes — pack an umbrella.",
    },
    meta: at(5580),
  },
  {
    type: "step.completed",
    data: {
      turnId: "turn-1",
      stepIndex: 1,
      usage: { inputTokens: 9040, outputTokens: 71 },
    },
    meta: at(5680),
  },
  { type: "turn.completed", data: { turnId: "turn-1" }, meta: at(5700) },
  { type: "turn.started", data: { turnId: "turn-2" }, meta: at(6600) },
  {
    type: "message.received",
    data: {
      turnId: "turn-2",
      message: "What changed in the auth module last week?",
    },
    meta: at(6600),
  },
  {
    type: "step.started",
    data: { turnId: "turn-2", stepIndex: 0 },
    meta: at(6770),
  },
  {
    type: "reasoning.completed",
    data: {
      turnId: "turn-2",
      stepIndex: 0,
      reasoning:
        "I'll search the git history for changes under the auth module, then read the file that changed most to summarize it.",
    },
    meta: at(7120),
  },
  {
    type: "actions.requested",
    data: {
      turnId: "turn-2",
      stepIndex: 0,
      actions: [
        {
          callId: "call_bash_1",
          kind: "tool-call",
          toolName: "bash",
          input: { command: "git log --since='7 days ago' --stat -- src/auth" },
        },
        {
          callId: "call_read_1",
          kind: "tool-call",
          toolName: "read_file",
          input: { path: "src/auth/session.ts" },
        },
      ],
    },
    meta: at(7170),
  },
  {
    type: "action.result",
    data: {
      turnId: "turn-2",
      stepIndex: 0,
      status: "completed",
      result: {
        callId: "call_bash_1",
        output: {
          exitCode: 0,
          stdout:
            "a1c9f2e  rotate refresh tokens on every refresh\nb3d0c74  revoke previous token after grace window",
        },
      },
    },
    meta: at(7390),
  },
  {
    type: "action.result",
    data: {
      turnId: "turn-2",
      stepIndex: 0,
      status: "completed",
      result: {
        callId: "call_read_1",
        output: { lines: 132, language: "typescript" },
      },
    },
    meta: at(7420),
  },
  {
    type: "step.completed",
    data: {
      turnId: "turn-2",
      stepIndex: 0,
      usage: { inputTokens: 7620, outputTokens: 96 },
    },
    meta: at(7520),
  },
  {
    type: "step.started",
    data: { turnId: "turn-2", stepIndex: 1 },
    meta: at(7620),
  },
  {
    type: "reasoning.completed",
    data: {
      turnId: "turn-2",
      stepIndex: 1,
      reasoning:
        "The main change is refresh-token rotation with a revocation grace window. I'll summarize both.",
    },
    meta: at(8320),
  },
  {
    type: "message.completed",
    data: {
      turnId: "turn-2",
      stepIndex: 1,
      message:
        "Last week the auth module gained refresh-token rotation: tokens now rotate on every refresh, and the previous token is revoked after a 60-second grace window.",
    },
    meta: at(9620),
  },
  {
    type: "step.completed",
    data: {
      turnId: "turn-2",
      stepIndex: 1,
      usage: { inputTokens: 8330, outputTokens: 84 },
    },
    meta: at(9720),
  },
  { type: "turn.completed", data: { turnId: "turn-2" }, meta: at(9800) },
  { type: "session.completed" },
];
