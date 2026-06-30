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

import type { Element, ElementBlock } from "@/types/element";
import type { Isotope } from "@/types/isotope";
import { ISOTOPE_DATA } from "@/data/isotopes";
import type { OrbitalType } from "./atomTypes";

// Re-export the consolidated atom types so existing `from "./atomUtils"`
// imports keep resolving (the canonical definitions live in atomTypes.ts).
export type {
  AtomicModelMode,
  AtomVisualMode,
  OrbitalType,
  ParticleType,
  SelectedParticle,
} from "./atomTypes";

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
  orbital: { color: "#a9c7ff", emissive: "#6d8bff" },
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

/* ------------------------------------------------------------------------- *
 * Quantum-orbital approximation
 *
 * Everything below builds the educational "probability cloud" view. It is a
 * deliberately simplified, deterministic approximation of atomic orbital
 * shapes — a teaching visual, NOT a quantum-mechanical calculation. Real
 * orbitals are continuous probability distributions; here we sample a fixed
 * point cloud per orbital family so the shapes read clearly on OLED black.
 * ------------------------------------------------------------------------- */

/** Restrained blue/cyan/violet palette for each orbital family. */
export const ORBITAL_COLORS: Record<OrbitalType, { color: string; glow: string }> = {
  s: { color: "#7fe8ff", glow: "#38bdf8" },
  p: { color: "#9ec5ff", glow: "#5b8bff" },
  d: { color: "#b9a8ff", glow: "#8b6dff" },
  f: { color: "#d2b4ff", glow: "#a855f7" },
} as const;

/** Friendly names + one-line shape descriptions for each orbital family. */
export const ORBITAL_INFO: Record<
  OrbitalType,
  { label: string; shape: string }
> = {
  s: { label: "s orbital", shape: "a single spherical cloud around the nucleus" },
  p: { label: "p orbital", shape: "two opposing lobes (a dumbbell shape)" },
  d: { label: "d orbital", shape: "a four-lobed, clover-like region" },
  f: { label: "f orbital", shape: "a complex, multi-lobed region" },
} as const;

/** Base radius (scene units) of each orbital family's cloud layer. */
const ORBITAL_LAYER_RADIUS: Record<OrbitalType, number> = {
  s: 2.4,
  p: 3.7,
  d: 5.0,
  f: 6.3,
};

/** Points sampled into each orbital family's cloud (fixed → heavy-atom safe). */
const ORBITAL_POINT_COUNT: Record<OrbitalType, number> = {
  s: 420,
  p: 520,
  d: 620,
  f: 720,
};

/** Radius of the cloud layer for an orbital family. */
export function getOrbitalLayerRadius(type: OrbitalType): number {
  return ORBITAL_LAYER_RADIUS[type];
}

/**
 * Which orbital families to emphasise for an element, based on its block. The
 * dominant (last) family is the element's own block; lower families are shown
 * faintly as inner context, matching how subshells fill.
 * - s-block → [s]
 * - p-block → [s, p]
 * - d-block → [s, p, d]
 * - f-block → [s, p, d, f]
 */
export function getOrbitalTypesForBlock(block: ElementBlock): OrbitalType[] {
  switch (block) {
    case "s":
      return ["s"];
    case "p":
      return ["s", "p"];
    case "d":
      return ["s", "p", "d"];
    case "f":
      return ["s", "p", "d", "f"];
    default:
      return ["s"];
  }
}

/**
 * One lobe of an orbital: a centre offset and the unit axis it elongates along.
 * `s` orbitals are a single shell and use no lobes.
 */
export interface OrbitalLobeDef {
  /** Centre of the lobe in scene units. */
  center: [number, number, number];
  /** Unit direction the lobe stretches along. */
  dir: [number, number, number];
  /** Y-rotation (radians) aligning a +Z-elongated mesh to {@link dir}. */
  rotationY: number;
  /** Small X-tilt (radians) for added complexity in f-orbitals. */
  rotationX: number;
  /** Elongation length (along dir) and perpendicular width, in scene units. */
  length: number;
  width: number;
}

/** In-plane lobe angles (radians) for each lobed orbital family. */
function lobeAnglesFor(type: OrbitalType): { phi: number; tiltX: number }[] {
  switch (type) {
    case "p":
      return [
        { phi: Math.PI / 2, tiltX: 0 },
        { phi: -Math.PI / 2, tiltX: 0 },
      ];
    case "d":
      return [
        { phi: Math.PI / 4, tiltX: 0 },
        { phi: (3 * Math.PI) / 4, tiltX: 0 },
        { phi: (5 * Math.PI) / 4, tiltX: 0 },
        { phi: (7 * Math.PI) / 4, tiltX: 0 },
      ];
    case "f":
      // Six lobes around the plane with alternating tilt → abstract, complex.
      return Array.from({ length: 6 }, (_, i) => ({
        phi: (i / 6) * Math.PI * 2,
        tiltX: i % 2 === 0 ? 0.55 : -0.55,
      }));
    default:
      return [];
  }
}

/**
 * Build the lobe layout for a lobed orbital family (`p`/`d`/`f`). Returns an
 * empty array for `s` (rendered as a single spherical shell instead).
 */
export function getOrbitalLobes(type: OrbitalType): OrbitalLobeDef[] {
  const radius = getOrbitalLayerRadius(type);
  const offset = radius * 0.62;
  const length = radius * 0.42;
  const width = radius * 0.2;

  return lobeAnglesFor(type).map(({ phi, tiltX }) => {
    // Direction in the XZ plane, then tilted about X for f-orbital complexity.
    const baseX = Math.cos(phi);
    const baseZ = Math.sin(phi);
    const dir: [number, number, number] = [
      baseX,
      -baseZ * Math.sin(tiltX),
      baseZ * Math.cos(tiltX),
    ];
    return {
      center: [dir[0] * offset, dir[1] * offset, dir[2] * offset],
      dir,
      // Maps a +Z-elongated mesh onto `dir`'s in-plane angle.
      rotationY: Math.PI / 2 - phi,
      rotationX: tiltX,
      length,
      width,
    };
  });
}

/** Tiny deterministic PRNG (mulberry32) so clouds never jitter between renders. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Stable seed per orbital family. */
const ORBITAL_SEED: Record<OrbitalType, number> = {
  s: 1011,
  p: 2027,
  d: 3041,
  f: 4093,
};

/**
 * Deterministically sample a point cloud approximating an orbital family's
 * probability density. `s` is a soft spherical shell; `p`/`d`/`f` distribute
 * gaussian blobs along their lobe axes. The returned positions are stable for
 * identical inputs — generate once with `useMemo`, never per frame.
 */
export function generateOrbitalPoints(type: OrbitalType): Float32Array {
  const count = ORBITAL_POINT_COUNT[type];
  const radius = getOrbitalLayerRadius(type);
  const rng = mulberry32(ORBITAL_SEED[type]);
  const positions = new Float32Array(count * 3);

  // Standard-normal sample via Box–Muller.
  const gauss = () => {
    const u1 = Math.max(1e-6, rng());
    const u2 = rng();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  };

  if (type === "s") {
    // Fuzzy spherical shell: uniform direction, density peaking near `radius`.
    for (let i = 0; i < count; i++) {
      const u = rng() * 2 - 1; // cos(theta), uniform on sphere
      const phi = rng() * Math.PI * 2;
      const s = Math.sqrt(Math.max(0, 1 - u * u));
      const r = radius * (0.45 + 0.4 * rng() + 0.12 * Math.abs(gauss()));
      positions[i * 3] = Math.cos(phi) * s * r;
      positions[i * 3 + 1] = u * r;
      positions[i * 3 + 2] = Math.sin(phi) * s * r;
    }
    return positions;
  }

  const lobes = getOrbitalLobes(type);
  const width = radius * 0.18;
  const length = radius * 0.34;

  for (let i = 0; i < count; i++) {
    const lobe = lobes[i % lobes.length];
    const dir = lobe.dir;
    // Isotropic gaussian blob, then stretch the component along the lobe axis.
    const gx = gauss();
    const gy = gauss();
    const gz = gauss();
    const along = gx * dir[0] + gy * dir[1] + gz * dir[2];
    const px = gx - along * dir[0];
    const py = gy - along * dir[1];
    const pz = gz - along * dir[2];
    positions[i * 3] =
      lobe.center[0] + px * width + dir[0] * along * length;
    positions[i * 3 + 1] =
      lobe.center[1] + py * width + dir[1] * along * length;
    positions[i * 3 + 2] =
      lobe.center[2] + pz * width + dir[2] * along * length;
  }
  return positions;
}
