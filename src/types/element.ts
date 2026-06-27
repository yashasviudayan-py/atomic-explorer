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
};
