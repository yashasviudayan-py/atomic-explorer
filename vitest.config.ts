import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// vitest 3.2 bundles vite 7 while the plugins resolve vite 8; their Plugin
// types differ only structurally, so tsc rejects passing one to the other.
// This is a build-time typing concern only — the plugins run fine — so we
// widen the array here rather than pin conflicting vite versions.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const plugins = [tsconfigPaths(), react()] as any;

/**
 * Vitest configuration for Atomic Explorer.
 *
 * - `tsconfigPaths` mirrors the `@/*` alias from tsconfig so tests import the
 *   same way the app does.
 * - `react` enables JSX/TSX transform for interaction tests.
 * - jsdom gives component tests a DOM, and pure-logic tests run fine in it too.
 * - `setupFiles` wires up jest-dom matchers and per-test cleanup.
 */
export default defineConfig({
  plugins,
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    css: false,
    coverage: {
      provider: "v8",
      include: ["src/lib/**", "src/components/**/*Utils.ts"],
      reporter: ["text", "html"],
    },
  },
});
