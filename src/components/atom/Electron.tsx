"use client";

import { useState } from "react";
import { ThreeEvent } from "@react-three/fiber";
import { ELECTRON_RADIUS, PARTICLE_COLORS } from "./atomUtils";

interface ElectronProps {
  position: [number, number, number];
  /** Highlighted when the electron particle type is selected. */
  selected: boolean;
  onSelect: () => void;
  /** Emissive/glow multiplier for visual-mode emphasis (1 = neutral). */
  emphasis?: number;
}

/**
 * A single electron: a small electric blue-white sphere with a faint glow halo.
 * Orbital motion is driven by the rotating parent shell group (in
 * {@link ElectronShell}) for performance — this component only owns appearance
 * and interaction, so there is no per-electron `useFrame`.
 */
export function Electron({ position, selected, onSelect, emphasis = 1 }: ElectronProps) {
  const [hovered, setHovered] = useState(false);
  const { color, emissive } = PARTICLE_COLORS.electron;

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect();
  };

  const handleOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setHovered(true);
    document.body.style.cursor = "pointer";
  };

  const handleOut = () => {
    setHovered(false);
    document.body.style.cursor = "auto";
  };

  const active = hovered || selected;

  return (
    <group position={position}>
      {/* Core electron */}
      <mesh
        onClick={handleClick}
        onPointerOver={handleOver}
        onPointerOut={handleOut}
        scale={active ? 1.3 : 1}
      >
        <sphereGeometry args={[ELECTRON_RADIUS, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={(selected ? 3 : hovered ? 2.4 : 1.8) * emphasis}
          roughness={0.2}
          metalness={0}
        />
      </mesh>
      {/* Tight glow halo — a slightly larger translucent sphere, kept subtle. */}
      <mesh scale={(active ? 2 : 1.7) * (emphasis > 1 ? 1.12 : 1)}>
        <sphereGeometry args={[ELECTRON_RADIUS, 12, 12]} />
        <meshBasicMaterial
          color={emissive}
          transparent
          opacity={Math.min(0.32, (active ? 0.18 : 0.1) * emphasis)}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
