"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { Group } from "three";
import { Electron } from "./Electron";
import {
  ParticleType,
  SelectedParticle,
  PARTICLE_COLORS,
  getElectronPosition,
  getElectronShellRadius,
  getShellAngularSpeed,
  getShellTilt,
} from "./atomUtils";

interface ElectronShellProps {
  /** 0-based shell index (innermost = 0). */
  shellIndex: number;
  /** Number of electrons occupying this shell. */
  electronCount: number;
  selected: SelectedParticle;
  onSelect: (type: ParticleType) => void;
  /** Animation speed multiplier (0 = paused). */
  animationSpeed: number;
}

/**
 * One Bohr electron shell: a thin glowing orbit ring plus its evenly spaced
 * electrons. A static outer group applies the shell's 3D tilt; an inner group
 * spins about its local axis to carry every electron around the orbit at once —
 * a single `useFrame` per shell rather than one per electron.
 */
export function ElectronShell({
  shellIndex,
  electronCount,
  selected,
  onSelect,
  animationSpeed,
}: ElectronShellProps) {
  const spinRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);

  const radius = getElectronShellRadius(shellIndex);
  const tilt = useMemo(() => getShellTilt(shellIndex), [shellIndex]);
  const angularSpeed = useMemo(
    () => getShellAngularSpeed(shellIndex),
    [shellIndex],
  );

  const electrons = useMemo(
    () =>
      Array.from({ length: electronCount }, (_, i) => ({
        id: i,
        position: getElectronPosition(i, electronCount, radius),
      })),
    [electronCount, radius],
  );

  // Orbital motion: rotate the inner group; updates a ref, never React state.
  useFrame((_, delta) => {
    if (!spinRef.current) return;
    spinRef.current.rotation.y += delta * angularSpeed * animationSpeed;
  });

  const { color } = PARTICLE_COLORS.shell;
  const isSelected = selected === "shell";

  const handleRingClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect("shell");
  };

  return (
    <group rotation={tilt}>
      {/* Orbit ring (thin torus, laid into the XZ plane). */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        onClick={handleRingClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        <torusGeometry args={[radius, 0.018, 8, 128]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isSelected ? 0.85 : hovered ? 0.6 : 0.32}
          depthWrite={false}
        />
      </mesh>

      {/* Electrons, carried around by the spinning group. */}
      <group ref={spinRef}>
        {electrons.map((electron) => (
          <Electron
            key={electron.id}
            position={electron.position}
            selected={selected === "electron"}
            onSelect={() => onSelect("electron")}
          />
        ))}
      </group>
    </group>
  );
}
