/**
 * Core domain types for Atomic Explorer.
 *
 * These describe the shape of the local element dataset consumed by the
 * periodic table, element detail pages, and (later) the atom visualization.
 */

/** Broad chemical category, used for color-coding the periodic table. */
export type ElementCategory =
  | "alkali-metal"
  | "alkaline-earth-metal"
  | "transition-metal"
  | "post-transition-metal"
  | "metalloid"
  | "reactive-nonmetal"
  | "noble-gas"
  | "lanthanide"
  | "actinide"
  | "unknown";

/** Orbital block the element's valence electrons occupy. */
export type ElementBlock = "s" | "p" | "d" | "f";

/** Physical state at room temperature (298 K). */
export type ElementPhase = "solid" | "liquid" | "gas" | "unknown";

/**
 * Richer physical, chemical, and historical properties for an element.
 *
 * Numeric fields are `null` where no reliable measured value exists — chiefly
 * the short-lived synthetic superheavy elements, whose bulk properties are
 * unmeasured or only theoretically predicted.
 */
export type ElementProperties = {
  /** State at room temperature (298 K). "unknown" for unmeasured superheavies. */
  phase: ElementPhase;
  /** Melting point in kelvin. */
  meltingPoint: number | null;
  /** Boiling point in kelvin. */
  boilingPoint: number | null;
  /** Density at room temperature in g/cm³ (gases measured at STP). */
  density: number | null;
  /** Pauling electronegativity. */
  electronegativity: number | null;
  /** Empirical atomic radius in picometres. */
  atomicRadius: number | null;
  /** First ionization energy in kJ/mol. */
  ionizationEnergy: number | null;
  /** Year of discovery/isolation; `null` for elements known since antiquity. */
  yearDiscovered: number | null;
  /** Person or team credited with the discovery. */
  discoveredBy: string | null;
  /** Short note on where the element's name comes from. */
  nameOrigin: string;
  /** One-line summary of notable real-world uses. */
  uses: string;
};

/**
 * A single chemical element.
 *
 * `x`/`y` are 1-based grid coordinates used to lay the element out on the
 * periodic table (18 columns wide; lanthanides/actinides sit on rows 9/10).
 * `shells` lists electron count per shell, innermost first, e.g. Na => [2, 8, 1].
 */
export type Element = {
  atomicNumber: number;
  symbol: string;
  name: string;
  /** Standard atomic weight (u). Bracketed for elements with no stable isotope. */
  atomicMass: string;
  category: ElementCategory;
  /** Group (column) 1–18, or null for f-block (lanthanides/actinides). */
  group: number | null;
  /** Period (row) 1–7. */
  period: number;
  block: ElementBlock;
  /** 1-based column for table layout. */
  x: number;
  /** 1-based row for table layout (9 = lanthanides, 10 = actinides). */
  y: number;
  /** Standard electron configuration, noble-gas shorthand, e.g. "[Ne] 3s2 3p1". */
  electronConfiguration: string;
  /** Electron count per shell, innermost first. */
  shells: number[];
  /** Short, one-sentence summary shown in previews and on the detail page. */
  summary: string;
  /** Richer physical, chemical, and historical properties. */
  properties: ElementProperties;
};
