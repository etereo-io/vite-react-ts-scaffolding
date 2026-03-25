import path from "node:path";
import ViteYaml from "@modyfi/vite-plugin-yaml";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import removeAttr from "react-remove-attr";
import { loadEnv } from "vite";
import checker from "vite-plugin-checker";
import svgr from "vite-plugin-svgr";
import { defineConfig } from "vitest/config";
import { htmlMetaTagsPlugin } from "./src/app/features/vite-plugins/htmlMetaTagsPlugin";

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
      !process.env.VITEST
        ? checker({
            typescript: true,
            biome: {
              command: "check"
            }
          })
        : undefined,
      tailwindcss(),
      inProdMode &&
        removeAttr({
          extensions: ["tsx"],
          attributes: ["data-testid"]
        }),
      react(),
      svgr(),
      ViteYaml(),
      htmlMetaTagsPlugin()
    ],

    build: {
      sourcemap: !inProdMode,
      reportCompressedSize: false,
      rollupOptions: {
        output: {
          manualChunks: {
            "vendor-react": ["react", "react-dom", "react-router"],
            "vendor-query": ["@tanstack/react-query"],
            "vendor-i18n": ["i18next", "react-i18next"]
          }
        }
      }
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

      pool: "forks",
      minWorkers: 2,
      maxWorkers: 4,

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
          "*/__mocks__/*",
          "**/*.types.ts",
          "**/*.constants.ts",
          "**/index.tsx",
          "**/config/**",
          "**/ui/**"
        ],
        reporter: ["text", "html", "lcov"],
        reportsDirectory: "reports/vite-coverage",
        enabled: false
      },

      clearMocks: true,
      mockReset: true,
      restoreMocks: true,
      unstubGlobals: true,
      unstubEnvs: true,

      // Suppress noisy third-party console output during tests
      onConsoleLog(log) {
        if (log.includes("i18next is maintained") || log.includes("locize"))
          return false;
      }
    }
  };
});
