/**
 * Types for the simplified cosmic-origin model used by the /origins story.
 *
 * Real nucleosynthesis is a blend of overlapping channels: almost every element
 * heavier than helium arrives from more than one astrophysical process, in
 * proportions that are still an active research question. This model records a
 * single dominant channel per element (plus notable secondary channels) purely
 * so the origin map can be colored and read at a glance. `confidence` records
 * how much that flattening cost us.
 */

/** A production channel for atomic nuclei. */
export type ElementOriginSource =
  | "big-bang"
  | "stellar-fusion"
  | "supernova"
  | "neutron-star-merger"
  | "cosmic-ray-spallation"
  | "human-synthesis"
  | "multiple";

/** Presentation metadata for one origin channel. */
export type ElementOriginCategory = {
  id: ElementOriginSource;
  /** Full name, used in the legend and the readout panel. */
  label: string;
  /** Compact name for tight spaces (chips, filter pills). */
  shortLabel: string;
  description: string;
  /**
   * CSS class that sets `--origin-accent` and `--origin-tint` on the element.
   * Defined in globals.css so 118 chips share one paint, not 118 inline styles.
   */
  accentClass: string;
};

/**
 * How well a single dominant source describes this element.
 *
 * - `high` — one channel clearly dominates and is well established.
 * - `medium` — one channel dominates, but the split is model-dependent.
 * - `simplified` — the real answer is a genuine mixture; treat the color as a
 *   label of convenience, not a measurement.
 */
export type ElementOriginConfidence = "high" | "medium" | "simplified";

/** The origin story for a single element, keyed by chemical symbol. */
export type ElementOriginEntry = {
  symbol: string;
  primarySource: ElementOriginSource;
  secondarySources?: ElementOriginSource[];
  /** One sentence, written for a curious reader rather than a specialist. */
  explanation: string;
  confidence: ElementOriginConfidence;
};

/** A milestone in the chemical history of the universe. */
export type CosmicEpoch = {
  id: string;
  /** When it happened, relative to the Big Bang or to now. */
  time: string;
  title: string;
  description: string;
  /** Drives the epoch's accent color, reusing the origin palette. */
  source: ElementOriginSource;
};
