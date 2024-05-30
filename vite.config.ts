import removeAttr from "react-remove-attr";

import path from "node:path";

import react from "@vitejs/plugin-react-swc";
import bodyParser from "body-parser";
import { loadEnv } from "vite";
import checker from "vite-plugin-checker";
import mockServer from "vite-plugin-mock-server";
import { defineConfig } from "vitest/config";

export default defineConfig(({ mode, command }) => {
  process.env.NODE_ENV = mode; // Make sure NODE_ENV matches mode when building

  const inDevMode = mode === "development";
  const inProdMode = mode === "production";
  const inTestMode = mode === "test";
  const inServeMode = command === "serve";

  // expose .env vars to server environment
  const env = loadEnv(mode, process.cwd(), "");
  process.env["VITE_DEFAULT_DELAY"] = env.VITE_DEFAULT_DELAY;
  process.env["VITE_APP_CONTEXT_PATH"] = env.VITE_APP_CONTEXT_PATH;
  process.env["VITE_APP_ENDPOINT"] = env.VITE_APP_ENDPOINT;

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
      inServeMode &&
        !inTestMode &&
        mockServer({
          urlPrefixes: ["/api/"],
          logLevel: "error",
          mockRootDir: "./src",
          middlewares: [bodyParser.json()],
          mockJsSuffix: ".server.mock.js",
          mockTsSuffix: ".server.mock.ts",
        }),
    ],

    build: {
      sourcemap: inDevMode,
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
