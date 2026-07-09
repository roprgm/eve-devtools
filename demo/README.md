# eve-devtools demo

A minimal chat app that exercises the devtools panel against a real
[eve](https://github.com/vercel/eve) agent.

- `app/` — the chat page: one input, streamed replies, and the panel mounted
  from the library source.
- `agent/` — the smallest useful eve agent: a model, a one-line instruction,
  and a `get_weather` tool.
- `eve-plugin.ts` — a vite plugin that runs the agent inside the dev server,
  so one command starts everything.

## Run

From the repository root:

```sh
bun install
bun run dev
```

The agent calls its model through the Vercel AI Gateway, so set the key in
`demo/.env.local`:

```
AI_GATEWAY_API_KEY=...
```

## How the agent is served

eve has no public API for embedding its server, so `eve-plugin.ts` imports the
internal module the eve CLI itself wraps and boots it in-process; vite proxies
`/eve` to it. When another process already serves the same agent — a second
vite instance, for example — the plugin reuses it instead of starting a
duplicate. Because the import is internal eve API, this package pins an exact
eve version.
