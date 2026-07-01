/**
 * Pure comparison helpers for the Element Comparison dashboard.
 *
 * Everything here is deterministic and framework-agnostic: given two elements
 * it derives the numbers, deltas, and simplified educational scores the compare
 * UI renders. It leans on the existing atom utilities for isotope/neutron logic
 * so the comparison stays consistent with the 3D explorer.
 *
 * Scientific honesty: neutron counts come from a *representative* isotope. When
 * curated isotope data isn't available we fall back to a value estimated from
 * the standard atomic mass, and the returned data flags this as approximate so
 * the UI never presents it as exact. Electron counts assume a neutral atom.
 */

import type { Element } from "@/types/element";
import type { Isotope } from "@/types/isotope";
import { CATEGORY_META } from "@/lib/elementCategories";
import {
  getApproximateMassNumber,
  getFallbackIsotope,
  getIsotopesForElement,
  getNeutronCount,
  parseAtomicMass,
} from "@/components/atom/atomUtils";

/** Which side of the comparison a value favors. */
export type ComparisonSide = "left" | "right" | "equal";

/** A single numeric metric compared across the two elements. */
export interface MetricComparison {
  /** Human label, e.g. "Atomic number". */
  label: string;
  leftValue: number;
  rightValue: number;
  /** Absolute difference between the two sides. */
  difference: number;
  /** Which side is larger (or "equal"). */
  greater: ComparisonSide;
  /**
   * True when at least one side's value is derived from an approximate
   * (standard-mass) isotope rather than curated data. Used to surface a
   * "≈ approximate" hint in the UI.
   */
  approximate?: boolean;
}

/**
 * A representative isotope for an element: the first curated *stable* isotope
 * when available, otherwise the first curated isotope, otherwise the
 * approximate standard-mass fallback (flagged `isApproximate`). This is the
 * "common/approximate" isotope the comparison uses for neutron counts.
 */
export function getRepresentativeIsotope(element: Element): Isotope {
  const isotopes = getIsotopesForElement(element);
  const stable = isotopes.find((iso) => iso.isStable);
  return stable ?? isotopes[0] ?? getFallbackIsotope(element);
}

/** True when an element has no curated isotope data (uses the fallback model). */
export function usesApproximateIsotope(element: Element): boolean {
  return Boolean(getRepresentativeIsotope(element).isApproximate);
}

/** Difference in atomic number (proton count) between the two elements. */
export function getAtomicNumberDifference(
  left: Element,
  right: Element,
): MetricComparison {
  return buildMetric(
    "Atomic number",
    left.atomicNumber,
    right.atomicNumber,
  );
}

/**
 * Difference in standard atomic mass. Falls back to an approximate mass number
 * when a mass can't be parsed, and flags the result approximate in that case.
 */
export function getMassDifference(
  left: Element,
  right: Element,
): MetricComparison {
  const leftMass =
    parseAtomicMass(left.atomicMass) ??
    getApproximateMassNumber(left.atomicMass, left.atomicNumber);
  const rightMass =
    parseAtomicMass(right.atomicMass) ??
    getApproximateMassNumber(right.atomicMass, right.atomicNumber);
  const approximate =
    parseAtomicMass(left.atomicMass) === null ||
    parseAtomicMass(right.atomicMass) === null;
  // Round the deltas to keep the UI readable while preserving mass precision.
  const rounded = (n: number) => Math.round(n * 1000) / 1000;
  return {
    ...buildMetric("Atomic mass (u)", rounded(leftMass), rounded(rightMass)),
    approximate,
  };
}

/**
 * Proton, electron (neutral atom), and representative-neutron comparison.
 * Neutron counts come from {@link getRepresentativeIsotope} and are flagged
 * approximate when either side relies on the standard-mass fallback.
 */
export function getParticleComparison(
  left: Element,
  right: Element,
): {
  protons: MetricComparison;
  electrons: MetricComparison;
  neutrons: MetricComparison;
} {
  const leftNeutrons = getRepresentativeIsotope(left).neutrons;
  const rightNeutrons = getRepresentativeIsotope(right).neutrons;
  const neutronApproximate =
    usesApproximateIsotope(left) || usesApproximateIsotope(right);

  return {
    protons: buildMetric("Protons", left.atomicNumber, right.atomicNumber),
    // Neutral atom: electron count equals proton count.
    electrons: buildMetric("Electrons", left.atomicNumber, right.atomicNumber),
    neutrons: {
      ...buildMetric("Neutrons", leftNeutrons, rightNeutrons),
      approximate: neutronApproximate,
    },
  };
}

/** A shell rendered side by side, with whether the two sides differ. */
export interface ShellRow {
  /** 1-based shell number. */
  shellNumber: number;
  /** Electron count on the left element's shell, or null if it has no such shell. */
  leftCount: number | null;
  /** Electron count on the right element's shell, or null. */
  rightCount: number | null;
  /** True when the two counts differ (including one side being absent). */
  differs: boolean;
}

/**
 * Align the two elements' shell distributions into rows, padding the shorter
 * list with nulls so every shell number present on either side has a row.
 */
export function getShellComparison(
  left: Element,
  right: Element,
): {
  rows: ShellRow[];
  leftShells: number[];
  rightShells: number[];
  /** Highest electron count across both elements, for bar scaling. */
  maxCount: number;
} {
  const shellCount = Math.max(left.shells.length, right.shells.length);
  const rows: ShellRow[] = [];
  let maxCount = 1;

  for (let i = 0; i < shellCount; i++) {
    const leftCount = i < left.shells.length ? left.shells[i] : null;
    const rightCount = i < right.shells.length ? right.shells[i] : null;
    maxCount = Math.max(maxCount, leftCount ?? 0, rightCount ?? 0);
    rows.push({
      shellNumber: i + 1,
      leftCount,
      rightCount,
      differs: leftCount !== rightCount,
    });
  }

  return { rows, leftShells: left.shells, rightShells: right.shells, maxCount };
}

/** Category / block / period / group sameness between two elements. */
export interface CategoryComparison {
  sameCategory: boolean;
  sameBlock: boolean;
  samePeriod: boolean;
  /** Only meaningful when both elements have a defined group. */
  sameGroup: boolean;
  /** True when either element has no group (f-block), so group can't compare. */
  groupUndefined: boolean;
  leftCategoryLabel: string;
  rightCategoryLabel: string;
}

/** Compare the two elements' category, block, period, and group. */
export function getCategoryComparison(
  left: Element,
  right: Element,
): CategoryComparison {
  const groupUndefined = left.group === null || right.group === null;
  return {
    sameCategory: left.category === right.category,
    sameBlock: left.block === right.block,
    samePeriod: left.period === right.period,
    sameGroup: !groupUndefined && left.group === right.group,
    groupUndefined,
    leftCategoryLabel: CATEGORY_META[left.category].label,
    rightCategoryLabel: CATEGORY_META[right.category].label,
  };
}

/**
 * A deliberately simplified, educational "structural complexity" score
 * (roughly 0–100). It blends proton count, shell count, orbital block, and an
 * approximate neutron count so heavier, higher-block atoms read as more
 * complex. This is a teaching heuristic, NOT a physical quantity.
 */
export function getComplexityScore(element: Element): number {
  // Block weight: filling higher subshells adds structural richness.
  const blockWeight = { s: 0, p: 1, d: 2, f: 3 }[element.block] ?? 0;
  const neutrons = getNeutronCount(element.atomicNumber, element.atomicMass);

  const raw =
    element.atomicNumber * 0.55 +
    element.shells.length * 5 +
    blockWeight * 6 +
    neutrons * 0.2;

  // Squash into a friendly 0–100 range; the divisor keeps uranium-class atoms
  // near the top without letting light atoms bunch up at zero.
  const score = Math.round((raw / 2.2) * 10) / 10;
  return Math.max(0, Math.min(100, score));
}

/** Everything the dashboard needs to compare two elements in one call. */
export interface ElementComparison {
  left: Element;
  right: Element;
  atomicNumber: MetricComparison;
  mass: MetricComparison;
  particles: ReturnType<typeof getParticleComparison>;
  shells: ReturnType<typeof getShellComparison>;
  category: CategoryComparison;
  complexity: {
    left: number;
    right: number;
    difference: number;
    greater: ComparisonSide;
  };
  /** True when the two selectors point at the same element. */
  sameElement: boolean;
}

/** Aggregate every comparison the dashboard needs for a pair of elements. */
export function getElementComparison(
  left: Element,
  right: Element,
): ElementComparison {
  const leftComplexity = getComplexityScore(left);
  const rightComplexity = getComplexityScore(right);
  return {
    left,
    right,
    atomicNumber: getAtomicNumberDifference(left, right),
    mass: getMassDifference(left, right),
    particles: getParticleComparison(left, right),
    shells: getShellComparison(left, right),
    category: getCategoryComparison(left, right),
    complexity: {
      left: leftComplexity,
      right: rightComplexity,
      difference: Math.abs(leftComplexity - rightComplexity),
      greater: sideOf(leftComplexity, rightComplexity),
    },
    sameElement: left.atomicNumber === right.atomicNumber,
  };
}

/** Which side is greater, comparing two numbers. */
function sideOf(leftValue: number, rightValue: number): ComparisonSide {
  if (leftValue > rightValue) return "left";
  if (rightValue > leftValue) return "right";
  return "equal";
}

/** Assemble a {@link MetricComparison} from a label and two values. */
function buildMetric(
  label: string,
  leftValue: number,
  rightValue: number,
): MetricComparison {
  return {
    label,
    leftValue,
    rightValue,
    difference: Math.abs(leftValue - rightValue),
    greater: sideOf(leftValue, rightValue),
  };
}
