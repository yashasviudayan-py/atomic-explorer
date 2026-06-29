/**
 * Isotope domain type for Atomic Explorer.
 *
 * An isotope is a variant of an element with the same proton count (atomic
 * number) but a different neutron count, and therefore a different mass number.
 * For a neutral atom the electron count equals the proton count.
 *
 * Curated isotope data is intentionally simplified for educational
 * visualization. Where curated data is unavailable, a fallback isotope is
 * generated from the element's standard atomic mass and flagged with
 * `isApproximate` so the UI never presents it as exact.
 */
export type Isotope = {
  /** Compact identifier, e.g. "C-12". */
  symbol: string;
  /** Parent element symbol, e.g. "C". */
  elementSymbol: string;
  /** Mass number (protons + neutrons), e.g. 12 for Carbon-12. */
  massNumber: number;
  /** Proton count — equals the element's atomic number. */
  protons: number;
  /** Neutron count — massNumber − atomicNumber, never negative. */
  neutrons: number;
  /** Electron count for a neutral atom — equals the proton count. */
  electrons: number;
  /** Human-readable label, e.g. "Carbon-12". */
  label: string;
  /** Natural abundance, when confidently known, e.g. "98.9%". */
  abundance?: string;
  /** Half-life for unstable isotopes, e.g. "5,730 years". */
  halfLife?: string;
  /** Whether the isotope is stable (non-radioactive). */
  isStable: boolean;
  /** Short, educational description. */
  description: string;
  /**
   * True when this isotope was generated from the element's standard atomic
   * mass rather than curated data. Such values are approximate and the UI
   * surfaces an "Approximate model" badge for them.
   */
  isApproximate?: boolean;
};
