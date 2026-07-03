"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Group } from "three";
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
          color="#ff7aa0"
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
}: {
  element: Element;
  animate: boolean;
}) {
  const iso = useMemo(() => getRepresentativeIsotope(element), [element]);
  const { protons, neutrons } = useMemo(
    () => getMiniNucleonCounts(iso.protons, iso.neutrons),
    [iso.protons, iso.neutrons],
  );

  return (
    <>
      <ambientLight intensity={0.55} />
      <pointLight position={[8, 8, 8]} intensity={70} color="#38bdf8" distance={50} />
      <pointLight position={[-8, -4, -6]} intensity={55} color="#a855f7" distance={50} />
      <pointLight position={[0, 0, 0]} intensity={4} color="#ff7aa0" distance={7} />

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

  // Frame the camera so the outermost shell fits comfortably.
  const cameraDistance = useMemo(() => {
    const outer = getElectronShellRadius(Math.max(0, element.shells.length - 1));
    return outer * 1.8 + 5;
  }, [element.shells.length]);

  const meta = CATEGORY_META[element.category];

  return (
    <div
      className="glass-panel relative aspect-square w-full overflow-hidden rounded-2xl"
      style={{ ["--accent" as string]: accent }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background: `radial-gradient(60% 60% at 50% 45%, ${accent}22, transparent 70%)`,
        }}
      />
      {mounted ? (
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [cameraDistance * 0.2, cameraDistance * 0.3, cameraDistance], fov: 45 }}
          gl={{ antialias: true, powerPreference: "low-power" }}
          style={{ background: "transparent" }}
        >
          <MiniAtomScene element={element} animate={animate} />
        </Canvas>
      ) : (
        <div className="flex h-full items-center justify-center">
          <span className="animate-pulse text-xs text-muted">Loading atom…</span>
        </div>
      )}

      {/* Corner label */}
      <span className="pointer-events-none absolute left-3 top-3 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-xs backdrop-blur">
        <span className={`font-bold ${meta.text}`}>{element.symbol}</span>
        <span className="text-muted">{element.name}</span>
      </span>
    </div>
  );
}
