"use client";

import { useState } from "react";
import { ThreeEvent } from "@react-three/fiber";
import { NUCLEON_RADIUS, PARTICLE_COLORS } from "./atomUtils";

interface ProtonProps {
  position: [number, number, number];
  /** Highlighted when the proton particle type is selected. */
  selected: boolean;
  onSelect: () => void;
}

/**
 * A single proton: a small warm-rose glowing sphere clustered in the nucleus.
 * Clicking it selects the "proton" info panel; hovering shows a pointer cursor.
 */
export function Proton({ position, selected, onSelect }: ProtonProps) {
  const [hovered, setHovered] = useState(false);
  const { color, emissive } = PARTICLE_COLORS.proton;

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
        emissiveIntensity={selected ? 2.2 : hovered ? 1.6 : 1.1}
        roughness={0.35}
        metalness={0.1}
      />
    </mesh>
  );
}
