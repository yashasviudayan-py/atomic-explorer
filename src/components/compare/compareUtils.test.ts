import { describe, it, expect } from "vitest";
import {
  getRepresentativeIsotope,
  usesApproximateIsotope,
  getAtomicNumberDifference,
  getMassDifference,
  getParticleComparison,
  getShellComparison,
  getCategoryComparison,
  getComplexityScore,
  getElementComparison,
} from "./compareUtils";
import { getElementBySymbol } from "@/data/elements";

const hydrogen = getElementBySymbol("H")!;
const carbon = getElementBySymbol("C")!;
const oxygen = getElementBySymbol("O")!;
const iron = getElementBySymbol("Fe")!;
const uranium = getElementBySymbol("U")!;

describe("getRepresentativeIsotope", () => {
  it("prefers a stable isotope when curated data exists", () => {
    const iso = getRepresentativeIsotope(carbon);
    expect(iso.elementSymbol).toBe("C");
    expect(iso.isStable).toBe(true);
  });

  it("falls back to an approximate isotope for elements without data", () => {
    const og = getElementBySymbol("Og")!;
    expect(usesApproximateIsotope(og)).toBe(true);
    expect(getRepresentativeIsotope(og).isApproximate).toBe(true);
  });
});

describe("numeric metric comparisons", () => {
  it("computes atomic-number difference and direction", () => {
    const metric = getAtomicNumberDifference(carbon, oxygen);
    expect(metric.leftValue).toBe(6);
    expect(metric.rightValue).toBe(8);
    expect(metric.difference).toBe(2);
    expect(metric.greater).toBe("right");
  });

  it("marks equal values as 'equal' with zero difference", () => {
    const metric = getAtomicNumberDifference(carbon, carbon);
    expect(metric.difference).toBe(0);
    expect(metric.greater).toBe("equal");
  });

  it("computes rounded mass difference from real masses", () => {
    const metric = getMassDifference(hydrogen, carbon);
    expect(metric.approximate).toBe(false);
    expect(metric.greater).toBe("right");
    expect(metric.difference).toBeCloseTo(12.011 - 1.008, 3);
  });
});

describe("getParticleComparison", () => {
  it("uses proton count for both protons and (neutral) electrons", () => {
    const { protons, electrons, neutrons } = getParticleComparison(
      carbon,
      oxygen,
    );
    expect(protons.leftValue).toBe(6);
    expect(electrons.leftValue).toBe(6); // neutral atom
    expect(electrons.rightValue).toBe(8);
    expect(neutrons.leftValue).toBeGreaterThan(0);
  });

  it("flags neutrons approximate when a side lacks curated data", () => {
    const og = getElementBySymbol("Og")!;
    const { neutrons } = getParticleComparison(carbon, og);
    expect(neutrons.approximate).toBe(true);
  });
});

describe("getShellComparison", () => {
  it("aligns shells and pads the shorter element with nulls", () => {
    // Hydrogen has 1 shell, iron has 4.
    const { rows } = getShellComparison(hydrogen, iron);
    expect(rows).toHaveLength(4);
    expect(rows[0].leftCount).toBe(hydrogen.shells[0]);
    expect(rows[3].leftCount).toBeNull(); // hydrogen has no 4th shell
    expect(rows[3].rightCount).toBe(iron.shells[3]);
    expect(rows[3].differs).toBe(true);
  });

  it("reports maxCount as the largest shell population across both", () => {
    const { maxCount } = getShellComparison(carbon, oxygen);
    const expected = Math.max(...carbon.shells, ...oxygen.shells);
    expect(maxCount).toBe(expected);
  });

  it("marks identical shells as not differing", () => {
    const { rows } = getShellComparison(carbon, carbon);
    expect(rows.every((r) => r.differs === false)).toBe(true);
  });
});

describe("getCategoryComparison", () => {
  it("detects shared and differing classifications", () => {
    const cmp = getCategoryComparison(carbon, oxygen);
    expect(cmp.sameCategory).toBe(true); // both reactive-nonmetal
    expect(cmp.samePeriod).toBe(true); // both period 2
    expect(cmp.leftCategoryLabel).toBe("Reactive nonmetals");
  });

  it("flags group as undefined when an f-block element is involved", () => {
    const uranium = getElementBySymbol("U")!; // f-block, group null
    const cmp = getCategoryComparison(uranium, carbon);
    expect(cmp.groupUndefined).toBe(true);
    expect(cmp.sameGroup).toBe(false);
  });
});

describe("getComplexityScore", () => {
  it("is clamped to the 0–100 range", () => {
    for (const el of [hydrogen, carbon, iron, uranium]) {
      const score = getComplexityScore(el);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    }
  });

  it("ranks heavier, higher-block atoms as more complex", () => {
    expect(getComplexityScore(uranium)).toBeGreaterThan(
      getComplexityScore(hydrogen),
    );
    expect(getComplexityScore(iron)).toBeGreaterThan(
      getComplexityScore(carbon),
    );
  });
});

describe("getElementComparison", () => {
  it("aggregates every sub-comparison and flags same-element pairs", () => {
    const cmp = getElementComparison(carbon, carbon);
    expect(cmp.sameElement).toBe(true);
    expect(cmp.atomicNumber.difference).toBe(0);
    expect(cmp.complexity.difference).toBe(0);
    expect(cmp.complexity.greater).toBe("equal");
  });

  it("wires the correct greater side into complexity", () => {
    const cmp = getElementComparison(hydrogen, uranium);
    expect(cmp.sameElement).toBe(false);
    expect(cmp.complexity.greater).toBe("right");
  });
});
