"use client";

import { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import type { Element } from "@/types/element";
import type { Isotope } from "@/types/isotope";
import { CATEGORY_META } from "@/lib/elementCategories";
import { AtomScene } from "./AtomScene";
import { AtomControlsPanel } from "./AtomControlsPanel";
import { ParticleInfoPanel } from "./ParticleInfoPanel";
import { IsotopeSelector } from "./IsotopeSelector";
import {
  AtomVisualMode,
  ParticleType,
  SelectedParticle,
  SpeedOption,
  getElectronShellRadius,
  getIsotopesForElement,
  getNucleusDisplayCounts,
} from "./atomUtils";

interface AtomViewerProps {
  element: Element;
}

/**
 * Top-level interactive 3D atom explorer for an element. Owns the isotope
 * selection, view/playback state, and selected-particle state, then lays out
 * the isotope selector, 3D Canvas, control bar, and particle info panel in a
 * premium OLED dashboard. Particle counts flow from the chosen isotope; the
 * electron-shell distribution comes from the element (unchanged across the
 * neutral isotopes shown here).
 */
export function AtomViewer({ element }: AtomViewerProps) {
  const isotopes = useMemo(() => getIsotopesForElement(element), [element]);

  const [selectedIsotope, setSelectedIsotope] = useState<Isotope>(isotopes[0]);
  const [selected, setSelected] = useState<SelectedParticle>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState<SpeedOption>(1);
  const [visualMode, setVisualMode] = useState<AtomVisualMode>("bohr");
  const [resetSignal, setResetSignal] = useState(0);

  const accent = CATEGORY_META[element.category].accent;

  // Composition comes from the selected isotope (neutral atom: e⁻ == p⁺).
  const { protons, neutrons } = selectedIsotope;

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

  // Pause/play and the 0× preset both stop motion.
  const effectiveSpeed = paused ? 0 : speed;

  const handleSelect = (type: ParticleType) => setSelected(type);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="flex flex-col gap-3">
        <IsotopeSelector
          element={element}
          selectedIsotope={selectedIsotope}
          isotopes={isotopes}
          onChange={setSelectedIsotope}
          accent={accent}
        />

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
              animationSpeed={effectiveSpeed}
              visualMode={visualMode}
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
          paused={paused}
          onTogglePaused={() => setPaused((v) => !v)}
          speed={speed}
          onSpeedChange={setSpeed}
          visualMode={visualMode}
          onVisualModeChange={setVisualMode}
          onReset={() => setResetSignal((n) => n + 1)}
          accent={accent}
        />
      </div>

      <ParticleInfoPanel
        element={element}
        isotope={selectedIsotope}
        selected={selected}
        shells={element.shells}
        capped={display.capped}
        accent={accent}
        onClear={() => setSelected(null)}
      />
    </div>
  );
}
