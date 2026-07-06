"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Group } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { Element } from "@/types/element";
import { CATEGORY_META } from "@/lib/elementCategories";
import {
  PARTICLE_COLORS,
  getElectronPosition,
  getElectronShellRadius,
  getNucleusParticles,
  getShellAngularSpeed,
  getShellTilt,
} from "@/components/atom/atomUtils";
import { getRepresentativeIsotope } from "./compareUtils";

interface AtomMiniViewerProps {
  element: Element;
  accent: string;
  /** Whether the atom slowly auto-rotates (paused when false). */
  animate?: boolean;
}

/** Nucleon cap for the *mini* preview — far lower than the full viewer. */
const MINI_NUCLEON_CAP = 26;
/** Electrons drawn per shell in the preview (rings still read for heavy atoms). */
const MINI_ELECTRONS_PER_SHELL = 12;
/** Low sphere tessellation keeps two side-by-side canvases cheap. */
const SPHERE_SEGMENTS = 10;

/** Vertical field of view (degrees) for the preview camera. */
const MINI_FOV = 38;
/**
 * Camera direction relative to the atom (looking at the origin). Its length is
 * irrelevant — the distance is derived from the fit calculation below — but the
 * ratio sets the three-quarter viewing angle.
 */
const CAMERA_DIR: [number, number, number] = [0.2, 0.28, 1];
/**
 * Extra bounding radius beyond the outermost shell so electron spheres, ring
 * thickness, and a little breathing room all stay inside the frame.
 */
const FRAME_MARGIN = 0.6;
/** Multiplier on the exact fit distance so shells never touch the panel edge. */
const FRAME_PADDING = 1.16;

/**
 * Scale true proton/neutron counts down to at most {@link MINI_NUCLEON_CAP}
 * spheres while keeping at least one of each present kind — a *condensed*
 * nucleus so uranium-class atoms never spawn hundreds of meshes here.
 */
function getMiniNucleonCounts(protons: number, neutrons: number) {
  const total = protons + neutrons;
  if (total <= MINI_NUCLEON_CAP) return { protons, neutrons };
  const scale = MINI_NUCLEON_CAP / total;
  return {
    protons: protons > 0 ? Math.max(1, Math.round(protons * scale)) : 0,
    neutrons: neutrons > 0 ? Math.max(1, Math.round(neutrons * scale)) : 0,
  };
}

/** Condensed nucleus: a soft glow plus a small deterministic nucleon cluster. */
function MiniNucleus({ protons, neutrons }: { protons: number; neutrons: number }) {
  const particles = useMemo(
    () => getNucleusParticles(protons, neutrons),
    [protons, neutrons],
  );
  const glowRadius = Math.max(0.5, 0.5 * Math.cbrt(protons + neutrons));

  return (
    <group>
      <mesh>
        <sphereGeometry args={[glowRadius, 16, 16]} />
        <meshBasicMaterial
          color="#ff8fa8"
          transparent
          opacity={0.08}
          depthWrite={false}
        />
      </mesh>
      {particles.map((p) => {
        const colors =
          p.type === "proton" ? PARTICLE_COLORS.proton : PARTICLE_COLORS.neutron;
        return (
          <mesh key={p.id} position={p.position}>
            <sphereGeometry args={[0.3, SPHERE_SEGMENTS, SPHERE_SEGMENTS]} />
            <meshStandardMaterial
              color={colors.color}
              emissive={colors.emissive}
              emissiveIntensity={0.6}
              roughness={0.35}
            />
          </mesh>
        );
      })}
    </group>
  );
}

/** One shell: a thin ring plus a spinning group of capped electrons. */
function MiniShell({
  shellIndex,
  electronCount,
  animate,
}: {
  shellIndex: number;
  electronCount: number;
  animate: boolean;
}) {
  const spinRef = useRef<Group>(null);
  const radius = getElectronShellRadius(shellIndex);
  const tilt = useMemo(() => getShellTilt(shellIndex), [shellIndex]);
  const angularSpeed = useMemo(
    () => getShellAngularSpeed(shellIndex),
    [shellIndex],
  );

  // Draw at most MINI_ELECTRONS_PER_SHELL evenly spaced electrons.
  const drawn = Math.min(electronCount, MINI_ELECTRONS_PER_SHELL);
  const electrons = useMemo(
    () =>
      Array.from({ length: drawn }, (_, i) => ({
        id: i,
        position: getElectronPosition(i, drawn, radius),
      })),
    [drawn, radius],
  );

  useFrame((_, delta) => {
    if (!spinRef.current || !animate) return;
    spinRef.current.rotation.y += delta * angularSpeed;
  });

  return (
    <group rotation={tilt}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.015, 6, 90]} />
        <meshBasicMaterial
          color={PARTICLE_COLORS.shell.color}
          transparent
          opacity={0.3}
          depthWrite={false}
        />
      </mesh>
      <group ref={spinRef}>
        {electrons.map((e) => (
          <mesh key={e.id} position={e.position}>
            <sphereGeometry args={[0.16, SPHERE_SEGMENTS, SPHERE_SEGMENTS]} />
            <meshStandardMaterial
              color={PARTICLE_COLORS.electron.color}
              emissive={PARTICLE_COLORS.electron.emissive}
              emissiveIntensity={0.9}
              roughness={0.3}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** The mini scene contents (lighting, nucleus, shells, gentle controls). */
function MiniAtomScene({
  element,
  animate,
  cameraPosition,
}: {
  element: Element;
  animate: boolean;
  /** Fitted camera position for the current element (see AtomMiniViewer). */
  cameraPosition: [number, number, number];
}) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const camera = useThree((state) => state.camera);
  const iso = useMemo(() => getRepresentativeIsotope(element), [element]);
  const { protons, neutrons } = useMemo(
    () => getMiniNucleonCounts(iso.protons, iso.neutrons),
    [iso.protons, iso.neutrons],
  );

  // The <Canvas camera> prop only positions the camera on mount. On the compare
  // page the element changes in place, so when the shell count (and the fitted
  // framing distance) changes we must move the live camera ourselves — otherwise
  // a larger atom keeps the previous, closer framing and renders oversized until
  // a full reload. Runs only when the fitted position changes (elements with the
  // same shell count already share a position, so nothing snaps needlessly).
  useEffect(() => {
    camera.position.set(cameraPosition[0], cameraPosition[1], cameraPosition[2]);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    controlsRef.current?.update();
  }, [camera, cameraPosition]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[8, 10, 7]} intensity={70} color="#bcd8ff" distance={60} />
      <pointLight position={[-8, -4, -6]} intensity={26} color="#7d7aff" distance={50} />
      <pointLight position={[0, 0, 0]} intensity={3.5} color="#ff8fa8" distance={7} />

      <MiniNucleus protons={protons} neutrons={neutrons} />
      {element.shells.map((count, index) => (
        <MiniShell
          key={index}
          shellIndex={index}
          electronCount={count}
          animate={animate}
        />
      ))}

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.1}
        autoRotate={animate}
        autoRotateSpeed={0.6}
        rotateSpeed={0.5}
      />
    </>
  );
}

/**
 * Compact 3D atom preview for the comparison dashboard.
 *
 * Deliberately lightweight: a condensed nucleus (capped nucleon count), thin
 * Bohr-style shell rings, and a small set of electrons per shell. It never
 * renders on the server (a `mounted` guard defers the WebGL canvas to the
 * client) and caps geometry so even uranium-class atoms stay cheap with two
 * previews on screen. This is a simplified Bohr-style visual, not to scale.
 */
export function AtomMiniViewer({
  element,
  accent,
  animate = true,
}: AtomMiniViewerProps) {
  const [mounted, setMounted] = useState(false);
  // Client-only WebGL gate: intentionally flip state after mount so the
  // server render and first client render agree before the canvas appears.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  // Frame the camera so the whole atom fits, whatever its size. The outermost
  // shell defines a bounding sphere; a perspective camera fits a sphere of
  // radius R when it sits R / sin(fov/2) from the centre. We scale the fixed
  // viewing direction to exactly that distance (plus padding), so heavy atoms
  // like gold never clip and light atoms like carbon aren't lost in empty space.
  const cameraPosition = useMemo<[number, number, number]>(() => {
    const outer = getElectronShellRadius(Math.max(0, element.shells.length - 1));
    const boundingRadius = outer + FRAME_MARGIN;
    const halfFov = (MINI_FOV * Math.PI) / 180 / 2;
    const distance = (boundingRadius / Math.sin(halfFov)) * FRAME_PADDING;
    const dirLength = Math.hypot(...CAMERA_DIR);
    return [
      (CAMERA_DIR[0] / dirLength) * distance,
      (CAMERA_DIR[1] / dirLength) * distance,
      (CAMERA_DIR[2] / dirLength) * distance,
    ];
  }, [element.shells.length]);

  const meta = CATEGORY_META[element.category];

  return (
    <div
      className="glass-panel-subtle relative aspect-square w-full overflow-hidden rounded-2xl"
      style={{ ["--accent" as string]: accent }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(55% 55% at 50% 45%, ${accent}1c, transparent 70%)`,
        }}
      />
      {mounted ? (
        <Canvas
          className="atom-canvas"
          dpr={[1, 1.5]}
          camera={{ position: cameraPosition, fov: MINI_FOV }}
          gl={{ antialias: true, powerPreference: "low-power" }}
          style={{ background: "transparent" }}
        >
          <MiniAtomScene
            element={element}
            animate={animate}
            cameraPosition={cameraPosition}
          />
        </Canvas>
      ) : (
        <div className="flex h-full items-center justify-center">
          <span className="animate-pulse text-xs text-muted">Loading atom…</span>
        </div>
      )}

      {/* Corner label */}
      <span className="pointer-events-none absolute left-3 top-3 flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-2.5 py-1 text-xs backdrop-blur">
        <span className={`font-bold ${meta.text}`}>{element.symbol}</span>
        <span className="text-muted">{element.name}</span>
      </span>
    </div>
  );
}
