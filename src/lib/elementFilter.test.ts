import { describe, it, expect } from "vitest";
import { matchesQuery, matchesFilters } from "./elementFilter";
import { getElementBySymbol } from "@/data/elements";

const carbon = getElementBySymbol("C")!;
const oxygen = getElementBySymbol("O")!;

describe("matchesQuery", () => {
  it("matches every element on an empty or whitespace query", () => {
    expect(matchesQuery(carbon, "")).toBe(true);
    expect(matchesQuery(carbon, "   ")).toBe(true);
  });

  it("matches on element name, case-insensitively", () => {
    expect(matchesQuery(carbon, "carbon")).toBe(true);
    expect(matchesQuery(carbon, "CARB")).toBe(true);
    expect(matchesQuery(carbon, "oxygen")).toBe(false);
  });

  it("matches on chemical symbol", () => {
    expect(matchesQuery(carbon, "c")).toBe(true);
    expect(matchesQuery(oxygen, "O")).toBe(true);
    expect(matchesQuery(oxygen, "c")).toBe(false);
  });

  it("matches on exact and prefix atomic number", () => {
    expect(matchesQuery(carbon, "6")).toBe(true); // carbon is 6
    const iron = getElementBySymbol("Fe")!; // 26
    expect(matchesQuery(iron, "2")).toBe(true); // prefix of 26
    expect(matchesQuery(iron, "26")).toBe(true);
    expect(matchesQuery(iron, "27")).toBe(false);
  });

  it("trims surrounding whitespace before matching", () => {
    expect(matchesQuery(carbon, "  carbon  ")).toBe(true);
  });
});

describe("matchesFilters", () => {
  it("passes when category is 'all' and the query matches", () => {
    expect(matchesFilters(carbon, "carb", "all")).toBe(true);
  });

  it("requires both the category and the query to match", () => {
    expect(matchesFilters(carbon, "carbon", "reactive-nonmetal")).toBe(true);
    // Right query, wrong category.
    expect(matchesFilters(carbon, "carbon", "noble-gas")).toBe(false);
    // Right category, wrong query.
    expect(matchesFilters(carbon, "oxygen", "reactive-nonmetal")).toBe(false);
  });
});
