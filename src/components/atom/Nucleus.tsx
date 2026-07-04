"use client";

import { useMemo } from "react";
import { Proton } from "./Proton";
import { Neutron } from "./Neutron";
import {
  ParticleType,
  SelectedParticle,
  getNucleusParticles,
} from "./atomUtils";

interface NucleusProps {
  /** Proton count to render (already capped for performance). */
  protons: number;
  /** Neutron count to render (already capped for performance). */
  neutrons: number;
  selected: SelectedParticle;
  onSelect: (type: ParticleType) => void;
  /** Emissive multiplier for nucleons (>1 in particle-focus mode). */
  nucleonEmphasis?: number;
  /** Slightly enlarge the nucleus in particle-focus mode. */
  emphasized?: boolean;
}

/**
 * The atomic nucleus: a deterministic packed cluster of proton and neutron
 * spheres wrapped in a soft central glow. Positions come from
 * {@link getNucleusParticles}, so they never shift between renders. The counts
 * received here are already capped for performance (see
 * {@link getNucleusDisplayCounts}); the info panel reports the true totals.
 */
export function Nucleus({
  protons,
  neutrons,
  selected,
  onSelect,
  nucleonEmphasis = 1,
  emphasized = false,
}: NucleusProps) {
  const particles = useMemo(
    () => getNucleusParticles(protons, neutrons),
    [protons, neutrons],
  );

  const glowRadius = Math.max(0.6, 0.55 * Math.cbrt(protons + neutrons));

  return (
    <group scale={emphasized ? 1.12 : 1}>
      {/* Ambient nucleus glow (two layers for a denser, dimensional core). */}
      <mesh>
        <sphereGeometry args={[glowRadius, 24, 24]} />
        <meshBasicMaterial
          color="#ff8fa8"
          transparent
          opacity={(emphasized ? 0.08 : 0.045) * nucleonEmphasis}
          depthWrite={false}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[glowRadius * 0.62, 20, 20]} />
        <meshBasicMaterial
          color="#ffd2dc"
          transparent
          opacity={0.04 * nucleonEmphasis}
          depthWrite={false}
        />
      </mesh>

      {particles.map((particle) =>
        particle.type === "proton" ? (
          <Proton
            key={particle.id}
            position={particle.position}
            selected={selected === "proton"}
            onSelect={() => onSelect("proton")}
            emphasis={nucleonEmphasis}
          />
        ) : (
          <Neutron
            key={particle.id}
            position={particle.position}
            selected={selected === "neutron"}
            onSelect={() => onSelect("neutron")}
            emphasis={nucleonEmphasis}
          />
        ),
      )}
    </group>
  );
}
