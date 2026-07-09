import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
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
