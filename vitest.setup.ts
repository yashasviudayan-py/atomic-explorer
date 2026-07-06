import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

/**
 * Deterministic in-memory Web Storage implementation.
 *
 * The jsdom build used here ships only a partial `localStorage` (no `clear`),
 * so we install a complete, self-contained one. Tests that need to simulate an
 * *unavailable* storage stub `window` directly, which this leaves untouched.
 */
class MemoryStorage implements Storage {
  private store = new Map<string, string>();

  get length(): number {
    return this.store.size;
  }
  clear(): void {
    this.store.clear();
  }
  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }
  removeItem(key: string): void {
    this.store.delete(key);
  }
  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }
}

Object.defineProperty(window, "localStorage", {
  configurable: true,
  value: new MemoryStorage(),
});

// Unmount React trees and reset localStorage between tests so component and
// lesson-progress specs start from a clean slate. localStorage may be absent
// (e.g. a spec that stubs `window` for SSR), so clearing it is best-effort.
afterEach(() => {
  cleanup();
  if (typeof window !== "undefined" && window.localStorage?.clear) {
    window.localStorage.clear();
  }
});
