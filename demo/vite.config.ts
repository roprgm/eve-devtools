import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { eveAgent } from "./eve-plugin";

const port = parseInt(process.env.PORT ?? "3000", 10);
const agentPort = 2000;

export default defineConfig({
  root: `${import.meta.dirname}/app`,
  publicDir: `${import.meta.dirname}/public`,
  build: { outDir: `${import.meta.dirname}/dist`, emptyOutDir: true },
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
