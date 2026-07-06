"use client";

import { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import type { Element } from "@/types/element";
import type { Isotope } from "@/types/isotope";
import { CATEGORY_META } from "@/lib/elementCategories";
import { AtomScene } from "./AtomScene";
import { AtomControlsPanel } from "./AtomControlsPanel";
import { ParticleInfoPanel } from "./ParticleInfoPanel";
import { OrbitalInfoPanel } from "./OrbitalInfoPanel";
import { GuidedExplorer, type StepFocus } from "./GuidedExplorer";
import { ModelNotice } from "./ModelNotice";
import { IsotopeSelector } from "./IsotopeSelector";
import type {
  AtomicModelMode,
  AtomVisualMode,
  ParticleType,
  SelectedParticle,
} from "./atomTypes";
import {
  SpeedOption,
  getElectronShellRadius,
  getIsotopesForElement,
  getNucleusDisplayCounts,
  getOrbitalLayerRadius,
  getOrbitalTypesForBlock,
} from "./atomUtils";

interface AtomViewerProps {
  element: Element;
}

/** Visual modes valid for each model (used to keep state consistent). */
const VALID_VISUAL_MODES: Record<AtomicModelMode, AtomVisualMode[]> = {
  bohr: ["balanced", "particle-focus", "shell-focus"],
  quantum: ["balanced", "particle-focus", "orbital-focus"],
};

/**
 * Top-level interactive 3D atom explorer for an element. Owns the model mode
 * (Bohr vs quantum), isotope selection, view/playback state, and the selected
 * particle/region, then lays out the isotope selector, 3D Canvas, control bar,
 * guided tour, and info panels in a premium OLED dashboard. Particle counts
 * flow from the chosen isotope; the electron-shell distribution comes from the
 * element (unchanged across the neutral isotopes shown here).
 */
export function AtomViewer({ element }: AtomViewerProps) {
  const isotopes = useMemo(() => getIsotopesForElement(element), [element]);

  const [selectedIsotope, setSelectedIsotope] = useState<Isotope>(isotopes[0]);
  const [selected, setSelected] = useState<SelectedParticle>(null);
  // Labels start off so the atom reads clean; the toggle and guided tour
  // bring them back when wanted.
  const [showLabels, setShowLabels] = useState(false);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState<SpeedOption>(1);
  const [modelMode, setModelMode] = useState<AtomicModelMode>("bohr");
  const [visualMode, setVisualMode] = useState<AtomVisualMode>("balanced");
  const [resetSignal, setResetSignal] = useState(0);

  const accent = CATEGORY_META[element.category].accent;
  const isQuantum = modelMode === "quantum";

  // Composition comes from the selected isotope (neutral atom: e⁻ == p⁺).
  const { protons, neutrons } = selectedIsotope;

  // Cap the rendered nucleon count for heavy atoms (true counts stay in panel).
  const display = useMemo(
    () => getNucleusDisplayCounts(protons, neutrons),
    [protons, neutrons],
  );

  // Frame the camera so the atom fills a consistent ~85% of the 36° vertical
  // field of view regardless of size. The distance scales (almost) purely with
  // the outermost radius — a large additive constant would push small atoms
  // (few shells) far away and leave them tiny in a sea of black.
  const cameraPosition = useMemo<[number, number, number]>(() => {
    const outerRadius = isQuantum
      ? getOrbitalLayerRadius(
          getOrbitalTypesForBlock(element.block).at(-1) ?? "s",
        )
      : getElectronShellRadius(Math.max(0, element.shells.length - 1));
    const distance = outerRadius * 2.8 + 0.6;
    return [distance * 0.22, distance * 0.28, distance];
  }, [isQuantum, element.block, element.shells.length]);

  // Pause/play and the 0× preset both stop motion.
  const effectiveSpeed = paused ? 0 : speed;

  const handleSelect = (type: ParticleType) => setSelected(type);

  // Switching model keeps the visual mode valid (e.g. shell-focus → balanced).
  const handleModelModeChange = (mode: AtomicModelMode) => {
    setModelMode(mode);
    setVisualMode((current) =>
      VALID_VISUAL_MODES[mode].includes(current) ? current : "balanced",
    );
    // Clear a selection that no longer exists in the new model.
    setSelected((current) => {
      if (mode === "quantum" && (current === "electron" || current === "shell")) {
        return null;
      }
      if (mode === "bohr" && current === "orbital") return null;
      return current;
    });
  };

  // Apply a guided-tour step: nudge model/visual mode, selection, and labels.
  const handleApplyStep = (focus: StepFocus) => {
    if (focus.modelMode) handleModelModeChange(focus.modelMode);
    if (focus.visualMode) setVisualMode(focus.visualMode);
    if (focus.selected !== undefined) setSelected(focus.selected);
    if (focus.showLabels) setShowLabels(true);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,26rem)]">
        <div className="flex flex-col gap-3">
          <IsotopeSelector
            selectedIsotope={selectedIsotope}
            isotopes={isotopes}
            onChange={setSelectedIsotope}
          />

          {/* Canvas card */}
          <div
            className="glass-panel-subtle relative h-[clamp(26rem,66vh,38rem)] overflow-hidden rounded-3xl lg:h-[clamp(600px,74vh,860px)]"
            style={{ ["--accent" as string]: accent }}
          >
            {/* Faint radial accent glow anchoring the atom */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-25"
              style={{
                background: `radial-gradient(55% 55% at 50% 45%, ${accent}1c, transparent 70%)`,
              }}
            />
            <Canvas
              className="atom-canvas"
              dpr={[1, 1.75]}
              camera={{ position: cameraPosition, fov: 36 }}
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
                atomicModelMode={modelMode}
                visualMode={visualMode}
                resetSignal={resetSignal}
              />
            </Canvas>

            <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-black/60 px-3 py-1 text-[0.7rem] text-muted backdrop-blur">
              {isQuantum
                ? "Drag to rotate · scroll to zoom · click the cloud"
                : "Drag to rotate · scroll to zoom · click a particle"}
            </span>
          </div>

          <AtomControlsPanel
            atomicModelMode={modelMode}
            onModelModeChange={handleModelModeChange}
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

          <GuidedExplorer
            element={element}
            accent={accent}
            onApply={handleApplyStep}
          />
        </div>

        <div className="flex flex-col gap-3">
          <ParticleInfoPanel
            element={element}
            isotope={selectedIsotope}
            selected={selected}
            shells={element.shells}
            capped={display.capped}
            modelMode={modelMode}
            accent={accent}
            onClear={() => setSelected(null)}
          />

          {isQuantum && <OrbitalInfoPanel element={element} accent={accent} />}
        </div>
      </div>

      <ModelNotice mode={modelMode} />
    </div>
  );
}
