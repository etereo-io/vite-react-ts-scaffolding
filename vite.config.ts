import removeAttr from "react-remove-attr";

import path from "node:path";

import react from "@vitejs/plugin-react-swc";
import { loadEnv } from "vite";
import checker from "vite-plugin-checker";
import { defineConfig } from "vitest/config";

export default defineConfig(({ mode }) => {
  process.env.NODE_ENV = mode; // Make sure NODE_ENV matches mode when building

  const inProdMode = mode === "production";

  // expose .env vars to server environment
  const env = loadEnv(mode, process.cwd(), "");
  process.env["VITE_DEFAULT_DELAY"] = env.VITE_DEFAULT_DELAY;
  process.env["VITE_APP_CONTEXT_PATH"] = env.VITE_APP_CONTEXT_PATH;
  process.env["VITE_APP_ENDPOINT"] = env.VITE_APP_ENDPOINT;
  process.env["VITE_ENABLE_MSW"] = env.VITE_ENABLE_MSW;

  return {
    plugins: [
      checker({
        typescript: true,
      }),
      inProdMode &&
        removeAttr({
          extensions: ["tsx"],
          attributes: ["data-testid"],
        }),
      react(),
    ],

    build: {
      sourcemap: !inProdMode,
      reportCompressedSize: false,
    },

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "#": path.resolve(__dirname, "test"),
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
  };
});
