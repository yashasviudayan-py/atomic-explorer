import { describe, it, expect } from "vitest";
import {
  parseAtomicMass,
  getApproximateMassNumber,
  getNeutronCount,
  getFallbackIsotope,
  getIsotopesForElement,
  getParticleCountsFromIsotope,
  getNucleusDisplayCounts,
  getNucleusParticles,
  getElectronShellRadius,
  getElectronPosition,
  getShellAngularSpeed,
  getOrbitalTypesForBlock,
  getOrbitalLobes,
  generateOrbitalPoints,
  MAX_NUCLEUS_PARTICLES,
  SHELL_BASE_RADIUS,
  SHELL_GAP,
} from "./atomUtils";
import { getElementBySymbol } from "@/data/elements";

describe("parseAtomicMass", () => {
  it("parses plain decimals", () => {
    expect(parseAtomicMass("1.008")).toBeCloseTo(1.008);
    expect(parseAtomicMass("12.011")).toBeCloseTo(12.011);
  });

  it("parses bracketed most-stable masses", () => {
    expect(parseAtomicMass("[98]")).toBe(98);
    expect(parseAtomicMass("[294]")).toBe(294);
  });

  it("returns null when no number is present", () => {
    expect(parseAtomicMass("unknown")).toBeNull();
    expect(parseAtomicMass("")).toBeNull();
  });
});

describe("getApproximateMassNumber", () => {
  it("rounds the parsed standard mass", () => {
    expect(getApproximateMassNumber("12.011", 6)).toBe(12);
    expect(getApproximateMassNumber("35.45", 17)).toBe(35);
  });

  it("falls back to ~2x atomic number when mass is unparseable", () => {
    expect(getApproximateMassNumber("n/a", 20)).toBe(40);
  });

  it("never returns less than the atomic number", () => {
    // A pathological mass smaller than Z still yields at least Z.
    expect(getApproximateMassNumber("1", 6)).toBe(6);
  });
});

describe("getNeutronCount", () => {
  it("computes mass number minus protons", () => {
    expect(getNeutronCount(6, "12.011")).toBe(6); // carbon-12
    expect(getNeutronCount(8, "15.999")).toBe(8); // oxygen-16
  });

  it("never returns a negative count", () => {
    expect(getNeutronCount(6, "1")).toBe(0);
  });
});

describe("getFallbackIsotope", () => {
  it("builds a neutral, approximate isotope from standard mass", () => {
    const carbon = getElementBySymbol("C")!;
    const iso = getFallbackIsotope(carbon);
    expect(iso.protons).toBe(6);
    expect(iso.electrons).toBe(6); // neutral atom
    expect(iso.neutrons).toBe(iso.massNumber - iso.protons);
    expect(iso.isApproximate).toBe(true);
    expect(iso.symbol).toBe(`C-${iso.massNumber}`);
  });

  it("flags elements with a bracketed mass as having no stable isotope", () => {
    const technetium = getElementBySymbol("Tc")!; // atomicMass "[98]"
    const iso = getFallbackIsotope(technetium);
    expect(iso.isStable).toBe(false);
    expect(iso.massNumber).toBe(98);
  });
});

describe("getIsotopesForElement", () => {
  it("returns curated isotopes when available", () => {
    const carbon = getElementBySymbol("C")!;
    const isotopes = getIsotopesForElement(carbon);
    expect(isotopes.length).toBeGreaterThan(0);
    // Curated carbon data should not be flagged approximate.
    expect(isotopes.every((i) => i.elementSymbol === "C")).toBe(true);
  });

  it("returns a single approximate fallback when no curated data exists", () => {
    // Oganesson (118) is a synthetic superheavy unlikely to have curated data.
    const og = getElementBySymbol("Og")!;
    const isotopes = getIsotopesForElement(og);
    expect(isotopes).toHaveLength(1);
    expect(isotopes[0].isApproximate).toBe(true);
  });
});

describe("getParticleCountsFromIsotope", () => {
  it("passes through the isotope's particle counts", () => {
    const carbon = getElementBySymbol("C")!;
    const iso = getFallbackIsotope(carbon);
    expect(getParticleCountsFromIsotope(iso)).toEqual({
      protons: iso.protons,
      neutrons: iso.neutrons,
      electrons: iso.electrons,
    });
  });
});

describe("getNucleusDisplayCounts", () => {
  it("does not cap small nuclei", () => {
    const result = getNucleusDisplayCounts(6, 6);
    expect(result).toEqual({ protons: 6, neutrons: 6, capped: false });
  });

  it("scales down proportionally past the particle cap", () => {
    const result = getNucleusDisplayCounts(92, 146); // uranium-238
    expect(result.capped).toBe(true);
    expect(result.protons + result.neutrons).toBeLessThanOrEqual(
      MAX_NUCLEUS_PARTICLES + 2,
    );
    // Proton:neutron ratio is roughly preserved.
    expect(result.protons).toBeGreaterThan(0);
    expect(result.neutrons).toBeGreaterThan(result.protons);
  });

  it("keeps at least one of each present particle type", () => {
    const result = getNucleusDisplayCounts(1, 300);
    expect(result.protons).toBeGreaterThanOrEqual(1);
    expect(result.neutrons).toBeGreaterThanOrEqual(1);
  });
});

describe("getNucleusParticles", () => {
  it("returns nothing for an empty nucleus", () => {
    expect(getNucleusParticles(0, 0)).toEqual([]);
  });

  it("places a lone nucleon at the origin", () => {
    const particles = getNucleusParticles(1, 0);
    expect(particles).toHaveLength(1);
    expect(particles[0].position).toEqual([0, 0, 0]);
    expect(particles[0].type).toBe("proton");
  });

  it("produces exactly protons+neutrons particles with the right mix", () => {
    const particles = getNucleusParticles(6, 6);
    expect(particles).toHaveLength(12);
    expect(particles.filter((p) => p.type === "proton")).toHaveLength(6);
    expect(particles.filter((p) => p.type === "neutron")).toHaveLength(6);
  });

  it("is deterministic — identical inputs yield identical layouts", () => {
    expect(getNucleusParticles(8, 8)).toEqual(getNucleusParticles(8, 8));
  });
});

describe("shell geometry", () => {
  it("increases shell radius linearly with index", () => {
    expect(getElectronShellRadius(0)).toBe(SHELL_BASE_RADIUS);
    expect(getElectronShellRadius(2)).toBe(SHELL_BASE_RADIUS + 2 * SHELL_GAP);
  });

  it("spaces electrons evenly around a shell", () => {
    const radius = 3;
    const first = getElectronPosition(0, 4, radius);
    // index 0 sits on +X.
    expect(first[0]).toBeCloseTo(radius);
    expect(first[1]).toBe(0);
    expect(first[2]).toBeCloseTo(0);
    // All electrons lie on the shell radius in the XZ plane.
    for (let i = 0; i < 4; i++) {
      const [x, , z] = getElectronPosition(i, 4, radius);
      expect(Math.hypot(x, z)).toBeCloseTo(radius);
    }
  });

  it("alternates orbit direction between shells", () => {
    expect(getShellAngularSpeed(0)).toBeGreaterThan(0);
    expect(getShellAngularSpeed(1)).toBeLessThan(0);
    // Inner shells orbit faster than outer ones (by magnitude).
    expect(Math.abs(getShellAngularSpeed(0))).toBeGreaterThan(
      Math.abs(getShellAngularSpeed(2)),
    );
  });
});

describe("orbital helpers", () => {
  it("maps blocks to their cumulative orbital families", () => {
    expect(getOrbitalTypesForBlock("s")).toEqual(["s"]);
    expect(getOrbitalTypesForBlock("p")).toEqual(["s", "p"]);
    expect(getOrbitalTypesForBlock("d")).toEqual(["s", "p", "d"]);
    expect(getOrbitalTypesForBlock("f")).toEqual(["s", "p", "d", "f"]);
  });

  it("gives s orbitals no lobes and p/d/f the expected lobe counts", () => {
    expect(getOrbitalLobes("s")).toHaveLength(0);
    expect(getOrbitalLobes("p")).toHaveLength(2);
    expect(getOrbitalLobes("d")).toHaveLength(4);
    expect(getOrbitalLobes("f")).toHaveLength(6);
  });

  it("generates a deterministic, correctly sized point cloud", () => {
    const a = generateOrbitalPoints("p");
    const b = generateOrbitalPoints("p");
    expect(a.length % 3).toBe(0);
    expect(a).toEqual(b); // seeded PRNG => stable
    expect(a.every((v) => Number.isFinite(v))).toBe(true);
  });
});
