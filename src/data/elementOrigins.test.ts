import { describe, expect, it } from "vitest";
import { ELEMENTS } from "@/data/elements";
import {
  COSMIC_EPOCHS,
  ELEMENT_ORIGINS,
  ORIGIN_CATEGORIES,
  ORIGIN_CATEGORY_BY_ID,
  getOriginBySymbol,
} from "@/data/elementOrigins";

describe("element origins", () => {
  it("covers every element exactly once, in atomic-number order", () => {
    expect(ELEMENT_ORIGINS.map((entry) => entry.symbol)).toEqual(
      ELEMENTS.map((element) => element.symbol),
    );
  });

  it("resolves a category for every primary and secondary source", () => {
    for (const entry of ELEMENT_ORIGINS) {
      expect(ORIGIN_CATEGORY_BY_ID[entry.primarySource]).toBeDefined();
      for (const source of entry.secondarySources ?? []) {
        expect(ORIGIN_CATEGORY_BY_ID[source]).toBeDefined();
      }
    }
  });

  it("never lists a secondary source that repeats the primary one", () => {
    for (const entry of ELEMENT_ORIGINS) {
      expect(entry.secondarySources ?? []).not.toContain(entry.primarySource);
    }
  });

  it("gives every element a non-empty explanation", () => {
    for (const entry of ELEMENT_ORIGINS) {
      expect(entry.explanation.length).toBeGreaterThan(20);
    }
  });

  it("looks elements up case-insensitively", () => {
    expect(getOriginBySymbol("au")?.primarySource).toBe("neutron-star-merger");
    expect(getOriginBySymbol("H")?.primarySource).toBe("big-bang");
    expect(getOriginBySymbol("Zz")).toBeUndefined();
  });

  it("keeps the origin palette and the timeline in sync", () => {
    const ids = new Set(ORIGIN_CATEGORIES.map((category) => category.id));
    for (const epoch of COSMIC_EPOCHS) {
      expect(ids.has(epoch.source)).toBe(true);
    }
  });
});
