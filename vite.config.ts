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

      environment: "happy-dom",

      environmentOptions: {
        url: "http://localhost"
      },

      // threads: worker_thread-based pool. Cold start ~3× faster than forks
      // (no process spawn, no IPC) and the worker globals (TransformStream,
      // Web Streams, etc.) reach the test context.
      //
      // Trade-off measured in player-spa's PR #1159: threads accumulates memory
      // per worker by the end of the suite, but forks costs significant wall-clock
      // from process spawn overhead — threads wins net.
      //
      // Experiments that FAILED (do not re-attempt without reading the PR notes):
      // - `pool: "vmThreads"`: breaks MSW (TransformStream missing in VM context).
      // - `isolate: false`: `vi.mock("../sibling", ...)` factories don't override
      //   modules already cached by a previous file in the same worker (verified
      //   against Vitest 3.2.4 source: execute.B7h3T_Hc.js:264).
      // - `deps.optimizer.web`: pre-bundles axios → bypasses MSW intercept.
      //
      // Parallelism: CI runners are typically 2-4 vCPU so cap there; local dev
      // boxes usually have 8+ cores → use more workers for faster feedback.
      pool: "threads",
      poolOptions: {
        threads: { minThreads: 2, maxThreads: process.env.CI ? 4 : 8 }
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

      // NOTE: clearMocks/mockReset/restoreMocks were tried but they wipe vi.fn() inside
      // global factory mocks in vitest.setup.ts (e.g. `useFoo: vi.fn(() => true)` loses
      // the return value after the first test).
      // unstubGlobals/unstubEnvs auto-revert `vi.stubGlobal(...)` calls at module level
      // (the pattern `vi.stubGlobal("crypto", ...)` outside a beforeEach), breaking any
      // test that relies on the stub for more than the first `it`.
      // With `isolate: true` (default), per-test cleanup isn't necessary — each file
      // gets a fresh globalThis anyway.
      // See: github.com/rafanadalacademy/apps PR #1159 for full root-cause analysis.

      // Suppress noisy third-party console output during tests
      onConsoleLog(log) {
        if (log.includes("i18next is maintained") || log.includes("locize"))
          return false;
      }
    }
  };
});
