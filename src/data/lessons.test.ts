import { describe, it, expect } from "vitest";
import {
  LESSONS,
  getSortedLessons,
  getLessonBySlug,
  getAdjacentLessons,
} from "./lessons";
import { getElementBySymbol } from "./elements";

describe("LESSONS dataset", () => {
  it("has at least one lesson", () => {
    expect(LESSONS.length).toBeGreaterThan(0);
  });

  it("has unique slugs and unique order values", () => {
    const slugs = new Set(LESSONS.map((l) => l.slug));
    const orders = new Set(LESSONS.map((l) => l.order));
    expect(slugs.size).toBe(LESSONS.length);
    expect(orders.size).toBe(LESSONS.length);
  });

  it("gives every lesson at least one step with content", () => {
    for (const lesson of LESSONS) {
      expect(lesson.steps.length, `${lesson.slug} steps`).toBeGreaterThan(0);
      for (const step of lesson.steps) {
        expect(step.title.length).toBeGreaterThan(0);
        expect(step.body.length).toBeGreaterThan(0);
      }
    }
  });

  it("has valid, well-formed checkpoints where present", () => {
    for (const lesson of LESSONS) {
      for (const step of lesson.steps) {
        if (step.type !== "checkpoint") continue;
        expect(step.checkpoint, `${lesson.slug}/${step.id}`).toBeDefined();
        const options = step.checkpoint!.options;
        expect(options.length).toBeGreaterThanOrEqual(2);
        // Exactly one correct answer, and every option teaches on selection.
        expect(options.filter((o) => o.isCorrect)).toHaveLength(1);
        expect(options.every((o) => o.explanation.length > 0)).toBe(true);
        // Option ids are unique within a checkpoint.
        expect(new Set(options.map((o) => o.id)).size).toBe(options.length);
      }
    }
  });

  it("references only real element symbols", () => {
    for (const lesson of LESSONS) {
      const symbols = [
        ...lesson.relatedElementSymbols,
        ...lesson.steps.flatMap((s) => s.relatedElementSymbols ?? []),
      ];
      for (const symbol of symbols) {
        expect(
          getElementBySymbol(symbol),
          `${lesson.slug} references unknown element ${symbol}`,
        ).toBeDefined();
      }
    }
  });
});

describe("lesson navigation helpers", () => {
  it("sorts lessons by ascending order", () => {
    const sorted = getSortedLessons();
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i].order).toBeGreaterThan(sorted[i - 1].order);
    }
  });

  it("looks up a lesson by exact slug", () => {
    const first = getSortedLessons()[0];
    expect(getLessonBySlug(first.slug)?.slug).toBe(first.slug);
    expect(getLessonBySlug("no-such-lesson")).toBeUndefined();
  });

  it("resolves adjacent lessons at the boundaries", () => {
    const sorted = getSortedLessons();
    const firstNav = getAdjacentLessons(sorted[0].slug);
    expect(firstNav.previous).toBeNull();
    if (sorted.length > 1) {
      expect(firstNav.next?.slug).toBe(sorted[1].slug);
    }

    const lastNav = getAdjacentLessons(sorted[sorted.length - 1].slug);
    expect(lastNav.next).toBeNull();

    // Unknown slug yields no neighbours.
    expect(getAdjacentLessons("nope")).toEqual({ previous: null, next: null });
  });
});
