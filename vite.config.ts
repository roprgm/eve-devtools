import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const port = parseInt(process.env.PORT ?? "3000", 10);

export default defineConfig({
  server: { port, open: "/demo/" },
  plugins: [tailwindcss(), dts({ include: ["index.ts", "react.ts", "src"] })],
  resolve: { alias: { "@": `${import.meta.dirname}/src` } },
  build: {
    lib: {
      entry: { index: "index.ts", react: "react.ts" },
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react"],
    },
  },
});
