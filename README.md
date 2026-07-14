# eve-devtools

An open-source, in-app inspector for [eve](https://github.com/vercel/eve) agents. It turns an agent's event stream into a live visual trace of conversations, reasoning, tool calls, token usage, and timing.

The inspector runs in a side panel that makes room for itself beside your app, making it easier to understand agent behavior without switching to a separate dashboard.

## Features

- Inspect turns, reasoning, tool inputs and outputs, errors, and usage as they happen.
- Resize the side panel without covering your app.
- Use the full-screen panel on narrow mobile viewports.
- Drop it into any browser app with a small framework-agnostic API or the React provider.
- Keep application styles isolated with a shadow root.
- Debug locally without sending data anywhere. The package makes no network requests.

## Install

```sh
bun add eve-devtools
```

## Use

`mount()` appends the panel to `document.body` and returns a handle. Pass its `onEvent` to eve's observe-only callback, and the panel traces the conversation:

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

## Contributing

Issues and pull requests are welcome. To run the project locally:

```sh
bun install
bun run dev    # demo page with a minimal eve agent traced live
bun run check  # lint, format, and types
```

The demo lives in `demo/` and calls its model through the Vercel AI Gateway. Set `AI_GATEWAY_API_KEY` in `demo/.env.local` before starting it.

## License

MIT
