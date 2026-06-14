import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// MUST stay in sync with the `paths` in tsconfig.json
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@app": fileURLToPath(new URL("./src/app", import.meta.url)),
      "@pages": fileURLToPath(new URL("./src/app/pages", import.meta.url)),
      "@scopes": fileURLToPath(new URL("./src/app/scopes", import.meta.url)),
      "@features": fileURLToPath(new URL("./src/features", import.meta.url)),
      "@shared": fileURLToPath(new URL("./src/shared", import.meta.url)),
      "@components": fileURLToPath(
        new URL("./src/shared/components", import.meta.url),
      ),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
