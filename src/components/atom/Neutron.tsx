"use client";

import { useState } from "react";
import { ThreeEvent } from "@react-three/fiber";
import { NUCLEON_RADIUS, PARTICLE_COLORS } from "./atomUtils";

interface NeutronProps {
  position: [number, number, number];
  /** Highlighted when the neutron particle type is selected. */
  selected: boolean;
  onSelect: () => void;
  /** Emissive multiplier for visual-mode emphasis (1 = neutral). */
  emphasis?: number;
}

/**
 * A single neutron: a cool cyan-blue glowing sphere clustered in the nucleus.
 * Clicking it selects the "neutron" info panel; hovering shows a pointer cursor.
 */
export function Neutron({ position, selected, onSelect, emphasis = 1 }: NeutronProps) {
  const [hovered, setHovered] = useState(false);
  const { color, emissive } = PARTICLE_COLORS.neutron;

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

  return (
    <mesh
      position={position}
      onClick={handleClick}
      onPointerOver={handleOver}
      onPointerOut={handleOut}
      scale={hovered || selected ? 1.18 : 1}
    >
      <sphereGeometry args={[NUCLEON_RADIUS, 14, 14]} />
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={(selected ? 2.2 : hovered ? 1.6 : 0.9) * emphasis}
        roughness={0.4}
        metalness={0.1}
      />
    </mesh>
  );
}
