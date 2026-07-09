import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { eveAgent } from "./eve-plugin";

const port = parseInt(process.env.PORT ?? "3000", 10);
const agentPort = 2000;

// On Vercel builds, `eve build` writes the deployment bundle to
// .vercel/output (Vercel Build Output API) and `.output/public` is never
// deployed. The static site must land in the bundle's static directory,
// where it is served ahead of the eve catch-all function. Never empty that
// directory: eve may have written assets into it already.
function resolveBuildOptions(root: string) {
  if (process.env.VERCEL) {
    return { outDir: `${root}/.vercel/output/static`, emptyOutDir: false };
  }
  return { outDir: `${root}/.output/public`, emptyOutDir: true };
}

export default defineConfig({
  root: `${import.meta.dirname}/app`,
  publicDir: `${import.meta.dirname}/public`,
  build: resolveBuildOptions(import.meta.dirname),
  server: {
    port,
    open: true,
    proxy: { "/eve": `http://127.0.0.1:${agentPort}` },
  },
  plugins: [
    tailwindcss(),
    eveAgent({ root: import.meta.dirname, port: agentPort }),
  ],
  resolve: { alias: { "@": `${import.meta.dirname}/../src` } },
});
