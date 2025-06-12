import removeAttr from "react-remove-attr";

import path from "node:path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { loadEnv } from "vite";
import checker from "vite-plugin-checker";
import { defineConfig } from "vitest/config";

export default defineConfig(({ mode }) => {
  process.env.NODE_ENV = mode; // Make sure NODE_ENV matches mode when building

  const inProdMode = mode === "production";

  // expose .env vars to server environment (only VITE_ prefixed vars)
  const env = loadEnv(mode, process.cwd(), "");
  Object.keys(env).forEach((key) => {
    if (key.startsWith("VITE_")) {
      process.env[key] = env[key];
    }
  });

  return {
    plugins: [
      checker({
        typescript: true
      }),
      tailwindcss(),
      inProdMode &&
        removeAttr({
          extensions: ["tsx"],
          attributes: ["data-testid"]
        }),
      react()
    ],

    build: {
      sourcemap: !inProdMode,
      reportCompressedSize: false
    },

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "#": path.resolve(__dirname, "test")
      }
    },

    test: {
      globals: true,

      environment: "jsdom",

      environmentOptions: {
        url: "http://localhost"
      },

      include: [
        "**/*.test.js",
        "**/*.test.ts",
        "**/*.test.jsx",
        "**/*.test.tsx"
      ],
      exclude: ["**/node_modules/**"],

      setupFiles: path.resolve(__dirname, "vitest.setup.ts"),

      reporters: ["default", "json", "vitest-sonar-reporter"],
      outputFile: {
        json: "reports/test-report/test-report.json",
        html: "reports/test-report/test-report.html",
        "vitest-sonar-reporter": "reports/vite-sonar/sonar-report.xml"
      },

      coverage: {
        provider: "v8",
        include: ["src/**/*"],
        exclude: [
          "src/main.tsx",
          "src/mock-server/**/*",
          "*.test.*",
          "*/__mocks__/*"
        ],
        reporter: ["text", "html", "lcov"],
        reportsDirectory: "reports/vite-coverage",
        enabled: false
      },

      clearMocks: true,
      mockReset: true,
      restoreMocks: true,
      unstubGlobals: true,
      unstubEnvs: true
    }
  };
});
