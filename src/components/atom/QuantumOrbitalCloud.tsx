"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, Group } from "three";
import type { Element } from "@/types/element";
import type {
  AtomVisualMode,
  OrbitalType,
  ParticleType,
  SelectedParticle,
} from "./atomTypes";
import { OrbitalLobe } from "./OrbitalLobe";
import {
  ORBITAL_COLORS,
  generateOrbitalPoints,
  getOrbitalLayerRadius,
  getOrbitalLobes,
  getOrbitalTypesForBlock,
} from "./atomUtils";

interface QuantumOrbitalCloudProps {
  element: Element;
  selected: SelectedParticle;
  setSelectedParticleType: (type: ParticleType) => void;
  /** Animation speed multiplier (0 = paused). */
  animationSpeed: number;
  /** Active visual emphasis mode. */
  visualMode: AtomVisualMode;
}

/** How brightly the cloud reads under each visual mode. */
function intensityForMode(mode: AtomVisualMode): number {
  switch (mode) {
    case "orbital-focus":
      return 1.4;
    case "particle-focus":
      return 0.55;
    case "shell-focus":
      return 0.85;
    case "balanced":
    default:
      return 1;
  }
}

/** Slow idle rotation per layer (alternating direction by depth). */
function layerSpinSpeed(index: number): number {
  const base = 0.09 / (1 + index * 0.25);
  return index % 2 === 0 ? base : -base;
}

interface OrbitalLayerProps {
  type: OrbitalType;
  /** Index in the rendered stack (0 = innermost). */
  index: number;
  /** True for the element's own block — rendered most prominently. */
  dominant: boolean;
  intensity: number;
  animationSpeed: number;
  selected: SelectedParticle;
  onSelect: (type: ParticleType) => void;
}

/**
 * One orbital family rendered as a deterministic probability-density point
 * cloud plus a few soft, clickable lobe meshes. The whole layer rotates slowly
 * (ref only — never React state) so the cloud feels alive without implying the
 * electrons trace a path.
 */
function OrbitalLayer({
  type,
  index,
  dominant,
  intensity,
  animationSpeed,
  selected,
  onSelect,
}: OrbitalLayerProps) {
  const groupRef = useRef<Group>(null);

  // Deterministic geometry — generated once, never per frame.
  const positions = useMemo(() => generateOrbitalPoints(type), [type]);
  const lobes = useMemo(() => getOrbitalLobes(type), [type]);
  const radius = getOrbitalLayerRadius(type);
  const { color, glow } = ORBITAL_COLORS[type];

  // Faint layers (lower subshells) sit behind the dominant block's cloud.
  const layerIntensity = intensity * (dominant ? 1 : 0.42);
  const isSelected = selected === "orbital";

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y +=
      delta * layerSpinSpeed(index) * animationSpeed;
  });

  const handleSelect = () => onSelect("orbital");

  return (
    <group ref={groupRef}>
      {/* Probability-density markers (not tracked electrons). */}
      <points raycast={() => null}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={color}
          size={dominant ? 0.062 : 0.044}
          sizeAttenuation
          transparent
          opacity={Math.min(0.8, (dominant ? 0.66 : 0.36) * layerIntensity)}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </points>

      {type === "s" ? (
        // s orbital: a single soft glowing sphere.
        <OrbitalLobe
          orbitalType="s"
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          scale={[radius * 1.05, radius * 1.05, radius * 1.05]}
          intensity={layerIntensity}
          selected={isSelected}
          onClick={handleSelect}
        />
      ) : (
        lobes.map((lobe, i) => (
          <OrbitalLobe
            key={i}
            orbitalType={type}
            position={lobe.center}
            rotation={[lobe.rotationX, lobe.rotationY, 0]}
            scale={[lobe.width, lobe.width, lobe.length]}
            intensity={layerIntensity}
            selected={isSelected}
            onClick={handleSelect}
          />
        ))
      )}

      {/* Faint outer boundary, hinting the region without a hard edge. */}
      {dominant && (
        <mesh raycast={() => null}>
          <sphereGeometry args={[radius * 1.12, 24, 24]} />
          <meshBasicMaterial
            color={glow}
            transparent
            opacity={0.03 * layerIntensity}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}

/**
 * The quantum-mode visualization: an educational probability cloud built from
 * one or more orbital families (chosen by the element's block). Each family is
 * a fixed-size point cloud + soft lobe meshes, so the cost is independent of
 * how heavy the atom is. This is a simplified teaching visual inspired by
 * atomic orbitals — not a quantum-mechanical calculation, and the points are
 * probability-density markers, not real-time electron positions.
 */
export function QuantumOrbitalCloud({
  element,
  selected,
  setSelectedParticleType,
  animationSpeed,
  visualMode,
}: QuantumOrbitalCloudProps) {
  const types = useMemo(
    () => getOrbitalTypesForBlock(element.block),
    [element.block],
  );
  const intensity = intensityForMode(visualMode);
  const dominantType = types[types.length - 1];

  return (
    <group>
      {types.map((type, index) => (
        <OrbitalLayer
          key={type}
          type={type}
          index={index}
          dominant={type === dominantType}
          intensity={intensity}
          animationSpeed={animationSpeed}
          selected={selected}
          onSelect={setSelectedParticleType}
        />
      ))}
    </group>
  );
}
