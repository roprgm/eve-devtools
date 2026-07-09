import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import type { Plugin } from "vite";

type EveServer = {
  start(): Promise<{ url: string }>;
  close(): Promise<void>;
};

type EveHost = {
  createDevelopmentServer(
    rootDir: string,
    options?: { port?: number },
  ): EveServer;
  isActiveDevelopmentServerForApp(input: {
    appRoot: string;
    serverUrl: string;
  }): Promise<boolean>;
};

// eve has no public server API: its CLI is a thin wrapper around this
// internal module, which the package exports map does not expose. Importing
// it by file path is the only way to boot the server in-process today.
async function importEveHost(): Promise<EveHost> {
  const require = createRequire(import.meta.url);
  const packageRoot = dirname(require.resolve("eve/package.json"));
  const hostPath = join(packageRoot, "dist/src/internal/nitro/host.js");
  return await import(pathToFileURL(hostPath).href);
}

export type EveAgentOptions = {
  root: string;
  port: number;
};

// Runs an eve agent inside the vite process and closes it with the dev
// server. When another process already serves the same agent (for example a
// second vite instance), it is reused instead of started again.
export function eveAgent(options: EveAgentOptions): Plugin {
  return {
    name: "eve-agent",
    apply: "serve",
    async configureServer(server) {
      const eve = await importEveHost();
      const serverUrl = `http://127.0.0.1:${options.port}/`;
      const running = await eve.isActiveDevelopmentServerForApp({
        appRoot: options.root,
        serverUrl,
      });
      if (running) {
        return;
      }
      const agent = eve.createDevelopmentServer(options.root, {
        port: options.port,
      });
      await agent.start();
      server.httpServer?.on("close", () => {
        void agent.close();
      });
    },
  };
}
