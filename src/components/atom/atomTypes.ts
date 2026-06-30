/**
 * Shared type vocabulary for the 3D atom explorer.
 *
 * These types are intentionally framework-agnostic and live apart from
 * {@link ./atomUtils} so every atom component — Bohr or quantum — can import a
 * single, consolidated definition. `atomUtils` re-exports them for backwards
 * compatibility, so existing `from "./atomUtils"` imports keep working.
 */

/**
 * Which conceptual model the explorer is rendering.
 * - `bohr`: the educational Bohr-style model (nucleus, shells, orbiting electrons).
 * - `quantum`: a simplified probability-cloud view inspired by atomic orbitals.
 */
export type AtomicModelMode = "bohr" | "quantum";

/**
 * Visual emphasis applied on top of the active model. Not every mode applies to
 * every model: Bohr uses balanced / particle-focus / shell-focus, while quantum
 * uses balanced / particle-focus / orbital-focus.
 */
export type AtomVisualMode =
  | "balanced"
  | "particle-focus"
  | "shell-focus"
  | "orbital-focus";

/** The four orbital families approximated in quantum mode. */
export type OrbitalType = "s" | "p" | "d" | "f";

/** A clickable element of the scene surfaced in the info panel. */
export type ParticleType =
  | "proton"
  | "neutron"
  | "electron"
  | "shell"
  | "orbital";

/** Currently inspected particle/region, or `null` for the general overview. */
export type SelectedParticle = ParticleType | null;
