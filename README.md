# eve-devtools

In-app devtools for [eve](https://github.com/vercel/eve) agents: a floating panel that shows what the agent is doing, live — turns, reasoning, tool calls with their inputs and outputs, token usage, and timing.

The panel renders in an isolated shadow root, so it never collides with the app's styles. It has no dependency on eve: the app hands it the agent's events. It makes no network requests.

## Install

```sh
bun add eve-devtools
```

## Use

`mount()` appends the panel to `document.body` and returns a handle. Pass its `onEvent` to the agent — eve's observe-only callback — and the panel traces the conversation:

```ts
import { mount } from "eve-devtools";

const devtools = mount();
const agent = useEveAgent({ onEvent: devtools.onEvent });
```

In a React app, use the provider from `eve-devtools/react` instead. Wrap the app once; `enabled` limits the panel to development builds:

```tsx
import { EveDevtoolsProvider } from "eve-devtools/react";

<EveDevtoolsProvider enabled={process.env.NODE_ENV === "development"}>
  <App />
</EveDevtoolsProvider>
```

Anywhere below the provider, read the handle and pass its `onEvent` to the agent:

```tsx
import { useEveDevtools } from "eve-devtools/react";

const devtools = useEveDevtools();
const agent = useEveAgent({ onEvent: devtools?.onEvent });
```

The same wiring works wherever events are available:

```ts
// with an EveAgentStore
store.setCallbacks({ onEvent: devtools.onEvent });

// iterating a ClientSession stream
for await (const event of response) {
  devtools.onEvent(event);
}
```

If the app restores a conversation from persisted events (`initialEvents`), replay them once so the trace covers the whole conversation, not just what streams from then on:

```ts
for (const event of savedEvents) {
  devtools.onEvent(event);
}
```

## API

`mount(root?)` renders the panel into `root` (default: `document.body`) and returns an `EveDevtools` handle:

- `onEvent(event)` — feed one stream event. Events the panel does not know are ignored, so any `HandleMessageStreamEvent` can be passed through unfiltered.
- `unmount()` — remove the panel and clean up.

`eve-devtools/react` wraps the lifecycle for React apps (React is an optional peer dependency, only needed for this entry):

- `<EveDevtoolsProvider enabled?>` — mounts the panel while rendered and shares the handle through context.
- `useEveDevtools()` — returns the `EveDevtools` handle, or `undefined` until the provider has mounted it.

## Develop

```sh
bun install
bun run dev    # demo page plus a minimal eve agent it traces live
bun run check  # lint, format, and types
```

The demo lives in `demo/` as its own package: a vite app, a minimal eve agent, and a vite plugin that runs the agent inside the dev server. The agent calls its model through the Vercel AI Gateway, so set `AI_GATEWAY_API_KEY` in `demo/.env.local`.

## License

MIT
