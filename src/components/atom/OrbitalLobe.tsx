"use client";

import { useState } from "react";
import { ThreeEvent } from "@react-three/fiber";
import type { OrbitalType } from "./atomTypes";
import { ORBITAL_COLORS } from "./atomUtils";

interface OrbitalLobeProps {
  /** Orbital family this lobe belongs to (drives its colour). */
  orbitalType: OrbitalType;
  position: [number, number, number];
  /** Euler rotation (radians) orienting the elongated lobe. */
  rotation: [number, number, number];
  /** Per-axis scale (the geometry elongates along local +Z). */
  scale: [number, number, number];
  /** Brightness multiplier from the active visual mode (1 = neutral). */
  intensity?: number;
  /** Highlight the lobe when the orbital region is selected. */
  selected?: boolean;
  onClick?: () => void;
  /** Sphere tessellation (lower on mobile). */
  segments?: number;
}

/**
 * A single soft, glowing orbital lobe — a unit sphere stretched into an
 * ellipsoid and rendered with an additive, depth-write-free material so the
 * lobes read as ethereal probability regions rather than solid surfaces. Used
 * to give the p/d/f probability clouds clear, clickable structure.
 */
export function OrbitalLobe({
  orbitalType,
  position,
  rotation,
  scale,
  intensity = 1,
  selected = false,
  onClick,
  segments = 28,
}: OrbitalLobeProps) {
  const [hovered, setHovered] = useState(false);
  const { color, glow } = ORBITAL_COLORS[orbitalType];
  const active = hovered || selected;

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onClick?.();
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

  // Extremely transparent: the point cloud carries the shape, the lobe mesh
  // only adds a soft volumetric hint (and a generous click target).
  const baseOpacity = Math.min(0.22, (active ? 0.13 : 0.055) * intensity);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Inner soft core of the lobe. */}
      <mesh
        onClick={handleClick}
        onPointerOver={handleOver}
        onPointerOut={handleOut}
      >
        <sphereGeometry args={[1, segments, segments]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={baseOpacity}
          depthWrite={false}
        />
      </mesh>
      {/* Fainter outer halo. */}
      <mesh scale={1.45}>
        <sphereGeometry args={[1, Math.max(12, segments - 8), Math.max(12, segments - 8)]} />
        <meshBasicMaterial
          color={glow}
          transparent
          opacity={baseOpacity * 0.4}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
