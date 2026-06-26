/**
 * Core domain types for Atomic Explorer.
 *
 * These describe the shape of element data the app will consume. The actual
 * dataset (local JSON/TS) lands in a later phase; defining the contract now
 * keeps the periodic table, element detail pages, and atom visualization in
 * sync as they are built.
 */

/** Broad chemical category, used for color-coding the periodic table. */
export type ElementCategory =
  | "alkali-metal"
  | "alkaline-earth-metal"
  | "transition-metal"
  | "post-transition-metal"
  | "metalloid"
  | "nonmetal"
  | "halogen"
  | "noble-gas"
  | "lanthanide"
  | "actinide"
  | "unknown";

/** Standard temperature-and-pressure phase of matter. */
export type ElementPhase = "solid" | "liquid" | "gas" | "unknown";

/**
 * Electron shell occupancy, ordered from the innermost shell outward.
 * e.g. Sodium (Na) => [2, 8, 1].
 */
export type ShellConfiguration = number[];

/**
 * A single chemical element. Optional fields capture data that is not defined
 * for every element (synthetic elements, for instance, often lack measured
 * physical properties).
 */
export interface Element {
  /** Atomic number (number of protons). */
  atomicNumber: number;
  /** Chemical symbol, e.g. "He". Used as the route param in /elements/[symbol]. */
  symbol: string;
  /** Full element name, e.g. "Helium". */
  name: string;
  /** Standard atomic weight (u). */
  atomicMass: number;
  category: ElementCategory;
  phase: ElementPhase;

  /** Group (column) in the periodic table, 1–18. Null for f-block placement. */
  group: number | null;
  /** Period (row) in the periodic table, 1–7. */
  period: number;

  /** Electron count per shell, innermost first. Drives the atom visualization. */
  shells: ShellConfiguration;
  /** Standard electron configuration string, e.g. "1s2 2s2 2p6". */
  electronConfiguration?: string;

  /** Short, human-friendly summary shown on the detail page. */
  summary?: string;
  /** Notable scientific facts surfaced alongside the visualization. */
  facts?: string[];

  /** Brand/accent color used for glow and highlight effects (hex). */
  accentColor?: string;
}

/**
 * Derived atomic composition for the visualization layer.
 *
 * Neutron count is the rounded mass minus the proton count for the most common
 * isotope; it is computed rather than stored so the data stays compact.
 */
export interface AtomicComposition {
  protons: number;
  neutrons: number;
  electrons: number;
  shells: ShellConfiguration;
}
