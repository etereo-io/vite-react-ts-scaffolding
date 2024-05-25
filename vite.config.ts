import path from "node:path";

import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  test: {
    globals: true,

    environment: "jsdom",

    environmentOptions: {
      url: "http://localhost",
    },

    include: ["**/*.test.js", "**/*.test.ts", "**/*.test.jsx", "**/*.test.tsx"],
    exclude: ["**/node_modules/**"],

    setupFiles: path.resolve(__dirname, "vitest.setup.ts"),

    reporters: ["default", "json"],
    outputFile: {
      json: "reports/test-report/test-report.json",
      html: "reports/test-report/test-report.html",
    },

    coverage: {
      provider: "v8",
      include: ["src/**/*"],
      exclude: ["src/main.tsx", "src/mocks/**/*", "*.test.*"],
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "reports/vite-coverage",
      enabled: false,
    },

    clearMocks: true,
  },
});
