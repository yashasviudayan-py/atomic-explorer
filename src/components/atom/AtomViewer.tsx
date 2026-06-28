"use client";

import { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import type { Element } from "@/types/element";
import { CATEGORY_META } from "@/lib/elementCategories";
import { AtomScene } from "./AtomScene";
import { AtomControlsPanel } from "./AtomControlsPanel";
import { ParticleInfoPanel } from "./ParticleInfoPanel";
import {
  ParticleType,
  SelectedParticle,
  SPEED_PRESETS,
  SpeedPreset,
  getElectronShellRadius,
  getNeutronCount,
  getNucleusDisplayCounts,
} from "./atomUtils";

interface AtomViewerProps {
  element: Element;
}

/**
 * Top-level interactive 3D atom explorer for an element. Derives the particle
 * composition from the element data, owns the view/selection state, and lays
 * out the Canvas, control bar, and particle info panel in a premium OLED card.
 */
export function AtomViewer({ element }: AtomViewerProps) {
  const [selected, setSelected] = useState<SelectedParticle>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [speed, setSpeed] = useState<SpeedPreset>("normal");
  const [resetSignal, setResetSignal] = useState(0);

  const accent = CATEGORY_META[element.category].accent;

  // Composition: a neutral atom has electrons == protons == atomic number.
  const protons = element.atomicNumber;
  const electrons = element.atomicNumber;
  const neutrons = useMemo(
    () => getNeutronCount(element.atomicNumber, element.atomicMass),
    [element.atomicNumber, element.atomicMass],
  );

  // Cap the rendered nucleon count for heavy atoms (true counts stay in panel).
  const display = useMemo(
    () => getNucleusDisplayCounts(protons, neutrons),
    [protons, neutrons],
  );

  // Frame the camera so the outermost shell comfortably fits.
  const cameraPosition = useMemo<[number, number, number]>(() => {
    const outerRadius = getElectronShellRadius(
      Math.max(0, element.shells.length - 1),
    );
    const distance = outerRadius * 1.9 + 6;
    return [distance * 0.25, distance * 0.32, distance];
  }, [element.shells.length]);

  const handleSelect = (type: ParticleType) => setSelected(type);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="flex flex-col gap-3">
        {/* Canvas card */}
        <div
          className="glass-panel relative h-[26rem] overflow-hidden rounded-3xl sm:h-[34rem]"
          style={{ ["--accent" as string]: accent }}
        >
          {/* Radial accent glow behind the canvas */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background: `radial-gradient(60% 60% at 50% 45%, ${accent}1f, transparent 70%)`,
            }}
          />
          <Canvas
            dpr={[1, 2]}
            camera={{ position: cameraPosition, fov: 45 }}
            gl={{ antialias: true }}
            onPointerMissed={() => setSelected(null)}
            style={{ background: "transparent" }}
          >
            <AtomScene
              element={element}
              protons={display.protons}
              neutrons={display.neutrons}
              shells={element.shells}
              selectedParticleType={selected}
              setSelectedParticleType={handleSelect}
              showLabels={showLabels}
              animationSpeed={SPEED_PRESETS[speed]}
              resetSignal={resetSignal}
            />
          </Canvas>

          <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[0.7rem] text-muted backdrop-blur">
            Drag to rotate · scroll to zoom · click a particle
          </span>
        </div>

        <AtomControlsPanel
          showLabels={showLabels}
          onToggleLabels={() => setShowLabels((v) => !v)}
          speed={speed}
          onSpeedChange={setSpeed}
          onReset={() => setResetSignal((n) => n + 1)}
          accent={accent}
        />
      </div>

      <ParticleInfoPanel
        element={element}
        selected={selected}
        protons={protons}
        neutrons={neutrons}
        electrons={electrons}
        shells={element.shells}
        capped={display.capped}
        accent={accent}
        onClear={() => setSelected(null)}
      />
    </div>
  );
}
