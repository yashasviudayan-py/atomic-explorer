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
}

/**
 * The atomic nucleus: a deterministic packed cluster of proton and neutron
 * spheres wrapped in a soft central glow. Positions come from
 * {@link getNucleusParticles}, so they never shift between renders.
 */
export function Nucleus({ protons, neutrons, selected, onSelect }: NucleusProps) {
  const particles = useMemo(
    () => getNucleusParticles(protons, neutrons),
    [protons, neutrons],
  );

  return (
    <group>
      {/* Ambient nucleus glow */}
      <mesh>
        <sphereGeometry args={[Math.max(0.6, 0.55 * Math.cbrt(protons + neutrons)), 24, 24]} />
        <meshBasicMaterial color="#ff7aa0" transparent opacity={0.06} depthWrite={false} />
      </mesh>

      {particles.map((particle) =>
        particle.type === "proton" ? (
          <Proton
            key={particle.id}
            position={particle.position}
            selected={selected === "proton"}
            onSelect={() => onSelect("proton")}
          />
        ) : (
          <Neutron
            key={particle.id}
            position={particle.position}
            selected={selected === "neutron"}
            onSelect={() => onSelect("neutron")}
          />
        ),
      )}
    </group>
  );
}
