/**
 * Pure helpers and shared types for the Bohr-style 3D atom visualization.
 *
 * Everything here is deterministic and framework-agnostic: given the same
 * inputs it returns the same particle layout, so nothing jitters between
 * renders. Distances are in arbitrary "scene units" tuned to look good with
 * the camera and shell radii defined below.
 *
 * This is an educational Bohr model, not a quantum-accurate simulation.
 * Real electron behaviour is described by quantum-mechanical probability
 * orbitals; the orbiting shells here are a readable teaching abstraction.
 */

import type { Element } from "@/types/element";
import type { Isotope } from "@/types/isotope";
import { ISOTOPE_DATA } from "@/data/isotopes";

/** A clickable particle category surfaced in the info panel. */
export type ParticleType = "proton" | "neutron" | "electron" | "shell";

/** Currently inspected particle, or `null` for the general overview. */
export type SelectedParticle = ParticleType | null;

/**
 * Visual emphasis mode for the 3D scene. All modes show the same educational
 * Bohr atom; they only shift which parts are emphasised.
 * - `bohr`: balanced, textbook view.
 * - `particle-focus`: nucleus protons/neutrons slightly emphasised.
 * - `shell-focus`: orbit rings and electrons slightly emphasised.
 */
export type AtomVisualMode = "bohr" | "particle-focus" | "shell-focus";

/** One nucleon with a fixed, deterministic position inside the nucleus. */
export interface NucleusParticle {
  id: string;
  type: "proton" | "neutron";
  position: [number, number, number];
}

/** Display counts after any performance cap, plus whether a cap was applied. */
export interface NucleusDisplayCounts {
  protons: number;
  neutrons: number;
  capped: boolean;
}

/**
 * Accent palette for particles. Warm rose/plasma for protons, cool cyan for
 * neutrons, electric blue-white for electrons — all chosen to glow on OLED
 * black without reading as a childish rainbow.
 */
export const PARTICLE_COLORS = {
  proton: { color: "#ff5d7e", emissive: "#ff1f4f" },
  neutron: { color: "#5fc8ff", emissive: "#1f7fd6" },
  electron: { color: "#cdeeff", emissive: "#38bdf8" },
  shell: { color: "#6fd6ff", emissive: "#2aa9ff" },
} as const;

/** Radius of an individual nucleon sphere. */
export const NUCLEON_RADIUS = 0.32;

/** Radius of an electron sphere. */
export const ELECTRON_RADIUS = 0.22;

/** Base radius of the innermost electron shell. */
export const SHELL_BASE_RADIUS = 2.6;

/** Additional radius per outer shell. */
export const SHELL_GAP = 1.25;

/**
 * Cap on nucleons actually rendered. Nuclei up to this size show every
 * individual nucleon; larger nuclei (e.g. uranium ≈ 238) would otherwise spawn
 * hundreds of meshes, so we show a representative cluster of this many
 * particles while the info panel always reports the true counts.
 */
export const MAX_NUCLEUS_PARTICLES = 80;

/** Discrete animation-speed multipliers exposed by the controls panel. */
export const SPEED_OPTIONS = [0, 0.5, 1, 1.5, 2] as const;

/** A selectable animation-speed multiplier. */
export type SpeedOption = (typeof SPEED_OPTIONS)[number];

/**
 * Parse a numeric mass out of a standard-atomic-weight string.
 * Handles plain decimals ("1.008", "12.011"), bracketed most-stable isotopes
 * ("[98]", "[294]"), and stray characters. Returns `null` when nothing
 * numeric can be found, so callers can decide how to fall back.
 */
export function parseAtomicMass(atomicMass: string): number | null {
  const match = atomicMass.match(/-?\d+(?:\.\d+)?/);
  if (!match) return null;
  const value = Number.parseFloat(match[0]);
  return Number.isFinite(value) ? value : null;
}

/**
 * Best-effort mass number for an element. Uses the parsed standard atomic mass
 * when available, otherwise falls back to roughly twice the atomic number
 * (a reasonable approximation for light-to-mid elements). Never returns less
 * than the atomic number, so neutron counts can't go negative.
 */
export function getApproximateMassNumber(
  atomicMass: string,
  atomicNumber: number,
): number {
  const parsed = parseAtomicMass(atomicMass);
  const massNumber =
    parsed === null ? atomicNumber * 2 : Math.round(parsed);
  return Math.max(atomicNumber, massNumber);
}

/**
 * Approximate neutron count for a neutral atom: rounded mass number minus the
 * proton count, clamped to at least 0.
 */
export function getNeutronCount(atomicNumber: number, atomicMass: string): number {
  const massNumber = getApproximateMassNumber(atomicMass, atomicNumber);
  return Math.max(0, massNumber - atomicNumber);
}

/**
 * Generate an approximate fallback isotope for elements without curated data,
 * derived from the rounded standard atomic mass. Always flagged
 * `isApproximate` and worded carefully so the UI never presents it as exact.
 * Elements with a bracketed atomic mass (no stable isotope) are marked
 * unstable.
 */
export function getFallbackIsotope(element: Element): Isotope {
  const protons = element.atomicNumber;
  const massNumber = getApproximateMassNumber(element.atomicMass, protons);
  const neutrons = Math.max(0, massNumber - protons);
  const noStableIsotope = element.atomicMass.trim().startsWith("[");
  return {
    symbol: `${element.symbol}-${massNumber}`,
    elementSymbol: element.symbol,
    massNumber,
    protons,
    neutrons,
    electrons: protons,
    label: `${element.name}-${massNumber}`,
    isStable: !noStableIsotope,
    isApproximate: true,
    description: noStableIsotope
      ? `Approximate model. ${element.name} has no stable isotope; this representative nucleus is estimated from its standard atomic mass (${element.atomicMass}).`
      : `Approximate model: a representative ${element.name} nucleus estimated from the standard atomic mass (${element.atomicMass}). Curated isotope data for this element isn't available yet.`,
  };
}

/**
 * All isotopes to offer for an element: curated data when present (ordered by
 * mass number), otherwise a single approximate fallback isotope.
 */
export function getIsotopesForElement(element: Element): Isotope[] {
  const curated = ISOTOPE_DATA[element.symbol];
  if (curated && curated.length > 0) return curated;
  return [getFallbackIsotope(element)];
}

/** Human-readable label for an isotope, e.g. "Carbon-12". */
export function formatIsotopeLabel(isotope: Isotope): string {
  return isotope.label;
}

/** Particle counts for a neutral atom of the given isotope. */
export function getParticleCountsFromIsotope(isotope: Isotope): {
  protons: number;
  neutrons: number;
  electrons: number;
} {
  return {
    protons: isotope.protons,
    neutrons: isotope.neutrons,
    electrons: isotope.electrons,
  };
}

/**
 * Scale proton/neutron counts down proportionally when the true total would
 * exceed {@link MAX_NUCLEUS_PARTICLES}. Both kinds keep at least one sphere so
 * the cluster still reads as a mix.
 */
export function getNucleusDisplayCounts(
  protons: number,
  neutrons: number,
): NucleusDisplayCounts {
  const total = protons + neutrons;
  if (total <= MAX_NUCLEUS_PARTICLES) {
    return { protons, neutrons, capped: false };
  }
  const scale = MAX_NUCLEUS_PARTICLES / total;
  const displayProtons = protons > 0 ? Math.max(1, Math.round(protons * scale)) : 0;
  const displayNeutrons = neutrons > 0 ? Math.max(1, Math.round(neutrons * scale)) : 0;
  return { protons: displayProtons, neutrons: displayNeutrons, capped: true };
}

/**
 * Deterministically arrange nucleons in a packed ball using a 3D golden-angle
 * spiral. Protons and neutrons are interleaved by ratio so colors mix evenly.
 * Identical inputs always yield identical positions — no per-render randomness.
 */
export function getNucleusParticles(
  protons: number,
  neutrons: number,
): NucleusParticle[] {
  const total = protons + neutrons;
  if (total <= 0) return [];

  // Interleave types by their running ratio for an even color mix.
  const types: ("proton" | "neutron")[] = [];
  let p = protons;
  let n = neutrons;
  while (p > 0 || n > 0) {
    if (p > 0 && (p >= n || n === 0)) {
      types.push("proton");
      p -= 1;
    } else {
      types.push("neutron");
      n -= 1;
    }
  }

  if (total === 1) {
    return [{ id: `${types[0]}-0`, type: types[0], position: [0, 0, 0] }];
  }

  const clusterRadius = 0.62 * Math.cbrt(total);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  return types.map((type, i) => {
    // Surface direction via Fibonacci sphere, radius via cube-root for a
    // filled ball rather than a hollow shell.
    const y = 1 - (2 * (i + 0.5)) / total;
    const radial = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * i;
    const r = clusterRadius * Math.cbrt((i + 0.5) / total);
    return {
      id: `${type}-${i}`,
      type,
      position: [
        Math.cos(theta) * radial * r,
        y * r,
        Math.sin(theta) * radial * r,
      ] as [number, number, number],
    };
  });
}

/** Radius of the electron shell at the given 0-based index. */
export function getElectronShellRadius(shellIndex: number): number {
  return SHELL_BASE_RADIUS + shellIndex * SHELL_GAP;
}

/**
 * Static tilt (Euler XYZ, radians) orienting a shell's orbit plane. Shell 0 is
 * flat horizontal; subsequent shells tilt in gently alternating directions for
 * a layered 3D look without becoming chaotic.
 */
export function getShellTilt(shellIndex: number): [number, number, number] {
  switch (shellIndex) {
    case 0:
      return [0, 0, 0];
    case 1:
      return [0.42, 0, 0.22];
    case 2:
      return [-0.42, 0, -0.22];
    default: {
      const i = shellIndex;
      return [
        Math.sin(i * 1.3) * 0.5,
        i * 0.3,
        Math.cos(i * 1.1) * 0.4,
      ];
    }
  }
}

/**
 * Position of an electron evenly spaced around a shell of the given radius,
 * lying in the shell's local XZ plane (orbital motion is applied by rotating
 * the parent group, so these stay constant).
 */
export function getElectronPosition(
  index: number,
  count: number,
  radius: number,
): [number, number, number] {
  const angle = (index / Math.max(1, count)) * Math.PI * 2;
  return [Math.cos(angle) * radius, 0, Math.sin(angle) * radius];
}

/**
 * Per-shell angular speed (radians/sec at normal speed). Inner shells orbit
 * faster and directions alternate, mirroring the readable textbook Bohr feel.
 */
export function getShellAngularSpeed(shellIndex: number): number {
  const base = 0.55 / (1 + shellIndex * 0.28);
  return shellIndex % 2 === 0 ? base : -base;
}
