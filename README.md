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

`onEvent(event)` feeds one stream event; unknown events are ignored, so any `HandleMessageStreamEvent` can be passed through unfiltered. Call `devtools.unmount()` to remove the panel.

## React

Wrap the app once in `EveDevtoolsProvider`. `enabled` limits the panel to development builds (React is an optional peer dependency, only needed for this entry):

```tsx
import { EveDevtoolsProvider } from "eve-devtools/react";

function Root() {
  return (
    <EveDevtoolsProvider enabled={process.env.NODE_ENV === "development"}>
      <App />
    </EveDevtoolsProvider>
  );
}
```

Anywhere below the provider, read the handle with `useEveDevtools()` and pass its `onEvent` to the agent. The handle is `undefined` until the provider has mounted, so guard the call:

```tsx
import { useEveDevtools } from "eve-devtools/react";

function Chat() {
  const devtools = useEveDevtools();
  const agent = useEveAgent({ onEvent: devtools?.onEvent });

  return <Conversation agent={agent} />;
}
```

## Develop

```sh
bun install
bun run dev    # demo page plus a minimal eve agent it traces live
bun run check  # lint, format, and types
```

The demo lives in `demo/` as its own package: a vite app, a minimal eve agent, and a vite plugin that runs the agent inside the dev server. The agent calls its model through the Vercel AI Gateway, so set `AI_GATEWAY_API_KEY` in `demo/.env.local`.

## License

MIT
