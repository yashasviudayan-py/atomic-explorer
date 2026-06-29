"use client";

import { useEffect, useMemo, useRef } from "react";
import { OrbitControls, Stars } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { Element } from "@/types/element";
import { Nucleus } from "./Nucleus";
import { ElectronShell } from "./ElectronShell";
import { AtomLabels } from "./AtomLabels";
import {
  AtomVisualMode,
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
  /** Visual emphasis mode for the scene. */
  visualMode: AtomVisualMode;
  /** Incrementing counter; each change triggers an OrbitControls reset. */
  resetSignal: number;
}

/** Per-mode emphasis values keeping the scene balanced and OLED-elegant. */
function emphasisFor(mode: AtomVisualMode) {
  switch (mode) {
    case "particle-focus":
      return {
        nucleonEmphasis: 1.5,
        nucleusEmphasized: true,
        electronEmphasis: 0.78,
        ringEmphasis: false,
      };
    case "shell-focus":
      return {
        nucleonEmphasis: 0.82,
        nucleusEmphasized: false,
        electronEmphasis: 1.5,
        ringEmphasis: true,
      };
    case "bohr":
    default:
      return {
        nucleonEmphasis: 1,
        nucleusEmphasized: false,
        electronEmphasis: 1,
        ringEmphasis: false,
      };
  }
}

/**
 * A starfield that drifts very slowly, giving the scene gentle parallax without
 * distracting from the atom. Rotation is paused along with the rest of the
 * animation when {@link AtomScene} reports speed 0.
 */
function DriftingStars({ speed }: { speed: number }) {
  const groupRef = useRef<Group>(null);
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.01 * speed;
  });
  return (
    <group ref={groupRef}>
      <Stars
        radius={90}
        depth={60}
        count={4500}
        factor={4}
        saturation={0}
        fade
        speed={0.3}
      />
    </group>
  );
}

/**
 * The live 3D atom: drifting starfield backdrop, cinematic lighting, the
 * nucleus, every electron shell with its orbiting electrons, optional labels,
 * and orbit controls. Rendered inside a `<Canvas>` (see {@link AtomViewer}).
 * The visual mode shifts emphasis between the nucleus and the shells while
 * keeping the overall composition dark and elegant.
 */
export function AtomScene({
  protons,
  neutrons,
  shells,
  selectedParticleType,
  setSelectedParticleType,
  showLabels,
  animationSpeed,
  visualMode,
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
  const emphasis = useMemo(() => emphasisFor(visualMode), [visualMode]);

  return (
    <>
      {/* Lighting: gentle ambient fill plus tinted point lights for depth. */}
      <ambientLight intensity={0.4} />
      <pointLight position={[12, 12, 12]} intensity={130} color="#38bdf8" distance={70} />
      <pointLight position={[-14, -6, -8]} intensity={95} color="#a855f7" distance={70} />
      <pointLight position={[0, 0, 0]} intensity={emphasis.nucleonEmphasis * 7} color="#ff7aa0" distance={9} />
      {/* Cool rim light to separate the atom from the black backdrop. */}
      <directionalLight position={[-6, 8, -10]} intensity={0.6} color="#9ec5ff" />

      <DriftingStars speed={animationSpeed} />

      <Nucleus
        protons={protons}
        neutrons={neutrons}
        selected={selectedParticleType}
        onSelect={setSelectedParticleType}
        nucleonEmphasis={emphasis.nucleonEmphasis}
        emphasized={emphasis.nucleusEmphasized}
      />

      {shells.map((count, index) => (
        <ElectronShell
          key={index}
          shellIndex={index}
          electronCount={count}
          selected={selectedParticleType}
          onSelect={setSelectedParticleType}
          animationSpeed={animationSpeed}
          electronEmphasis={emphasis.electronEmphasis}
          ringEmphasis={emphasis.ringEmphasis}
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
