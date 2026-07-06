import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  getLessonProgress,
  markLessonComplete,
  isLessonComplete,
  getCompletedLessonCount,
  getProgressPercentage,
} from "./lessonProgress";

const STORAGE_KEY = "atomic-explorer:lesson-progress";

describe("lessonProgress", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns empty progress when nothing is stored", () => {
    expect(getLessonProgress()).toEqual({ completedSlugs: [] });
    expect(getCompletedLessonCount()).toBe(0);
  });

  it("marks a lesson complete and persists it", () => {
    markLessonComplete("what-is-an-atom");
    expect(isLessonComplete("what-is-an-atom")).toBe(true);
    expect(getCompletedLessonCount()).toBe(1);
    // Backed by localStorage under the shared key.
    expect(window.localStorage.getItem(STORAGE_KEY)).toContain(
      "what-is-an-atom",
    );
  });

  it("is idempotent — completing the same lesson twice keeps one entry", () => {
    markLessonComplete("isotopes");
    markLessonComplete("isotopes");
    expect(getCompletedLessonCount()).toBe(1);
  });

  it("preserves completion order across multiple lessons", () => {
    markLessonComplete("a");
    markLessonComplete("b");
    markLessonComplete("c");
    expect(getLessonProgress().completedSlugs).toEqual(["a", "b", "c"]);
  });

  it("recovers gracefully from corrupt stored JSON", () => {
    window.localStorage.setItem(STORAGE_KEY, "{not valid json");
    expect(getLessonProgress()).toEqual({ completedSlugs: [] });
  });

  it("ignores non-string slugs in stored data", () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ completedSlugs: ["ok", 42, null, "fine"] }),
    );
    expect(getLessonProgress().completedSlugs).toEqual(["ok", "fine"]);
  });

  it("ignores a stored object with the wrong shape", () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ foo: "bar" }));
    expect(getLessonProgress()).toEqual({ completedSlugs: [] });
  });

  describe("getProgressPercentage", () => {
    it("returns 0 when the total is zero or negative", () => {
      expect(getProgressPercentage(0)).toBe(0);
      expect(getProgressPercentage(-5)).toBe(0);
    });

    it("computes a rounded percentage against the total", () => {
      markLessonComplete("a");
      expect(getProgressPercentage(4)).toBe(25);
      markLessonComplete("b");
      expect(getProgressPercentage(3)).toBe(67); // 2/3 rounded
    });

    it("caps completed at the total so it never exceeds 100", () => {
      markLessonComplete("a");
      markLessonComplete("b");
      markLessonComplete("c");
      expect(getProgressPercentage(2)).toBe(100);
    });
  });

  describe("SSR / unavailable storage safety", () => {
    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it("returns empty progress and no-ops when window is undefined", () => {
      vi.stubGlobal("window", undefined);
      expect(getLessonProgress()).toEqual({ completedSlugs: [] });
      // Should not throw.
      expect(() => markLessonComplete("x")).not.toThrow();
    });
  });
});
