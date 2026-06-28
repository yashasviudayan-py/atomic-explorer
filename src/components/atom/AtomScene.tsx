"use client";

import { useEffect, useRef } from "react";
import { OrbitControls, Stars } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { Element } from "@/types/element";
import { Nucleus } from "./Nucleus";
import { ElectronShell } from "./ElectronShell";
import { AtomLabels } from "./AtomLabels";
import {
  ParticleType,
  SelectedParticle,
  getElectronShellRadius,
} from "./atomUtils";

interface AtomSceneProps {
  element: Element;
  /** Proton count to render (capped for performance). */
  protons: number;
  /** Neutron count to render (capped for performance). */
  neutrons: number;
  /** Electron-per-shell distribution from the element data. */
  shells: number[];
  selectedParticleType: SelectedParticle;
  setSelectedParticleType: (type: ParticleType) => void;
  showLabels: boolean;
  /** Animation speed multiplier (0 = paused). */
  animationSpeed: number;
  /** Incrementing counter; each change triggers an OrbitControls reset. */
  resetSignal: number;
}

/**
 * The live 3D atom: starfield backdrop, lighting, the nucleus, every electron
 * shell with its orbiting electrons, optional labels, and orbit controls.
 * Rendered inside a `<Canvas>` (see {@link AtomViewer}).
 */
export function AtomScene({
  protons,
  neutrons,
  shells,
  selectedParticleType,
  setSelectedParticleType,
  showLabels,
  animationSpeed,
  resetSignal,
}: AtomSceneProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  // Reset camera/orbit when the reset signal changes (but not on first mount).
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    controlsRef.current?.reset();
  }, [resetSignal]);

  const outerRadius = getElectronShellRadius(Math.max(0, shells.length - 1));

  return (
    <>
      {/* Lighting: gentle ambient fill plus tinted point lights for depth. */}
      <ambientLight intensity={0.45} />
      <pointLight position={[10, 10, 10]} intensity={120} color="#38bdf8" distance={60} />
      <pointLight position={[-12, -6, -8]} intensity={90} color="#a855f7" distance={60} />
      <pointLight position={[0, 0, 0]} intensity={6} color="#ff7aa0" distance={8} />

      {/* Space dust / starfield. */}
      <Stars
        radius={80}
        depth={60}
        count={3500}
        factor={4}
        saturation={0}
        fade
        speed={0.4}
      />

      <Nucleus
        protons={protons}
        neutrons={neutrons}
        selected={selectedParticleType}
        onSelect={setSelectedParticleType}
      />

      {shells.map((count, index) => (
        <ElectronShell
          key={index}
          shellIndex={index}
          electronCount={count}
          selected={selectedParticleType}
          onSelect={setSelectedParticleType}
          animationSpeed={animationSpeed}
        />
      ))}

      {showLabels && <AtomLabels shellCount={shells.length} />}

      <OrbitControls
        ref={controlsRef}
        enablePan
        enableDamping
        dampingFactor={0.08}
        minDistance={4}
        maxDistance={Math.max(28, outerRadius * 3)}
        rotateSpeed={0.6}
        zoomSpeed={0.8}
      />
    </>
  );
}
