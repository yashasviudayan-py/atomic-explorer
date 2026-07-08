"use client";

import { useEffect, useMemo, useRef } from "react";
import { OrbitControls, Stars } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Group } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { Element } from "@/types/element";
import { Nucleus } from "./Nucleus";
import { ElectronShell } from "./ElectronShell";
import { AtomLabels } from "./AtomLabels";
import { QuantumOrbitalCloud } from "./QuantumOrbitalCloud";
import type { QualityPreset } from "./useRenderQuality";
import {
  AtomicModelMode,
  AtomVisualMode,
  ParticleType,
  SelectedParticle,
  getElectronShellRadius,
  getOrbitalLayerRadius,
  getOrbitalTypesForBlock,
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
  /** Which conceptual model to render (Bohr shells vs quantum cloud). */
  atomicModelMode: AtomicModelMode;
  /** Visual emphasis mode for the scene. */
  visualMode: AtomVisualMode;
  /** Incrementing counter; each change triggers an OrbitControls reset. */
  resetSignal: number;
  /** Fitted camera position for the current element/model (see AtomViewer). */
  cameraPosition: [number, number, number];
  /** Render-quality preset (star count, cloud density, tessellation, …). */
  quality: QualityPreset;
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
    case "orbital-focus":
    case "balanced":
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
 * distracting from the atom. Star count and whether it rotates come from the
 * render-quality preset — on low quality (mobile) it is omitted entirely by the
 * caller, and rotation is disabled so nothing spins in the background.
 */
function DriftingStars({
  speed,
  count,
  autoRotate,
}: {
  speed: number;
  count: number;
  autoRotate: boolean;
}) {
  const groupRef = useRef<Group>(null);
  useFrame((_, delta) => {
    if (!groupRef.current || !autoRotate) return;
    groupRef.current.rotation.y += delta * 0.01 * speed;
  });
  return (
    <group ref={groupRef}>
      <Stars
        radius={100}
        depth={50}
        count={count}
        factor={2.5}
        saturation={0}
        fade
        speed={autoRotate ? 0.2 : 0}
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
  element,
  protons,
  neutrons,
  shells,
  selectedParticleType,
  setSelectedParticleType,
  showLabels,
  animationSpeed,
  atomicModelMode,
  visualMode,
  resetSignal,
  cameraPosition,
  quality,
}: AtomSceneProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const camera = useThree((state) => state.camera);

  // Reset camera/orbit when the reset signal changes (but not on first mount).
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    controlsRef.current?.reset();
  }, [resetSignal]);

  // Reframe when the fitted camera position changes. The <Canvas camera> prop
  // only positions the camera on mount, so switching model (Bohr <-> Quantum,
  // whose clouds have a different extent) would otherwise keep the old framing
  // and render the atom clipped or undersized until a reload. Move the live
  // camera to the fitted, centred view and re-save it as the OrbitControls home
  // state, so a later "Reset view" returns here rather than the stale mount-time
  // framing. Skips the first run — mount already frames from the Canvas prop.
  const firstFrame = useRef(true);
  useEffect(() => {
    if (firstFrame.current) {
      firstFrame.current = false;
      return;
    }
    const controls = controlsRef.current;
    camera.position.set(cameraPosition[0], cameraPosition[1], cameraPosition[2]);
    if (controls) {
      controls.target.set(0, 0, 0);
      camera.lookAt(controls.target);
      controls.update();
      controls.saveState();
    } else {
      camera.lookAt(0, 0, 0);
    }
    camera.updateProjectionMatrix();
  }, [camera, cameraPosition]);

  const isQuantum = atomicModelMode === "quantum";
  const emphasis = useMemo(() => emphasisFor(visualMode), [visualMode]);

  // Outermost radius drives the camera framing / zoom-out limit per model.
  const outerRadius = useMemo(() => {
    if (isQuantum) {
      const types = getOrbitalTypesForBlock(element.block);
      return getOrbitalLayerRadius(types[types.length - 1]);
    }
    return getElectronShellRadius(Math.max(0, shells.length - 1));
  }, [isQuantum, element.block, shells.length]);

  return (
    <>
      {/* Lighting: quiet ambient fill, one cool key light, a faint violet
          bounce for depth, and a rim light to lift the atom off true black. */}
      <ambientLight intensity={isQuantum ? 0.45 : 0.4} />
      <pointLight position={[12, 14, 10]} intensity={120} color="#bcd8ff" distance={80} />
      <pointLight position={[-14, -6, -8]} intensity={40} color="#7d7aff" distance={70} />
      <pointLight
        position={[0, 0, 0]}
        intensity={isQuantum ? 3 : emphasis.nucleonEmphasis * 5}
        color={isQuantum ? "#9ec5ff" : "#ff8fa8"}
        distance={isQuantum ? 12 : 9}
      />
      {/* Cool rim light to separate the atom from the black backdrop. */}
      <directionalLight position={[-6, 8, -10]} intensity={0.55} color="#9ec5ff" />

      {quality.starCount > 0 && (
        <DriftingStars
          speed={animationSpeed}
          count={quality.starCount}
          autoRotate={quality.autoRotate}
        />
      )}

      {/* The nucleus is shared by both models. */}
      <Nucleus
        protons={protons}
        neutrons={neutrons}
        selected={selectedParticleType}
        onSelect={setSelectedParticleType}
        nucleonEmphasis={emphasis.nucleonEmphasis}
        emphasized={emphasis.nucleusEmphasized}
        segments={quality.sphereSegments}
      />

      {isQuantum ? (
        <QuantumOrbitalCloud
          element={element}
          selected={selectedParticleType}
          setSelectedParticleType={setSelectedParticleType}
          animationSpeed={animationSpeed}
          visualMode={visualMode}
          quality={quality}
        />
      ) : (
        shells.map((count, index) => (
          <ElectronShell
            key={index}
            shellIndex={index}
            electronCount={count}
            selected={selectedParticleType}
            onSelect={setSelectedParticleType}
            animationSpeed={animationSpeed}
            electronEmphasis={emphasis.electronEmphasis}
            ringEmphasis={emphasis.ringEmphasis}
            segments={quality.sphereSegments}
          />
        ))
      )}

      {showLabels && (
        <AtomLabels
          mode={atomicModelMode}
          shellCount={shells.length}
          orbitalRadius={outerRadius}
        />
      )}

      <OrbitControls
        ref={controlsRef}
        enablePan
        enableDamping
        dampingFactor={0.06}
        minDistance={4}
        maxDistance={Math.max(32, outerRadius * 4.2)}
        rotateSpeed={0.55}
        zoomSpeed={0.8}
      />
    </>
  );
}
